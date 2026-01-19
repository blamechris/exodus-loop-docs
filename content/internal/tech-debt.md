---
title: Tech Debt Tracker
---

# Tech Debt Tracker

This page tracks technical debt identified during the codebase audit. Issues are linked to GitHub Issues for sprint planning.

## Priority Legend

| Priority | Description | SLA |
|----------|-------------|-----|
| Critical | Bugs affecting gameplay/data | Fix immediately |
| High | Significant issues | This sprint |
| Medium | Code quality, future risk | Next sprint |
| Low | Nice to have | Backlog |

---

## Critical Issues (3)

### 1. Pilot survival chance unclamped

**Location:** `game_state.gd:1938-1948`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

**Problem:** `survival_chance` can exceed 1.0, causing 100% survival rate.

```gdscript
# Current code
var survival_chance = GameState.get_admiral_skill_value("pilot_survival_chance")
if randf() < survival_chance:  # Can be > 1.0!
    # Pilot survives
```

**Fix:**
```gdscript
var survival_chance = clampf(
    GameState.get_admiral_skill_value("pilot_survival_chance"),
    0.0, 1.0
)
```

---

### 2. Minimum map size unvalidated

**Location:** `battle_map_generator.gd:150-196`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

**Problem:** Maps smaller than 6×7 break spawn zone calculations.

**Impact:** Potential crash or invalid spawns on small maps.

**Fix:** Add validation in map generation:
```gdscript
assert(width >= 6 and height >= 7, "Map too small for spawn zones")
```

---

### 3. Sequential combat contradicts GDD

**Location:** `combat_resolver.gd:147-224`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

**Problem:** Original GDD specifies "simultaneous" combat, but implementation is sequential (initiative-based).

**Decision needed:** Update GDD to match implementation, or change implementation to match GDD.

**Recommendation:** Keep sequential combat (more tactical depth), update GDD v1.0 to document this as intentional divergence.

---

## High Priority Issues (6)

### 4. Missing null safety

**Locations:** Multiple files
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

**Problem:** Many method calls lack null checks before invocation.

**Pattern:**
```gdscript
# Bad
squadron.take_damage(5)

# Good
if squadron and is_instance_valid(squadron):
    squadron.take_damage(5)
```

---

### 5. Static ID counter race conditions

**Location:** `squadron.gd`, `pilot.gd`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

**Problem:** Static ID counters (`_next_id`) not synced after save load, risking ID collisions.

**Fix:** After loading, sync counters:
```gdscript
Squadron._next_id = loaded_squadrons.map(func(s): return s.id).max() + 1
```

---

### 6. Modal cleanup on screen exit

**Location:** `battle_screen.gd:266-276`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

**Problem:** Modals not cleaned up when exiting battle screen, potential memory leak.

**Fix:** Add `_exit_tree()` cleanup:
```gdscript
func _exit_tree() -> void:
    for modal in active_modals:
        if is_instance_valid(modal):
            modal.queue_free()
```

---

### 7. Race condition in screen transitions

**Location:** `main.gd:84-90`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

**Problem:** Double-click can trigger multiple transitions, overwriting destination.

**Fix:** Add transition lock:
```gdscript
var is_transitioning: bool = false

func _on_screen_change_requested(name: String, params: Dictionary) -> void:
    if is_transitioning: return
    is_transitioning = true
    await _transition_to_screen(name, params)
    is_transitioning = false
```

---

### 8. Infinite loop in asteroid placement

**Location:** `battle_map_generator.gd:643-676`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

**Problem:** No max iteration guard in asteroid placement loop.

**Fix:** Add iteration limit:
```gdscript
var max_attempts = 100
var attempts = 0
while not placed and attempts < max_attempts:
    attempts += 1
    # ... placement logic
```

---

### 9. Save migration version jumps

**Location:** `save_manager.gd:71-150`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

**Problem:** v1→v6 jumps may skip intermediate migrations.

**Fix:** Apply migrations sequentially:
```gdscript
while version < CURRENT_VERSION:
    data = _apply_migration(data, version)
    version += 1
```

---

## Medium Priority Issues (10+)

### Magic numbers throughout codebase

**Locations:** Multiple files
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

Hardcoded values should be extracted to named constants. Examples:
- Morale thresholds (80, 20)
- XP values (25, 50, 10)
- Resource amounts
- Damage modifiers

---

### Incomplete type hints

**Locations:** `game_state.gd`, `squadron.gd`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

Public APIs lack return type hints:
```gdscript
# Current
func get_adjacent_cells(pos):

# Should be
func get_adjacent_cells(pos: Vector2i) -> Array[Vector2i]:
```

---

### Debug prints in production

**Location:** `carrier.gd`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

Print statements left in production code.

---

### Inconsistent RNG seeding

**Location:** Multiple procedural generators
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

Mix of instance vs function-scoped RNG causing inconsistent reproducibility.

---

### Asymmetric can_attack logic

**Location:** `squadron.gd`
**GitHub Issue:** [#TBD](https://github.com/blamechris/exodus-loop/issues)

Miners handled differently from other types in attack validation.

---

## Documentation Gaps

| Gap | Status |
|-----|--------|
| Save format schema | Documented in [[../developer-guide/save-system|Save System]] |
| Combat flow | Documented in [[../developer-guide/combat-system|Combat System]] |
| State machine diagrams | Documented in [[../developer-guide/screens|Screen Navigation]] |
| Perk stacking rules | Documented in [[../game-design/pilots|Pilot System]] |
| FCN mechanic | Documented in [[../game-design/squadrons|Squadron Types]] |
| Generation tuning guide | Partially in [[../game-design/balance|Balance Constants]] |

---

## GDD Divergences

| Divergence | Resolution |
|------------|------------|
| 3 squadrons → 7 squadrons | GDD v1.0 updated |
| 1-2 upgrades → 22 upgrades | GDD v1.0 updated |
| Simultaneous → Sequential combat | GDD v1.0 updated, documented as intentional |
| Grid 5×7 → 7×8 default | GDD v1.0 updated |

---

*Last updated: 2026-01-18*
