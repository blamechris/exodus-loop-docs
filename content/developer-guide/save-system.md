---
title: Save System
---

# Save System

Exodus Loop uses JSON-based persistence with versioned schemas for forward compatibility.

## Save Types

| Type | File | Persistence | Content |
|------|------|-------------|---------|
| Meta | `user://meta_save.json` | Permanent | XP, unlocks, admiral, blessed |
| Run | `user://run_save.json` | Per-run | Current run state |

---

## Meta Save Schema (v13)

```json
{
  "version": 13,
  "meta_xp": 1500,
  "unlocked_upgrades": [
    "reinforced_hull_1",
    "supply_cache_1",
    "sensors_1"
  ],
  "admiral": {
    "version": 2,
    "level": 3,
    "xp": 450,
    "unlocked_skills": ["LAST_STAND", "EJECT_PROTOCOL"],
    "skill_tree_seed": 12345
  },
  "blessed_squadrons": [...],
  "carried_over_pilots": [...],
  "hall_of_fame": [],
  "statistics": {...},
  "exodus_fleet": {
    "version": 1,
    "components": [
      {
        "id": 1,
        "cell_type": 3,
        "shape_id": 5,
        "rarity": 2,
        "special_traits": ["power_efficient"],
        "damage_percent": 0.0,
        "source": "extraction",
        "extraction_run": 5,
        "extraction_date": 1706300000,
        "is_equipped": false
      }
    ],
    "saved_carriers": [
      {
        "id": 1,
        "name": "Glass Cannon",
        "class_type": 2,
        "config": { /* ShipConfigurationV2 dict */ },
        "tags": ["offensive", "fast"],
        "created_date": 1706200000,
        "last_used_date": 1706300000
      }
    ],
    "total_extracted": 15,
    "total_lost": 5
  }
}
```

### Exodus Fleet Schema

| Field | Type | Description |
|-------|------|-------------|
| components | Array | Extracted components in fleet |
| saved_carriers | Array | Saved carrier build configurations |
| total_extracted | int | Lifetime components extracted |
| total_lost | int | Components lost to carrier destruction |

### ExtractedComponent Fields

| Field | Type | Description |
|-------|------|-------------|
| id | int | Unique component ID |
| cell_type | int | ShipGridData.CellType enum |
| shape_id | int | PolyominoData.ShapeId enum |
| rarity | int | 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary |
| special_traits | Array | Trait IDs for this component |
| damage_percent | float | 0.0-1.0, amount of damage |
| is_equipped | bool | Currently at risk in a run |

---

## Run Save Schema (v9)

```json
{
  "version": 9,
  "seed": 987654,
  "turn_number": 12,
  "current_node_id": 5,
  "fleet_actions_remaining": 1,
  "resources": {
    "metal": 8,
    "energy": 12,
    "fuel": 2
  },
  "carrier": {
    "hp": 7,
    "max_hp": 10,
    "grid_pos": [3, 7],
    "shield_available": true
  },
  "squadron_roster": [
    {
      "version": 7,
      "id": 1,
      "type": 0,
      "callsign": "I-Alpha-1",
      "hull": 2,
      "max_hull": 3,
      "ammo": 1,
      "fuel": 3,
      "grid_pos": [2, 4],
      "state": "READY",
      "ship_location": "DOCKED",
      "assigned_pilot_id": 5,
      "is_enemy": false,
      "is_blessed": false
    }
  ],
  "pilot_roster": [
    {
      "version": 3,
      "id": 5,
      "name": "Maverick",
      "perks": [0, 2],
      "xp": 125,
      "level": 2,
      "morale": 65,
      "passive_ability": "",
      "kills": 3,
      "missions": 2,
      "is_alive": true,
      "is_carried_over": false,
      "is_retired": false
    }
  ],
  "node_map": {
    "layers": 6,
    "nodes": [],
    "visited_nodes": [0, 1, 3, 5]
  },
  "battle_state": null
}
```

---

## Version Migration

**File:** `save_manager.gd:71-150`

```gdscript
func _migrate_meta_save(data: Dictionary) -> Dictionary:
    var version = data.get("version", 1)

    # v1 -> v2: Added admiral
    if version < 2:
        data["admiral"] = Admiral.new().to_dict()
        version = 2

    # v2 -> v3: Added blessed_squadrons
    if version < 3:
        data["blessed_squadrons"] = []
        version = 3

    # v3 -> v4: Added carried_over_pilots
    if version < 4:
        data["carried_over_pilots"] = []
        version = 4

    # v4 -> v5: Added hall_of_fame
    if version < 5:
        data["hall_of_fame"] = []
        version = 5

    # v5 -> v6: Added statistics
    if version < 6:
        data["statistics"] = _default_statistics()
        version = 6

    # v6 -> v13: Added exodus_fleet (versions 7-12 were intermediate)
    if version < 13:
        data["exodus_fleet"] = {
            "version": 1,
            "components": [],
            "saved_carriers": [],
            "total_extracted": 0,
            "total_lost": 0
        }
        version = 13

    data["version"] = version
    return data
```

### Known Issue: Version Jumps

**Location:** `save_manager.gd:71-150`

Migrations should be applied sequentially, but a v1→v6 jump may skip intermediate steps:

```gdscript
# Problem: If version jumps from 1 to 6 directly,
# intermediate migrations may be skipped

# Fix: Ensure each migration only increments by 1
while version < CURRENT_VERSION:
    data = _apply_migration(data, version)
    version += 1
```

---

## SaveManager API

```gdscript
# Meta state
func save_meta_state() -> void:
    var data = {
        "version": META_VERSION,
        "meta_xp": GameState.meta_xp,
        "unlocked_upgrades": GameState.unlocked_upgrades,
        "admiral": GameState.current_admiral.to_dict(),
        "blessed_squadrons": _serialize_blessed(),
        "carried_over_pilots": _serialize_carried_pilots(),
        "hall_of_fame": _serialize_hall_of_fame(),
        "statistics": GameState.statistics
    }
    _write_json("user://meta_save.json", data)

func load_meta_state() -> bool:
    var data = _read_json("user://meta_save.json")
    if data.is_empty():
        return false

    data = _migrate_meta_save(data)
    _apply_meta_state(data)
    return true

# Run state
func save_run_state() -> void:
    var data = {
        "version": RUN_VERSION,
        "seed": GameState.current_seed,
        "turn_number": GameState.turn_number,
        # ... full run state
    }
    _write_json("user://run_save.json", data)

func load_run_state() -> bool:
    var data = _read_json("user://run_save.json")
    if data.is_empty():
        return false

    data = _migrate_run_save(data)
    _apply_run_state(data)
    return true

func has_saved_run() -> bool:
    return FileAccess.file_exists("user://run_save.json")

func clear_run_save() -> void:
    DirAccess.remove_absolute("user://run_save.json")
```

---

## Entity Serialization

### Squadron.to_dict()

```gdscript
func to_dict() -> Dictionary:
    return {
        "version": 7,
        "id": id,
        "type": type,
        "callsign": callsign,
        "hull": hull,
        "max_hull": max_hull,
        "ammo": ammo,
        "max_ammo": max_ammo,
        "fuel": fuel,
        "max_fuel": max_fuel,
        "grid_pos": [grid_pos.x, grid_pos.y],
        "state": State.keys()[state],
        "ship_location": ShipLocation.keys()[ship_location],
        "assigned_pilot_id": assigned_pilot_id,
        "is_enemy": is_enemy,
        "is_blessed": is_blessed
    }

static func from_dict(data: Dictionary) -> Squadron:
    var squad = Squadron.new()
    squad.id = data.id
    squad.type = data.type
    squad.callsign = data.callsign
    # ... restore all fields
    return squad
```

### Pilot.to_dict()

```gdscript
func to_dict() -> Dictionary:
    return {
        "version": 3,
        "id": id,
        "name": name,
        "perks": perks.map(func(p): return int(p)),
        "xp": xp,
        "level": level,
        "morale": morale,
        "passive_ability": passive_ability,
        "kills": kills,
        "missions": missions,
        "is_alive": is_alive,
        "is_carried_over": is_carried_over,
        "is_retired": is_retired
    }
```

---

## ID Synchronization

After loading, sync static ID counters to prevent collisions:

```gdscript
func _sync_id_counters() -> void:
    # Squadron IDs
    var max_squad_id = 0
    for squad in GameState.squadron_roster + GameState.blessed_squadrons:
        max_squad_id = maxi(max_squad_id, squad.id)
    Squadron._next_id = max_squad_id + 1

    # Pilot IDs
    var max_pilot_id = 0
    for pilot in GameState.pilot_roster + GameState.carried_over_pilots:
        max_pilot_id = maxi(max_pilot_id, pilot.id)
    Pilot._next_id = max_pilot_id + 1
```

---

## Testing Saves

```gdscript
# Test save/load cycle
func test_save_load_integrity():
    var original_state = GameState.snapshot()
    SaveManager.save_run_state()

    GameState.reset()
    SaveManager.load_run_state()

    var loaded_state = GameState.snapshot()
    assert(original_state == loaded_state, "Save/load integrity failed")
```
