export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const cors = {
      'Access-Control-Allow-Origin': '*', // 按需收紧为你站点域名
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    // 工具：统一 JSON 响应
    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });

    // 工具：写入 KV，TTL 24 小时
    async function saveGame(gameId, payload) {
      const record = {
        ...payload,
        gameId,
        createdAt: payload.createdAt || Date.now(),
      };
      await env.GAMES_KV.put(`game:${gameId}`, JSON.stringify(record), { expirationTtl: 86400 });
      return record;
    }

    // 创建房间：POST /games
    if (method === 'POST' && path === '/games') {
      const body = await request.json();
      const { hostId, word1, word2, total, undercover = 1, blank = 0 } = body || {};
      if (!hostId || !word1 || !word2 || !total) {
        return json({ error: '缺少必要字段' }, 400);
      }
      const gameId = crypto.randomUUID();
      const record = await saveGame(gameId, { hostId, word1, word2, total, undercover, blank });
      return json(record, 200);
    }

    // 更新房间：PUT /games/:id （重置 TTL）
    const updateMatch = path.match(/^\/games\/([^/]+)$/);
    if (method === 'PUT' && updateMatch) {
      const gameId = updateMatch[1];
      const body = await request.json();
      const { hostId, word1, word2, total, undercover = 1, blank = 0 } = body || {};
      if (!hostId || !word1 || !word2 || !total) {
        return json({ error: '缺少必要字段' }, 400);
      }
      const record = await saveGame(gameId, { hostId, word1, word2, total, undercover, blank, createdAt: Date.now() });
      return json(record, 200);
    }

    // 获取房间：GET /games/:id
    if ((method === 'GET' || method === 'HEAD') && updateMatch) {
      const gameId = updateMatch[1];
      const data = await env.GAMES_KV.get(`game:${gameId}`, { type: 'json' });
      if (!data) return json({ error: 'not found' }, 404);
      return json(data, 200);
    }

    // 最近 24 小时：GET /games/recent?hostId=xxx
    if (method === 'GET' && path === '/games/recent') {
      const hostId = url.searchParams.get('hostId');
      if (!hostId) return json({ error: 'hostId required' }, 400);
      const list = await env.GAMES_KV.list({ prefix: 'game:' });
      const cutoff = Date.now() - 24 * 3600 * 1000;
      const results = [];
      for (const k of list.keys) {
        const data = await env.GAMES_KV.get(k.name, { type: 'json' });
        if (data && data.hostId === hostId && data.createdAt >= cutoff) results.push(data);
      }
      results.sort((a, b) => b.createdAt - a.createdAt);
      return json(results, 200);
    }

    return new Response('not found', { status: 404, headers: cors });
  },
};

