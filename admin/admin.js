const els = {
  lang: document.getElementById('lang'),
  token: document.getElementById('token'),
  load: document.getElementById('load'),
  save: document.getElementById('save'),
  status: document.getElementById('status'),
  capabilities: document.getElementById('capabilities'),
  certifications: document.getElementById('certifications'),
  projects: document.getElementById('projects'),
  process: document.getElementById('process'),
  contact: document.getElementById('contact')
};

function setStatus(msg, ok = true) {
  els.status.textContent = (ok ? '✅ ' : '⚠️ ') + msg;
}

async function fetchDefault(lang) {
  const res = await fetch('/content/default.json');
  const json = await res.json();
  return json[lang];
}

async function loadKV(lang) {
  const res = await fetch(`/api/content?key=home&lang=${lang}`);
  if (res.ok) return res.json();
  return null;
}

function fillForm(data) {
  els.capabilities.value = JSON.stringify(data.capabilities || [], null, 2);
  els.certifications.value = JSON.stringify(data.certifications || [], null, 2);
  els.projects.value = JSON.stringify(data.projects || [], null, 2);
  els.process.value = JSON.stringify(data.process || [], null, 2);
  els.contact.value = JSON.stringify(data.contact || {}, null, 2);
}

els.load.addEventListener('click', async () => {
  const lang = els.lang.value;
  setStatus('Loading...', true);
  const kv = await loadKV(lang);
  const data = kv || await fetchDefault(lang);
  fillForm(data);
  setStatus(kv ? '已从 KV 加载内容。' : 'KV 未配置，已加载默认内容。');
});

els.save.addEventListener('click', async () => {
  const lang = els.lang.value;
  const token = els.token.value.trim();
  if (!token) return setStatus('请填写 ADMIN_TOKEN。', false);

  let data;
  try {
    data = {
      capabilities: JSON.parse(els.capabilities.value || '[]'),
      certifications: JSON.parse(els.certifications.value || '[]'),
      projects: JSON.parse(els.projects.value || '[]'),
      process: JSON.parse(els.process.value || '[]'),
      contact: JSON.parse(els.contact.value || '{}')
    };
  } catch (e) {
    return setStatus('JSON 格式错误，请检查。', false);
  }

  const res = await fetch('/api/content', {
    method: 'PUT',
    headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
    body: JSON.stringify({ key: 'home', lang, data })
  });
  if (res.ok) setStatus('已保存到 KV（实时生效）。');
  else setStatus('保存失败，请检查 Token 或重试。', false);
});
