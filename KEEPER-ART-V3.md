# Keeper standing artwork v3

Ten transparent WebP runtime sprites (with original PNG sources retained) now use the approved dark green coat, yellow lapels,
red vest, crown-shaped gold hatband, diamond playing-card hat ornament and ivory
star mask with black void eye apertures. Existing ending illustrations are retained.

The sixteen narrative pose IDs resolve to ten new assets through `keeper-art` in
index.html. Conversation and puzzle portraits use this mapping. The 3D park sprite
uses the same textures, including the pleading pose at the exit confrontation.

01 basic; 02 soft smile; 03 welcome; 04 hand over heart; 05 hat greeting;
06 thoughtful; 07 surprised; 08 worried; 09 lonely; 10 please stay.

Validation: all ten source PNGs have alpha transparency; all sixteen narrative IDs have
existing asset targets; ten pose switches verified in the browser without console
errors; 280 full-story assertions pass. `node preview-keeper.cjs` creates the local
QA fixture at `/qa/keeper-standing.html`, which is excluded from the hosted files.

Original images remain in assets for recovery. Generated art uses built-in Imagegen.
