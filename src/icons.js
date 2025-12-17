// Material Icons (Material Symbols Outlined) helper
// Mapeo de nombres de iconos a Material Symbols
const iconMap = {
  gift: "card_giftcard",
  home: "home",
  chart: "bar_chart",
  users: "group",
  settings: "settings",
  lock: "lock",
  heart: "favorite",
  document: "description",
  lightbulb: "lightbulb",
  trash: "delete",
  edit: "edit",
  check: "check",
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
};

export function renderIcon(name, className = "text-2xl") {
  // Buscar en el mapa o usar el nombre directamente
  const iconName = iconMap[name] || name;
  return `<span class="material-symbols-outlined ${className}">${iconName}</span>`;
}

// Helper para renderizar iconos de grupos
export function renderGroupIcon(iconValue, className = "text-2xl") {
  if (iconValue) {
    // Si es un nombre conocido, usar el mapa
    if (iconMap[iconValue]) {
      return renderIcon(iconValue, className);
    }
    // Si no está en el mapa, intentar usarlo directamente como nombre de Material Icon
    return `<span class="material-symbols-outlined ${className}">${iconValue}</span>`;
  }
  // Default: icono de regalo
  return renderIcon("gift", className);
}
