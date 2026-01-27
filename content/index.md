---
title: Exodus Loop Documentation
---

# Exodus Loop

**A Godot 4.5 mobile roguelike where you command a carrier fleet escaping through hostile space.**

Welcome to the official documentation for Exodus Loop. This site contains the Game Design Document (GDD v1.0) reflecting the actual implementation, developer guides for onboarding, and technical references.

## Quick Links

### Game Design
- [[game-design/index|Game Design Document]] - Complete GDD v1.0
- [[game-design/squadrons|Squadron Types]] - All 7 squadron types with stats
- [[game-design/combat|Combat System]] - Sequential combat mechanics
- [[game-design/pilots|Pilot System]] - Perks, morale, permadeath
- [[game-design/progression|Progression]] - 22 upgrades, Admiral skills

### Developer Guide
- [[developer-guide/index|Getting Started]] - Development setup
- [[developer-guide/architecture|Architecture]] - Autoloads, signals, patterns
- [[developer-guide/screens|Screen Navigation]] - State machine and flow
- [[developer-guide/combat-system|Combat Implementation]] - Phase breakdown
- [[developer-guide/save-system|Save System]] - Schema and migration

### Internal
- [[internal/tech-debt|Tech Debt Tracker]] - Prioritized issues
- [[internal/exodus-fleet|Exodus Fleet System]] - Meta-progression fleet extraction
- [[internal/reinforcements|Reinforcement System]] - Multi-wave battle encounters
- [[internal/crafting|Crafting System]] - Blueprint-based component crafting
- [GitHub Repository](https://github.com/blamechris/exodus-loop)

---

## Core Fantasy

You are the captain of humanity's last carrier, escorting refugee fleet survivors fleeing a Borg-like assimilating enemy. When you die, you wake up at the beginning—Edge of Tomorrow style—retaining knowledge and eventually sharing your time-loop power with elite pilots.

**Session Length:** 5 minutes (quick death) to 15+ minutes (full run)

## Current Version

**Version:** 0.5.29
**Engine:** Godot 4.5 (GDScript)
**Platforms:** iOS, Android (single codebase)
**Resolution:** 720x1280 (9:16 portrait, mobile-first)

---

*This documentation reflects the actual implementation as of version 0.5.29.*
