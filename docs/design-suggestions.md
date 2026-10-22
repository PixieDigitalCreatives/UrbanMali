# Design Suggestions & Ideas Log

> Guardrail: Per the project brief, the approved design must not change. All suggestions for layout, colour, spacing, icons, copy, or hierarchy enhancements are recorded here for future consideration and must NOT be applied to the codebase.

## Log

- **[2026-10-18] Hero Section 2-Column Responsive Layout (Tablet & Desktop)**:
  - *Context*: On tablet / medium viewports (768px - 1023px), the hero section previously stacked vertically, causing the organic hero gardener illustration to be pushed below the fold beneath all headline copy and action buttons.
  - *User Direction*: User requested to fit the image cleanly into the hero section.
  - *Implementation*: Switched the hero grid from `lg:grid-cols-12` to `md:grid-cols-12` (`md:col-span-7` text, `md:col-span-5` illustration), scaling the image nicely alongside the headline and buttons within the first fold without requiring scrolling.
