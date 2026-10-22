# Skills Used & Available

## Workspace Skills (`.agents/skills/`)
- `playwright-skill`: Available and active for browser automation, visual testing, regression checks, and responsive UI testing.

## Global Skills (`~/.gemini/config/skills/` & plugins)
- `antislop` (Core filter, always active)
- `antislop-ui` (UI & visual craft filter)
- `antislop-layoutmobile` (Mobile & responsive layout rules)
- `antislop-copywriting` (Copy & prose rules)
- `antislop-code` (Code comment hygiene)
- `modern-web-guidance` (`modern-web-guidance-plugin`: best practice guide for modern web, CSS, motion, and web APIs)
- GSD Suite:
  - `gsd-map-codebase` / `gsd-onboard`
  - `gsd-ingest-docs`
  - `gsd-spec-phase`
  - `gsd-plan-phase`
  - `gsd-execute-phase`
  - `gsd-ui-phase`
  - `gsd-code-review`
  - `gsd-ui-review`
  - `gsd-add-tests`
  - `gsd-verify-work`
  - `gsd-docs-update`
  - `gsd-progress` / `gsd-next`
  - `gsd-debug`
  - `gsd-undo`
  - `gsd-pause-work` / `gsd-resume-work`

## Missing Skills Status
- `impeccable`: Missing (not found in workspace or global skills directories). Per instructions, noted here without inventing it.
- `taste-skill`: Missing (not found in workspace or global skills directories). Per instructions, noted here without inventing it.

## Skill Configuration & Guardrails
- **antislop mode**: `during` (session override).
- **Design Guardrail**: Antislop and design skills will not alter layout, color palette, typography hierarchy, copy, or structural design. Any potential design enhancement suggestions will be logged to `/docs/design-suggestions.md` without modifying the approved design.
