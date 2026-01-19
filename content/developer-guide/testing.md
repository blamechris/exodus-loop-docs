---
title: Testing Guide
---

# Testing Guide

Exodus Loop follows Test-Driven Development (TDD) with a custom test runner.

## Running Tests

```bash
# Run all tests
godot --headless --script res://test/test_runner.gd

# Run specific test file
godot --headless --script res://test/test_runner.gd -- --filter=combat

# Verbose output
godot --headless --script res://test/test_runner.gd -- --verbose
```

---

## Test Structure

```
test/
├── test_runner.gd      # Main test runner with assertions
├── test_runner.tscn    # Scene for running tests
├── unit/               # Unit tests
│   ├── test_squadron.gd
│   ├── test_pilot.gd
│   ├── test_combat_resolver.gd
│   └── test_dice_system.gd
├── integration/        # Integration tests
│   └── test_battle_flow.gd
└── fixtures/           # Test data
    └── test_scenarios.gd
```

---

## Test Runner API

```gdscript
extends Node

# Assertions
func assert_true(condition: bool, message: String = "") -> void
func assert_false(condition: bool, message: String = "") -> void
func assert_eq(actual, expected, message: String = "") -> void
func assert_ne(actual, expected, message: String = "") -> void
func assert_lt(actual, expected, message: String = "") -> void
func assert_gt(actual, expected, message: String = "") -> void
func assert_null(value, message: String = "") -> void
func assert_not_null(value, message: String = "") -> void
func assert_in_range(value, min_val, max_val, message: String = "") -> void

# Test lifecycle
func before_all() -> void    # Run once before all tests
func after_all() -> void     # Run once after all tests
func before_each() -> void   # Run before each test
func after_each() -> void    # Run after each test
```

---

## Writing Tests

### Basic Test Pattern

```gdscript
# test/unit/test_squadron.gd
extends "res://test/test_runner.gd"

func test_squadron_creation():
    var squad = Squadron.new()
    squad.initialize(Squadron.SquadronType.INTERCEPTOR, Vector2i(2, 3))

    assert_eq(squad.type, Squadron.SquadronType.INTERCEPTOR)
    assert_eq(squad.grid_pos, Vector2i(2, 3))
    assert_eq(squad.hull, 3, "Interceptor should have 3 hull")

func test_squadron_takes_damage():
    var squad = Squadron.new()
    squad.initialize(Squadron.SquadronType.GUNSHIP, Vector2i.ZERO)

    var initial_hull = squad.hull
    squad.take_damage(2)

    assert_eq(squad.hull, initial_hull - 2)

func test_squadron_destroyed_at_zero_hull():
    var squad = Squadron.new()
    squad.initialize(Squadron.SquadronType.SCOUT, Vector2i.ZERO)

    squad.take_damage(squad.hull)

    assert_eq(squad.hull, 0)
    assert_true(squad.is_destroyed())
```

### Testing Combat

```gdscript
# test/unit/test_combat_resolver.gd
extends "res://test/test_runner.gd"

func before_each():
    GameState.reset()
    GameState.grid_width = 7
    GameState.grid_height = 8

func test_rps_advantage_interceptor_vs_bomber():
    var interceptor = _create_squadron(Squadron.SquadronType.INTERCEPTOR, Vector2i(3, 3))
    var bomber = _create_enemy(Squadron.SquadronType.BOMBER, Vector2i(3, 3))

    var die_type = DiceSystem.get_rps_die(interceptor.type, bomber.squadron.type)

    assert_eq(die_type, DiceSystem.DiceType.D10, "Interceptor should have d10 vs Bomber")

func test_combat_resolution_sequential():
    var attacker = _create_squadron(Squadron.SquadronType.INTERCEPTOR, Vector2i(3, 3))
    var defender = _create_enemy(Squadron.SquadronType.BOMBER, Vector2i(3, 3))

    var log = CombatResolver.resolve_cell_combat(Vector2i(3, 3))

    assert_not_null(log)
    assert_eq(log.cell_pos, Vector2i(3, 3))
    assert_gt(log.initiative_order.size(), 0)

func _create_squadron(type: int, pos: Vector2i) -> Squadron:
    var squad = Squadron.new()
    squad.initialize(type, pos)
    GameState.squadron_roster.append(squad)
    return squad

func _create_enemy(type: int, pos: Vector2i) -> Enemy:
    var enemy = Enemy.new()
    enemy.initialize(type, pos)
    GameState.enemy_roster.append(enemy)
    return enemy
```

### Testing Dice System

```gdscript
# test/unit/test_dice_system.gd
extends "res://test/test_runner.gd"

func test_initiative_roll_range():
    for spd in range(1, 5):
        for _i in range(100):
            var roll = DiceSystem.roll_initiative(spd)
            assert_in_range(roll.base_roll, 1, spd + 1,
                "Initiative roll should be 1 to SPD+1")

func test_damage_formula():
    # Damage = max(0, roll + atk - def)
    var roll = DiceSystem.roll_damage(3, 2, DiceSystem.DiceType.D6)

    # Roll is 1-6, atk=3, def=2
    # Damage = roll + 3 - 2 = roll + 1
    # Range: 2-7
    assert_in_range(roll.total, 0, 10)

func test_rps_die_types():
    # Interceptor vs Bomber = advantage = d10
    assert_eq(
        DiceSystem.get_rps_die(Squadron.SquadronType.INTERCEPTOR, Squadron.SquadronType.BOMBER),
        DiceSystem.DiceType.D10
    )

    # Bomber vs Interceptor = disadvantage = d4
    assert_eq(
        DiceSystem.get_rps_die(Squadron.SquadronType.BOMBER, Squadron.SquadronType.INTERCEPTOR),
        DiceSystem.DiceType.D4
    )

    # Frigate vs anything = neutral = d6
    assert_eq(
        DiceSystem.get_rps_die(Squadron.SquadronType.FRIGATE, Squadron.SquadronType.BOMBER),
        DiceSystem.DiceType.D6
    )
```

---

## TDD Workflow

### RED Phase

Write a failing test first:

```gdscript
func test_pilot_gains_xp_on_kill():
    var pilot = Pilot.new()
    pilot.initialize("Maverick")
    var initial_xp = pilot.xp

    pilot.award_kill_xp()  # Method doesn't exist yet

    assert_eq(pilot.xp, initial_xp + 10, "Kill should award 10 XP")
```

### GREEN Phase

Write minimal code to pass:

```gdscript
# In pilot.gd
func award_kill_xp() -> void:
    xp += 10
```

### REFACTOR Phase

Improve while keeping tests green:

```gdscript
# In pilot.gd
const KILL_XP = 10

func award_kill_xp() -> void:
    add_xp(KILL_XP)

func add_xp(amount: int) -> void:
    xp += amount
    _check_level_up()
```

---

## Coverage Targets

| Layer | Target |
|-------|--------|
| Core game logic | >80% |
| UI components | >60% |
| Utilities | >90% |
| **Overall minimum** | **80%** |

---

## CI Integration

Tests run automatically on all PRs:

```yaml
# .github/workflows/ci.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Setup Godot
      uses: chickensoft-games/setup-godot@v2
      with:
        version: 4.5
    - name: Run tests
      run: godot --headless --script res://test/test_runner.gd
```

---

## Testing Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how
2. **One assertion per concept** - Multiple asserts OK if testing same thing
3. **Descriptive test names** - `test_pilot_level_up_at_50_xp` not `test_pilot_1`
4. **Isolate tests** - Use `before_each` to reset state
5. **Test edge cases** - Zero, negative, max values
6. **Mock external dependencies** - Don't depend on file system in unit tests
