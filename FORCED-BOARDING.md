# Two-question boarding obligation

The 3D adapter used to turn the original forced puzzle into a walking objective,
while still permitting park return and zone changes. Completing the second topic
response now locks the current ride. Keeper's instruction leads directly to that
ride's interior and seat (or the mirror control room).

Until physical completion, the park-return API, dismount API, route changes and
map navigation cannot release the obligation. Puzzle return choices are removed,
including after help/retry. Solving the puzzle still starts the real ride; mirror
success still requires walking through its finish. Physical completion releases
the lock and resets the question count. Restart clears it as well.

The original story-core.js is preserved; the adapter enforces the requested
two-response rule. Existing conversations, replies, help and danger outcomes stay
available. A fatal outcome is still an ending rather than a free route change.

Keeper corruption now uses keeper-veins.js, a shared branching arrival field.
Early stages retain original pixels outside thin scarlet veins. Later stages
expand the red regions until the exit form is fully scarlet. Three.js samples the
field in UV space; portraits and puzzle images use an alpha-clipped SVG overlay
from the same field. There is no overall red wash.

327 assertions pass, including two-response enforcement, locked return/dismount,
blocked map/zone changes, real ride launch/completion release, and increasing
branch coverage. Browser checks cover the second-response boarding sequence and
the actual branching portrait effect, with no console errors.
