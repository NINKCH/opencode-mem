const PRIVATE_TAG_PATTERN = /<private>[\s\S]*?<\/private>/gi;

export function stripPrivateContent(content: string): string {
  return content.replace(PRIVATE_TAG_PATTERN, "[PRIVATE]");
}

export function isFullyPrivate(content: string): boolean {
  const stripped = stripPrivateContent(content);
  return stripped.trim() === "[PRIVATE]" || stripped.trim() === "";
}

export function sanitizeForStorage(content: string): string {
  let sanitized = stripPrivateContent(content);
  sanitized = sanitized.replace(/\s+/g, " ").trim();
  return sanitized;
}
