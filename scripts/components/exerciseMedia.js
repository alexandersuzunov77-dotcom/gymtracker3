// Resolves the demo media for an exercise: real demonstration photos where we
// have them (two frames, cross-faded to show the movement — see ATTRIBUTION.md),
// falling back to the procedurally drawn silhouette for the few exercises the
// photo dataset doesn't cover. User-uploaded photos always take precedence
// upstream (imageSlot).

import { IMAGES_BY_NAME } from '../data/exerciseImages.js';
import { exerciseArtSvg } from './exerciseArt.js';

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function hasPhoto(ex) {
  return Boolean(IMAGES_BY_NAME[ex.name]);
}

/** Full-size demo media HTML: animated two-frame photo demo, or silhouette SVG. */
export function exerciseMediaHtml(ex) {
  const frames = IMAGES_BY_NAME[ex.name];
  if (!frames) return exerciseArtSvg(ex);
  const alt = escapeAttr(ex.name);
  return `
    <div class="photo-demo">
      <img src="${frames[0]}" alt="${alt} — start position" loading="lazy">
      ${frames[1] ? `<img class="frame2" src="${frames[1]}" alt="${alt} — end position" loading="lazy">` : ''}
    </div>`;
}

/** Small static thumbnail HTML (first frame only), or silhouette SVG. */
export function exerciseThumbHtml(ex) {
  const frames = IMAGES_BY_NAME[ex.name];
  if (!frames) return exerciseArtSvg(ex);
  return `<img class="photo-thumb" src="${frames[0]}" alt="" loading="lazy">`;
}
