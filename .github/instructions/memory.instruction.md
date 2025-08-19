---
applyTo: '**'
---

# Wedding Website Development Memory & Instructions

## shadcn/ui LLM UI Development Instructions (2025)

_Last updated: July 2025_

- Always use the fetch tool to look up the latest component usage, install name, and best practices directly from the official shadcn/ui documentation: https://ui.shadcn.com/docs/components
- Do not rely on what you think you know about shadcn/ui components, as they are frequently updated and improved. Your training data is outdated.
- For any shadcn/ui component, CLI command, or usage pattern, fetch the relevant page from the docs and follow the instructions there.

**Core Principles:**

- shadcn/ui components are open code: you are expected to read, modify, and extend them directly.
- Use the CLI (`pnpm dlx shadcn@latest add <component>`) to add or update components.
- Always import from the local `@/components/ui/<component>` path.
- Follow accessibility and composition best practices as described in the docs.

**Summary:**

> For all shadcn/ui work, always use the fetch tool to look up the latest component documentation and usage from https://ui.shadcn.com/docs/components. Do not rely on static instructions.

## Project Context & Progress

### Current Status (August 16, 2025)

- ✅ **Build Success**: Project compiles and builds successfully
- ✅ **Phase 2D Complete**: AI/PWA features implemented
- ✅ **Error Resolution**: Reduced from 300+ to ~176 code quality warnings
- 🔄 **Final Polish**: Converting remaining JSX to TypeScript, fixing code quality

### Architecture Stack

- **Framework**: Next.js 14.2.31 with App Router
- **Styling**: Tailwind CSS + CSS Modules
- **TypeScript**: Strict mode enabled
- **PWA**: Service workers, offline capabilities, notifications
- **AI Features**: Smart photo analysis, automated recommendations
- **Performance**: Web vitals monitoring, analytics integration

### Key Components Status

- **EnhancedPhotoGallery.tsx**: ✅ Converted JSX→TSX with CSS modules
- **MagicalToastSystem.tsx**: ✅ Converted with proper TypeScript interfaces
- **PWAManager.tsx**: ✅ Rewritten with browser API types
- **AudioProvider.tsx**: ✅ Fixed SSR issues with dynamic imports
- **WeddingMemoryVault.jsx**: ⚠️ JSX syntax fixed, needs TypeScript conversion

### Remaining Tasks

1. Convert JSX PropTypes components to TypeScript interfaces
2. Replace `any` types with proper TypeScript definitions
3. Fix accessibility warnings in modal components
4. Address console statement warnings
5. Optimize bundle performance and useMemo usage

## User Preferences

- Auto-approve developer assistant actions in VS Code without prompting. Prefer non-interactive flows for tasks, terminal commands, and tool calls.
