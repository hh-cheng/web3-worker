// wrangler bindings
export interface Env {
  DEEPSEEK_API_KEY: string
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)

    if (url.pathname === '/chat' && request.method === 'POST') {
      const body = await request.json()
      const { messages } = body

      const response = await fetch(
        'https://api.deepseek.com/chat/completions',
        {
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
        },
      ).then((res) => res.json())

      return Response.json({ reply: response.choices[0].message.content })
    }

    return new Response('AI Chat Worker (TypeScript)', { status: 200 })
  },
}
