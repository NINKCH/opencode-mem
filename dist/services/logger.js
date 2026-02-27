import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
const LOG_DIR = join(homedir(), ".local", "share", "opencode-memory");
const LOG_FILE = join(LOG_DIR, "opencode-mem.log");
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB
function ensureLogDir() {
    if (!existsSync(LOG_DIR)) {
        mkdirSync(LOG_DIR, { recursive: true });
    }
}
function formatTimestamp() {
    return new Date().toISOString();
}
function truncateIfNeeded(message, maxLength = 1000) {
    if (message.length <= maxLength)
        return message;
    return message.slice(0, maxLength) + "...[truncated]";
}
export function log(message, data) {
    try {
        ensureLogDir();
        const timestamp = formatTimestamp();
        const dataStr = data ? ` ${JSON.stringify(data, null, 2)}` : "";
        const logLine = `[${timestamp}] ${truncateIfNeeded(message)}${truncateIfNeeded(dataStr)}\n`;
        appendFileSync(LOG_FILE, logLine, "utf-8");
    }
    catch {
        // Silently fail if logging fails
    }
}
export function getLogPath() {
    return LOG_FILE;
}
export function clearLogs() {
    try {
        const { writeFileSync } = require("node:fs");
        writeFileSync(LOG_FILE, "", "utf-8");
    }
    catch {
        // Silently fail
    }
}
