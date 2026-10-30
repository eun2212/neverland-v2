# Keeper: affection and deliberate danger

The published narrative extension is `keeper-story.js`, loaded after the 3D
adapter. The original 2D source remains available unchanged as a reference.

## Story flow

- Initial walking reaches the Keeper. Three introductions lead to a repeatable
  orientation menu: situation, objective, controls, current-position map, ready.
- Orientation questions do not consume the two-question allowance. Walking to
  the ship and boarding remain physical actions. A separate boarding briefing
  allows reassurance, waiting, leaving, or explicit readiness. Only then does
  the lever appear. A short launch scene precedes the actual first ride.
- The first accident still leads to the walkable monochrome doll graveyard.
  On return the Keeper insists it was a dream. Doubt, comfort and accusation
  branches reconnect to the park map and are recalled in the confrontation.
- All five successful puzzle routes now lead through a ride-specific suspicious
  incident. The player can accept help, inspect independently, or question him.
  Repairs really work. Safe completion and red corruption credit still occur
  only after physical ride completion (or the mirror exit).
- Post-ride gratitude, suspicion and boundaries change scores once per ride and
  response type; repeats cannot farm these rewards. Keeper remembers boundaries
  and doubt in later hub dialogue. Survived ride count drives colder dialogue
  alongside the existing single-origin red takeover.
- Existing 18 personality replies, help/retry/risk, parade and dice are connected
  to the new voice. Gameplay hints and risk odds are retained. The two-question
  compulsory ride still locks the gate and standing until completion.
- Five searchable records add evidence of deliberate intervention. Both evidence
  choices retain the discovery, and rechecking never duplicates clue rewards.
- At the physical exit he admits releasing the Captain Hook stop and knowingly
  allowing other hazards. The final response recalls the dream conversation
  and evidence. All three original resolution methods and five ending eligibility
  rules remain; ending prose now retains his responsibility and romantic tension.

## Validation

`node verify-keeper-story.cjs`: 494 assertions, including the 332 baseline checks,
all 15 incident branches, all 18 personality replies, dream branches, repeatable
tutorial questions, readiness/actual first launch, both evidence branches at five
rides, enforced boarding, physical safe-completion timing, reset and confrontation.

`node preview-keeper-story.cjs` generates a local-only QA fixture; never publish
the `qa` directory. Browser checks covered orientation layout, explicit dream
denial, incident choices and confession branches, with no console errors.

`node package-full-story.cjs` embeds the new module in the portable HTML.
