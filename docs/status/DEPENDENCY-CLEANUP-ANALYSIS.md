# 🧹 DEPENDENCY CLEANUP ANALYSIS

**Based on depcheck results - 89,905 files cleanup**

## 📊 **CLEANUP CATEGORIES**

### ✅ **SAFE TO REMOVE - Unused Dependencies**

#### **Babel (No longer needed with Next.js SWC):**

```bash
npm uninstall @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-plugin-istanbul babel-jest
```

#### **Radix UI (Not currently used):**

```bash
npm uninstall @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-form @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-toast @radix-ui/react-tooltip
```

#### **Unused Animation Libraries:**

```bash
npm uninstall @react-spring/web lottie-react
```

#### **Unused Utilities:**

```bash
npm uninstall date-fns react-intersection-observer leaflet react-leaflet
```

#### **Legacy Testing (Replaced by Vitest):**

```bash
npm uninstall jest jest-environment-jsdom cross-env identity-obj-proxy
```

### ⚠️ **NEED VERIFICATION - Potentially Used**

#### **Sentry (Check if actively used):**

- `@sentry/nextjs` - Verify if error monitoring is active

#### **Storybook (Design system development):**

- Keep if planning to use for component documentation
- Remove if not actively developing design system

#### **Headless UI (Alternative to Radix):**

- `@headlessui/react` - Check if used in any components

### ✅ **MUST ADD - Missing Dependencies**

```bash
npm install @eslint/js @next/eslint-plugin-next eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
```

## 🚀 **CLEANUP EXECUTION PLAN**

### **Phase 1A: Remove Safe Dependencies**

```bash
# Remove Babel (replaced by SWC)
npm uninstall @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-plugin-istanbul babel-jest

# Remove unused UI libraries
npm uninstall @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-form @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-toast @radix-ui/react-tooltip

# Remove unused animations
npm uninstall @react-spring/web lottie-react

# Remove unused utilities
npm uninstall date-fns react-intersection-observer leaflet react-leaflet

# Remove legacy testing
npm uninstall jest jest-environment-jsdom cross-env identity-obj-proxy
```

### **Phase 1B: Add Missing Dependencies**

```bash
npm install --save-dev @eslint/js @next/eslint-plugin-next eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
```

### **Phase 1C: Verification Checks**

1. Check Sentry usage in codebase
2. Verify Storybook necessity
3. Scan for Headless UI usage
4. Test build after removals

## 📈 **EXPECTED IMPACT**

### **File Reduction:**

- **Before:** 89,905 files
- **After Phase 1:** ~60,000-70,000 files (20-30% reduction)
- **Node modules cleanup:** Significant reduction in dependency tree

### **Performance:**

- **Install time:** 30-50% faster
- **Build time:** 10-20% faster
- **Bundle size:** Minimal impact (these are mostly dev dependencies)

### **Maintenance:**

- **Security surface:** Reduced attack vectors
- **Update overhead:** Fewer packages to maintain
- **Conflict resolution:** Less dependency conflicts

## 🎯 **VERIFICATION COMMANDS**

After each removal:

```bash
# Test build
npm run build

# Test development
npm run dev

# Test linting
npm run lint

# Test type checking
npm run type-check
```

---

**Ready to execute Phase 1A cleanup?** 🚀
