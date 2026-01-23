const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

/* ---------- Toast ---------- */
const toast = $("#toast");
const toastMsg = $("#toastMsg");
let toastTimer = null;

function showToast(msg, badge="✓"){
  if(!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  const b = $("#toastBadge");
  if(b) b.textContent = badge;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"), 1600);
}

/* ---------- Theme ---------- */
const themeBtn = $("#themeBtn");
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.dataset.theme = (savedTheme === "light") ? "light" : "dark";

function updateThemeLabel(){
  if(!themeBtn) return;
  themeBtn.textContent = (document.documentElement.dataset.theme === "light") ? "☀️ Theme" : "🌙 Theme";
}
updateThemeLabel();

if(themeBtn){
  themeBtn.addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme === "light";
    document.documentElement.dataset.theme = isLight ? "dark" : "light";
    localStorage.setItem("theme", document.documentElement.dataset.theme);
    updateThemeLabel();
    showToast(`Theme: ${document.documentElement.dataset.theme}`);
  });
}

/* ---------- Links ---------- */
const LINKEDIN_URL = "https://linkedin.com/in/omkar-pallerla"; // update if needed
const lt = $("#linkedinTop"), lb = $("#linkedinBottom");
if(lt) lt.href = LINKEDIN_URL;
if(lb) lb.href = LINKEDIN_URL;

/* ---------- Copy actions ---------- */
const copyEmailBtn = $("#copyEmail");
if(copyEmailBtn){
  copyEmailBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText("omkar.m.pallerla@gmail.com");
    showToast("Email copied");
  });
}
const copyPhoneBtn = $("#copyPhone");
if(copyPhoneBtn){
  copyPhoneBtn.addEventListener("click", async () => {
    await navigator.clipboard.writeText("623-290-6396");
    showToast("Phone copied");
  });
}

/* ---------- Mailto ---------- */
const emailBtn = $("#emailBtn");
if(emailBtn){
  emailBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const subject = "Connecting — Analytics / BI / Business Delivery";
    const body = encodeURIComponent(
      "Hi Omkar,\n\nI came across your portfolio and would like to connect.\n\nRole:\nCompany:\nBest time to chat:\n\nThanks,\n"
    );
    window.location.href = `mailto:omkar.m.pallerla@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
}

/* ---------- Footer year ---------- */
const year = $("#year");
if(year) year.textContent = new Date().getFullYear();

/* ---------- Case Study filter buttons ---------- */
const filterBtns = $$(".filterBtn");
const caseCards = $$("#caseGrid .projectCard");

function applyFilter(filter){
  caseCards.forEach(card=>{
    card.style.display = (filter === "all" || card.dataset.role === filter) ? "block" : "none";
  });
}

filterBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    filterBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);
    showToast(`Filter: ${btn.textContent}`);
  });
});

/* ---------- Focus Tabs (hero role highlighter) ---------- */
const tabs = $$(".tab[data-role]");
const roleBadge = $("#roleBadge");
const heroKicker = $("#heroKicker");
const heroSub = $("#heroSub");
const caseFilterMap = { all: "all", bi: "bi", da: "da", ba: "ba" };

const copyByRole = {
  all: {
    badge: "All",
    kicker: "I design trusted metrics and insights that drive decisions.",
    sub: "I bridge <b>data analysis</b>, <b>BI development</b>, and <b>business delivery</b> — turning messy questions into clean KPIs, reliable reporting, and outcomes stakeholders can act on."
  },
  bi: {
    badge: "BI & Governance",
    kicker: "BI: prevent metric drift, scale self-service, and ship dashboards that teams trust.",
    sub: "I build <b>governed KPI definitions</b>, reusable models, and dashboards designed for adoption — with performance and governance in mind."
  },
  da: {
    badge: "Data Insights",
    kicker: "DA: find KPI drivers through EDA, cohorts, and storytelling.",
    sub: "I translate data into decisions with <b>EDA</b>, <b>cohorts/segments</b>, and clear KPI narratives that stakeholders can execute."
  },
  ba: {
    badge: "Business Delivery",
    kicker: "BA: turn ambiguity into clarity — requirements, acceptance criteria, and UAT readiness.",
    sub: "I run workshops, define scope and success metrics, write <b>user stories</b> + <b>acceptance criteria</b>, and coordinate UAT for confident releases."
  }
};

function applyRole(role){
  const cfg = copyByRole[role] || copyByRole.all;
  if(roleBadge) roleBadge.textContent = cfg.badge;
  if(heroKicker) heroKicker.textContent = cfg.kicker;
  if(heroSub) heroSub.innerHTML = cfg.sub;

  // sync filter buttons (best UX)
  const mapped = caseFilterMap[role] || "all";
  filterBtns.forEach(b=>{
    b.classList.toggle("active", b.dataset.filter === mapped);
  });
  applyFilter(mapped);
  showToast(`Focus: ${cfg.badge}`);
}

tabs.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    tabs.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    applyRole(btn.dataset.role);
  });
});

/* ---------- Skill narrative ---------- */
const skillNarrative = $("#skillNarrative");
const skillChips = $$(".chip[data-skill]");
const skillText = {
  SQL: "<b>SQL</b> is my daily driver: clean transformations, reconciliations, and performance-friendly reporting queries.",
  Looker: "<b>Looker/LookML</b>: semantic layers, KPI standardization, explores, and governance patterns to scale self-service.",
  BI: "<b>Dashboards</b>: UX patterns that drive adoption—clear filters, drilldowns, and progressive disclosure.",
  BA: "<b>Requirements</b>: structured elicitation and scope clarity that prevents rework.",
  UAT: "<b>UAT</b>: scenarios mapped to acceptance criteria, defect triage, and release readiness.",
  Stakeholders: "<b>Stakeholders</b>: align priorities, tradeoffs, and success criteria so delivery stays focused."
};
skillChips.forEach(ch=>{
  ch.addEventListener("click", ()=>{
    skillChips.forEach(c=>c.classList.remove("active"));
    ch.classList.add("active");
    const key = ch.dataset.skill;
    if(skillNarrative && skillText[key]) skillNarrative.innerHTML = skillText[key];
  });
});
