// File: utils/cleanJSON.ts
export function cleanJSONString(jsonStr: string): string {
    let cleaned = jsonStr;
    // If a closing bracket exists, truncate string accordingly.
    const closingBracketIndex = cleaned.lastIndexOf("}]");
    if (closingBracketIndex !== -1) {
      cleaned = cleaned.substring(0, closingBracketIndex + 2);
    }
    cleaned = cleaned
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\\n/g, "")
      .replace(/\r/g, "")
      .trim();
    return cleaned;
  }
  