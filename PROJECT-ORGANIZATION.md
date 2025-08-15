# Project Organization Index

Generated: 2025-08-14 15:06:27

## Directory Structure

### Scripts (/scripts)

- **core/**: Essential maintenance and project management scripts
- **development/**: Development environment and workflow scripts
- **deployment/**: Build, deploy, and production scripts
- **testing/**: Test automation and validation scripts
- **monitoring/**: Performance and health monitoring scripts
- **optimization/**: Code and asset optimization scripts
- **security/**: Security validation and remediation scripts
- **mcp/**: Model Context Protocol server management
- **analytics/**: SEO, analytics, and analysis tools
- **utilities/**: General purpose utility scripts

### Source (/src)

#### Components (/src/components)

- **ui/**: Basic UI components (buttons, cards, navigation)
- **forms/**: Form-related components
- **media/**: Media handling components (gallery, video, audio)
- **features/**: Feature-specific components
- **admin/**: Administrative interface components
- **accessibility/**: Accessibility enhancement components
- **performance/**: Performance monitoring and optimization components

#### Page Components (/src/page-components)

- **core/**: Main page components (home, landing)
- **gallery/**: Photo and media gallery pages
- **interactive/**: Interactive features (guestbook, maps)
- **family/**: Family-related pages
- **admin/**: Administrative pages

#### Styles (/src/styles)

- **core/**: Base design system and core styles
- **features/**: Feature-specific styling
- **components/**: Component-specific styles

#### Utils (/src/utils)

- **core/**: Core utility functions
- **seo/**: SEO and metadata utilities
- **performance/**: Performance monitoring and optimization
- **features/**: Feature-specific utilities
- **security/**: Security-related utilities

### Public (/public)

- **images/**: All image assets organized by category
- **scripts/**: Public JavaScript files
- **media/**: Audio and video files
- **config/**: SEO, PWA, and configuration files

## Organization Benefits

1. **Improved Developer Experience**: Logical grouping makes finding files intuitive
2. **Better Maintainability**: Related files are co-located
3. **Enhanced Collaboration**: Clear structure for team development
4. **Optimized Build Process**: Better tree-shaking and code splitting
5. **Simplified Testing**: Test files organized alongside source files

## Usage Guidelines

- Follow the established directory structure for new files
- Keep related files together within their designated categories
- Use the organization scripts to maintain structure
- Update this index when adding new categories

## Maintenance

Run the organization script monthly to maintain structure:
`ash
npm run organize
`

For validation:
`ash
npm run organize:validate
`
