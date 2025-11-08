// wrangler bindings
export interface Env {
  DEEPSEEK_API_KEY: string
}

const allowedOrigins = [
  'https://chat.bonelycheng.cc',
  'https://chatbot.bonelycheng.cc',
  'http://localhost:5174', // for local testing
]

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') || ''
  const isAllowed = allowedOrigins.includes(origin)

  return {
    'Access-Control-Allow-Origin': isAllowed
      ? origin
      : 'https://chatbot.bonelycheng.cc',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const corsHeaders = getCorsHeaders(request)

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
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
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      })
    } catch (error) {
      console.error('Chat request error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to process chat request' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      )
    }
  }

  // Default response
  return new Response(JSON.stringify({ hello: 'world' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

export default {
  async fetch(request: Request, env: Env) {
    return handleRequest(request, env)
  },
}
