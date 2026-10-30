# Scarlet Keeper

Each completed, survived ride adds one corruption step (19%, capped at 95%).
Assisted rides and repeated rides count; puzzle attempts, the mandatory first
accident and fatal outcomes do not. The counter commits only after the physical
ride finishes, or after walking through the unlocked mirror exit.

The exit reveal / confrontation forces 100% corruption. Every pixel of Keeper's
figure then becomes one scarlet color, including skin, mask, hat and decorations.
The original transparent silhouette, pose and feather edges are retained.
Restart restores the original colors and zeroes the survival counter.

Three.js SpriteMaterial applies one contiguous red takeover from the mask star after the sprite fog shader
chunk. The portrait and puzzle images share an alpha-clipped SVG vein overlay with the
same progression. All ten existing poses participate; no extra raster downloads
are required. Original artwork and the five concept candidates remain intact.

In the first-accident monochrome realm, all thirty-four neon eye groups have
been replaced by scarlet broken scan-lines. Ground rings became red fragments.
The sole scenery accent is #ff100a; the black/white dolls and checker floor remain.
Reduced-motion preference freezes scan-line drift.

Validation: 332 assertions, including gradual change, full exit red, first-death
exclusion, successful assisted/repeated rides, death exclusion and reset. Browser
checks cover intermediate 3D tint, solid-red exit sprite, solid-red dialogue and
the red-only graveyard accents, with no shader/console errors.
