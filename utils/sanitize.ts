/**
 * Security utility for sanitizing user input before sending to AI models
 * SEC-004: Prevent prompt injection and validate input
 */

/**
 * Sanitizes user input to prevent prompt injection attacks
 * - Removes control characters and special escape sequences
 * - Escapes JSON special characters
 * - Validates input length
 * - Removes potential prompt injection patterns
 */
export function sanitizeForPrompt(input: string, maxLength: number = 5000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);

  // Remove control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Remove potential prompt injection patterns
  // These patterns might try to trick the AI into ignoring previous instructions
  const injectionPatterns = [
    /ignore\s+(previous|all|above)\s+instructions?/gi,
    /disregard\s+(previous|all|above)\s+instructions?/gi,
    /forget\s+(previous|all|above)\s+instructions?/gi,
    /new\s+instructions?:/gi,
    /system\s*:/gi,
    /admin\s*:/gi,
    /override\s+instructions?/gi,
  ];

  injectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  // Escape characters that could break JSON or prompt structure
  // But preserve basic punctuation for natural language
  sanitized = sanitized
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/"/g, '\\"')     // Escape double quotes
    .replace(/\n/g, ' ')      // Replace newlines with spaces
    .replace(/\r/g, '')       // Remove carriage returns
    .replace(/\t/g, ' ');     // Replace tabs with spaces

  return sanitized;
}

/**
 * Validates code input for technical interviews
 * - Limits length
 * - Removes dangerous patterns (but preserves code structure)
 */
export function sanitizeCodeInput(code: string, maxLength: number = 10000): string {
  if (!code || typeof code !== 'string') {
    return '';
  }

  // Trim and limit length (code can be longer than text answers)
  let sanitized = code.trim().slice(0, maxLength);

  // Remove control characters but preserve newlines and tabs (important for code)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Remove prompt injection patterns but be less aggressive (preserve code syntax)
  const codeInjectionPatterns = [
    /ignore\s+(previous|all)\s+instructions?/gi,
    /system\s*:\s*you\s+are/gi,
  ];

  codeInjectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  return sanitized;
}

/**
 * Validates that input is not empty after sanitization
 */
export function validateInput(input: string, minLength: number = 1): boolean {
  const sanitized = input.trim();
  return sanitized.length >= minLength;
}
