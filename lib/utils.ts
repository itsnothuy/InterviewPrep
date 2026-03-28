import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitLanguages(languages: string) {
  return languages.split(",").map((language) => language.trim());
}

export function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}

/**
 * Validates that a URL is a valid HTTPS GitHub URL.
 * Prevents XSS attacks from malicious URLs like javascript:alert('XSS')
 * @param url - The URL to validate
 * @returns true if the URL is a valid GitHub HTTPS URL, false otherwise
 */
export function isValidGitHubUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'github.com';
  } catch {
    return false;
  }
}
