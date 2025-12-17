// Material Icons (Material Symbols Outlined) helper
// Mapeo de nombres de iconos a Material Symbols
const iconMap = {
  gift: "card_giftcard",
  home: "home",
  chart: "bar_chart",
  users: "group",
  groups: "groups",
  people: "people",
  settings: "settings",
  lock: "lock",
  heart: "favorite",
  document: "description",
  lightbulb: "lightbulb",
  trash: "delete",
  edit: "edit",
  check: "check",
  check_circle: "check_circle",
  close: "close",
  dice: "casino",
  crown: "workspace_premium",
  search: "search",
  code: "code",
  clipboard: "content_paste",
  package: "inventory_2",
  user: "person",
  cookie: "cookie",
  link: "link",
  mail: "mail",
  tree: "park",
  party: "celebration",
  beer: "sports_bar",
  chocolate: "cake",
  book: "menu_book",
  gamepad: "sports_esports",
  beach: "beach_access",
  unlock: "lock_open",
  pencil: "edit",
  "wand-2": "wand_stars",
  shuffle: "shuffle",
  schedule: "schedule",
  add_circle: "add_circle",
  star: "star",
  arrow_forward: "arrow_forward",
  inbox: "inbox",
  "arrow-right": "arrow_forward",
  close: "close",
  list: "list",
};

// Mapeo de tamaños de Tailwind a px
const sizeMap = {
  "text-xs": "12px",
  "text-sm": "14px",
  "text-base": "16px",
  "text-lg": "18px",
  "text-xl": "20px",
  "text-2xl": "24px",
  "text-3xl": "30px",
  "text-4xl": "36px",
  "text-5xl": "48px",
  "text-6xl": "60px",
  "text-7xl": "72px",
  "text-8xl": "96px",
  "text-9xl": "128px",
};

function extractFontSize(className) {
  const sizeClass = className.split(" ").find((c) => sizeMap[c]);
  return sizeMap[sizeClass] || "24px";
}

export function renderIcon(name, className = "text-2xl") {
  const iconName = iconMap[name] || name;
  const fontSize = extractFontSize(className);
  // Remove size classes and apply inline font-size
  const otherClasses = className
    .split(" ")
    .filter((c) => !sizeMap[c])
    .join(" ");
  const style = `font-size: ${fontSize}; display: inline-block; vertical-align: -0.25em; line-height: 1;`;

  return `<span class="material-symbols-outlined ${otherClasses}" style="${style}">${iconName}</span>`;
}

// Helper para renderizar iconos de grupos
export function renderGroupIcon(iconValue, className = "text-2xl") {
  if (iconValue) {
    // Si es un nombre conocido, usar el mapa
    if (iconMap[iconValue]) {
      return renderIcon(iconValue, className);
    }
    // Si no está en el mapa, intentar usarlo directamente como nombre de Material Icon
    const fontSize = extractFontSize(className);
    const otherClasses = className
      .split(" ")
      .filter((c) => !sizeMap[c])
      .join(" ");
    const style = `font-size: ${fontSize}; display: inline-block; vertical-align: -0.25em; line-height: 1;`;
    return `<span class="material-symbols-outlined ${otherClasses}" style="${style}">${iconValue}</span>`;
  }
  // Default: icono de regalo
  return renderIcon("gift", className);
}
