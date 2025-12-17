// Lista de dominios de email temporales/desechables más comunes
const disposableEmailDomains = [
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "mailinator.com",
  "throwaway.email",
  "trashmail.com",
  "yopmail.com",
  "maildrop.cc",
  "getnada.com",
  "temp-mail.org",
  "fakeinbox.com",
  "sharklasers.com",
  "guerrillamail.info",
  "grr.la",
  "spam4.me",
  "mytrashmail.com",
];

export function isDisposableEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  return disposableEmailDomains.includes(domain);
}

export function isValidName(name) {
  // Nombre debe tener al menos 2 caracteres
  if (!name || name.trim().length < 2) {
    return false;
  }

  // Nombre no debe ser solo números
  if (/^\d+$/.test(name.trim())) {
    return false;
  }

  // Nombre no debe tener demasiados caracteres especiales
  const specialCharsCount = (name.match(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g) || []).length;
  if (specialCharsCount > 3) {
    return false;
  }

  return true;
}

export function isValidEmail(email) {
  // Validación básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isStrongPassword(password) {
  // Al menos 6 caracteres (ya validado en otra parte)
  if (password.length < 6) {
    return { valid: false, message: "La contraseña debe tener al menos 6 caracteres" };
  }

  // Recomendación: al menos una letra y un número
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      valid: true,
      warning: "Recomendamos usar letras y números para mayor seguridad",
    };
  }

  return { valid: true };
}

export function sanitizeInput(input) {
  if (typeof input !== "string") return input;

  // Eliminar espacios al inicio y final
  let sanitized = input.trim();

  // Eliminar caracteres de control
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");

  // Limitar longitud
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500);
  }

  return sanitized;
}

export function detectSuspiciousActivity(req) {
  const suspiciousPatterns = [];

  // Detectar user agents sospechosos
  const userAgent = req.get("user-agent") || "";
  if (!userAgent || userAgent.toLowerCase().includes("bot") || userAgent.length < 10) {
    suspiciousPatterns.push("suspicious_user_agent");
  }

  // Detectar referer sospechoso
  const referer = req.get("referer") || "";
  if (referer && !referer.includes(req.get("host"))) {
    // Referer externo - podría ser sospechoso si viene de un sitio raro
    if (referer.includes("spam") || referer.includes("bot")) {
      suspiciousPatterns.push("suspicious_referer");
    }
  }

  return suspiciousPatterns;
}
