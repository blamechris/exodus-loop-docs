---
title: Developer Guide
---

# Developer Guide

Welcome to the Exodus Loop developer guide. This documentation covers the technical implementation, architecture patterns, and development workflows.

## Quick Start

```bash
# Clone repository
git clone https://github.com/blamechris/exodus-loop.git
cd exodus-loop

# Open in Godot 4.5
godot project.godot

# Run tests
godot --headless --script res://test/test_runner.gd
```

## Sections

- [[architecture|Architecture]] - Autoloads, signals, code patterns
- [[screens|Screen Navigation]] - State machine and transition flow
- [[combat-system|Combat Implementation]] - Phase breakdown, damage formulas
- [[save-system|Save System]] - Schema documentation, migration guide
- [[testing|Testing Guide]] - Test patterns, coverage expectations

---

## Project Structure

```
exodus-loop/
├── src/
│   ├── autoload/           # Singletons
│   │   ├── game_state.gd   # Central state management
│   │   ├── combat_resolver.gd
│   │   ├── dice_system.gd
│   │   └── save_manager.gd
│   ├── entities/           # Game objects
│   │   ├── squadron.gd
│   │   ├── enemy.gd
│   │   ├── carrier.gd
│   │   ├── pilot.gd
│   │   └── admiral.gd
│   ├── screens/            # UI screens
│   │   ├── battle/
│   │   ├── title/
│   │   ├── node_map/
│   │   └── results/
│   └── ui/components/      # Reusable UI
├── test/                   # Test suite
├── assets/                 # Sprites, audio
├── docs/                   # Documentation
└── .github/workflows/      # CI/CD
```

---

## Key Files

| File | Lines | Purpose |
|------|-------|---------|
| game_state.gd | ~2100 | Central state, upgrades, pilots |
| combat_resolver.gd | ~700 | Combat resolution logic |
| battle_screen.gd | ~2100 | Battle UI and phase management |
| squadron.gd | ~800 | Squadron entity |
| save_manager.gd | ~400 | Persistence |

---

## Development Workflow

### TDD Modus Operandi

All development follows RED-GREEN-REFACTOR:

1. **RED:** Write failing test first
2. **GREEN:** Write minimal code to pass
3. **REFACTOR:** Improve while keeping tests green

### Branch Naming

```
feat/feature-name     # New features
fix/issue-description # Bug fixes
refactor/component    # Refactoring
docs/topic            # Documentation
test/test-description # Test additions
```

### Commit Messages

```
type(scope): Short summary in present tense

[Optional body with details]
```

Types: feat, fix, refactor, docs, test, chore, style, perf

---

## Common Pitfalls

### Null Safety

Many locations lack null checks. Always verify before calling methods:

```gdscript
# Bad
squadron.take_damage(5)

# Good
if squadron and is_instance_valid(squadron):
    squadron.take_damage(5)
```

### ID Management

Static ID counters (Squadron, Pilot) can have race conditions on save load:

```gdscript
# After loading, sync counter to max loaded ID
Squadron._next_id = loaded_squadrons.map(func(s): return s.id).max() + 1
```

### RNG Patterns

Use instance RNG for reproducible results, function-scoped for procedural:

```gdscript
# Instance RNG (reproducible with seed)
var rng = RandomNumberGenerator.new()
rng.seed = seed_value
var result = rng.randi_range(1, 10)

# Function-scoped (non-reproducible)
var result = randi_range(1, 10)
```

---

## Mobile Considerations

- **Resolution:** 720×1280 (9:16 portrait)
- **Touch targets:** Minimum 44px
- **No hover states:** Touch-first design
- **Performance:** Target 60fps on mid-range devices

---

## CI/CD Pipeline

| Job | Runs On | Purpose |
|-----|---------|---------|
| Validate | All PRs | Parse check, import |
| Test | All PRs | Run test suite |
| Lint | All PRs | GDScript linting |
| Build Web | main only | Web export |
| Build Android | main only | APK export |

See `.github/workflows/ci.yml` for details.

---

## Getting Help

- [GitHub Issues](https://github.com/blamechris/exodus-loop/issues)
- CLAUDE.md in repository root
- This documentation site
