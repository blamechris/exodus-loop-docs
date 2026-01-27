---
title: Internal Systems
---

# Internal Systems

Technical documentation for internal game systems and meta-progression features.

---

## Meta-Progression Systems

### [[exodus-fleet|Exodus Fleet System]]

Persistent component extraction across runs:
- Mark components for extraction during battle
- Successful runs add components to fleet
- Failed runs LOSE equipped fleet components
- Rarity tiers with stat bonuses and traits

### [[crafting|Crafting System]]

Blueprint-based component crafting:
- Blueprints drop from destroyed capital ships
- Build queue (max 3 concurrent builds)
- Build progress measured in battles
- Crafted components go to safe inventory

---

## Battle Systems

### [[reinforcements|Reinforcement System]]

Multi-wave encounter management:
- 6 trigger types (turn, casualties, beacon, etc.)
- Encounter-specific wave configurations
- Wave announcement UI
- Spawn position variety (center, flanks, behind)

---

## Tracking

### [[tech-debt|Tech Debt Tracker]]

Prioritized issues from codebase audit:
- 2 Critical issues
- 5 High priority issues
- Linked to GitHub Issues (#125-131)

---

## See Also

- [[../developer-guide/architecture|Architecture]] - System integration
- [[../game-design/carriers|Carriers]] - Ship Builder V2 system
- [[../game-design/combat|Combat]] - Battle phase breakdown
