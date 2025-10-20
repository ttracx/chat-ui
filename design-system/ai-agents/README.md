# AI Agents for Design System

Intelligent agents powered by OpenAI API for automated component generation, design system evolution, and library management.

## Overview

The AI Agent system provides:
- **Automated component generation** based on design system patterns
- **Intelligent design system evolution** with consistency checks
- **Automatic library updates** when components are created
- **Model Context Server (MCP)** for agent coordination
- **Quality assurance** through automated testing and validation

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              OpenAI API (GPT-4)                     │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│        Model Context Server (MCP)                   │
│  - Design System Context                            │
│  - Component Templates                              │
│  - Token Management                                 │
│  - Version Control                                  │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌───▼────────┐ ┌──▼──────────┐
│ Component    │ │ Design     │ │ Quality     │
│ Generator    │ │ Reviewer   │ │ Assurance   │
│ Agent        │ │ Agent      │ │ Agent       │
└───────┬──────┘ └───┬────────┘ └──┬──────────┘
        │            │              │
        └────────────┼──────────────┘
                     │
        ┌────────────▼────────────┐
        │   Library Updater       │
        │   - Auto-commit         │
        │   - Version bump        │
        │   - Documentation       │
        └─────────────────────────┘
```

## Components

### 1. Model Context Server (MCP)
Central hub for AI agents to access design system knowledge.

### 2. AI Agents
- **Component Generator Agent**: Creates new components
- **Design Reviewer Agent**: Validates design consistency
- **Quality Assurance Agent**: Tests and validates code
- **Documentation Agent**: Generates documentation
- **Migration Agent**: Handles version migrations

### 3. Library Updater
Automatically updates packages when components are created.

## Quick Start

### Installation

```bash
cd design-system/ai-agents

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OpenAI API key to .env
```

### Configuration

```env
# .env
OPENAI_API_KEY=sk-...
MCP_PORT=3001
MCP_HOST=localhost
DESIGN_SYSTEM_PATH=../
AUTO_COMMIT=true
AUTO_VERSION_BUMP=true
```

### Start MCP Server

```bash
npm run mcp:start
```

### Generate a Component

```bash
# Using CLI
npm run generate:component -- --name "Tooltip" --type "overlay" --platforms "web,ios,android"

# Using API
curl -X POST http://localhost:3001/api/generate/component \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tooltip",
    "type": "overlay",
    "description": "Contextual help component",
    "platforms": ["web", "ios", "android"]
  }'
```

## Usage Examples

### Generate New Component

```javascript
import { ComponentGeneratorAgent } from './agents/component-generator';

const agent = new ComponentGeneratorAgent({
  designSystemPath: '../',
  openaiApiKey: process.env.OPENAI_API_KEY
});

const result = await agent.generateComponent({
  name: 'Tooltip',
  type: 'overlay',
  description: 'Shows contextual information on hover/tap',
  variants: ['top', 'right', 'bottom', 'left'],
  features: ['auto-positioning', 'keyboard-accessible'],
  platforms: ['web', 'ios', 'android']
});

console.log('Generated:', result.files);
// Output: Files created for all platforms + documentation
```

### Review Design Consistency

```javascript
import { DesignReviewerAgent } from './agents/design-reviewer';

const reviewer = new DesignReviewerAgent();

const review = await reviewer.reviewComponent('./components/NewButton.md');

if (review.consistent) {
  console.log('✓ Component follows design system guidelines');
} else {
  console.log('✗ Issues found:', review.issues);
  // Issues: ["Color doesn't match tokens", "Missing accessibility specs"]
}
```

### Auto-update Library

```javascript
import { LibraryUpdater } from './core/library-updater';

const updater = new LibraryUpdater({
  autoCommit: true,
  autoVersionBump: 'minor'
});

await updater.addComponent({
  name: 'Tooltip',
  files: [
    './platforms/web/Tooltip.svelte',
    './platforms/ios/DSTooltip.swift',
    './platforms/android/DSTooltip.kt',
    './components/Tooltip.md'
  ]
});

// Automatically:
// 1. Updates package exports
// 2. Generates documentation
// 3. Runs tests
// 4. Commits changes
// 5. Bumps version
```

## Agent Types

### Component Generator Agent

**Purpose**: Generate new components based on specifications

**Capabilities**:
- Analyzes existing components for patterns
- Uses design tokens automatically
- Generates code for all platforms
- Creates comprehensive documentation
- Includes all component states
- Adds accessibility features

**Example**:
```bash
npm run agent:generate -- \
  --component "DatePicker" \
  --description "Calendar-based date selection" \
  --features "range-selection,min-max-dates,disabled-dates" \
  --platforms "web,ios,android"
```

### Design Reviewer Agent

**Purpose**: Validate design consistency and quality

**Capabilities**:
- Checks design token usage
- Validates accessibility compliance
- Ensures responsive design
- Verifies platform conventions
- Reviews documentation completeness

**Example**:
```bash
npm run agent:review -- --component "./components/NewComponent.md"
```

### Quality Assurance Agent

**Purpose**: Test and validate generated code

**Capabilities**:
- Runs unit tests
- Checks accessibility
- Validates responsive layouts
- Tests all component states
- Ensures cross-platform consistency

**Example**:
```bash
npm run agent:qa -- --component "Tooltip" --platforms "all"
```

### Documentation Agent

**Purpose**: Generate and maintain documentation

**Capabilities**:
- Creates component documentation
- Generates usage examples
- Updates API reference
- Creates migration guides
- Maintains changelog

**Example**:
```bash
npm run agent:docs -- --component "Tooltip" --update-all
```

## MCP Server API

### Endpoints

#### POST `/api/generate/component`
Generate a new component

```json
{
  "name": "Tooltip",
  "type": "overlay",
  "description": "Contextual help",
  "variants": ["top", "right", "bottom", "left"],
  "platforms": ["web", "ios", "android"]
}
```

#### POST `/api/review/component`
Review component for consistency

```json
{
  "componentPath": "./components/Tooltip.md",
  "checkAccessibility": true,
  "checkTokens": true
}
```

#### POST `/api/update/library`
Update library packages

```json
{
  "component": "Tooltip",
  "version": "minor",
  "autoCommit": true
}
```

#### GET `/api/context/design-system`
Get design system context for AI

```json
{
  "tokens": { ... },
  "components": [ ... ],
  "patterns": [ ... ],
  "guidelines": { ... }
}
```

#### POST `/api/agent/coordinate`
Coordinate multiple agents

```json
{
  "task": "create-feature",
  "feature": "dark-mode-toggle",
  "agents": ["generator", "reviewer", "qa", "docs"]
}
```

## Configuration

### Agent Settings

```javascript
// config/agents.config.js
export default {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 4000
  },
  
  componentGenerator: {
    useTemplates: true,
    enforceTokens: true,
    generateTests: true,
    platforms: ['web', 'ios', 'android']
  },
  
  designReviewer: {
    strictMode: true,
    autoFix: false,
    checkAccessibility: true,
    wcagLevel: 'AA'
  },
  
  libraryUpdater: {
    autoCommit: true,
    autoVersionBump: 'minor',
    runTests: true,
    updateDocs: true
  }
};
```

### MCP Configuration

```javascript
// config/mcp.config.js
export default {
  server: {
    port: 3001,
    host: 'localhost',
    cors: true
  },
  
  context: {
    designSystemPath: '../',
    cacheEnabled: true,
    cacheTTL: 3600, // 1 hour
    includeHistory: true
  },
  
  agents: {
    maxConcurrent: 3,
    timeout: 300000, // 5 minutes
    retryAttempts: 3
  }
};
```

## Advanced Features

### Multi-Agent Coordination

```javascript
import { AgentCoordinator } from './core/coordinator';

const coordinator = new AgentCoordinator();

// Complex task requiring multiple agents
const result = await coordinator.execute({
  task: 'create-feature',
  description: 'Add dark mode support to all components',
  agents: [
    {
      type: 'component-generator',
      config: { feature: 'dark-mode-variant' }
    },
    {
      type: 'design-reviewer',
      config: { checkContrast: true }
    },
    {
      type: 'qa',
      config: { testDarkMode: true }
    },
    {
      type: 'documentation',
      config: { updateGuidelines: true }
    }
  ]
});
```

### Context-Aware Generation

```javascript
import { MCPClient } from './mcp/client';

const mcp = new MCPClient();

// Agent automatically learns from existing components
const context = await mcp.getContext({
  component: 'Button',
  includeVariants: true,
  includePlatforms: ['web', 'ios'],
  includePatterns: true
});

// Use context for consistent generation
const newComponent = await generator.create({
  name: 'IconButton',
  basedOn: 'Button',
  context: context
});
```

### Automated Testing

```javascript
import { QAAgent } from './agents/qa';

const qa = new QAAgent();

// Run comprehensive tests
const testResults = await qa.test({
  component: 'Tooltip',
  tests: [
    'unit',
    'integration',
    'accessibility',
    'visual-regression',
    'cross-platform'
  ],
  browsers: ['chrome', 'firefox', 'safari'],
  devices: ['iphone', 'android', 'desktop']
});
```

## Monitoring & Logging

### Agent Activity Log

```javascript
import { AgentLogger } from './core/logger';

const logger = new AgentLogger();

logger.info('Component generation started', {
  agent: 'component-generator',
  component: 'Tooltip',
  timestamp: new Date()
});

logger.success('Component generated successfully', {
  files: 5,
  platforms: 3,
  duration: '2.3s'
});
```

### Metrics Dashboard

Access metrics at: `http://localhost:3001/metrics`

- Component generation success rate
- Average generation time
- Design consistency score
- Test pass rate
- Library update frequency

## Best Practices

### Do ✓
- Provide clear component specifications
- Review generated code before committing
- Use design tokens consistently
- Test on all target platforms
- Keep MCP context updated
- Monitor agent performance
- Validate accessibility

### Don't ✗
- Generate components without specifications
- Skip code review
- Disable quality checks
- Hard-code values in prompts
- Ignore agent warnings
- Deploy without testing

## Troubleshooting

### Common Issues

**Agent not generating components**:
```bash
# Check API key
echo $OPENAI_API_KEY

# Check MCP server
curl http://localhost:3001/health

# View logs
npm run logs
```

**Inconsistent designs**:
```bash
# Update design system context
npm run mcp:update-context

# Clear cache
npm run mcp:clear-cache

# Retrain on recent components
npm run agent:retrain
```

**Library update failures**:
```bash
# Check file permissions
ls -la ../platforms/

# Run tests manually
npm test

# Disable auto-commit temporarily
AUTO_COMMIT=false npm run generate:component
```

## Related Documentation

- [MCP Server](./mcp/README.md)
- [Agent Development](./docs/agent-development.md)
- [API Reference](./docs/api-reference.md)
- [Component Templates](./templates/README.md)

## Support

- GitHub Issues: Report bugs and request features
- Slack: #design-system-ai
- Email: ai-agents@vibecaas.com
