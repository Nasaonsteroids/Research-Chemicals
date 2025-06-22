/* =========================================================================
   UX & Data-Driven Upgrades – v1.2  (2025-06-22)
   -------------------------------------------------------------------------
   ✔  Fixes light/dark toggle (adds full light-palette variables)
   ✔  Removes redundant filter FAB (user already has a filter button)
   ✔  Back-to-Top FAB remains with smoother show/hide logic
   ✔  Cycle planner UI totally overhauled – clearer form, inline editing,
      start-date support, quick clear & improved .ics export
   -------------------------------------------------------------------------*/

(() => {
  if (document.documentElement.dataset.upgrades) return;         // guard against double-inject
  document.documentElement.dataset.upgrades = "1";

  /* ----------------------------- helpers ------------------------------ */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const canon  = window.canon || (s => s.toLowerCase().replace(/[^a-z0-9\-]+/g, ""));
  const LOOKUP = window.compLookup || {};
  const LS     = { THEME: "pref-theme", SELECTED: "cmp-selected" };

  /* ------------------------- shared styles ---------------------------- */
  const css = `
    :root { --fab-size:46px; }

    /* 🎨 LIGHT theme overrides */
    :root.light, [data-theme="light"] {
      --bg:#f7f9fe;
      --card:rgba(0,0,0,0.06);
      --card-glow:rgba(0,119,255,.28);
      --accent:#0077ff;
      --text:#0f172a;
      --text-dim:#475569;
      --surface-1:#ffffff;
      --surface-2:#f1f5f9;
      --surface-3:#e2e8f0;
    }

    /* base (mostly dark) shared styles */
    .fab { position:fixed; width:var(--fab-size); height:var(--fab-size); display:grid; place-items:center;
           border-radius:50%; border:none; cursor:pointer; z-index:998; background:var(--surface-3,#222);
           color:var(--text,#fff); font-size:1.05rem; box-shadow:0 3px 8px rgb(0 0 0 /.4); transition:opacity .25s; }
    :root.light .fab, [data-theme="light"] .fab { color:var(--text); }

    .customModal { position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
                   background:rgba(0,0,0,.7); z-index:1000; }
    .customModal .inner { width:92%; max-width:700px; max-height:90vh; overflow:auto; padding:1.5rem;
                          background:var(--card,#111); border-radius:var(--radius,10px); }
    .customModal.wide .inner { max-width:900px; }

    @keyframes shimmer{from{background-position:-450px 0}to{background-position:450px 0}}
    .skeleton{position:relative;overflow:hidden;}
    .skeleton::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
                     background-size:800px 100%;animation:shimmer 1.3s infinite linear;}

    .card.selected{outline:3px solid var(--accent,#00ffd0)}
    .cmpTick{position:absolute;top:6px;right:6px;background:var(--accent,#00ffd0);color:#000;border-radius:50%;width:20px;height:20px;
             display:grid;place-items:center;font-size:.8rem;pointer-events:none;opacity:.85}
    .cmpTable{width:100%;border-collapse:collapse;margin-top:1rem;font-size:.9rem}
    .cmpTable th{text-align:left;padding:.4rem .6rem;background:var(--surface-2,#333)}
    .cmpTable td{padding:.35rem .6rem;border-bottom:1px solid rgb(255 255 255 /.07)}

    /* Planner UI */
    .planner-controls{display:flex;flex-wrap:wrap;gap:.8rem;margin-bottom:1rem;font-size:.9rem}
    .planner-controls label{display:flex;align-items:center;gap:.3rem}
    #cpList .item{display:grid;grid-template-columns:1fr 70px 60px 28px;gap:.4rem;align-items:center;margin-bottom:.5rem}
    #cpList input,#cpList select{width:100%}
  `;
  const style = document.createElement("style");
  style.id = "upgrades-style";
  style.textContent = css;
  document.head.append(style);

  /* ----------------------- theme toggle ------------------------------ */
  (() => {
    const root  = document.documentElement;
    const current = localStorage.getItem(LS.THEME) ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const apply = t => {
      root.dataset.theme = t;
      root.classList.toggle("light", t === "light");             // keep old stylesheet happy
    };
    apply(current);

    const btn = document.createElement("button");
    btn.id = "themeToggle";
    btn.className = "fab";
    btn.style.bottom = "1rem";
    btn.style.right  = "1rem";
    const sync = () =>
      (btn.textContent = root.classList.contains("light") ? "🌞" : "🌜");
    sync();
    btn.addEventListener("click", () => {
      const next = root.classList.contains("light") ? "dark" : "light";
      apply(next);
      localStorage.setItem(LS.THEME, next);
      sync();
    });
    document.body.append(btn);
  })();

  /* ------------------------ Back-to-top FAB -------------------------- */
  (() => {
    const topFab = document.createElement("button");
    topFab.id = "fabTop";
    topFab.className = "fab";
    topFab.title = "Back to top";
    topFab.textContent = "↑";
    Object.assign(topFab.style, {
      bottom: "4.4rem", right: "1rem", opacity: "0", pointerEvents: "none"
    });
    topFab.onclick = () =>
      window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.append(topFab);

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const show = window.scrollY > 600;
        topFab.style.opacity       = show ? "1" : "0";
        topFab.style.pointerEvents = show ? "auto" : "none";
        ticking = false;
      });
    }, { passive: true });
  })();

  /* -------------------- skeleton placeholders ------------------------ */
  (() => {
    const cards = $$(".card");
    const obs   = new IntersectionObserver(
      (es, o) =>
        es.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.remove("skeleton");
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "200px" }
    );
    cards.forEach(c => {
      if (!c.classList.contains("show")) {
        c.classList.add("skeleton");
        obs.observe(c);
      }
    });
  })();

  /* -------------------- keyboard navigation -------------------------- */
  (() => {
    [...$$(".card"), ...$$(".chip"), $("#filterToggle")]
      .filter(Boolean)
      .forEach(el => (el.tabIndex = 0));

    document.addEventListener("keydown", e => {
      const dirs = { ArrowRight: 1, ArrowLeft: -1 };
      if (!(e.key in dirs)) return;
      const cards = $$(".card");
      const idx   = cards.indexOf(document.activeElement);
      if (idx === -1) return;
      e.preventDefault();
      cards[idx + dirs[e.key]]?.focus();
    });
  })();

  /* ---------------------- comparator selector ------------------------ */
  (() => {
    const selected = new Set(
      JSON.parse(localStorage.getItem(LS.SELECTED) || "[]")
    );

    const cmpBtn = document.createElement("button");
    cmpBtn.id = "compareBtn";
    cmpBtn.className = "fab";
    cmpBtn.title = "Compare selected";
    Object.assign(cmpBtn.style, {
      bottom: "8rem", right: "1rem", opacity: "0", pointerEvents: "none"
    });
    document.body.append(cmpBtn);

    const syncBtn = () => {
      const n = selected.size;
      cmpBtn.textContent       = `⇄ ${n}`;
      cmpBtn.style.opacity     = n > 1 ? "1" : "0";
      cmpBtn.style.pointerEvents = n > 1 ? "auto" : "none";
    };

    $$(".card").forEach(card => {
      const slug = canon(
        card.dataset.name || card.querySelector("h3")?.textContent || ""
      );
      const tick = document.createElement("span");
      tick.className = "cmpTick";
      tick.textContent = "✓";
      card.style.position = "relative";
      card.append(tick);
      if (selected.has(slug)) card.classList.add("selected");

      card.addEventListener("click", e => {
        if (e.shiftKey || e.altKey || e.metaKey) {
          e.preventDefault();
          e.stopPropagation();
          card.classList.toggle("selected");
          selected[selected.has(slug) ? "delete" : "add"](slug);
          localStorage.setItem(LS.SELECTED, JSON.stringify([...selected]));
          syncBtn();
        }
      });
    });
    syncBtn();

    cmpBtn.addEventListener("click", () => {
      const items = [...selected].map(s => LOOKUP[s]).filter(Boolean);
      if (items.length < 2) return;
      const md = ensureModal("cmpModal");
      md.innerHTML = `
        <h3>Comparison (${items.length})</h3>
        <table class="cmpTable"></table>
        <button class="close">Close</button>`;
      md.querySelector(".close").onclick = () =>
        md.parentElement.remove();
      const keys = ["name", "dose", "risk", "category"];
      const tb   = md.querySelector("table");
      keys.forEach(k => {
        const row = document.createElement("tr");
        row.innerHTML = `<th>${k}</th>${items
          .map(i => `<td>${i[k] ?? "—"}</td>`)
          .join("")}`;
        tb.append(row);
      });
    });
  })();

  /* ------------------- half-life chart ------------------------------- */
  (() => {
    const loadChart = () => {
      if (loadChart.p) return loadChart.p;
      loadChart.p = new Promise(res => {
        const s = document.createElement("script");
        s.src   = "https://cdn.jsdelivr.net/npm/chart.js";
        s.async = true;
        s.onload = () => res(window.Chart);
        document.head.append(s);
      });
      return loadChart.p;
    };

    const parseHalf = txt => {
      const m = txt?.match(
        /([0-9.]+)(?:\\s*(?:-|–)\\s*([0-9.]+))?\\s*([hdw])/i
      );
      if (!m) return 0;
      const avg = (parseFloat(m[1]) + parseFloat(m[2] || m[1])) / 2;
      return m[3].toLowerCase() === "d"
        ? avg * 24
        : m[3].toLowerCase() === "w"
        ? avg * 168
        : avg;
    };

    document.addEventListener(
      "click",
      e => {
        const card = e.target.closest(".card");
        if (!card) return;
        const info =
          LOOKUP[
            canon(
              card.dataset.name || card.querySelector("h3")?.textContent || ""
            )
          ];
        if (!info?.halfLife) return;
        setTimeout(() => {
          const m = $("#modal");
          if (!m || m.dataset.hlfdone) return;
          m.dataset.hlfdone = 1;
          const btn = document.createElement("button");
          btn.textContent = "Plot serum levels";
          btn.style.marginTop = "1rem";
          (m.querySelector(".modal-content") || m).append(btn);
          btn.onclick = () => draw(info);
        }, 40);
      },
      true
    );

    async function draw(comp) {
      const inn = ensureModal("hlfModal");
      inn.innerHTML =
        '<canvas width="380" height="240"></canvas><button class="close">Close</button>';
      inn.querySelector(".close").onclick = () =>
        inn.parentElement.remove();
      const t = parseHalf(comp.halfLife);
      if (!t)
        return inn.prepend(
          Object.assign(document.createElement("p"), {
            textContent: "Half-life unknown."
          })
        );
      const Chart = await loadChart();
      const k     = Math.log(2) / t;
      const hrs   = Array.from({ length: Math.round(t * 8) }, (_, i) => i);
      new Chart(inn.querySelector("canvas"), {
        type: "line",
        data: {
          labels: hrs,
          datasets: [
            { label: `${comp.name} (norm.)`,
              data: hrs.map(h => Math.exp(-k * h)) }
          ]
        },
        options: { responsive: true, scales: { y: { min: 0, max: 1 } } }
      });
    }
  })();

  /* ------------------- cycle planner (revamped) ---------------------- */
  (() => {
    const fab = document.createElement("button");
    fab.id = "plannerBtn";
    fab.className = "fab";
    fab.textContent = "📅";
    fab.title = "Open cycle planner";
    Object.assign(fab.style, { bottom: "11.6rem", right: "1rem" });
    document.body.append(fab);

    const state = [];

    const loadIcs = () => {
      if (loadIcs.p) return loadIcs.p;
      loadIcs.p = new Promise(res => {
        const s = document.createElement("script");
        s.src   = "https://cdn.jsdelivr.net/npm/ics/dist/ics.min.js";
        s.async = true;
        s.onload = () => res(window.ics);
        document.head.append(s);
      });
      return loadIcs.p;
    };

    fab.onclick = () => {
      const md = ensureModal("planModal", "wide");
      md.innerHTML = `
        <h3>Cycle planner</h3>
        <div class="planner-controls">
          <label>Start date <input type="date" id="cpStart"></label>
          <label>Cycle length (weeks) <input type="number" id="cpLen" min="1" value="12"></label>
          <button id="cpClear" class="secondary">Clear all</button>
        </div>
        <div class="row">
          <select id="cpCompound"></select>
          <input id="cpDose" type="number" placeholder="Dose">
          <input id="cpWeek" type="number" min="1" value="1" style="width:75px;">
          <button id="cpAdd">Add</button>
        </div>
        <div id="cpList"></div>
        <button id="cpExport">Export .ics</button>
        <button class="close" style="float:right">Close</button>`;

      md.querySelector(".close").onclick = () =>
        md.parentElement.remove();

      // populate compound select
      const sel = md.querySelector("#cpCompound");
      Object.values(LOOKUP)
        .map(o => o.name)
        .sort()
        .forEach(n => sel.add(new Option(n, n)));

      // add entry
      md.querySelector("#cpAdd").onclick = () => {
        const entry = {
          name: sel.value,
          dose: md.querySelector("#cpDose").value,
          week: +md.querySelector("#cpWeek").value
        };
        if (!entry.name || !entry.dose)
          return alert("Please specify compound and dose");
        state.push(entry);
        render();
      };

      // clear planner
      md.querySelector("#cpClear").onclick = () => {
        state.length = 0;
        render();
      };

      // export
      md.querySelector("#cpExport").onclick = async () => {
        if (!state.length) return alert("Planner empty");
        const startInput = md.querySelector("#cpStart").value;
        if (!startInput) return alert("Pick a start date first");
        const ICS = await loadIcs();
        const cal = new ICS();
        state.forEach(it => {
          const st = new Date(startInput);
          st.setDate(st.getDate() + (it.week - 1) * 7);
          const iso = st.toISOString().slice(0, 10);
          cal.addEvent(it.name, it.dose, "Cycle", iso, iso);
        });
        cal.download("cycle-plan");
      };

      const render = () => {
        const wrap = md.querySelector("#cpList");
        if (!state.length)
          return (wrap.innerHTML = "<p>No compounds added.</p>");
        state.sort((a, b) => a.week - b.week);
        wrap.innerHTML = state
          .map(
            (p, i) => `
            <div class="item" data-i="${i}">
              <select class="name"></select>
              <input class="dose" type="number" value="${p.dose}">
              <input class="wk" type="number" min="1" value="${p.week}">
              <button class="rem">✕</button>
            </div>`
          )
          .join("");
        wrap.querySelectorAll(".item").forEach(div => {
          const i = +div.dataset.i;
          const nsel = div.querySelector(".name");
          Object.values(LOOKUP)
            .map(o => o.name)
            .sort()
            .forEach(n =>
              nsel.add(
                new Option(n, n, false, n === state[i].name)
              )
            );
          nsel.onchange = e => (state[i].name = e.target.value);
          div.querySelector(".dose").onchange = e =>
            (state[i].dose = e.target.value);
          div.querySelector(".wk").onchange = e =>
            (state[i].week = +e.target.value);
          div.querySelector(".rem").onclick = () => {
            state.splice(i, 1);
            render();
          };
        });
      };
      render();
    };
  })();

  /* ------------------- modal factory ------------------------------- */
  function ensureModal(id, wide) {
    let m = document.getElementById(id);
    if (!m) {
      m = document.createElement("div");
      m.id = id;
      m.className = "customModal" + (wide ? " wide" : "");
      m.innerHTML = '<div class="inner"></div>';
      m.onclick = e => e.target === m && m.remove();
      document.body.append(m);
    }
    return m.querySelector(".inner");
  }
})();
