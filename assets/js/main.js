/* ================================================================
   Campusly — main.js
   Dark-first مع Toasts بدل Alerts + Stepper في Modal الحجز.
   ================================================================ */

/* -------- مفاتيح التخزين -------- */
const STORE = {
  theme: "campusly:theme",
  lastFilter: "campusly:lastFilter",
};

/* -------- بيانات (محتوى مختلف عن المشروعين الآخرين) -------- */
const EVENTS = [
  {
    id: 1, title: "Hackathon 48h", category: "tech", date: "2026-05-30",
    location: "Innovation Lab · قاعة A", image: "assets/img/hackathon-innovation-lab.jpeg",
    excerpt: "يومان متواصلان من البرمجة الجماعية على تحديات واقعية.",
    description: "يختار كل فريق تحدياً من ثلاث فئات (تعليم، صحة، بيئة)، ثم يقدم نموذجاً أولياً قابلاً للتشغيل أمام لجنة من الصناعة. جوائز قيمة وشهادات مشاركة للجميع.",
    speakers: ["Lead: Dr. Salma Kaddour", "م. بلال نجم"],
  },
  {
    id: 2, title: "TEDx Campus", category: "arts", date: "2026-06-10",
    location: "Auditorium", image: "assets/img/tedx-stage.jpeg",
    excerpt: "ثمانية متحدثين، ثمان قصص ستغير طريقة تفكيرك.",
    description: "حدث TEDx السنوي للجامعة يجمع باحثين، رواد أعمال، وفنانين لتقديم أفكار جديدة خلال جلسة واحدة. بث مباشر متاح للجميع.",
    speakers: ["د. هدى المغربي", "ريم ع��ود", "وسام الأحمد"],
  },
  {
    id: 3, title: "Data Night", category: "workshop", date: "2026-06-25",
    location: "Data Hub", image: "assets/img/data-night-dashboard.jpeg",
    excerpt: "ورشة عملية على بناء لوحات بيانات تفاعلية.",
    description: "تبدأ الورشة بنظرة سريعة على أساسيات تنظيف البيانات، ثم ننتقل إلى بناء لوحة بيانات حية باستخدام أدوات مفتوحة المصدر.",
    speakers: ["م. ديانا عبدالله"],
  },
  {
    id: 4, title: "Astro Night", category: "social", date: "2026-07-18",
    location: "المرصد", image: "assets/img/astro-stargazing.jpeg",
    excerpt: "ليلة فلكية مفتوحة للجميع تحت سماء الحرم الجامعي.",
    description: "رصد مباشر للأجرام السماوية عبر تلسكوبات نادي الفلك، مع تعليق مبسط من أعضاء النادي، وفعاليات جانبية للعائلات.",
    speakers: [],
  },
  {
    id: 5, title: "Music Fest", category: "arts", date: "2026-07-30",
    location: "الساحة الرئيسية", image: "assets/img/music-concert.jpeg",
    excerpt: "مهرجان موسيقى حية لفرق طلابية وضيوف محترفين.",
    description: "خمس فرق موسيقية تتناوب على المسرح الرئيسي من الخامسة مساءً حتى منتصف الليل، مع ركن طعام وتفاعلات بصرية مباشرة.",
    speakers: [],
  },
  {
    id: 6, title: "Startup Pitch", category: "business", date: "2026-08-14",
    location: "Business Wing", image: "assets/img/startup-pitch-room.jpeg",
    excerpt: "عشرة مشاريع طلابية تعرض أمام لجنة استثمارية.",
    description: "يقدم الطلاب مشاريعهم في 5 دقائق لكل فريق، متبوعة بأسئلة من المستثمرين. الفائزون يحصلون على برنامج احتضان مجاني.",
    speakers: ["أ. وليد شمس"],
  },
];

const CATEGORY_LABELS = {
  tech: "Tech · تقنية",
  business: "Business · أعمال",
  social: "Social · اجتماعية",
  workshop: "Workshop · ورش",
  arts: "Arts · فنون",
};

/* -------- Helpers -------- */
function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString("ar-EG", { year:"numeric", month:"long", day:"numeric" }); }
  catch(_) { return iso; }
}
function getParam(k) { return new URLSearchParams(location.search).get(k); }
function cardHTML(ev) {
  return `
    <article class="glass glass-hover c-card h-100">
      <img src="${ev.image}" alt="${ev.title}" class="card-img-top" loading="lazy">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <span class="badge-cat">${CATEGORY_LABELS[ev.category] || ev.category}</span>
          <small class="text-muted" style="color:var(--c-muted) !important;">${fmtDate(ev.date)}</small>
        </div>
        <h3>${ev.title}</h3>
        <p class="excerpt">${ev.excerpt}</p>
        <div class="d-flex gap-2">
          <a href="event.html?id=${ev.id}" class="btn-c-primary text-decoration-none">التفاصيل</a>
          <button class="btn-c-ghost" data-bs-toggle="modal" data-bs-target="#bookModal" data-event-id="${ev.id}">حجز</button>
        </div>
      </div>
    </article>
  `;
}

/* -------- الرئيسية: فعاليات مميزة + أحدث -------- */
function renderHomeFeatured() {
  const el = document.getElementById("featuredGrid");
  if (!el) return;
  el.innerHTML = EVENTS.slice(0,3).map(e => `<div class="col-md-6 col-lg-4">${cardHTML(e)}</div>`).join("");
}
function renderHomeLatest() {
  const el = document.getElementById("latestGrid");
  if (!el) return;
  const latest = [...EVENTS].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 3);
  el.innerHTML = latest.map(e => `<div class="col-md-6 col-lg-4">${cardHTML(e)}</div>`).join("");
}

/* -------- events.html -------- */
function setupEventsPage() {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;
  const q = document.getElementById("searchInput");
  const cat = document.getElementById("categoryFilter");
  const emptyMsg = document.getElementById("emptyMsg");

  const saved = JSON.parse(localStorage.getItem(STORE.lastFilter) || "{}");
  if (saved.q && q) q.value = saved.q;
  if (saved.cat && cat) cat.value = saved.cat;

  function render() {
    const qv = (q?.value || "").trim().toLowerCase();
    const cv = cat?.value || "";
    const filtered = EVENTS.filter(ev =>
      (!qv || ev.title.toLowerCase().includes(qv) || ev.excerpt.toLowerCase().includes(qv)) &&
      (!cv || ev.category === cv)
    );
    grid.innerHTML = filtered.map(e => `<div class="col-md-6 col-lg-4">${cardHTML(e)}</div>`).join("");
    if (emptyMsg) emptyMsg.classList.toggle("d-none", filtered.length > 0);
    localStorage.setItem(STORE.lastFilter, JSON.stringify({ q: qv, cat: cv }));
    const count = document.getElementById("resultsCount");
    if (count) count.textContent = filtered.length;
  }
  [q, cat].forEach(el => el && el.addEventListener("input", render));
  render();
}

/* -------- event.html -------- */
function setupEventDetailsPage() {
  const host = document.getElementById("eventDetails");
  if (!host) return;
  const id = parseInt(getParam("id") || "1", 10);
  const ev = EVENTS.find(e => e.id === id) || EVENTS[0];
  document.title = `${ev.title} — Campusly`;

  host.innerHTML = `
    <div class="row g-4 align-items-start">
      <div class="col-lg-7">
        <span class="badge-cat mb-3 d-inline-block">${CATEGORY_LABELS[ev.category]}</span>
        <h1 class="display-6">${ev.title}</h1>
        <p class="text-muted" style="color:var(--c-muted)!important;">
          <strong style="color:var(--c-text);">التاريخ:</strong> ${fmtDate(ev.date)} ·
          <strong style="color:var(--c-text);">المكان:</strong> ${ev.location}
        </p>
        <img src="${ev.image}" alt="${ev.title}" class="img-fluid mt-3" style="border-radius:18px; aspect-ratio:16/8; object-fit:cover; width:100%; border:1px solid var(--c-border);">
        <div class="glass p-4 mt-4">
          <h2 class="h5">نظرة عامة</h2>
          <p class="mb-0">${ev.description}</p>
        </div>
        ${ev.speakers?.length ? `
        <div class="glass p-4 mt-3">
          <h2 class="h6">المتحدثون</h2>
          <ul class="mb-0">${ev.speakers.map(s => `<li>${s}</li>`).join("")}</ul>
        </div>` : ""}
        <h2 class="h6 mt-4">معرض الصور</h2>
        <div class="row g-3 event-gallery">
          <div class="col-6 col-md-4"><img src="${ev.image}" alt=""></div>
          <div class="col-6 col-md-4"><img src="${EVENTS.find(x => x.id === (ev.id % 6) + 1)?.image || ev.image}" alt=""></div>
          <div class="col-6 col-md-4"><img src="${EVENTS.find(x => x.id === ((ev.id + 1) % 6) + 1)?.image || ev.image}" alt=""></div>
        </div>
      </div>
      <aside class="col-lg-5">
        <div class="glass p-4">
          <h2 class="h6">الموقع</h2>
          <p class="small mb-3" style="color:var(--c-muted); line-height:1.7;">${ev.location}</p>
          <div class="d-grid gap-2">
            <button class="btn-c-primary" data-bs-toggle="modal" data-bs-target="#bookModal" data-event-id="${ev.id}">حجز مقعد</button>
          </div>
        </div>
      </aside>
    </div>
  `;
}

/* -------- contact.html — Toasts بدل Alerts -------- */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const msg = form.elements["message"].value.trim();
    const errors = [];
    if (name.length < 3) errors.push("الاسم قصير جداً (3 أحرف على الأقل).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("صيغة البريد الإلكتروني غير صحيحة.");
    if (msg.length < 10) errors.push("الرسالة قصيرة جداً (10 أحرف على الأقل).");

    if (errors.length) {
      showToast(errors.join(" | "), "danger", 4000);
    } else {
      showToast("تم استلام رسالتك بنجاح، شكراً لتواصلك!", "success");
      form.reset();
    }
  });
}

/* -------- Modal الحجز بـ Stepper -------- */
function setupBookModal() {
  const modal = document.getElementById("bookModal");
  if (!modal) return;
  const title = modal.querySelector(".modal-title");
  const steps = modal.querySelectorAll(".step");
  const panes = modal.querySelectorAll("[data-pane]");

  function goTo(i) {
    steps.forEach((s, idx) => s.classList.toggle("active", idx <= i));
    panes.forEach((p, idx) => p.classList.toggle("d-none", idx !== i));
    modal.querySelector("#bookNext").classList.toggle("d-none", i === panes.length - 1);
    modal.querySelector("#bookConfirm").classList.toggle("d-none", i !== panes.length - 1);
    modal.querySelector("#bookBack").disabled = (i === 0);
    modal.dataset.step = i;
  }

  modal.addEventListener("show.bs.modal", (ev) => {
    const btn = ev.relatedTarget;
    const id = btn?.getAttribute("data-event-id");
    const found = EVENTS.find(e => String(e.id) === String(id));
    if (found && title) title.textContent = `حجز: ${found.title}`;
    goTo(0);
  });

  modal.querySelector("#bookNext")?.addEventListener("click", () => {
    const i = parseInt(modal.dataset.step || "0", 10);
    goTo(Math.min(i + 1, panes.length - 1));
  });
  modal.querySelector("#bookBack")?.addEventListener("click", () => {
    const i = parseInt(modal.dataset.step || "0", 10);
    goTo(Math.max(i - 1, 0));
  });
  modal.querySelector("#bookConfirm")?.addEventListener("click", () => {
    showToast("تم تأكيد الحجز بنجاح", "success");
    bootstrap.Modal.getInstance(modal)?.hide();
  });
}

/* -------- Scroll Top -------- */
function setupScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 400));
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* -------- Light/Dark (Dark-first) — الزر يعرض الوضع الذي سيتم التبديل إليه -------- */
function updateThemeToggleLabel(toggle) {
  if (!toggle) return;
  const isLight = document.body.classList.contains("light");
  toggle.textContent = isLight ? "الوضع الداكن" : "الوضع الفاتح";
  toggle.setAttribute("title", isLight ? "التبديل إلى الوضع الداكن" : "التبديل إلى الوضع الفاتح");
}

function setupThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem(STORE.theme);
  if (saved === "light") document.body.classList.add("light");
  updateThemeToggleLabel(toggle);
  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem(STORE.theme, document.body.classList.contains("light") ? "light" : "dark");
    updateThemeToggleLabel(toggle);
  });
}

/* -------- Toast (Bootstrap) -------- */
function showToast(message, type = "success", duration = 2800) {
  let host = document.getElementById("toastHost");
  if (!host) {
    host = document.createElement("div");
    host.id = "toastHost";
    host.className = "toast-container position-fixed top-0 start-50 translate-middle-x p-3";
    host.style.zIndex = "1090";
    document.body.appendChild(host);
  }
  const el = document.createElement("div");
  el.className = `toast c-toast ${type}`;
  el.setAttribute("role", "alert");
  el.innerHTML = `
    <div class="toast-header">
      <strong class="me-auto">${type === "danger" ? "خطأ" : "تمّ"}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">${message}</div>
  `;
  host.appendChild(el);
  const t = new bootstrap.Toast(el, { delay: duration });
  t.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}

/* -------- Active Nav -------- */
function highlightActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".c-navbar .nav-link").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
}

/* -------- init -------- */
document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNav();
  setupThemeToggle();
  setupScrollTop();
  setupBookModal();
  renderHomeFeatured();
  renderHomeLatest();
  setupEventsPage();
  setupEventDetailsPage();
  setupContactForm();
});
