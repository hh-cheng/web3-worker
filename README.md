# Cloudflare Worker

A Cloudflare Worker project for handling web3 requests and AI chat interactions.

## Prerequisites

- **Node.js** (v16 or higher)
- **pnpm** (v10.20.0 or higher)
- **Wrangler CLI** (included as dev dependency)
- **Cloudflare Account** (for deployment)

## Project Setup

### Installation

Install project dependencies:

```bash
pnpm install
```

### Configuration

The worker is configured in `wrangler.toml`:
- **Worker Name**: `ai-chat-worker`
- **Entry Point**: `worker.ts`
- **Environment Variables**: `DEEPSEEK_API_KEY` (configured in wrangler.toml)
- **Deployed Domain**: `chat.bonelycheng.cc`

## Development

### Local Development

Run the worker locally for testing and development:

```bash
pnpm dev
```

This starts a local development server, typically at `http://localhost:8787`. You can now test your worker endpoints locally before deploying.

### Code Quality

The project uses **Biome** for linting and formatting. Run:

```bash
pnpm lint
```

## Testing

### Manual Testing with Local Dev Server

1. Start the local development server:
   ```bash
   pnpm exec wrangler dev
   ```

2. Test an endpoint using curl or your preferred HTTP client:
   ```bash
   curl http://localhost:8787/your-endpoint
   ```

### Testing with Environment Variables

To test with your environment variables locally, they are automatically loaded from `wrangler.toml`:

```bash
pnpm exec wrangler dev
```

The `DEEPSEEK_API_KEY` will be available in your `env` parameter within the worker.

### Inspect Worker Logs

To view logs from your local worker during development:

```bash
pnpm exec wrangler dev --log-level debug
```

## Deployment

### Prerequisites for Deployment

1. Create a Cloudflare account if you don't have one
2. Authenticate with Wrangler:
   ```bash
   pnpm exec wrangler login
   ```
   This opens a browser to authorize Wrangler with your Cloudflare account

### Deploy to Production

Deploy your worker to Cloudflare:

```bash
npx wrangler deploy
```

This command:
- Uploads your worker code to Cloudflare
- Binds the configured routes (`chat.bonelycheng.cc/*`)
- Sets environment variables from `wrangler.toml`
- Makes the worker live at your configured domain

### Verify Deployment

After deployment, verify your worker is running:

```bash
curl https://chat.bonelycheng.cc/your-endpoint
```

Or visit `https://chat.bonelycheng.cc` in your browser.

## Environment Variables

Environment variables are defined in `wrangler.toml`:

```toml
[vars]
DEEPSEEK_API_KEY = "sk-xxxx..."
```

To add or update variables:
1. Edit `wrangler.toml`
2. Redeploy with `pnpm exec wrangler deploy`

**Note**: Keep sensitive keys in `.env.local` or Cloudflare's secret management for production.

## Troubleshooting

### Worker Not Responding
- Check that the domain is correctly configured in `wrangler.toml`
- Verify DNS settings point to Cloudflare nameservers
- Check Cloudflare dashboard for deployment status

### Environment Variables Not Available
- Ensure variables are defined in `wrangler.toml`
- Redeploy after making changes
- Verify the variable is accessed via `env` parameter in the fetch handler

### Local Development Issues
- Clear the dev server cache: `pnpm exec wrangler dev --no-cache`
- Check that port 8787 is not in use
- Restart the dev server if code changes don't reflect

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm exec wrangler dev` | Start local development server |
| `pnpm exec wrangler deploy` | Deploy to production |
| `pnpm exec wrangler login` | Authenticate with Cloudflare |
| `pnpm exec biome check --apply` | Lint and format code |

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)
- [TypeScript with Workers](https://developers.cloudflare.com/workers/languages/typescript/)
