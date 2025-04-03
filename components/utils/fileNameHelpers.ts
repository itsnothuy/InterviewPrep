// components/utils/fileNameHelpers.ts

export function getDisplayedFileName(fileKey: string): string {
    // Remove the "uploads/" prefix.
    const withoutPrefix = fileKey.replace(/^uploads\//, "");
    // Remove any leading digits (timestamp) from the file name.
    return withoutPrefix.replace(/^\d+/, "");
  }
  