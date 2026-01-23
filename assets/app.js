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

/* ---------- Copy buttons ---------- */
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
    const subject = "Connecting — Analytics / BI / BA Role";
    const body = encodeURIComponent(
      "Hi Omkar,\n\nI came across your portfolio and would like to connect.\n\nRole:\nCompany:\nBest time to chat:\n\nThanks,\n"
    );
    window.location.href = `mailto:omkar.m.pallerla@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
}

/* ---------- Footer year ---------- */
const year = $("#year");
if(year) year.textContent = new Date().getFullYear();

/* ---------- Role Tabs (hero) ---------- */
const roleTabs = $$(".tab[data-role]");
const roleBadge = $("#roleBadge");
const roleKicker = $("#roleKicker");
const heroSub = $("#heroSub");
const primaryResumeBtn = $("#primaryResumeBtn");

const roleCopy = {
  all: {
    badge: "All",
    kicker: "Analytics that moves from data → decisions",
    sub: "I work across <b>Data Analytics</b>, <b>BI Development</b>, and <b>Business Analysis</b> — translating stakeholder needs into clean KPI definitions, scalable reporting, and measurable outcomes.",
    resumeText: "⬇ Download Resume (BI)",
    resumeHref: "assets/docs/Omkar_Pallerla_BI_Developer.pdf",
  },
  bi: {
    badge: "BI Developer",
    kicker: "BI: governed metrics + dashboards that scale",
    sub: "I build <b>semantic layers</b>, standardize KPIs, and ship dashboards in Looker/Tableau/Power BI with governance and performance in mind.",
    resumeText: "⬇ Download Resume (BI)",
    resumeHref: "assets/docs/Omkar_Pallerla_BI_Developer.pdf",
  },
  da: {
    badge: "Data Analyst",
    kicker: "DA: insights, cohorts, and KPI storytelling",
    sub: "I translate data into decisions through <b>EDA</b>, <b>cohorts/funnels</b>, and clear KPI narratives that stakeholders can act on.",
    resumeText: "⬇ Download Resume (DA)",
    resumeHref: "assets/docs/Omkar_Pallerla_Data_Analyst.pdf",
  },
  ba: {
    badge: "Business Analyst",
    kicker: "BA: requirements → UAT → launch",
    sub: "I run requirement workshops, write <b>user stories</b> + <b>acceptance criteria</b>, and coordinate UAT for confident releases.",
    resumeText: "⬇ Download Resume (BA)",
    resumeHref: "assets/docs/Omkar_Pallerla_IT_Business_Analyst.pdf",
  }
};

function applyRole(role){
  const cfg = roleCopy[role] || roleCopy.all;
  if(roleBadge) roleBadge.textContent = cfg.badge;
  if(roleKicker) roleKicker.textContent = cfg.kicker;
  if(heroSub) heroSub.innerHTML = cfg.sub;
  if(primaryResumeBtn){
    primaryResumeBtn.textContent = cfg.resumeText;
    primaryResumeBtn.href = cfg.resumeHref;
  }

  // highlight case study cards
  const cards = $$("#caseGrid .projectCard");
  cards.forEach(card=>{
    const r = card.dataset.role;
    if(role === "all" || r === role){
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
  showToast(`Role: ${cfg.badge}`);
}

roleTabs.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    roleTabs.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    applyRole(btn.dataset.role);
  });
});

/* ---------- Filters (case studies) ---------- */
const filterBtns = $$(".filterBtn");
filterBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    filterBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    const cards = $$("#caseGrid .projectCard");
    cards.forEach(card=>{
      card.style.display = (f === "all" || card.dataset.role === f) ? "block" : "none";
    });
    showToast(`Filter: ${btn.textContent}`);
  });
});

/* ---------- Skill narrative ---------- */
const skillNarrative = $("#skillNarrative");
const chips = $$(".chip[data-skill]");
const skillText = {
  SQL: "<b>SQL</b> is my daily driver: clean transformations, reliable reconciliations, and performance-friendly reporting queries.",
  Looker: "<b>Looker/LookML</b>: semantic layers, KPI standardization, explores, and governance patterns to scale self-service.",
  Tableau: "<b>Tableau</b>: stakeholder-friendly visuals and KPI dashboards designed for quick decisions.",
  PowerBI: "<b>Power BI</b>: DAX-driven KPIs, interactive reporting, and operational dashboards.",
  Excel: "<b>Excel</b>: fast validation, reconciliation, pivot-based analysis, and stakeholder-ready summaries.",
  BigQuery: "<b>BigQuery</b>: warehouse-scale reporting and query optimization for large datasets.",
  Snowflake: "<b>Snowflake</b>: scalable analytics models and consistent KPI reporting across teams.",
  Python: "<b>Python</b>: EDA, feature engineering, quick prototypes, and repeatable analysis workflows.",
  Req: "<b>Requirements</b>: structured elicitation, scope clarity, and documentation that prevents rework.",
  Stories: "<b>User stories</b>: clear, testable stories that align dev + stakeholders.",
  AC: "<b>Acceptance criteria</b>: measurable outcomes and edge cases that reduce ambiguity.",
  UAT: "<b>UAT</b>: test planning, validation, defect triage, and go-live confidence.",
  Agile: "<b>Agile/Scrum</b>: backlog refinement, sprint planning support, and release readiness.",
  Stakeholders: "<b>Stakeholder management</b>: aligning priorities, tradeoffs, and success metrics.",
  KPI: "<b>KPI frameworks</b>: definitions, owners, grain, sources, and validation checks."
};

chips.forEach(ch=>{
  ch.addEventListener("click", ()=>{
    chips.forEach(c=>c.classList.remove("active"));
    ch.classList.add("active");
    const key = ch.dataset.skill;
    if(skillNarrative && skillText[key]) skillNarrative.innerHTML = skillText[key];
  });
});
