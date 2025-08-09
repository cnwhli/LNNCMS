const state = {
  lang: localStorage.getItem('lang') || 'zh',
  cache: null
};

const i18nKeys = {
  zh: {
    'nav.about': '关于',
    'nav.capabilities': '能力',
    'nav.projects': '案例',
    'nav.process': '流程',
    'nav.contact': '联系',
    'hero.title': '为全球品牌打造极致的家具与空间解决方案',
    'hero.subtitle': '从材料到工艺，从打样到量产，我们交付可以落地的美学。',
    'hero.cta': '获取报价',
    'hero.badge1': '定制', 'hero.badge2': '可持续', 'hero.badge3': '国际标准',
    'about.title': '关于 LNN',
    'cap.title': '核心能力', 'cap.certTitle': '质量与认证',
    'projects.title': '精选案例',
    'process.title': '从概念到交付',
    'contact.title': '联系与合作',
    'contact.company': '公司：', 'contact.addr': '地址：', 'contact.email': '邮箱：', 'contact.phone': '电话：',
    'form.project': '项目名称', 'form.scope': '需求范围', 'form.submit': '发送需求', 'form.notice': '提交后我们将在 24 小时内联系您。'
  },
  en: {
    'nav.about': 'About',
    'nav.capabilities': 'Capabilities',
    'nav.projects': 'Projects',
    'nav.process': 'Process',
    'nav.contact': 'Contact',
    'hero.title': 'Crafting world-class furniture and spatial solutions',
    'hero.subtitle': 'From materials to manufacturing, from prototype to scale, we deliver executable aesthetics.',
    'hero.cta': 'Request a quote',
    'hero.badge1': 'Custom', 'hero.badge2': 'Sustainable', 'hero.badge3': 'International Standard',
    'about.title': 'About LNN',
    'cap.title': 'Core Capabilities', 'cap.certTitle': 'Quality & Certifications',
    'projects.title': 'Featured Projects',
    'process.title': 'From Concept to Delivery',
    'contact.title': 'Contact',
    'contact.company': 'Company:', 'contact.addr': 'Address:', 'contact.email': 'Email:', 'contact.phone': 'Phone:',
    'form.project': 'Project Name', 'form.scope': 'Scope', 'form.submit': 'Send Request', 'form.notice': 'We’ll reply within 24 hours.'
  }
};

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    el.textContent = i18nKeys[state.lang][k] || el.textContent;
  });
  document.documentElement.lang = state.lang;
}

async function loadContent() {
  const lang = state.lang;
  try {
    // 从 KV（实时）取内容，若无则回退到本地 content/default.json
    const res = await fetch(`/api/content?key=home&lang=${lang}`);
    if (res.ok) {
      const data = await res.json();
      state.cache = data;
    } else {
      throw new Error('KV empty');
    }
  } catch {
    const fallback = await fetch('/content/default.json');
    state.cache = (await fallback.json())[lang];
  }
  render();
}

function render() {
  const data = state.cache || {};
  // 能力
  const cap = document.getElementById('cap-list');
  cap.innerHTML = '';
  (data.capabilities || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    cap.appendChild(li);
  });
  // 认证
  const cert = document.getElementById('cert-list');
  cert.innerHTML = '';
  (data.certifications || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    cert.appendChild(li);
  });
  // 项目
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';
  (data.projects || []).forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <p style="color:#b8b8b8">${p.desc}</p>
    `;
    grid.appendChild(card);
  });
  // 流程
  const steps = document.getElementById('steps-list');
  steps.innerHTML = '';
  (data.process || []).forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    steps.appendChild(li);
  });
  // 联系
  document.getElementById('addr').textContent = data.contact?.address || '';
  const email = document.getElementById('email');
  email.textContent = data.contact?.email || '';
  email.href = `mailto:${data.contact?.email || ''}`;
  const phone = document.getElementById('phone');
  phone.textContent = data.contact?.phone || '';
  phone.href = `tel:${data.contact?.phone || ''}`;

  document.getElementById('year').textContent = new Date().getFullYear();
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn');
  if (btn) {
    state.lang = btn.dataset.lang;
    localStorage.setItem('lang', state.lang);
    applyI18n();
    loadContent();
  }
});

document.getElementById('quote-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  alert((state.lang === 'zh') ? '已提交，我们会尽快联系你。' : 'Submitted. We will contact you soon.');
  e.target.reset();
});

applyI18n();
loadContent();
