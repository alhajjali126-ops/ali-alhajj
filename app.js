(() => {
  'use strict';
  const KEY = 'ali_backend_hub_v1';
  const PHASES = window.PHASES || [];
  const PROJECT = window.PROJECT || [];

  /* ---------- State (LocalStorage) ---------- */
  const fresh = () => ({ done: {}, project: {}, notes: '' });
  function load() {
    try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); }
    catch (e) { return fresh(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* storage blocked */ } }
  let st = load();

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  function h(tag, props = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) n.setAttribute(k, v);
    }
    kids.flat().forEach(c => n.append(c instanceof Node ? c : document.createTextNode(c)));
    return n;
  }
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const fmt = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[\[(.+?)\]\]/g, '<code class="i">$1</code>');
  const pct = (d, t) => (t ? Math.round((d / t) * 100) : 0);

  /* ---------- Progress ---------- */
  function phaseStats(p) {
    const d = p.topics.filter(t => st.done[t.id]).length;
    return { d, t: p.topics.length, p: pct(d, p.topics.length) };
  }
  function overallStats() {
    let d = 0, t = 0;
    PHASES.forEach(p => { const s = phaseStats(p); d += s.d; t += s.t; });
    return { d, t, p: pct(d, t) };
  }
  function projectStats() {
    const all = PROJECT.flatMap(g => g.items);
    const d = all.filter(i => st.project[i.id]).length;
    return { d, t: all.length, p: pct(d, all.length) };
  }
  function statFor(key) {
    if (key === 'overall') return overallStats();
    if (key === 'project') return projectStats();
    const p = PHASES.find(x => x.id === key.replace('phase:', ''));
    return p ? phaseStats(p) : { d: 0, t: 0, p: 0 };
  }
  function updateProgress() {
    document.querySelectorAll('[data-fill]').forEach(n => { n.style.width = statFor(n.dataset.fill).p + '%'; });
    document.querySelectorAll('[data-pct]').forEach(n => { n.textContent = statFor(n.dataset.pct).p + '%'; });
    document.querySelectorAll('[data-count]').forEach(n => {
      const s = statFor(n.dataset.count); n.textContent = s.d + '/' + s.t;
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- Routing ---------- */
  const route = () => (location.hash || '#home').slice(1);
  function go(r) { location.hash = r; }

  function renderNav(active) {
    const nav = $('#nav'); nav.replaceChildren();
    const mk = (id, label, key) => h('button', {
      class: active === id ? 'active' : '', type: 'button', onclick: () => go(id)
    }, h('span', { text: label }), h('span', { class: 'badge', 'data-count': key }));
    nav.append(mk('home', 'الرئيسية', 'overall'));
    PHASES.forEach(p => nav.append(mk(p.id, `${p.num}. ${p.short}`, 'phase:' + p.id)));
    nav.append(mk('project', 'مشروع التخرج', 'project'));
  }

  function render() {
    const r = route();
    const view = $('#view'); view.replaceChildren();
    renderNav(r);
    if (r === 'project') view.append(projectView());
    else if (PHASES.some(p => p.id === r)) view.append(phaseView(PHASES.find(p => p.id === r)));
    else view.append(homeView());
    updateProgress();
    window.scrollTo({ top: 0 });
  }

  /* ---------- Views ---------- */
  function homeView() {
    const o = overallStats();
    const wrap = h('div');
    wrap.append(h('section', { class: 'hero' },
      h('h2', {}, 'أهلاً ', h('em', { text: 'علي' }), '، خارطتك لإتقان الـ Backend'),
      h('p', { text: 'خمس مراحل مرتّبة من «كيف يعمل الويب» حتى Laravel و Git و Docker، مع شرح مبسّط ومثال كود ومهمة تطبيقية لكل درس. تقدّمك يُحفظ تلقائياً في المتصفح.' }),
      h('div', { class: 'stats' },
        h('span', { class: 'chip' }, 'الدروس: ', h('b', { 'data-count': 'overall', text: o.d + '/' + o.t })),
        h('span', { class: 'chip' }, 'الإنجاز: ', h('b', { 'data-pct': 'overall', text: o.p + '%' })),
        h('span', { class: 'chip' }, 'مشروع التخرج: ', h('b', { 'data-pct': 'project', text: '0%' }))
      )
    ));
    const grid = h('div', { class: 'grid' });
    PHASES.forEach(p => grid.append(h('button', { class: 'card', type: 'button', onclick: () => go(p.id) },
      h('span', { class: 'tag-num', text: `المرحلة 0${p.num}` }),
      h('h3', { text: p.title }),
      h('p', { text: p.desc }),
      h('div', { class: 'row' },
        h('div', { class: 'bar' }, h('div', { class: 'fill', 'data-fill': 'phase:' + p.id })),
        h('b', { class: 'pct', 'data-pct': 'phase:' + p.id, text: '0%' }))
    )));
    grid.append(h('button', { class: 'card', type: 'button', onclick: () => go('project') },
      h('span', { class: 'tag-num', text: 'التطبيق العملي' }),
      h('h3', { text: 'مشروع التخرج' }),
      h('p', { text: 'قائمة مهام الفريق: قاعدة البيانات، GitHub، بناء الـ API، والتسليم.' }),
      h('div', { class: 'row' },
        h('div', { class: 'bar' }, h('div', { class: 'fill', 'data-fill': 'project' })),
        h('b', { class: 'pct', 'data-pct': 'project', text: '0%' }))
    ));
    wrap.append(grid);
    return wrap;
  }

  function codeBox(lang, code) {
    const copy = h('button', { type: 'button', text: 'نسخ' });
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(code); copy.textContent = 'تم النسخ'; }
      catch (e) { copy.textContent = 'تعذّر النسخ'; }
      setTimeout(() => (copy.textContent = 'نسخ'), 1500);
    });
    return h('div', { class: 'codebox' },
      h('div', { class: 'codebar' }, h('span', { text: lang }), copy),
      h('pre', {}, h('code', { text: code })));
  }

  function topicEl(p, t, i) {
    const d = h('details', { class: 'topic' + (st.done[t.id] ? ' done' : ''), id: 't-' + t.id });
    d.append(h('summary', {},
      h('span', { class: 'num', text: `${p.num}.${i + 1}` }),
      h('span', { class: 't', text: t.title }),
      h('span', { class: 'arrow', text: '◀' })));

    const explain = h('div', { class: 'explain' });
    t.explain.split('\n\n').forEach(par => { const el = h('p'); el.innerHTML = fmt(par); explain.append(el); });

    const ans = h('div', { class: 'answer', hidden: '' });
    ans.innerHTML = '<strong>الجواب المقترح:</strong> ' + fmt(t.answer);
    const reveal = h('button', { class: 'btn', type: 'button', text: 'تحقق من فهمك' });
    reveal.addEventListener('click', () => {
      ans.hidden = !ans.hidden; reveal.textContent = ans.hidden ? 'تحقق من فهمك' : 'إخفاء الجواب';
    });
    const taskTxt = h('div'); taskTxt.innerHTML = fmt(t.task);

    const cb = h('input', { type: 'checkbox', id: 'cb-' + t.id });
    cb.checked = !!st.done[t.id];
    cb.addEventListener('change', () => {
      st.done[t.id] = cb.checked; if (!cb.checked) delete st.done[t.id];
      save(); d.classList.toggle('done', cb.checked); updateProgress();
      if (cb.checked) {
        if (overallStats().p === 100) toast('أنهيت الخارطة كاملة، أحسنت يا علي');
        else if (phaseStats(p).p === 100) toast(`أنهيت المرحلة ${p.num}`);
        else toast('تم الإنجاز');
      }
    });

    d.append(h('div', { class: 'body' },
      h('div', { class: 'sec-title', text: 'الشرح' }), explain,
      h('div', { class: 'sec-title', text: 'مثال عملي' }), codeBox(t.lang, t.code),
      h('div', { class: 'sec-title', text: 'مهمة تطبيقية' }),
      h('div', { class: 'task' }, h('div', { class: 'lbl', text: 'جرّبها بنفسك' }), taskTxt, reveal, ans),
      h('label', { class: 'donebar', for: 'cb-' + t.id }, cb, h('span', { text: 'تم الإنجاز' }))
    ));
    return d;
  }

  function phaseView(p) {
    const wrap = h('div');
    wrap.append(h('div', { class: 'phase-head' },
      h('span', { class: 'tag', text: `المرحلة ${p.num} من ${PHASES.length}` }),
      h('h2', { text: p.title }),
      h('p', { text: p.desc }),
      h('div', { class: 'row' },
        h('div', { class: 'bar', style: 'flex:1' }, h('div', { class: 'fill', 'data-fill': 'phase:' + p.id })),
        h('span', { class: 'pct', 'data-pct': 'phase:' + p.id, text: '0%' }))
    ));
    p.topics.forEach((t, i) => wrap.append(topicEl(p, t, i)));
    const idx = PHASES.indexOf(p);
    const nav = h('div', { class: 'next' });
    nav.append(idx > 0
      ? h('button', { class: 'btn', type: 'button', text: 'المرحلة السابقة', onclick: () => go(PHASES[idx - 1].id) })
      : h('span'));
    nav.append(idx < PHASES.length - 1
      ? h('button', { class: 'btn primary', type: 'button', text: 'المرحلة التالية', onclick: () => go(PHASES[idx + 1].id) })
      : h('button', { class: 'btn primary', type: 'button', text: 'إلى مشروع التخرج', onclick: () => go('project') }));
    wrap.append(nav);
    return wrap;
  }

  function projectView() {
    const wrap = h('div');
    wrap.append(h('div', { class: 'phase-head' },
      h('span', { class: 'tag', text: 'تطبيق عملي' }),
      h('h2', { text: 'مشروع التخرج - جامعة دمشق' }),
      h('p', { text: 'قائمة مهام لتنظيم العمل مع فريقك. وزّعوا البنود على الأعضاء وتابعوا الإنجاز.' }),
      h('div', { class: 'row' },
        h('div', { class: 'bar', style: 'flex:1' }, h('div', { class: 'fill', 'data-fill': 'project' })),
        h('span', { class: 'pct', 'data-pct': 'project', text: '0%' }))
    ));
    PROJECT.forEach(g => {
      const box = h('section', { class: 'group' }, h('h3', { text: g.title }), h('div', { class: 'sub', text: g.sub }));
      g.items.forEach(it => {
        const cb = h('input', { type: 'checkbox', id: 'p-' + it.id });
        cb.checked = !!st.project[it.id];
        const row = h('div', { class: 'item' + (cb.checked ? ' ok' : '') }, cb,
          h('label', { for: 'p-' + it.id }, it.text, it.hint ? h('small', { text: it.hint }) : ''));
        cb.addEventListener('change', () => {
          if (cb.checked) st.project[it.id] = true; else delete st.project[it.id];
          save(); row.classList.toggle('ok', cb.checked); updateProgress();
          if (cb.checked && projectStats().p === 100) toast('مشروع التخرج جاهز');
        });
        box.append(row);
      });
      wrap.append(box);
    });
    const ta = h('textarea', { placeholder: 'اكتب هنا: أسماء أعضاء الفريق، توزيع المهام، روابط المستودع، المواعيد…' });
    ta.value = st.notes || '';
    ta.addEventListener('input', () => { st.notes = ta.value; save(); });
    wrap.append(h('section', { class: 'group' }, h('h3', { text: 'ملاحظات الفريق' }),
      h('div', { class: 'sub', text: 'تُحفظ تلقائياً في هذا المتصفح.' }), ta));
    return wrap;
  }

  /* ---------- Reset / PWA ---------- */
  $('#resetBtn').addEventListener('click', () => {
    if (confirm('هل تريد تصفير كل التقدم والملاحظات؟')) { st = fresh(); save(); render(); toast('تمت إعادة الضبط'); }
  });
  let deferred;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('#installBtn').hidden = false; });
  $('#installBtn').addEventListener('click', async () => {
    if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('#installBtn').hidden = true;
  });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
  }

  window.addEventListener('hashchange', render);
  render();
})();
