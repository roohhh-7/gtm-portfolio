import './style.css'

const PROJECTS = [
  { name: "Signal Router", desc: "Unified intent data from six tools into one scoring model, auto-routing hot accounts.", stack: "Clay · Segment · Slack API", metric: "+41% reply rate" },
  { name: "Enrichment Waterfall", desc: "Chained five data providers with fallback logic for firmographics under 30s.", stack: "Clay · Clearbit · Apollo", metric: "98% fill rate" },
  { name: "Champion Tracker", desc: "Job-change alerts that reopen opportunities when champions switch companies.", stack: "n8n · LinkedIn API · HubSpot", metric: "+120 pipeline/mo" },
  { name: "Outbound Autopilot", desc: "Personalized sequences generated from scraped product-usage data.", stack: "Python · GPT API · Instantly", metric: "3.2x meetings booked" }
];
const EXPERIENCE = [
  { role: "GTM Engineer", company: "Northlane", dates: "2023 — Now", impact: "Rebuilt lead-to-account routing, cutting speed-to-lead from 45 min to under 90 sec." },
  { role: "RevOps Analyst", company: "Fieldstone Labs", dates: "2021 — 2023", impact: "Stood up first lead-scoring model, cleaned nine years of CRM debt." },
  { role: "SDR → Team Lead", company: "Verdant Systems", dates: "2019 — 2021", impact: "Ran outbound experiments that became templates automation later scaled." }
];

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
  cells[0].innerHTML = `<span class="cell-primary revealed">${item.name}</span>`;
  cells[1].innerHTML = `<span class="cell-desc revealed">${item.desc}</span>`;
  cells[2].innerHTML = `<span class="cell-mono revealed">${item.stack}</span>`;
  cells[3].innerHTML = `<span class="cell-metric revealed">${item.metric}</span><span class="ai-badge">✦ filled</span>`;
  tr.classList.remove('row-skel');
}
function fillExperienceRow(tr, item){
  const cells = tr.querySelectorAll('td.cell');
  cells[0].innerHTML = `<span class="cell-primary revealed">${item.role}</span>`;
  cells[1].innerHTML = `<span class="revealed">${item.company}</span>`;
  cells[2].innerHTML = `<span class="cell-mono revealed">${item.dates}</span>`;
  cells[3].innerHTML = `<span class="revealed">${item.impact}</span><span class="ai-badge">✦ filled</span>`;
  tr.classList.remove('row-skel');
}

function setFormula(ref, text, running){
  document.getElementById('cellRef').textContent = ref;
  const f = document.getElementById('formulaText');
  f.textContent = text;
  f.classList.toggle('running', !!running);
}

async function runGridEnrichment(btnId, bodyId, items, fillFn, formulaLabel){
  const btn = document.getElementById(btnId);
  if(btn.disabled) return;
  btn.disabled = true;
  btn.querySelector('.label').textContent = 'Running…';
  document.getElementById('saveState').textContent = 'syncing…';
  const tbody = document.getElementById(bodyId);
  const rows = tbody.querySelectorAll('tr');
  for(let i=0;i<rows.length;i++){
    setFormula('A'+(i+2), `=ENRICH(${formulaLabel}${i+1})`, true);
    await new Promise(r => setTimeout(r, 260));
    fillFn(rows[i], items[i]);
  }
  setFormula('A1', 'Alex Rivera', false);
  btn.querySelector('.label').textContent = 'Enriched';
  btn.classList.add('done');
  document.getElementById('saveState').textContent = 'saved';
  checkAllDone();
}

document.getElementById('btnProjects').addEventListener('click', () => {
  runGridEnrichment('btnProjects', 'projectsBody', PROJECTS, fillProjectsRow, 'project');
});
document.getElementById('btnExperience').addEventListener('click', () => {
  runGridEnrichment('btnExperience', 'experienceBody', EXPERIENCE, fillExperienceRow, 'role');
});

document.getElementById('btnProfile').addEventListener('click', async () => {
  const btn = document.getElementById('btnProfile');
  if(btn.disabled) return;
  btn.disabled = true;
  btn.querySelector('.label').textContent = 'Running…';
  document.getElementById('saveState').textContent = 'syncing…';
  setFormula('B2', '=ENRICH(profile.bio)', true);
  await new Promise(r => setTimeout(r, 500));
  document.getElementById('fieldBio').innerHTML =
    `<span class="revealed">I build the pipes between marketing, sales, and product data — scoring leads, routing signals, and wiring up outbound systems so reps spend time on conversations, not spreadsheets.</span><span class="ai-badge">✦ filled</span>`;
  setFormula('B3', '=ENRICH(profile.skills)', true);
  await new Promise(r => setTimeout(r, 450));
  document.getElementById('fieldSkills').innerHTML = `<div class="chips revealed">
      <span class="chip">Clay</span><span class="chip">HubSpot</span><span class="chip">Apollo</span>
      <span class="chip">Salesforce</span><span class="chip">n8n / Zapier</span><span class="chip">Python</span>
      <span class="chip">SQL</span><span class="chip">Segment</span>
    </div><span class="ai-badge">✦ filled</span>`;
  setFormula('A1', 'Alex Rivera', false);
  btn.querySelector('.label').textContent = 'Enriched';
  btn.classList.add('done');
  document.getElementById('statusPill').textContent = 'enriched';
  document.getElementById('statusPill').classList.add('done');
  document.getElementById('saveState').textContent = 'saved';
  checkAllDone();
});

function checkAllDone(){
  const done = document.querySelectorAll('.run-btn.done').length;
  if(done === 3){
    document.getElementById('saveState').textContent = 'all sheets enriched';
  }
}

// cell click -> update formula bar + selection
document.querySelectorAll('td.cell:not(.copyable)').forEach(td => {
  td.addEventListener('click', () => {
    const text = td.textContent.trim().replace('filled','').trim();
    setFormula('•', text.slice(0,60), false);
  });
});

// contact copy
document.querySelectorAll('td.copyable').forEach(td => {
  async function copy(){
    const text = td.getAttribute('data-copy');
    try{ await navigator.clipboard.writeText(text); }catch(e){}
    td.classList.add('copied');
    setTimeout(() => td.classList.remove('copied'), 1400);
  }
  td.addEventListener('click', copy);
  td.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); copy(); } });
});
