# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (opens automatically on port 3000)
npm run dev

# Build for production with TypeScript checking
npm run build

# Lint TypeScript/TSX files
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

This is an Arabic screenplay editor built with React 18, TypeScript, and Vite. The application follows a single-page architecture with routing handled by Wouter.

### Core Architecture Components

**Screenplay Processing Engine** (`src/lib/screenplay/`):
- `ScreenplayCoordinator.ts` - Central coordinator that processes text lines using an agent-based system
- `formattingAgents.ts` - Collection of specialized agents (SceneHeaderAgent, CharacterDialogueAgent, ActionAgent, etc.) that detect and format different screenplay elements
- `patterns.ts` - Regular expressions for Arabic screenplay formatting patterns
- `types.ts` - TypeScript interfaces for agent system

**UI Components** (`src/components/`):
- Built on Radix UI primitives with custom styling
- `ScreenplayEditor.tsx` - Main editor component
- `ui/` - Reusable UI components following shadcn/ui patterns

**Styling System**:
- Tailwind CSS with custom configuration in `src/tailwind.config.js`
- Arabic-specific CSS in `src/assets/screenplay.css`
- Path aliases configured: `@/` maps to `src/`

### Agent-Based Text Processing

The screenplay engine uses a chain-of-responsibility pattern where specialized agents process text lines:

1. `SceneHeaderAgent` - Detects scene headers (مشهد patterns)
2. `CharacterDialogueAgent` - Handles character names and dialogue
3. `TransitionAgent` - Processes transitions (FADE IN/OUT, etc.)
4. `DirectorNotesAgent` - Formats parenthetical notes
5. `ActionAgent` - Formats action lines
6. `DefaultAgent` - Fallback for unmatched content

Each agent returns an `AgentResult` with HTML, confidence score, and updated context.

### State Management

- React Query for server state management (`@tanstack/react-query`)
- Local state with React hooks
- Toast notifications via custom toast system

### Key Dependencies

- **UI**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS with animations
- **Routing**: Wouter (lightweight router)
- **Forms**: React Hook Form
- **Build**: Vite with React plugin

## Arabic Language Support

The application is fully localized for Arabic and includes:
- RTL (right-to-left) text support
- Arabic screenplay formatting patterns
- Arabic font support in styling system
- Arabic-specific regex patterns for screenplay elements