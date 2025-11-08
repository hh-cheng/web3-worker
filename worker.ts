// wrangler bindings
export interface Env {
  DEEPSEEK_API_KEY: string
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    // Preflight request
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Origin': 'https://chatbot.bonelycheng.cc',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  const url = new URL(request.url)

  // Handle /chat endpoint
  if (url.pathname === '/chat' && request.method === 'POST') {
    try {
      const body = await request.json()
      const { messages } = body

      const result = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          messages,
          stream: false,
          model: 'deepseek-chat',
        }),
      }).then((res) => res.json())

      return new Response(JSON.stringify(result.choices[0].message), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to process chat request' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }
  }

  // Default response
  return new Response(JSON.stringify({ hello: 'world' }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export default {
  async fetch(request: Request, env: Env) {
    const response = await handleRequest(request, env)

    // Add CORS headers to all responses
    return new Response(response.body, {
      ...response,
      headers: {
        ...response.headers,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Origin': 'https://chatbot.bonelycheng.cc',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  },
}
