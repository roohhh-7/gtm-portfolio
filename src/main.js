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
    nameHtml += ` <span class="progress-pill revealed">In Progress</span>`;
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
  
  ext.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <h3>98%</h3>
        <p>fill rate</p>
      </div>
      <div class="stat-card">
        <h3>-63%</h3>
        <p>enrichment cost</p>
      </div>
      <div class="stat-card">
        <h3>&lt;30s</h3>
        <p>per lead</p>
      </div>
    </div>
    
    <div class="ext-section">
      <h4>PROBLEM</h4>
      <p>Around a third of inbound leads arrived with missing company data, which meant reps either skipped them or wasted time researching manually.</p>
    </div>
    
    <div class="ext-section">
      <h4>APPROACH</h4>
      <ul>
        <li>Mapped every required field to its cheapest reliable data source first</li>
        <li>Built a Clay waterfall that only calls a paid provider when the free one comes back empty</li>
        <li>Added a confidence score so reps know which fields to double check</li>
      </ul>
    </div>
    
    <div class="ext-section">
      <h4>TOOLS</h4>
      <table class="tools-table">
        <tr><td>Clay</td><td>Waterfall orchestration + confidence scoring</td></tr>
        <tr><td>Clearbit</td><td>Primary firmographic source</td></tr>
        <tr><td>Apollo</td><td>Fallback + contact-level enrichment</td></tr>
      </table>
    </div>
    
    <div class="ext-section">
      <h4>TIMELINE</h4>
      <div class="timeline-grid">
        <span class="tl-label">Mapping</span><span class="tl-val">4 days</span>
        <span class="tl-label">Build</span><span class="tl-val">2 weeks</span>
        <span class="tl-label">Tuning</span><span class="tl-val">ongoing</span>
      </div>
    </div>
    
    <a href="#" class="read-more">Read full case study &rarr;</a>
  `;
  
  modalEnrichBtn.classList.remove('is-running');
  modalEnrichBtn.classList.add('done');
  showToast('Project details enriched', 'success');
});
