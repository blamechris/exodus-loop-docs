---
title: Achievements
---

# Achievements

Exodus Loop features 6 unlockable achievements that track player milestones across runs.

## Achievement List

| Achievement | Description | Unlock Condition |
|-------------|-------------|------------------|
| **First Blood** | Destroy your first enemy squadron | Destroy any enemy in combat |
| **Sector Clear** | Complete your first sector | Finish sector 1+ |
| **Fleet Admiral** | Defeat the final boss and win a run | Complete a full run victory |
| **Ace Pilot** | Have a pilot reach Legend rank | Level a pilot to rank 5 |
| **Flawless Victory** | Win a battle without losing any squadrons | Complete battle with zero squadron deaths |
| **Against All Odds** | Win a run with only 1 squadron remaining | Complete a run while down to last squadron |

---

## Achievement System Details

### Unlock Timing
- Achievements are checked at appropriate game moments:
  - **First Blood:** End of combat resolution when enemy destroyed
  - **Sector Clear:** On sector completion
  - **Fleet Admiral:** On run victory
  - **Ace Pilot:** When pilot levels up to rank 5
  - **Flawless Victory:** End of battle with victory and zero deaths
  - **Against All Odds:** Run victory with single remaining squadron

### Persistence
- Unlock timestamps are stored in meta state
- Unlocked achievements persist permanently across all runs
- Achievements are saved immediately upon unlock via `SaveManager.save_meta_state()`

### Viewing Achievements
- Accessible from the title screen via Achievements button
- Shows locked and unlocked status
- Displays unlock timestamp for completed achievements

---

## Design Notes

**Progressive Difficulty:**
- First Blood → Sector Clear → Fleet Admiral forms a natural progression
- Ace Pilot and Flawless Victory reward mastery of specific systems
- Against All Odds is the ultimate challenge achievement

**No Rewards:**
- Achievements are currently for prestige only
- No gameplay unlocks tied to achievements (by design)
