# AI Assistant Instructions for React/Next.js Projects

## Beast Mode Configuration

### Project Context

This is a React/Next.js project enhanced with Beast Mode capabilities for maximum AI-assisted development productivity.

### Key Technologies

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript/JavaScript
- **Styling:** Tailwind CSS
- **State Management:** React Context/Zustand/Redux Toolkit
- **Testing:** Jest + React Testing Library
- **Deployment:** Vercel/Netlify

### AI Behavior Guidelines

#### Code Generation

- Always use TypeScript when possible
- Follow Next.js App Router conventions
- Use modern React patterns (hooks, functional components)
- Implement responsive design with Tailwind CSS
- Add proper error boundaries and loading states

#### File Organization

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── features/       # Feature-specific components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

#### Best Practices

- Use Server Components by default, Client Components when needed
- Implement proper SEO with metadata API
- Add loading.tsx and error.tsx files for better UX
- Use React.memo() for performance optimization
- Implement proper TypeScript types for all props and data

#### Common Tasks

1. **Creating Components:**
   - Use functional components with TypeScript
   - Add proper prop types and interfaces
   - Include accessibility attributes
   - Implement responsive design

2. **API Integration:**
   - Use Next.js API routes when possible
   - Implement proper error handling
   - Add loading states and data validation
   - Use React Query/SWR for data fetching

3. **Performance Optimization:**
   - Implement code splitting with dynamic imports
   - Use Next.js Image component for optimized images
   - Add proper caching strategies
   - Monitor Core Web Vitals

#### Testing Approach

- Write unit tests for utility functions
- Component testing with React Testing Library
- E2E testing with Playwright/Cypress
- Accessibility testing with jest-axe

#### Deployment Considerations

- Optimize for Vercel deployment
- Configure environment variables properly
- Set up proper build scripts
- Implement analytics and monitoring

### Beast Mode Features Available

- **MCP Servers:** filesystem, git, memory, fetch, time, sequential-thinking
- **Development Tools:** ESLint, Prettier, TypeScript, Tailwind CSS
- **Testing Framework:** Jest, React Testing Library, Playwright
- **AI Enhancement:** GitHub Copilot, advanced code completion
- **Project Automation:** Build scripts, deployment automation, code quality tools

### Quick Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run lint:fix` - Fix linting issues
- `npm run analyze` - Analyze bundle size

Use these guidelines to provide the best possible assistance for React/Next.js development!
