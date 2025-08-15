# Storybook Setup Documentation

## Overview

Your wedding website project is now fully configured with Storybook, ESLint, and Prettier. This setup provides:

- **Component Development**: Build and test UI components in isolation
- **Visual Documentation**: Living style guide for your components
- **Accessibility Testing**: Built-in a11y checks
- **Cross-Platform Testing**: Automated testing with Vitest integration

## Configuration Files

### `.storybook/main.ts`

- **Enhanced with type safety**: Better TypeScript configuration
- **Cross-platform paths**: Uses forward slashes for consistency
- **Auto-documentation**: Configured for automatic docs generation
- **Accessibility addon**: Integrated a11y testing

### `.storybook/preview.ts`

- **Global decorators**: Consistent styling across stories
- **Theme testing**: Light/dark background options
- **A11y configuration**: Accessibility testing setup

### `vitest.config.ts`

- **Dual project setup**: Separate configs for Storybook and unit tests
- **Browser testing**: Playwright integration for component testing
- **Environment separation**: Different test environments for different test types

## Available Scripts

```bash
# Development
npm run dev                 # Start Next.js development server
npm run storybook          # Start Storybook development server

# Testing
npm run test               # Run all Vitest tests
npm run test:storybook     # Run Storybook component tests
npm run test:unit          # Run unit tests only
npm run test:coverage      # Run tests with coverage report

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues automatically
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting

# Building
npm run build              # Build Next.js app
npm run build-storybook    # Build Storybook for deployment
```

## Features Implemented

### 1. **Cross-Platform Paths**

- All paths use forward slashes for Windows/Mac/Linux compatibility
- Dynamic path resolution with `__dirname` and relative paths

### 2. **Environment Separation**

- Development vs production configurations
- Separate test environments for unit tests and component tests

### 3. **Addon Management**

- **@storybook/addon-docs**: Auto-generated documentation
- **@storybook/addon-a11y**: Accessibility testing
- **@storybook/addon-vitest**: Integrated testing
- **@storybook/addon-onboarding**: Learning resources

### 4. **Type Safety**

- Full TypeScript support in all configuration files
- Proper type definitions for custom functions
- Enhanced type checking in stories

### 5. **Documentation**

- Comprehensive comments in configuration files
- Auto-generated component documentation
- Accessibility guidelines integration

### 6. **Testing Integration**

- Automated component testing with Vitest
- Browser-based testing with Playwright
- Accessibility testing on every story

## Creating New Stories

When creating stories for your wedding website components, follow this pattern:

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import YourComponent from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Wedding Website/Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Description of your component.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Your component props
  },
};
```

## Next Steps

1. **Create stories for your wedding components**:
   - `PasswordPrompt`
   - `PhotoGallery`
   - `GuestbookForm`
   - `AdminDashboard`
   - etc.

2. **Set up Chromatic** (optional):
   - Visual regression testing
   - Design review workflows
   - Update the `chromatic` script with your project token

3. **Add interaction testing**:
   - Use `@storybook/testing-library` for user interactions
   - Test form submissions, button clicks, etc.

4. **Configure CI/CD**:
   - Run Storybook tests in your build pipeline
   - Deploy Storybook documentation automatically

## Troubleshooting

- **Import errors**: Ensure all required dependencies are installed
- **Path issues**: Always use forward slashes in configuration files
- **Type errors**: Check TypeScript configuration in `tsconfig.json`
- **Test failures**: Run tests in isolation to identify specific issues

Your Storybook setup is now production-ready and will help you build a polished, accessible wedding website!
