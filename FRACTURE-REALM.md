# The route beyond the first accident

The first eight-second Captain Hook voyage now ends in a walkable 3D realm,
replacing the original sequence of still images. The original narrative module
remains available for recovery; the physical story adapter bypasses its cutscene.

- Only W / Up / the mobile forward button advances. Backward, lateral and camera
  rotation input are ignored. The player may stop; there is no automatic walking.
- A circular aperture and fog progressively open with forward distance. The
  warped black/white corridor widens toward 325 articulated porcelain dolls,
  broken parts, a wheel made from joints, hanging carousel dolls and a snapped boat.
  Thirty-four scarlet scan-line glitches and red ground fragments are the only colored scenery.
- At the endpoint the aperture fully opens. The vista remains for 3.2 seconds,
  then the player returns to the central park. Keeper reacts with surprise and
  regains his welcoming manner. The first accident awards no ride completion.
- Each subsequent completed ride queues four seconds of patchy checker material
  corruption. It waits during dialogue and interiors until the player is back
  walking in the park. Mirror completion is included.
- When an exit appears, every park mesh and the sky take the black/white checker
  shader; Keeper sprites/portraits remain outside that shader and become solid red through their survival-corruption effect. Reset restores the park.
- Reduced-motion preference freezes checker drift and red scan-line drift. The
  route does not use rapid flashes. Pause and browser focus behavior are retained.

Runtime: reality-fracture.js (rendering), world.js (input/progress), story-3d.js
(accident/return/ride hooks), carnival-scene.js (camera/aperture/integration).

QA: `node verify-full-story.cjs` passes 309 assertions, including directional
locking, stopping, gradual progress, full-view hold, automatic return, Keeper's
reaction, and queued glitches. `node preview-fracture.cjs` creates a local-only
fixture at `/qa/fracture.html` for testing the three visual states. The QA hooks
are injected only into that generated fixture and are absent from the hosted app.
