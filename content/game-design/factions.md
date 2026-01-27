---
title: Factions
---

# Factions

Exodus Loop features two distinct factions, each with unique unit naming, visual styling, and combat traits.

---

## Human Fleet (Player)

The remnants of humanity's carrier fleet, featuring advanced but aging technology.

### Unit Naming

Human squadrons use standard NATO-style callsigns:

| Type | Callsign Pattern | Example |
|------|------------------|---------|
| Interceptor | I-[Phonetic]-[#] | I-Alpha-1 |
| Bomber | B-[Phonetic]-[#] | B-Bravo-2 |
| Gunship | G-[Phonetic]-[#] | G-Charlie-3 |
| Frigate | F-[Phonetic]-[#] | F-Delta-4 |
| Destroyer | D-[Phonetic]-[#] | D-Echo-5 |
| Scout | S-[Phonetic]-[#] | S-Foxtrot-6 |
| Miner | M-[Phonetic]-[#] | M-Golf-7 |

### Visual Style

- **HP Bar Color:** Blue/Cyan
- **Grid Tokens:** Standard geometric icons
- **Carrier:** Player's carrier uses [[carriers|Carrier Class]] styling

---

## Nautolan Faction (Enemy)

An alien bio-organic faction using swarm tactics and regenerative bio-ships.

### Encounter Trigger

Nautolan encounters spawn when:
- Node type is "ALIEN"
- Scenario type begins with "alien_" (e.g., "alien_standard")

### Unit Naming

Nautolan units use bio-organic names:

| Human Equivalent | Nautolan Name | Icon |
|------------------|---------------|------|
| Interceptor | **Stinger** | ~ |
| Bomber | **Spitter** | * |
| Gunship | **Brute** | # |
| Frigate | **Symbiote** | hexagon |
| Destroyer | **Lurker** | = |
| Scout | **Psion** | ? |
| Miner | **Harvester** | circled dot |

### Visual Style

- **HP Bar Color:** Purple (0.6, 0.2, 0.8)
- **Grid Tokens:** Bio-organic symbols
- **Distinct naming for visual differentiation**

### Nautolan Carrier: Leviathan

The Leviathan is the Nautolan capital ship variant:

| Stat | Value | Comparison |
|------|-------|------------|
| Hull | 8 | Lower than Standard (10) |
| Hangar | 6 | Higher than Standard (4) |
| Reinforce Rate | 70% | Higher than Standard (50%) |
| Icon | hexagon | Bio-organic design |
| Default Trait | AGGRESSIVE | Swarm behavior |

**Specialty:** The Leviathan trades durability for overwhelming squadron deployment. Expect constant reinforcements and swarm tactics.

### Nautolan Traits

Ships spawned from Nautolan carriers may have these faction-specific traits:

| Trait | Effect |
|-------|--------|
| **Regeneration** | Heals 1 HP per turn |
| **Swarm Tactics** | +1 ATK when adjacent to ally |
| **Bio-Armor** | First damage each turn reduced by 1 |
| **Spore Cloud** | On death, adjacent enemies take 1 damage |

---

## Faction Detection

Faction is set on enemy spawn based on:

```gdscript
# In enemy.gd
if scenario_type.begins_with("alien_"):
    squadron.faction = "nautolan"
else:
    squadron.faction = "human"
```

All faction-specific naming, icons, and HP bar colors are derived from this faction property.

---

## Future Factions

Planned factions for future updates:

- **Rogue AI** - Mechanical precision, predictable patterns
- **Pirate Fleet** - Varied salvaged ships, opportunistic tactics
- **Assimilators** - The primary antagonist, Borg-like adaptation
