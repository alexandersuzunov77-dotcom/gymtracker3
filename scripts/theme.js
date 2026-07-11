export const ACCENT_OPTIONS = ['#b6f24a', '#ff8a3d', '#3d9bff', '#b45cff', '#ff4d4d'];
export const DENSITY_OPTIONS = ['Compact', 'Standard', 'Roomy'];
export const ENERGY_OPTIONS = ['Focused', 'Charged'];

export function densityToPad(density) {
  return density === 'Compact' ? 0.6 : density === 'Roomy' ? 1.45 : 1;
}

export function applyTheme(settings) {
  const root = document.documentElement;
  const accent = settings.accent || '#b6f24a';
  root.style.setProperty('--accent', accent);
  root.style.setProperty('--pad', String(densityToPad(settings.density)));
  root.style.setProperty('--glow', settings.energy === 'Charged'
    ? `0 0 18px ${accent}80, 0 0 5px ${accent}`
    : 'none');
}
