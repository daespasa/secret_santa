import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// Rate limiter para registro - máximo 3 intentos por hora por IP
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 intentos
  message: "Demasiados intentos de registro. Por favor intenta de nuevo en una hora.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Rate limiter para login - máximo 10 intentos por 15 minutos por IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos
  message: "Demasiados intentos de inicio de sesión. Por favor intenta de nuevo más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar intentos exitosos
});

// Speed limiter para login - ralentizar después de 3 intentos
export const loginSpeedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 3, // Después de 3 intentos
  delayMs: (hits) => hits * 1000, // 1s, 2s, 3s, etc.
  maxDelayMs: 10000, // Máximo 10 segundos de delay
});

// Rate limiter para cambio de contraseña - máximo 5 intentos por hora
export const changePasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 intentos
  message: "Demasiados intentos de cambio de contraseña. Por favor intenta de nuevo en una hora.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Rate limiter general para API - máximo 100 requests por 15 minutos
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests
  message: "Demasiadas solicitudes desde esta IP. Por favor intenta de nuevo más tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para creación de grupos - máximo 10 grupos por hora
export const createGroupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // 10 grupos
  message: "Has creado demasiados grupos. Por favor espera una hora.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Rate limiter para sorteos - máximo 20 sorteos por hora
export const drawLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // 20 sorteos
  message: "Has realizado demasiados sorteos. Por favor espera una hora.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
