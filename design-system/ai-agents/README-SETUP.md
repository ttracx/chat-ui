# AI Agents Setup Guide

Quick setup guide for the VibeCaaS Design System AI Agents.

## Prerequisites

- Node.js 18+ and npm 9+
- OpenAI API key
- Git installed and configured

## Installation

### 1. Install Dependencies

```bash
cd design-system/ai-agents
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
nano .env
```

Required environment variables:
```env
OPENAI_API_KEY=sk-your-key-here
MCP_PORT=3001
DESIGN_SYSTEM_PATH=../
AUTO_COMMIT=true
AUTO_VERSION_BUMP=minor
```

### 3. Build TypeScript

```bash
npm run build
```

## Quick Start

### Start MCP Server

```bash
# Production mode
npm run mcp:start

# Development mode (with auto-reload)
npm run mcp:dev
```

The server will start at `http://localhost:3001`

### Generate a Component (CLI)

```bash
# Basic usage
npm run generate:component -- --name "Tooltip" --type "overlay"

# With all options
npm run generate:component -- \
  --name "DatePicker" \
  --type "input" \
  --description "Calendar-based date selection" \
  --variants "single,range" \
  --features "min-max-dates,disabled-dates" \
  --platforms "web,ios,android"
```

### Using the API

```bash
# Generate component
curl -X POST http://localhost:3001/api/generate/component \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tooltip",
    "type": "overlay",
    "description": "Contextual help component",
    "variants": ["top", "right", "bottom", "left"],
    "platforms": ["web", "ios", "android"]
  }'

# Get design system context
curl http://localhost:3001/api/context/design-system

# Review a component
curl -X POST http://localhost:3001/api/review/component \
  -H "Content-Type: application/json" \
  -d '{
    "componentPath": "./components/Tooltip.md",
    "checkAccessibility": true,
    "checkTokens": true
  }'
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# With coverage
npm test:coverage
```

## Development

### Project Structure

```
ai-agents/
├── agents/              # AI agent implementations
│   ├── component-generator.ts
│   ├── design-reviewer.ts
│   └── qa.ts
├── core/               # Core utilities
│   ├── coordinator.ts
│   ├── library-updater.ts
│   └── logger.ts
├── mcp/                # Model Context Server
│   ├── server.ts
│   └── context.ts
├── cli/                # Command-line tools
└── scripts/            # Utility scripts
```

### Adding a New Agent

1. Create agent file in `agents/`:
```typescript
// agents/my-agent.ts
export class MyAgent {
  constructor(config: MyAgentConfig) {
    // Initialize
  }

  public async execute(task: any): Promise<any> {
    // Agent logic
  }
}
```

2. Register in coordinator:
```typescript
// core/coordinator.ts
case 'my-agent':
  agent = new MyAgent(config);
  break;
```

3. Add CLI command if needed:
```bash
// cli/my-agent.ts
```

### Debugging

Enable debug logging:
```bash
LOG_LEVEL=debug npm run mcp:dev
```

View logs:
```bash
npm run logs
```

## Troubleshooting

### API Key Issues

```bash
# Verify API key is set
echo $OPENAI_API_KEY

# Test OpenAI connection
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Server Won't Start

```bash
# Check if port is in use
lsof -i :3001

# Try different port
MCP_PORT=3002 npm run mcp:start
```

### Generation Fails

```bash
# Clear cache
npm run mcp:clear-cache

# Update context
npm run mcp:update-context

# Check design system path
ls $DESIGN_SYSTEM_PATH
```

## Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start npm --name "mcp-server" -- run mcp:start

# Monitor
pm2 monit

# View logs
pm2 logs mcp-server

# Restart
pm2 restart mcp-server
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "mcp:start"]
```

```bash
# Build image
docker build -t vibecaas-ai-agents .

# Run container
docker run -p 3001:3001 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  vibecaas-ai-agents
```

## Next Steps

- Read the [main README](./README.md) for detailed documentation
- Explore the [agent development guide](./docs/agent-development.md)
- Check out [API reference](./docs/api-reference.md)
- See [examples](./examples/) for common use cases

## Support

- Issues: Create a GitHub issue
- Slack: #design-system-ai
- Email: ai-agents@vibecaas.com
