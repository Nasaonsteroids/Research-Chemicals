/* =========================================================================
   Website Enhancements – v17  (100 % fullständig kod)
   •  ALLA preparat (extraMeta) – inget hopklippt
   •  Robust namn-match (canon()/metaBySlug) – chip visas på varje kort
   •  Sidopanel = alla taggar direkt (AND-filter + risk-slider)
   •  window.extraMeta      ← för dev-konsol
   •  export default ...    ← avkommentera för ES-module
   ======================================================================= */

/* =============================== 1. extraMeta =========================== */
const extraMeta = {
  /* ---------------- PEPTIDES ------------------------------------------- */
  'Semaglutide':               { tags:['GLP-1','fat-loss'],                risk:2, dosePerKg:[0.05,0.1], category:'peptides' },
  'Tirzepatide':               { tags:['GIP','GLP-1','fat-loss'],          risk:2, dosePerKg:[0.05,0.1], category:'peptides' },
  'BPC-157':                   { tags:['healing'],                          risk:1,                       category:'peptides' },
  'Tesamorelin':               { tags:['GH-releasing'],                     risk:2,                       category:'peptides' },

  /* ---- mg/kg peptides (fanns i ursprungsstack) ------------------------ */
  'GDF-8 neutralising Ab':     { tags:['myostatin'],                        risk:3, dosePerKg:[1],        category:'peptides' },
  'Adipotide (FTP-P1)':        { tags:['fat-loss','experimental'],          risk:4, dosePerKg:[0.75,1.5], category:'peptides' },
  'FOXO4-DRI':                 { tags:['senolytic','anti-aging'],           risk:4, dosePerKg:[0.1],      category:'peptides' },
  'SS-31 (Elamipretide)':      { tags:['mitochondria'],                     risk:2, dosePerKg:[0.1],      category:'peptides' },

  /* ---- Övriga peptides inkl. blends, nootropics, osv ------------------ */
  'Retatrutide':               { tags:['GLP-1','GIP','glucagon','fat-loss'], risk:3, category:'peptides' },
  'Survodutide (BI456906)':    { tags:['GLP-1','glucagon','fat-loss'],       risk:3, category:'peptides' },
  'AOD-9604':                  { tags:['GH-frag','lipolytic'],               risk:2, category:'peptides' },
  'Mazdutide (LY3502970)':     { tags:['GLP-1','fat-loss'],                  risk:3, category:'peptides' },
  'Cagrilintide':              { tags:['amylin','satiety'],                  risk:2, category:'peptides' },
  'IGF-1 LR3':                 { tags:['IGF-1','anabolic','muscle-gain'],    risk:3, category:'peptides' },
  'IGF-DES (1-3)':             { tags:['IGF-1','hyperplasia'],               risk:3, category:'peptides' },
  'Follistatin-344/315':       { tags:['myostatin-block'],                   risk:4, category:'peptides' },
  'TB-500 (Thymosin-β4)':      { tags:['healing','angiogenic'],              risk:2, category:'peptides' },
  'GHK-Cu':                    { tags:['skin','collagen'],                   risk:2, category:'peptides' },
  'LL-37':                     { tags:['antimicrobial'],                     risk:2, category:'peptides' },
  'Thymosin α1':               { tags:['immune'],                            risk:1, category:'peptides' },
  'Thymalin':                  { tags:['immune','anti-aging'],               risk:1, category:'peptides' },
  'KPV':                       { tags:['anti-inflammatory'],                 risk:1, category:'peptides' },
  'Hexarelin (Examorelin)':    { tags:['GHRP'],                              risk:3, category:'peptides' },
  'HMG':                       { tags:['gonadotropin'],                      risk:3, category:'peptides' },
  'Kisspeptin-10':             { tags:['GnRH-stim'],                         risk:2, category:'peptides' },
  'Glutathione (IV)':          { tags:['antioxidant'],                       risk:1, category:'peptides' },
  'Cerebrolysin':              { tags:['nootropic'],                         risk:2, category:'peptides' },
  'Epithalon (Epitalon)':      { tags:['telomerase','sleep'],                risk:2, category:'peptides' },
  'MOTS-c':                    { tags:['mitochondria','endurance'],          risk:3, category:'peptides' },
  'Melatonin (IV bolus)':      { tags:['sleep','antioxidant'],               risk:1, category:'peptides' },
  'NAD⁺ / NMN':                { tags:['sirtuin','mitochondria'],            risk:2, category:'peptides' },
  'Snap-8':                    { tags:['cosmetic','wrinkle'],                risk:1, category:'peptides' },
  'Ara-290 (Cibinetide)':      { tags:['neuropathy'],                        risk:2, category:'peptides' },
  'Selank':                    { tags:['anxiolytic'],                        risk:1, category:'peptides' },
  'Semax':                     { tags:['nootropic'],                         risk:1, category:'peptides' },
  'PT-141 (Bremelanotide)':    { tags:['libido'],                            risk:2, category:'peptides' },
  'Oxytocin (intranasal)':     { tags:['bonding'],                           risk:1, category:'peptides' },
  'Insulin (rapid-acting)':    { tags:['anabolic','glucose'],                risk:4, category:'peptides' },
  'hCG':                       { tags:['LH-mimetic','fertility'],            risk:2, category:'peptides' },
  'EPO-α':                     { tags:['erythropoiesis','endurance'],        risk:4, category:'peptides' },
  '5-Amino-1-MQ':              { tags:['NNMT-inhibitor','fat-loss'],         risk:3, category:'peptides' },
  'Sermorelin':                { tags:['GHRH'],                              risk:2, category:'peptides' },
  'Ipamorelin':                { tags:['GHRP'],                              risk:2, category:'peptides' },
  'GHRP-2':                    { tags:['GHRP'],                              risk:2, category:'peptides' },
  'GHRP-6':                    { tags:['GHRP','appetite'],                   risk:2, category:'peptides' },
  'PEG-MGF':                   { tags:['MGF','muscle-gain'],                 risk:3, category:'peptides' },
  'DSIP':                      { tags:['sleep'],                             risk:1, category:'peptides' },
  'Dihexa':                    { tags:['nootropic','HGF-mimetic'],           risk:4, category:'peptides' },
  'Liraglutide':               { tags:['GLP-1','fat-loss'],                  risk:2, category:'peptides' },
  'Exendin-4':                 { tags:['GLP-1','short-acting'],              risk:2, category:'peptides' },
  'VIP':                       { tags:['vasodilator'],                       risk:2, category:'peptides' },
  'GLOW Blend':                { tags:['healing-blend'],                     risk:3, category:'peptides' },
  'BG37 Hair Blend':           { tags:['hair-growth'],                       risk:2, category:'peptides' },
  'BBG70 Post-surgery Blend':  { tags:['surgery-healing'],                   risk:3, category:'peptides' },
  'CJC-1295 + Ipamorelin':     { tags:['GHRH','GHRP'],                       risk:2, category:'peptides' },
  'MT-2 / PT-141 combo':       { tags:['melanotan','libido'],                risk:3, category:'peptides' },
  'Gonadorelin':               { tags:['GnRH'],                              risk:2, category:'peptides' },
  'Triptorelin':               { tags:['GnRH-agonist'],                      risk:3, category:'peptides' },
  'ACE-031 (ActRIIB-Fc)':      { tags:['myostatin-trap'],                    risk:4, category:'peptides' },
  'Apelin-13':                 { tags:['vasodilator','AMPK'],                risk:2, category:'peptides' },
  'Angiotensin (1-7)':         { tags:['vasodilator','anti-fibrotic'],       risk:2, category:'peptides' },
  'P21':                       { tags:['nootropic'],                         risk:3, category:'peptides' },
  'Noopept (GVS-111)':         { tags:['nootropic'],                         risk:2, category:'peptides' },
  'Pal-GHK':                   { tags:['collagen','topical'],                risk:1, category:'peptides' },
  'Pal-Tripeptide-38':         { tags:['wrinkle'],                           risk:1, category:'peptides' },
  'TB4 Fragment (TB4-Frag)':   { tags:['healing'],                           risk:2, category:'peptides' },

  /* -------------------------- AAS / STEROIDS ------------------------ */
  'Testosterone Enanthate':            { tags:['testosterone','bulk'],          risk:3, dosePerKg:[3,6], category:'aas' },
  'Testosterone Cypionate':            { tags:['testosterone','bulk'],          risk:3, category:'aas' },
  'Testosterone Propionate':           { tags:['testosterone','short-ester'],   risk:3, category:'aas' },
  'Testosterone Phenylpropionate':     { tags:['testosterone','medium-ester'],  risk:3, category:'aas' },
  'Testosterone Suspension':           { tags:['testosterone','strength'],      risk:4, category:'aas' },
  'Testosterone Undecanoate (Nebido)': { tags:['testosterone','ultra-long'],    risk:3, category:'aas' },
  'Sustanon / Multi-ester Test':       { tags:['testosterone','blend'],         risk:3, category:'aas' },
  'Boldenone Undecylenate (EQ)':       { tags:['boldenone','lean-gain'],        risk:3, category:'aas' },
  'Boldenone Cypionate':               { tags:['boldenone','lean-gain'],        risk:3, category:'aas' },
  'Drostanolone Propionate (Masteron-P)':{tags:['DHT','hardening'],             risk:3, category:'aas' },
  'Drostanolone Enanthate (Masteron-E)':{ tags:['DHT','hardening'],             risk:3, category:'aas' },
  'Primobolan (Metenolone Enanthate)':  { tags:['DHT','mild'],                  risk:2, category:'aas' },
  'Methenolone Acetate (Oral Primo)':   { tags:['DHT','mild','oral'],           risk:2, category:'aas' },
  'Nandrolone Decanoate (Deca)':        { tags:['19-nor','joint'],              risk:4, category:'aas' },
  'Nandrolone Phenylpropionate (NPP)':  { tags:['19-nor','joint'],              risk:3, category:'aas' },
  'Nandrolone Undecanoate':            { tags:['19-nor'],                       risk:4, category:'aas' },
  'DHB (Dihydroboldenone Cypionate)':   { tags:['strength','dry'],               risk:4, category:'aas' },
  'Trenbolone Acetate':                { tags:['tren','recomp'],                 risk:5, category:'aas' },
  'Trenbolone Enanthate':              { tags:['tren','recomp'],                 risk:5, category:'aas' },
  'Trenbolone Hex (Parabolan)':        { tags:['tren','contest'],                risk:5, category:'aas' },
  'Trenbolone Suspension':             { tags:['tren','strength'],               risk:5, category:'aas' },
  'Tri-Tren Blend':                    { tags:['tren','multi-ester'],            risk:5, category:'aas' },
  'Trestolone Acetate (MENT)':         { tags:['19-nor','potent'],               risk:4, category:'aas' },
  'Methandienone (Dianabol)':          { tags:['oral','bulk'],                   risk:4, category:'aas' },
  'Oxymetholone (Anadrol)':            { tags:['oral','mass'],                   risk:4, category:'aas' },
  'Stanozolol (Winstrol)':             { tags:['oral','dry'],                    risk:4, category:'aas' },
  'Turinabol (Oral-Tbol)':             { tags:['oral','lean'],                   risk:3, category:'aas' },
  'Fluoxymesterone (Halotestin)':      { tags:['oral','strength'],               risk:5, category:'aas' },
  'Superdrol (Methasterone)':          { tags:['oral','strength','dry'],         risk:5, category:'aas' },
  'Methyl-1-Testosterone (M1T)':       { tags:['oral','potent'],                 risk:5, category:'aas' },
  'Epistane (Methylepitiostane)':      { tags:['oral','dry'],                    risk:3, category:'aas' },
  'Dimethazine (DMZ)':                 { tags:['oral','strength'],               risk:4, category:'aas' },
  'Furazabol (Miotolan)':              { tags:['oral','mild','dry'],             risk:3, category:'aas' },
  'Methyltestosterone':                { tags:['oral','testosterone'],           risk:4, category:'aas' },

  /* ----------------------------- SARMs ----------------------------- */
  'RAD-140 (Testolone)':       { tags:['sarm','potent','lean-gain'],        risk:3, category:'sarms' },
  'MK-2866 (Ostarine)':        { tags:['sarm','mild'],                      risk:2, category:'sarms' },
  'LGD-4033 (Ligandrol)':      { tags:['sarm','bulk'],                      risk:3, category:'sarms' },
  'S4 (Andarine)':             { tags:['sarm','hardening','vision'],        risk:3, category:'sarms' },
  'LGD-3303':                  { tags:['sarm','bone'],                      risk:3, category:'sarms' },
  'S23':                       { tags:['sarm','dry'],                       risk:4, category:'sarms' },
  'AC-262536':                 { tags:['sarm','partial'],                   risk:2, category:'sarms' },
  'LGD-2226':                  { tags:['sarm','long-half-life'],            risk:2, category:'sarms' },
  'TLB-150 (RAD-150)':         { tags:['sarm','potent'],                    risk:3, category:'sarms' },
  'YK-11':                     { tags:['sarm','myostatin'],                 risk:4, category:'sarms' },
  'GW-501516 (Cardarine)':     { tags:['PPAR-delta','endurance'],           risk:4, category:'sarms' },
  'SR9009 (Stenabolic)':       { tags:['REV-ERB','metabolic'],              risk:3, category:'sarms' },
  'MK-677 (Ibutamoren)':       { tags:['GH-secretagogue','sleep'],          risk:2, dosePerKg:[1,1.5], category:'sarms' },

  /* ---------------------- SERMs / Ancillaries ---------------------- */
  'Tamoxifen (Nolvadex)':      { tags:['SERM','PCT'],    risk:2, category:'serms' },
  'Clomid (Clomiphene)':       { tags:['SERM','PCT'],    risk:3, category:'serms' },
  'Arimidex (Anastrozole)':    { tags:['AI'],            risk:2, category:'serms' },
  'Letrozole':                 { tags:['AI','potent'],   risk:3, category:'serms' },
  'Exemestane':                { tags:['AI','suicide'],  risk:2, category:'serms' },
  'Formestane':                { tags:['AI','topical'],  risk:2, category:'serms' },
  'Raloxifene':                { tags:['SERM','gyno'],   risk:2, category:'serms' },
  'Toremifene':                { tags:['SERM'],          risk:2, category:'serms' },
  'Finasteride':               { tags:['5-AR-inhibitor','hair'], risk:2, category:'serms' },
  'Dutasteride':               { tags:['5-AR-inhibitor'],        risk:3, category:'serms' },
  'Cabergoline':               { tags:['prolactin'],     risk:3, category:'serms' },
  'Pramipexole':               { tags:['prolactin'],     risk:3, category:'serms' },
  'Bromocriptine':             { tags:['prolactin'],     risk:3, category:'serms' },
  'Clenbuterol':               { tags:['β2-agonist','thermogenic'], risk:4, category:'serms' },
  'Albuterol':                 { tags:['β2-agonist'],    risk:3, category:'serms' },
  'Ephedrine':                 { tags:['adrenergic'],    risk:3, category:'serms' },
  'Yohimbine HCl':             { tags:['α2-antagonist'], risk:3, category:'serms' },
  'T3 (Liothyronine)':         { tags:['thyroid'],       risk:4, category:'serms' },
  'T4 (Levothyroxine)':        { tags:['thyroid'],       risk:3, category:'serms' },
  'DNP (2,4-Dinitrophenol)':   { tags:['uncoupler','extreme'], risk:5, category:'serms' },
  'Metformin':                 { tags:['insulin-sens','AMPK'],   risk:1, category:'serms' },
  'Berberine':                 { tags:['AMPK','OTC'],            risk:1, category:'serms' },
  'Sildenafil (Viagra)':       { tags:['PDE-5','erectile'],      risk:2, category:'serms' },
  'Tadalafil (Cialis)':        { tags:['PDE-5','long-acting'],   risk:2, category:'serms' },
  'Vardenafil (Levitra)':      { tags:['PDE-5'],                 risk:2, category:'serms' },
  'Avanafil (Stendra)':        { tags:['PDE-5','fast'],          risk:2, category:'serms' },

  /* ----------------------------- MISC ------------------------------- */
  'AICAR': { tags:['AMPK','endurance'], risk:3, dosePerKg:[10], category:'misc' }
};

/* ====================== 2. Slug‑helper ================================= */
function canon (str = "") {
  return str
    .normalize("NFKD")            // width / accents → normal ascii
    .replace(/[\u2010-\u2015]/g, "-") // fancy dashes → hyphen
    .replace(/\s+/g, "-")        // whitespace → hyphen
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, ""); // bara a‑z, 0‑9 och -
}

/* ====================== 3. Bygg global lookup ========================== */
const defaultRisk = { peptides:2, aas:4, sarms:3, serms:2, misc:3 };

function buildLookup () {
  const lookup = {}; // slug → { name, tags, risk, dosePerKg, category, … }

  // 3.1  Samla ihop befintliga window.data‑strukturer om de finns
  if (!window.data) window.data = {};
  [ ["fullData", null], ["peptides", "peptides"], ["aas", "aas"],
    ["steroids", "aas"], ["sarms", "sarms"], ["serms", "serms"] ]
    .forEach(([src, cat]) => { if (window[src]) window.data[cat || src] = window[src]; });

  // 3.2  Lägg in alla compounds (även nested arrays) i lookup
  for (const [cat, val] of Object.entries(window.data)) {
    const arr = Array.isArray(val) ? val : Object.values(val).flat();
    arr.forEach(c => {
      if (!c || !c.name) return;
      const slug = canon(c.name);
      const meta = extraMeta[c.name] || {};
      const item = {
        name: c.name,
        dose: c.dose,
        details: c.details,
        dosePerKg: c.dosePerKg ?? meta.dosePerKg,
        tags: c.tags ?? meta.tags,
        risk: c.risk ?? meta.risk ?? defaultRisk[cat] ?? 3,
        category: c.category ?? meta.category ?? cat,
      };
      if (!item.tags || !item.tags.length) {
        // fallback till singular kategorinamn ("peptide", "sarm" …)
        item.tags = [ (item.category || "misc").replace(/s$/, "") ];
      }
      lookup[slug] = item;
    });
  }

  // 3.3  Säkra att extraMeta‑poster som saknas i sidan också hamnar i lookup
  for (const [rawName, meta] of Object.entries(extraMeta)) {
    const slug = canon(rawName);
    if (!lookup[slug]) {
      lookup[slug] = {
        name: rawName,
        tags: meta.tags,
        risk: meta.risk ?? defaultRisk[meta.category] ?? 3,
        dosePerKg: meta.dosePerKg,
        category: meta.category || "misc",
      };
    }
  }

  return lookup;
}

const LOOKUP = buildLookup();
window.extraMeta = extraMeta;   // lämna kvar för dev‑konsol
window.compLookup = LOOKUP;     // lättåtkomligt globalt

/* ====================== 4. UI helpers ================================= */
function $(sel, ctx=document) { return ctx.querySelector(sel); }
function $all(sel, ctx=document) { return [...ctx.querySelectorAll(sel)]; }

/* ====================== 5. Sidebar (filter) =========================== */
function buildSidebar () {
  // 5.1  Skapa element om de inte finns
  let sidebar = $("#filterSidebar");
  if (!sidebar) {
    sidebar = document.createElement("aside");
    sidebar.id = "filterSidebar";
    document.body.appendChild(sidebar);
  }

  sidebar.innerHTML = `
    <h3 class="sidebarTitle">Filtrera substanser</h3>
    <section id="filterTagsWrap" style="margin-bottom:1rem;"></section>

    <label style="display:block;margin-top:1rem;">Max risk:
      <input type="range" id="riskRange" min="1" max="5" value="5">
      <span id="riskVal">5</span>
    </label>

    <hr style="margin:1rem 0;">

    <h4 style="margin:0 0 0.5rem 0;">Doskalkylator</h4>
    <label>Vikt (kg):
      <input type="number" id="weightInput" min="30" max="200" style="width:70px;">
    </label>
    <label style="display:block;margin:0.5rem 0;">Substans:
      <select id="compoundSelect"></select>
    </label>
    <button id="calcBtn" style="margin-top:0.3rem;">Beräkna</button>
    <p id="doseOut" style="margin-top:0.6rem;font-size:0.9rem;"></p>`;

// 5.2  Toggle-knapp
if (!$("#filterToggle")) {
  const btn = document.createElement("button");
  btn.id = "filterToggle";
  // ikon + text i varsitt element
  btn.innerHTML = '<span class="icon">☰</span><span class="label"> Filter</span>';
  btn.onclick = () => {
    sidebar.classList.toggle("open");
    if (sidebar.classList.contains("open")) populateSelect();
  };
  document.body.appendChild(btn);
}


  // 5.3  Risk‑slider
  const riskInput = $("#riskRange");
  riskInput.oninput = e => {
    $("#riskVal").textContent = e.target.value;
    applyFilters();
  };

  // 5.4  Kalkylator
  function populateSelect () {
    const sel = $("#compoundSelect");
    sel.innerHTML = "";
    const names = Object.values(LOOKUP).map(o => o.name).sort();
    names.forEach(n => sel.add(new Option(n, n)));
  }
  populateSelect();

  $("#calcBtn").onclick = () => {
    const sel = $("#compoundSelect");
    const comp = LOOKUP[canon(sel.value)];
    const kg = parseFloat($("#weightInput").value);
    const out = $("#doseOut");
    if (!comp) { out.textContent = "Substansen hittades inte."; return; }

    let txt = `Typdos: ${comp.dose || "—"}`;
    if (comp.dosePerKg && kg) {
      const [lo, hi] = comp.dosePerKg.map(d => (d * kg).toFixed(2));
      txt += `<br>≈ ${lo} – ${hi} mg/vecka (vid ${kg} kg)`;
    }
    out.innerHTML = txt;
  };

  // 5.5  Bygg tag‑chips (baserat på korten som finns i DOM just nu)
  function refreshSidebarTags () {
    const wrap = $("#filterTagsWrap");
    wrap.innerHTML = "";

    const allTags = new Set();
    $all("[data-name]").forEach(card => {
      const info = LOOKUP[canon(card.dataset.name)] || {};
      (info.tags || []).forEach(t => allTags.add(t));
    });

    allTags.forEach(t => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.dataset.tag = t;
      chip.textContent = t;
      chip.onclick = () => toggleTag(t);
      wrap.appendChild(chip);
    });
  }
  refreshSidebarTags();

  // Exponera så att enhance() kan kalla om nya kort läggs till
  sidebar.refreshTags = refreshSidebarTags;
}

/* ====================== 6. Centralt filter‑state ====================== */
const activeTags = new Set();
let maxRiskCache = 5; // default

function toggleTag (tag) {
  activeTags.has(tag) ? activeTags.delete(tag) : activeTags.add(tag);
  // uppdatera chip‑utseende på alla förekomster
  $all(`.chip[data-tag="${CSS.escape(tag)}"]`).forEach(el => el.classList.toggle("active", activeTags.has(tag)));
  applyFilters();
}

function applyFilters () {
  maxRiskCache = parseInt($("#riskRange").value, 10);
  $all('[data-name]').forEach(card => {
    const info = LOOKUP[canon(card.dataset.name)] || {};
    const riskOK = (info.risk || 5) <= maxRiskCache;
    const tagOK  = [...activeTags].every(t => (info.tags || []).includes(t));
    card.style.display = (riskOK && tagOK) ? "block" : "none";
  });
}

/* ====================== 7. Förbättra korten =========================== */
function enhanceCard (card) {
  if (card.dataset.enhanced) return; // redan fixad
  card.dataset.enhanced = "1";

  const info = LOOKUP[canon(card.dataset.name)] || {};

  /* 7.1  Risk‑mätare */
  const gauge = document.createElement("div");
  gauge.className = "riskGauge";
  gauge.style.setProperty('--risk', info.risk || 3);
  card.prepend(gauge);

  /* 7.2  Tag‑chips */
  (info.tags || []).forEach(t => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.dataset.tag = t;
    chip.textContent = t;
    chip.classList.toggle("active", activeTags.has(t));
    chip.onclick = () => toggleTag(t);
    card.appendChild(chip);
  });
}

function enhanceExistingCards () {
  $all('[data-name]').forEach(enhanceCard);
  // se till att sidebaren alltid matchar taggar på sidan
  const sidebar = $("#filterSidebar");
  if (sidebar && typeof sidebar.refreshTags === 'function') sidebar.refreshTags();
}

/* ====================== 8. MutationObserver (SPA / dynamisk) ========= */
new MutationObserver(muts => {
  let added = false;
  muts.forEach(m => m.addedNodes.forEach(node => {
    if (node.nodeType === 1 && node.matches && node.matches('[data-name]')) {
      enhanceCard(node);
      added = true;
    }
  }));
  if (added) applyFilters();
}).observe(document.body, { childList:true, subtree:true });

/* ====================== 9. Disclaimer‑banner ========================= */
function showDisclaimer () {
  if (localStorage.getItem('bannerDismissed')) return;
  const div = document.createElement('div');
  div.id = 'disclaimerBanner';
  div.innerHTML = '⚠️ Endast utbildningssyfte – ingen medicinsk rådgivning.' +
                  '<button id="closeBanner" aria-label="Stäng">×</button>';
  document.body.prepend(div);
  $('#closeBanner', div).onclick = () => {
    div.remove();
    localStorage.setItem('bannerDismissed', '1');
  };
}

/* ====================== 10. Init ===================================== */
function init () {
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', run, { once:true })
    : run();

  function run () {
    buildSidebar();
    enhanceExistingCards();
    showDisclaimer();
  }
}
init();

/* ---- Export (om du laddar som ES‑module) -----------------------------
export default window.compLookup;
*/
