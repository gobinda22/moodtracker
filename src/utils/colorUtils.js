// Lighten a hex color by a percentage (0-100)
export const lightenColor = (color, percent) => {
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  let rr = r.toString(16).padStart(2, '0');
  let gg = g.toString(16).padStart(2, '0');
  let bb = b.toString(16).padStart(2, '0');

  return `#${rr}${gg}${bb}`;
};

// Darken a hex color by a percentage (0-100)
export const darkenColor = (color, percent) => {
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  r = Math.max(0, Math.floor(r * (1 - percent / 100)));
  g = Math.max(0, Math.floor(g * (1 - percent / 100)));
  b = Math.max(0, Math.floor(b * (1 - percent / 100)));

  let rr = r.toString(16).padStart(2, '0');
  let gg = g.toString(16).padStart(2, '0');
  let bb = b.toString(16).padStart(2, '0');

  return `#${rr}${gg}${bb}`;
};

// Generate a gradient string for CSS from an array of colors
export const generateGradient = (colors, direction = '135deg') => {
  if (!colors || colors.length === 0) return null;
  if (colors.length === 1) return colors[0];
  
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
};

// Add alpha transparency to a hex color
export const addAlpha = (color, alpha) => {
  // Convert alpha from 0-1 to 0-255 and then to hex
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${color}${alphaHex}`;
};

// Blend two colors together
export const blendColors = (color1, color2, ratio = 0.5) => {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Determine if a color is light or dark (for choosing contrasting text)
export const isLightColor = (color) => {
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  
  // Calculate luminance using the formula: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
};

// Get a contrasting text color (black or white) based on background
export const getContrastingTextColor = (backgroundColor) => {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
};

// Generate a color palette from a base color
export const generateColorPalette = (baseColor) => {
  return {
    light: lightenColor(baseColor, 30),
    main: baseColor,
    dark: darkenColor(baseColor, 30),
    veryLight: lightenColor(baseColor, 80),
    veryDark: darkenColor(baseColor, 60)
  };
};