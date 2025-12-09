# Cloudflare Agents Implementation

This project implements **Cloudflare Agents SDK** - an AI-powered agentic system for intelligent error analysis and processing.

## Features

### 🤖 Intelligent Agent System
- **ErrorAnalysisAgent**: AI-powered agent that analyzes errors using Cloudflare Workers AI
- **State Management**: Agents maintain persistent state across requests
- **Callable Methods**: Decorated methods that can be invoked externally
- **Scheduled Tasks**: Background jobs that run on defined schedules

### 🧠 AI-Powered Analysis
- Deep error analysis using Llama 3.3 70B model via Cloudflare Workers AI
- Pattern recognition and historical tracking
- Confidence scoring for analysis results
- Fallback to rule-based analysis when AI is unavailable

### 📊 Real-time Monitoring
- Live event streaming
- Agent state visualization
- Error pattern tracking
- Severity distribution analytics

## Architecture

The implementation follows the Cloudflare Agents architecture:

```
┌─────────────────────────────────────────┐
│         User Input (Web UI)             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Next.js API Routes                 │
│  (/app/api/worker/route.ts)             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     ErrorAnalysisAgent                  │
│  (lib/error-analysis-agent.ts)          │
│  - @callable analyzeError()             │
│  - @callable searchSimilarErrors()      │
│  - @callable getStatistics()            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Cloudflare Workers AI (Optional)     │
│  Model: llama-3.3-70b-instruct-fp8-fast │
└─────────────────────────────────────────┘
```

## Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Cloudflare AI (Optional)

For AI-powered analysis, you need Cloudflare credentials:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Workers & Pages"
3. Copy your **Account ID**
4. Create an API Token:
   - Profile → API Tokens → Create Token
   - Use "Edit Cloudflare Workers" template
   - Add "Account.Workers AI" permission with Edit access
   - Create and copy the token

5. Create `.env.local` file:
```bash
cp .env.example .env.local
```

6. Add your credentials:
```env
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
```

**Note**: The app works without credentials using rule-based analysis. AI features are enhanced when credentials are provided.

### 3. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Agent Components

### Base Agent Class (`lib/agent.ts`)
- Generic agent base with state management
- Scheduling system for background tasks
- Lifecycle hooks (onStart, etc.)
- Method execution framework

### ErrorAnalysisAgent (`lib/error-analysis-agent.ts`)
Implements three callable methods:

1. **`analyzeError()`** - Analyzes errors using AI or rule-based logic
2. **`searchSimilarErrors()`** - Finds similar historical errors
3. **`getStatistics()`** - Returns agent statistics and metrics

Scheduled tasks:
- Daily summary generation (11:59 PM)
- Pattern analysis (every 6 hours)

### Agent Types (`lib/agent-types.ts`)
- TypeScript interfaces for Agent system
- `@callable()` decorator for marking public methods
- Type definitions for state and environment

## Usage

### Analyzing an Error

1. Enter an error message in the input form
2. Click "Process Error"
3. The ErrorAnalysisAgent will:
   - Validate the input
   - Analyze using AI (if configured) or rules
   - Return error type, severity, root cause, and suggestions
   - Update agent state and statistics
   - Emit real-time events

### Viewing Agent Status

The Agent Panel displays:
- Agent name, version, and status
- Total errors analyzed
- Error pattern distribution
- Severity breakdown
- Scheduled tasks
- Last analysis timestamp

### API Endpoints

**POST /api/worker**
```json
{
  "error": "TypeError: Cannot read property 'x' of undefined",
  "eventId": "unique-id"
}
```

**GET /api/worker**
Returns agent metadata, state, and statistics.

## Key Features from Cloudflare Agents

### ✅ Implemented
- [x] Agent base class with state management
- [x] `@callable()` decorator pattern
- [x] AI integration (Workers AI / Llama 3.3)
- [x] State persistence across requests
- [x] Scheduled tasks framework
- [x] Real-time event streaming
- [x] Pattern recognition
- [x] Statistics tracking

### 🎯 Cloudflare Platform Features
For production deployment on Cloudflare:
- **Durable Objects**: For persistent state storage
- **Workflows**: For complex multi-step processes
- **Vectorize**: For semantic error search
- **D1**: For error history storage
- **WebSockets**: For real-time communication (via Durable Objects)

## Code Example

```typescript
import { ErrorAnalysisAgent } from '@/lib/error-analysis-agent'

// Initialize agent
const agent = new ErrorAnalysisAgent({
  AI: yourCloudflareAiInstance
})

// Use callable methods
const result = await agent.analyzeError(
  "error-123",
  "TypeError: Cannot read property 'x' of undefined"
)

// Get statistics
const stats = await agent.getStatistics()

// Access agent state
const state = agent.getState()
```

## Learn More

- [Cloudflare Agents](https://agents.cloudflare.com/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare Workflows](https://developers.cloudflare.com/workflows/)

## License

MIT
