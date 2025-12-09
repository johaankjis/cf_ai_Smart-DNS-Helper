# Smart DNS Helper - AI-Powered Error Analysis System

An intelligent error analysis application built with Next.js that implements the **Cloudflare Agents SDK** for AI-powered error detection, classification, and troubleshooting recommendations.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## 🎯 Overview

This application demonstrates a production-ready implementation of the Cloudflare Agents architecture, featuring:

- **AI-Powered Error Analysis**: Leverages Cloudflare Workers AI (Llama 3.3 70B) for deep error analysis
- **Intelligent Agent System**: Implements persistent state management and scheduled tasks
- **Real-time Processing**: Live event streaming and status updates
- **Pattern Recognition**: Automatic detection and tracking of error patterns
- **Hybrid Analysis**: Falls back to rule-based analysis when AI is unavailable

## ✨ Key Features

### 🤖 Cloudflare Agents SDK Implementation

- **ErrorAnalysisAgent**: AI-powered agent with callable methods
- **State Management**: Persistent state across requests
- **Scheduled Tasks**: Background jobs running on defined schedules
- **Callable Methods**: Decorated methods for external invocation
- **Pattern Tracking**: Historical error analysis and trend detection

### 🧠 AI-Powered Capabilities

- Deep error analysis using Llama 3.3 70B model
- Confidence scoring for analysis results
- Root cause identification
- Actionable fix suggestions
- Related pattern detection
- Automatic severity classification

### 📊 Real-time Monitoring

- Live event streaming with Server-Sent Events (SSE)
- Agent state visualization
- Error pattern tracking dashboard
- Severity distribution analytics
- Memory store updates

### 🎨 Modern UI/UX

- Built with shadcn/ui components
- Responsive design with Tailwind CSS
- Dark/light theme support
- Real-time status indicators
- Interactive dashboards

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         User Input (Web UI)             │
│      (Error Input Form)                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Next.js API Routes                 │
│   (/app/api/worker/route.ts)            │
│   - POST: Process errors                │
│   - GET: Agent status                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│     ErrorAnalysisAgent                  │
│  (lib/error-analysis-agent.ts)          │
│  ┌─────────────────────────────────┐    │
│  │ @callable methods:              │    │
│  │ • analyzeError()                │    │
│  │ • searchSimilarErrors()         │    │
│  │ • getStatistics()               │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Scheduled tasks:                │    │
│  │ • generateDailySummary()        │    │
│  │ • analyzePatterns()             │    │
│  └─────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Cloudflare Workers AI (Optional)     │
│  Model: llama-3.3-70b-instruct-fp8-fast │
│  Fallback: Rule-based Analysis          │
└─────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.0.7 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Analytics**: Vercel Analytics

### Backend
- **Runtime**: Next.js API Routes
- **AI Integration**: Cloudflare Workers AI
- **State Management**: In-memory (Agent state)
- **Real-time**: Server-Sent Events (SSE)

### Development
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 8.x or higher (or npm/yarn)
- **Cloudflare Account** (Optional, for AI features):
  - Account ID
  - API Token with Workers AI permissions

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/johaankjis/cf_ai_Smart-DNS-Helper.git
cd cf_ai_Smart-DNS-Helper
```

### 2. Install Dependencies

```bash
pnpm install
```

Or using npm:
```bash
npm install
```

### 3. Configure Environment (Optional)

For AI-powered analysis with Cloudflare Workers AI:

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Get your Cloudflare credentials:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages**
   - Copy your **Account ID** (shown on the right side)
   
3. Create an API Token:
   - Click on your profile icon (top right)
   - Go to **My Profile** → **API Tokens**
   - Click **Create Token**
   - Use the **"Edit Cloudflare Workers"** template
   - Add **"Account.Workers AI"** permission with **Edit** access
   - Click **Continue to summary** → **Create Token**
   - Copy the token

4. Update `.env.local`:
```env
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
```

**Note**: The application works without these credentials using rule-based analysis. AI features are enhanced when credentials are provided.

### 4. Run Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
pnpm build
pnpm start
```

## 📖 Usage Guide

### Analyzing Errors

1. **Enter an Error Message**: Use the "Error Input" form on the left side
2. **Submit**: Click "Submit Error" to process
3. **Watch Real-time Analysis**: 
   - Event stream shows validation → workflow → completion
   - Memory display shows updated statistics
   - Agent panel reflects current state

### Understanding Results

The analysis provides:
- **Error Type**: Classification (Syntax, Network, Type, etc.)
- **Severity**: Critical, High, Medium, or Low
- **Root Cause**: AI-powered explanation of what caused the error
- **Suggestions**: 3-5 actionable steps to fix the issue
- **Confidence Score**: AI's confidence in the analysis (0-100%)
- **Related Patterns**: Similar error patterns to watch for

### Agent Panel Information

- **Status**: Current agent state (idle, analyzing, error)
- **Statistics**: Total errors analyzed, patterns, severity distribution
- **Scheduled Tasks**: Background jobs and their schedules
- **Last Analysis**: Timestamp of most recent analysis

## 🔌 API Endpoints

### POST `/api/worker`

Process an error message through the AI agent.

**Request:**
```json
{
  "error": "TypeError: Cannot read property 'x' of undefined",
  "eventId": "evt_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "errorType": "Type Error",
    "severity": "high",
    "rootCause": "Attempting to access property on undefined object",
    "suggestions": [
      "Add null/undefined checks before property access",
      "Use optional chaining (?.)",
      "Validate data structure before use"
    ],
    "confidence": 85,
    "processedAt": "2024-01-01T12:00:00.000Z"
  },
  "memory": {
    "totalErrors": 42,
    "lastProcessed": "TypeError: Cannot read property 'x' of undefined",
    "workflows": [...],
    "statistics": {...}
  },
  "agent": {
    "name": "ErrorAnalysisAgent",
    "state": {...}
  }
}
```

### GET `/api/worker`

Retrieve agent status and statistics.

**Response:**
```json
{
  "success": true,
  "agent": {
    "metadata": {
      "name": "ErrorAnalysisAgent",
      "description": "AI-powered error analysis and pattern recognition",
      "version": "1.0.0",
      "schedules": [...]
    },
    "state": {
      "totalAnalyzed": 42,
      "recentErrors": [...],
      "errorPatterns": {...},
      "lastAnalysis": "2024-01-01T12:00:00.000Z",
      "agentStatus": "idle"
    },
    "statistics": {
      "totalAnalyzed": 42,
      "patternCounts": {...},
      "severityDistribution": {...},
      "recentErrorCount": 15
    }
  },
  "memory": {...}
}
```

### GET `/api/events`

Server-Sent Events endpoint for real-time updates.

**Event Types:**
- `validation`: Input validation status
- `workflow`: Processing workflow updates
- `memory_update`: Memory store changes
- `completed`: Analysis completion with results

### GET `/api/memory`

Retrieve current memory store state.

## 📁 Project Structure

```
cf_ai_Smart-DNS-Helper/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── events/route.ts       # SSE endpoint
│   │   ├── memory/route.ts       # Memory store endpoint
│   │   └── worker/route.ts       # Main worker endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                    # React components
│   ├── agent-panel.tsx           # Agent status display
│   ├── error-input-form.tsx      # Error submission form
│   ├── event-stream.tsx          # Real-time event display
│   ├── memory-display.tsx        # Memory state display
│   ├── worker-status.tsx         # Connection status
│   └── ui/                       # shadcn/ui components
├── hooks/                        # Custom React hooks
│   └── use-realtime.ts           # Real-time data hook
├── lib/                          # Core library code
│   ├── agent.ts                  # Base Agent class
│   ├── agent-types.ts            # Agent type definitions
│   ├── error-analysis-agent.ts   # Error Analysis Agent
│   ├── memory-store.ts           # Memory store types
│   ├── realtime.ts               # Real-time event system
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
├── styles/                       # Additional styles
├── .env.example                  # Environment variables template
├── CLOUDFLARE_AGENTS.md          # Agent implementation docs
├── components.json               # shadcn/ui config
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS config
├── tailwind.config.ts            # Tailwind CSS config
└── tsconfig.json                 # TypeScript config
```

## 🧩 Core Components

### Agent System

#### Base Agent Class (`lib/agent.ts`)
- Generic agent foundation with state management
- Scheduling system for background tasks
- Lifecycle hooks (onStart, etc.)
- Method execution framework
- State persistence

#### ErrorAnalysisAgent (`lib/error-analysis-agent.ts`)
Implements three callable methods:

1. **`analyzeError(errorId, errorMessage)`** - Main error analysis
2. **`searchSimilarErrors(query)`** - Find similar historical errors
3. **`getStatistics()`** - Return metrics and statistics

Scheduled tasks:
- **Daily Summary**: Generates at 11:59 PM
- **Pattern Analysis**: Runs every 6 hours

#### Agent Types (`lib/agent-types.ts`)
- `@callable()` decorator for marking public methods
- Type definitions for state, environment, and configuration
- Interface contracts for agent system

### UI Components

- **ErrorInputForm**: Form for submitting errors
- **AgentPanel**: Displays agent status and statistics
- **EventStream**: Real-time event feed
- **MemoryDisplay**: Shows memory store state
- **WorkerStatus**: Connection indicator

## 🔧 Development

### Running Linter

```bash
pnpm lint
```

### Building the Project

```bash
pnpm build
```

### Type Checking

```bash
npx tsc --noEmit
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy

### Cloudflare Pages

1. Build the project:
```bash
pnpm build
```

2. Deploy the `out` directory to Cloudflare Pages

3. Configure environment variables in Cloudflare dashboard

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎓 Learning Resources

- [Cloudflare Agents](https://agents.cloudflare.com/) - Official Agents documentation
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) - Workers AI docs
- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all linters pass

## 🔐 Security

- Never commit `.env.local` or API tokens
- Rotate API tokens regularly
- Use environment variables for sensitive data
- Follow Cloudflare security best practices

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👤 Author

**johaankjis**
- GitHub: [@johaankjis](https://github.com/johaankjis)

## 🙏 Acknowledgments

- [Cloudflare](https://www.cloudflare.com/) for Workers AI platform
- [Vercel](https://vercel.com/) for Next.js framework
- [shadcn](https://ui.shadcn.com/) for beautiful UI components
- The open-source community

## 📊 Project Status

This project is actively maintained and demonstrates production-ready implementations of:
- ✅ Cloudflare Agents SDK
- ✅ AI-powered error analysis
- ✅ Real-time event streaming
- ✅ State management patterns
- ✅ Modern React practices

## 🐛 Known Issues

- Build warnings for TypeScript are currently ignored (see `next.config.mjs`)
- Image optimization is disabled for static exports
- Agent state is stored in memory (not persistent across restarts)

For production use, consider:
- Implementing persistent storage (Cloudflare Durable Objects, D1, or external database)
- Adding authentication/authorization
- Implementing rate limiting
- Adding comprehensive error handling
- Setting up monitoring and logging

## 📧 Support

For issues, questions, or contributions:
- Open an issue on [GitHub](https://github.com/johaankjis/cf_ai_Smart-DNS-Helper/issues)
- Check existing issues before creating new ones
- Provide detailed information for bug reports

---

Made with ❤️ using Cloudflare Agents SDK and Next.js
