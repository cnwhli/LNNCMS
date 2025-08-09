// Cloudflare Pages Function
// 绑定：KV 命名空间 CONTENT（在 Pages 项目设置中绑定）
// 环境变量：ADMIN_TOKEN（自定义一串强密码）

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  // 简单 CORS（同域访问即可）
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  };

  if (method === 'GET') {
    const key = url.searchParams.get('key') || 'home';
    const lang = url.searchParams.get('lang') || 'zh';
    const kvKey = `${key}:${lang}`;
    const value = await env.CONTENT.get(kvKey);
    if (!value) {
      return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers });
    }
    return new Response(value, { status: 200, headers });
  }

  if (method === 'PUT') {
    const auth = request.headers.get('authorization') || '';
    const token = auth.replace(/^Bearer\s+/i, '');
    if (!token || token !== env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers });
    }
    const body = await request.json().catch(() => ({}));
    const { key = 'home', lang = 'zh', data } = body;
    if (!data) {
      return new Response(JSON.stringify({ error: 'invalid_payload' }), { status: 400, headers });
    }
    const kvKey = `${key}:${lang}`;
    await env.CONTENT.put(kvKey, JSON.stringify(data));
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers });
}
