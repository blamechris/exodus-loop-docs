---
title: Exodus Fleet System
---

# Exodus Fleet System

The Exodus Fleet is a meta-progression system where players extract components from successful runs to build a persistent fleet inventory.

---

## Core Concept

**Risk/Reward Gameplay:**
- Mark ONE component for extraction before each battle
- Run success = marked component joins your Exodus Fleet
- Run failure (carrier destroyed) = ALL equipped Exodus Fleet components are **LOST**

This creates high-stakes decisions: equipping your best fleet components makes you stronger but risks losing them.

---

## Component Extraction

### Marking Components

During the POSITIONING phase of each battle:
1. Open the ship configuration view
2. Select a component to mark for extraction
3. Only ONE component can be marked per battle
4. Marked components display an extraction icon

### Extraction Triggers

| Outcome | Result |
|---------|--------|
| Battle Victory | Marked component extracted |
| Battle Escape | Marked component NOT extracted |
| Run Complete (Boss Victory) | All marked components + bonus extraction |
| Carrier Destroyed | ALL equipped fleet components **LOST** |
| Run Abandoned | No extraction, no loss |

---

## Rarity System

Extracted components have rarity tiers affecting their stats:

| Rarity | Draw Weight | Stat Bonus | Traits |
|--------|-------------|------------|--------|
| **COMMON** | 50% | +0% | None |
| **UNCOMMON** | 30% | +10% | 1 minor |
| **RARE** | 15% | +25% | 1 major |
| **EPIC** | 4% | +40% | 2 traits |
| **LEGENDARY** | 1% | +60% | Unique ability |

### Trait Examples

**Minor Traits:**
- Reinforced (+5% durability)
- Efficient (-5% power cost)
- Lightweight (+0.5 speed contribution)

**Major Traits:**
- Overcharged (+15% output)
- Hardened (+15% durability)
- Integrated (counts as 2 component types)

---

## ExtractedComponent Class

```gdscript
class ExtractedComponent:
    var id: String
    var component_type: ComponentType
    var rarity: Rarity
    var shape: ShapeType
    var traits: Array[String]
    var damage_percent: float  # 0-100, affects stats
    var extraction_run_id: String
    var extraction_date: int  # Unix timestamp
```

---

## SavedCarrier Class

Players can save complete carrier configurations:

```gdscript
class SavedCarrier:
    var id: String
    var name: String
    var carrier_class: CarrierClassTemplate.CarrierClass
    var components: Array[ExtractedComponent]
    var creation_date: int
    var total_runs: int
    var total_victories: int
```

---

## Exodus Fleet Screen

Access from the title screen or between runs:

### Components Tab

- View all extracted components
- Filter by type (Engine, Weapon, Hangar, etc.)
- Filter by rarity
- Sort by extraction date, rarity, or type

### Carriers Tab

- Save current carrier build as a template
- Load saved builds for new runs
- View carrier statistics (runs, victories)

### Workshop Tab

- **Repair:** Fix damaged components (costs Metal)
- **Salvage:** Break down components for Metal resources

| Rarity | Salvage Value |
|--------|---------------|
| COMMON | 1 Metal |
| UNCOMMON | 2 Metal |
| RARE | 4 Metal |
| EPIC | 8 Metal |
| LEGENDARY | 15 Metal |

### Stats Tab

- Total fleet value
- Extraction history
- Rarity breakdown pie chart
- Components extracted per run

---

## Integration Points

### GameState

```gdscript
# In game_state.gd
var exodus_fleet: ExodusFleet

func mark_for_extraction(component: DrawnComponent) -> void
func complete_extraction() -> void
func handle_carrier_destroyed() -> void  # Removes equipped fleet components
```

### SaveManager

```gdscript
# Save version 13+
func _serialize_exodus_fleet() -> Dictionary
func _deserialize_exodus_fleet(data: Dictionary) -> void
```

### ComponentDrawManager

```gdscript
# When starting a new run
func equip_from_fleet(component_id: String) -> bool
func get_equipped_fleet_components() -> Array[DrawnComponent]
```

---

## Design Philosophy

The Exodus Fleet system creates meaningful meta-progression without trivializing individual runs:

1. **Invested Stakes** - Using fleet components feels risky
2. **Gradual Power Growth** - Fleet grows slowly over many runs
3. **Emotional Attachment** - Named components with history
4. **Recovery from Loss** - Even losing components teaches what to save next time
5. **Build Experimentation** - Saved carriers encourage trying different strategies
