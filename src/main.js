import './style.css'

const PROJECTS = [
  { name: "Orbital", desc: "Outbound platform that automates prospecting, lead enrichment, qualification, and personalized outreach.", stack: "Apollo · Clay · Gemini · HubSpot · n8n · Antigravity", metric: "85% less manual prospecting" },
  { name: "Intent Terminal", desc: "Intent platform that monitors buying signals, prioritizes high-fit accounts, and prepares them for outreach.", stack: "Apollo · n8n · Gemini · HubSpot · Google News RSS · Reddit API · Firecrawl · Claude · Neon", metric: "AI-ranked buying signals" },
  { name: "Catalyst", desc: "GTM operating system that automates product launches, campaign workflows, lead capture, and performance tracking.", stack: "Framer · Gemini · HubSpot · n8n · PostHog · Google Analytics 4 · Microsoft Clarity · Neon · Antigravity", metric: "Launches streamlined with automated GTM workflows", status: "in-progress" }
];
const EXPERIENCE = [
  { role: "Product Intern", company: "C.R.E.A.T.E Lab", dates: "Oct 2025 — Present", impact: "Building AI-powered products, workflow systems, an ERP platform, and RAG-based analysis." },
  { role: "Business Operations Intern", company: "Neo Green Infra Solutions", dates: "May 2025 — Aug 2025", impact: "Streamlined lead management and automated operational workflows." }
];
const CONTACTS = [
  { field: "email", value: "rohits03.std@gmail.com", url: "mailto:rohits03.std@gmail.com" },
  { field: "linkedin", value: "linkedin.com/in/rohits773625/", url: "https://www.linkedin.com/in/rohits773625/" },
  { field: "github", value: "github.com/roohhh-7/", url: "https://github.com/roohhh-7/" }
];

// Toast Notification System
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✓' : '✦';
  toast.innerHTML = `<span style="color: var(--${type}); font-weight: 700;">${icon}</span> ${message}`;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

// Build Tables
function buildRows(bodyId, items, cols){
  const tbody = document.getElementById(bodyId);
  tbody.innerHTML = items.map((item, i) => {
    const cells = cols.map(c => `<td class="cell" data-field="${c.key}"><div class="skeleton" style="width:${c.w}"></div></td>`).join('');
    return `<tr class="row-skel" data-row="${i}">${'<td class="rownum-col">'+(i+1)+'</td>'}${cells}</tr>`;
  }).join('');
}

buildRows('projectsBody', PROJECTS, [
  {key:'name', w:'70%'}, {key:'desc', w:'92%'}, {key:'stack', w:'80%'}, {key:'metric', w:'60%'}
]);
buildRows('experienceBody', EXPERIENCE, [
  {key:'role', w:'70%'}, {key:'company', w:'75%'}, {key:'dates', w:'50%'}, {key:'impact', w:'92%'}
]);

function fillProjectsRow(tr, item){
  const cells = tr.querySelectorAll('td.cell');
  let nameHtml = `<span class="cell-primary revealed">${item.name}</span>`;
  if (item.status === 'in-progress') {
    nameHtml += `<div style="margin-top: 4px;"><span class="progress-pill revealed" style="margin-left: 0;">In Progress</span></div>`;
  }
  cells[0].innerHTML = nameHtml;
  cells[1].innerHTML = `<span class="cell-desc revealed">${item.desc}</span>`;
  cells[2].innerHTML = `<span class="cell-mono revealed">${item.stack}</span>`;
  cells[3].innerHTML = `<span class="cell-metric revealed">${item.metric}</span><span class="ai-badge">✦ filled</span>`;
  tr.classList.remove('row-skel');
  tr.classList.add('clickable-row');
  tr.addEventListener('click', () => openProjectModal(item));
}
function fillExperienceRow(tr, item){
  const cells = tr.querySelectorAll('td.cell');
  cells[0].innerHTML = `<span class="cell-primary revealed">${item.role}</span>`;
  cells[1].innerHTML = `<span class="revealed">${item.company}</span>`;
  cells[2].innerHTML = `<span class="cell-mono revealed">${item.dates}</span>`;
  cells[3].innerHTML = `<span class="cell-desc revealed" style="max-width:30ch;">${item.impact}</span><span class="ai-badge">✦ verified</span>`;
  tr.classList.remove('row-skel');
  tr.classList.add('clickable-row');
  tr.addEventListener('click', () => openExperienceModal(item));
}
function fillContactRow(tr, item){
  const cells = tr.querySelectorAll('td.cell');
  let targetAttr = item.field === 'email' ? '' : ' target="_blank"';
  cells[0].innerHTML = `<span class="cell-mono revealed">${item.field}</span>`;
  cells[1].innerHTML = `<a href="${item.url}"${targetAttr} class="cell-value contact-link revealed">${item.value}</a><span class="ai-badge">✦ verified</span>`;
  tr.classList.remove('row-skel');
  tr.classList.add('contact-row');
}

function setFormula(ref, text, running){
  document.getElementById('cellRef').textContent = ref;
  const f = document.getElementById('formulaText');
  f.textContent = text;
  f.classList.toggle('running', !!running);
}

// Enrichment Logic
async function runGridEnrichment(btnId, bodyId, items, fillFn, formulaLabel){
  const btn = document.getElementById(btnId);
  if(btn.disabled) return;
  btn.disabled = true;
  btn.classList.add('is-running');
  btn.querySelector('.label').textContent = 'Running…';

  const tbody = document.getElementById(bodyId);
  const rows = tbody.querySelectorAll('tr');
  for(let i=0;i<rows.length;i++){
    setFormula('A'+(i+2), `=ENRICH(${formulaLabel}${i+1})`, true);
    await new Promise(r => setTimeout(r, 260));
    fillFn(rows[i], items[i]);
  }
  setFormula('A1', 'Rohit S.', false);
  btn.classList.remove('is-running');
  btn.querySelector('.label').textContent = 'Enriched';
  btn.classList.add('done');

  showToast(`${formulaLabel.charAt(0).toUpperCase() + formulaLabel.slice(1)}s enriched`, 'success');
  checkAllDone();
}

async function runProfileEnrichment() {
  const btn = document.getElementById('btnProfile');
  if(btn.disabled) return;
  btn.disabled = true;
  btn.classList.add('is-running');
  btn.querySelector('.label').textContent = 'Running…';

  setFormula('B2', '=ENRICH(profile.bio)', true);
  await new Promise(r => setTimeout(r, 500));
  document.getElementById('fieldBio').innerHTML =
    `<span class="revealed"><span class="bio-quote">Every click tells a story. Every signal deserves a response.</span>I build AI-native products for GTM teams that turn signals into actions and workflows into systems. This portfolio is where I explore outbound, intent intelligence, RevOps, and growth automation, one project at a time.</span><span class="ai-badge">✦ filled</span>`;
  setFormula('B3', '=ENRICH(profile.skills)', true);
  await new Promise(r => setTimeout(r, 450));
  document.getElementById('fieldSkills').innerHTML = `<div class="chips revealed">
      <span class="chip">Apollo</span><span class="chip">Clay</span><span class="chip">Clearbit</span>
      <span class="chip">LeadIQ</span><span class="chip">HubSpot</span><span class="chip">Attio</span>
      <span class="chip">Instantly</span><span class="chip">Smartlead</span><span class="chip">Warmly</span>
      <span class="chip">Common Room</span><span class="chip">n8n</span><span class="chip">Zapier</span>
      <span class="chip">PostHog</span><span class="chip">Google Analytics</span><span class="chip">Amplitude</span>
      <span class="chip">Buffer</span><span class="chip">Framer</span><span class="chip">Webflow</span>
      <span class="chip">Notion</span><span class="chip">Gemini</span><span class="chip">OpenAI</span><span class="chip">Claude</span>
    </div><span class="ai-badge">✦ filled</span>`;
  setFormula('A1', 'Rohit S.', false);
  btn.classList.remove('is-running');
  btn.querySelector('.label').textContent = 'Enriched';
  btn.classList.add('done');

  showToast('Profile enriched', 'success');
  checkAllDone();
}

document.getElementById('btnProjects').addEventListener('click', () => {
  runGridEnrichment('btnProjects', 'projectsBody', PROJECTS, fillProjectsRow, 'project');
});
document.getElementById('btnExperience').addEventListener('click', () => {
  runGridEnrichment('btnExperience', 'experienceBody', EXPERIENCE, fillExperienceRow, 'role');
});
document.getElementById('btnContact').addEventListener('click', () => {
  runGridEnrichment('btnContact', 'contactBody', CONTACTS, fillContactRow, 'contact');
});
document.getElementById('btnProfile').addEventListener('click', runProfileEnrichment);

// Run All Logic
document.getElementById('btnRunAll').addEventListener('click', async () => {
  const runAllBtn = document.getElementById('btnRunAll');
  runAllBtn.disabled = true;
  runAllBtn.classList.add('is-running');
  runAllBtn.querySelector('.label').textContent = 'Enriching...';
  
  // Run all three concurrently
  await Promise.all([
    runProfileEnrichment(),
    runGridEnrichment('btnProjects', 'projectsBody', PROJECTS, fillProjectsRow, 'project'),
    runGridEnrichment('btnExperience', 'experienceBody', EXPERIENCE, fillExperienceRow, 'role'),
    runGridEnrichment('btnContact', 'contactBody', CONTACTS, fillContactRow, 'contact')
  ]);
  
  runAllBtn.classList.remove('is-running');
  runAllBtn.querySelector('.label').textContent = 'All Sheets Enriched';
  showToast('Global enrichment complete!', 'info');
});

function checkAllDone(){
  const done = document.querySelectorAll('.run-btn.done').length;
  if(done === 4){

  }
}

// cell click -> update formula bar
document.querySelectorAll('td.cell').forEach(td => {
  td.addEventListener('click', () => {
    // avoid empty skeletons
    if(td.querySelector('.skeleton')) return;
    const text = td.textContent.trim().replace('✦ filled','').trim();
    if(text) setFormula('•', text.slice(0,60), false);
  });
});

// contact copy using toasts
document.querySelectorAll('.contact-row.copyable').forEach(row => {
  async function copy(){
    const text = row.getAttribute('data-copy');
    try{ await navigator.clipboard.writeText(text); }catch(e){}
    showToast(`Copied ${text}`, 'success');
  }
  row.addEventListener('click', copy);
  row.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); copy(); } });
});


// Sticky Tabs - Intersection Observer
const sections = document.querySelectorAll('.section-target');
const navLinks = document.querySelectorAll('.sheet-tabs a');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -50% 0px',
  threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-target') === entry.target.id);
      });
    }
  });
}, observerOptions);

sections.forEach(sec => observer.observe(sec));

// --- Modal Logic ---
const modalOverlay = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalEnrichBtn = document.getElementById('modalEnrichBtn');

function openProjectModal(item) {
  document.querySelector('.modal-eyebrow').textContent = 'PROJECT RECORD';
  document.getElementById('modalTitle').textContent = item.name;
  
  // Inject Chips
  const chipsHtml = item.stack.split('·').map(s => `<span class="chip">${s.trim()}</span>`).join('');
  document.getElementById('modalChips').innerHTML = chipsHtml;
  
  document.getElementById('modalDesc').textContent = item.desc;
  
  // Inject Metric Pill
  document.getElementById('modalMetric').innerHTML = `<span class="progress-pill" style="font-size:11px; padding:4px 8px;">${item.metric}</span>`;
  
  // Reset modal state
  document.getElementById('modalExtended').classList.add('hidden');
  document.getElementById('modalExtended').innerHTML = '';
  document.getElementById('modalToolbar').style.display = 'flex';
  
  modalEnrichBtn.disabled = false;
  modalEnrichBtn.classList.remove('done', 'is-running');
  modalEnrichBtn.querySelector('.label').textContent = 'Enrich for full details';
  modalEnrichBtn.dataset.project = item.name;
  
  modalOverlay.classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function openExperienceModal(item) {
  document.querySelector('.modal-eyebrow').textContent = 'EXPERIENCE RECORD';
  document.getElementById('modalTitle').textContent = item.role;
  
  // Inject Chips
  const chipsHtml = `<span class="chip">${item.company}</span><span class="chip">${item.dates}</span>`;
  document.getElementById('modalChips').innerHTML = chipsHtml;
  
  document.getElementById('modalDesc').textContent = item.impact;
  
  // Clear metric pill
  document.getElementById('modalMetric').innerHTML = '';
  
  // Reset modal state
  document.getElementById('modalExtended').classList.add('hidden');
  document.getElementById('modalExtended').innerHTML = '';
  document.getElementById('modalToolbar').style.display = 'none';
  
  modalOverlay.classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

modalClose.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
  document.body.classList.remove('no-scroll');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
});

modalEnrichBtn.addEventListener('click', async () => {
  if(modalEnrichBtn.disabled) return;
  modalEnrichBtn.disabled = true;
  modalEnrichBtn.classList.add('is-running');
  modalEnrichBtn.querySelector('.label').textContent = 'Running…';
  
  await new Promise(r => setTimeout(r, 1200));
  
  document.getElementById('modalToolbar').style.display = 'none';
  
  const ext = document.getElementById('modalExtended');
  ext.classList.remove('hidden');
  
  if (document.getElementById('modalTitle').textContent === 'Orbital') {
    ext.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <h3>85%</h3>
          <p>less manual effort</p>
        </div>
        <div class="stat-card">
          <h3>3x</h3>
          <p>meetings booked</p>
        </div>
        <div class="stat-card">
          <h3>&lt;5m</h3>
          <p>lead response</p>
        </div>
      </div>
      
      <div class="ext-section">
        <h4>THE PROBLEM & PAIN POINTS</h4>
        <p>SDRs spend over 40% of their working hours trapped in manual data entry, toggling between siloed applications (LinkedIn, Clay, ChatGPT, CRM), and drafting cold outreach that yields diminishing ROI.</p>
        <ul style="margin-top: 8px;">
          <li><strong>Time Poverty:</strong> 4 hours spent researching leaves only 4 hours to actually sell.</li>
          <li><strong>Data Decay:</strong> By the time a CSV is exported, enriched, and uploaded, data is disorganized.</li>
          <li><strong>The Personalization Paradox:</strong> Highly personalized emails get responses but don't scale; generic templates scale but get ignored.</li>
        </ul>
      </div>
      
      <div class="ext-section">
        <h4>THE SOLUTION: PRODUCT VISION</h4>
        <p>Orbital is an autonomous Go-To-Market infrastructure platform that consolidates lead discovery, data enrichment, and AI-driven personalization into a single workspace.</p>
        <ul style="margin-top: 8px;">
          <li><strong>Centralization:</strong> A multi-tabbed, spreadsheet-style UI (Campaign > Company > People) to manage ABM workflows.</li>
          <li><strong>Autonomous Orchestration:</strong> "Zero-Click" enrichment automatically queries data providers and caches records instantly.</li>
          <li><strong>Actionable Intelligence:</strong> An AI Research Co-Pilot synthesizes firmographics and news into personalized email drafts.</li>
        </ul>
      </div>
      
      <div class="ext-section">
        <h4>TOOLS & REVOPs ORCHESTRATION</h4>
        <table class="tools-table">
          <tr><td>n8n</td><td>Workflow orchestration (pushing data to HubSpot & Slack seamlessly)</td></tr>
          <tr><td>Apollo & Clay</td><td>Zero-click firmographic discovery and contact enrichment</td></tr>
          <tr><td>LLMs</td><td>Deep research synthesis and automated hyper-personalized copywriting</td></tr>
          <tr><td>HubSpot</td><td>100% accurate CRM sync with automated bi-directional updates</td></tr>
        </table>
      </div>
      
      <div class="ext-section">
        <h4>RESULTS & GTM STRATEGY</h4>
        <p>Positioned as "The AI SDR that scales your best reps" targeting mid-market B2B SaaS. Driven by a Product-Led Growth (PLG) motion offering 50 free enriched contacts.</p>
        <div class="timeline-grid" style="margin-top: 12px;">
          <span class="tl-label">Status</span><span class="tl-val">MVP Completed</span>
          <span class="tl-label">Time-to-Value</span><span class="tl-val">&lt; 3 minutes to first email</span>
          <span class="tl-label">Data Accuracy</span><span class="tl-val">100% automated CRM sync</span>
          <span class="tl-label">Response SLA</span><span class="tl-val">&lt; 5 minutes</span>
        </div>
      </div>
      
      <div style="margin-top: 24px;">
        <a href="https://app.notion.com/p/Case-Study-Orbital-Autonomous-B2B-Go-To-Market-Engine-3998fab9854d80f593e2edf0ed8012a1" target="_blank" class="run-btn" style="text-decoration:none; display:inline-flex;">
          <span class="spark">✦</span><span class="label">View full case study</span>
        </a>
      </div>
    `;
  } else if (document.getElementById('modalTitle').textContent === 'Intent Terminal') {
    ext.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <h3>100%</h3>
          <p>autonomous</p>
        </div>
        <div class="stat-card">
          <h3>Instant</h3>
          <p>CRM sync</p>
        </div>
        <div class="stat-card">
          <h3>45m</h3>
          <p>saved per lead</p>
        </div>
      </div>

      <div class="ext-section">
        <h4>THE PROBLEM & PAIN POINTS</h4>
        <p>Modern outbound sales is broken. The standard playbook of dumping static contact lists into automated sequences results in terrible conversion rates and a damaged brand reputation.</p>
        <ul style="margin-top: 8px;">
          <li><strong>The Context Gap:</strong> Reaching out exactly when a prospect has a problem is the only way to stand out.</li>
          <li><strong>Manual Bottleneck:</strong> Researching companies, detecting intent, and crafting emails takes humans up to 45 minutes per account.</li>
          <li><strong>Scaling Limits:</strong> You cannot scale highly personalized, intent-driven outreach with human SDRs alone.</li>
        </ul>
      </div>

      <div class="ext-section">
        <h4>THE SOLUTION: PRODUCT VISION</h4>
        <p>The Intent Platform is a fully autonomous outbound engine designed to scale the brain of a top performing sales rep.</p>
        <ul style="margin-top: 8px;">
          <li><strong>Intent Driven Targeting:</strong> AI forensic analysis actively scans target company websites to extract explicit buying signals.</li>
          <li><strong>1-Click Pipeline:</strong> A seamless automated flow that triggers Apollo enrichment and AI generation the moment intent is flagged.</li>
          <li><strong>Dynamic Strategy:</strong> Segmented workspaces adapt the AI persona (e.g. CTO pitch vs Marketing pitch) instantly.</li>
        </ul>
      </div>

      <div class="ext-section">
        <h4>TOOLS & REVOPs ORCHESTRATION</h4>
        <table class="tools-table">
          <tr><td>AI Engine</td><td>Signal extraction, persona adaptation, and hyper-personalized drafting</td></tr>
          <tr><td>Apollo.io</td><td>Real-time verified contact enrichment and decision-maker targeting</td></tr>
          <tr><td>HubSpot</td><td>Real-time CRM syncing of drafted outreach and campaign logging</td></tr>
        </table>
      </div>

      <div class="ext-section">
        <h4>RESULTS & GTM STRATEGY</h4>
        <p>Turning outbound sales from a volume numbers game back into a precision relationship game by automating research, timing, and relevance.</p>
        <div class="timeline-grid" style="margin-top: 12px;">
          <span class="tl-label">Pipeline</span><span class="tl-val">Fully Autonomous</span>
          <span class="tl-label">Analytics</span><span class="tl-val">Real-time velocity KPIs</span>
          <span class="tl-label">Campaigns</span><span class="tl-val">Dynamic Persona Adaptation</span>
          <span class="tl-label">Time-to-Value</span><span class="tl-val">Instant</span>
        </div>
      </div>
    `;
  } else {
    ext.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--ink-soft);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.5; margin-bottom:12px;">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <h3 style="font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 6px;">Case Study In Progress</h3>
        <p style="font-size: 13.5px; max-width: 260px; margin: 0 auto;">I'm currently documenting the GTM operating system and workflows for Catalyst.</p>
      </div>
    `;
  }
  
  modalEnrichBtn.classList.remove('is-running');
  modalEnrichBtn.classList.add('done');
  showToast('Project details enriched', 'success');
});

document.body.style.overflow = "hidden";

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
async function scrambleText(element, newText) {
    const duration = 220; // sped up from 400
    const steps = 8;
    const stepTime = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
        let current = '';
        for (let j = 0; j < newText.length; j++) {
            if (i / steps > j / newText.length) {
                current += newText[j];
            } else {
                current += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        element.textContent = current;
        await sleep(stepTime);
    }
    element.textContent = newText;
}

async function runLoader(){
    const stages = [
        "Routing Signals",
        "Enriching Data",
        "Launching Portfolio"
    ];

    const stage = document.getElementById("stageText");
    const word = document.getElementById("stageWord");

    for(const text of stages){
        stage.classList.add("show");
        await scrambleText(word, text);
        await sleep(150); // sped up

        stage.classList.remove("show");
        await sleep(80); // sped up
    }

    await sleep(50);
    document.getElementById("loader").classList.add("hide");
    document.body.style.overflow = "";
}

runLoader();
