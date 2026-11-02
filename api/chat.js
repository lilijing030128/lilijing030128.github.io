module.exports = async function handler(req, res) {
  // 1. 解决跨域 CORS 问题，允许你的 GitHub Pages 访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理浏览器的预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 读取你在 Vercel 配置的 API Key
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '缺少 ZHIPU_API_KEY 环境变量，请检查 Vercel 设置' });
  }

  try {
    // 调用智谱 API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'glm-4-flash', // 免费模型
        messages: req.body.messages,
        temperature: 0.6
      })
    });

    const data = await response.json();
    
    // 把智谱的回答返回给前端网页
    res.status(200).json(data);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'AI 服务请求失败' });
  }
}
