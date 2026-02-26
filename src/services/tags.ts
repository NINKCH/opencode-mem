import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { CONFIG } from "../config.js";
import { log } from "./logger.js";

function getGitEmail(): string {
  try {
    const email = execSync("git config user.email", { encoding: "utf-8" }).trim();
    return email || "unknown@example.com";
  } catch {
    return "unknown@example.com";
  }
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex").substring(0, 16);
}

export interface Tags {
  user: string;
  project: string;
}

export function getTags(directory: string): Tags {
  const userEmail = getGitEmail();
  const userHash = hash(userEmail);
  const projectHash = hash(directory);

  const userTag = CONFIG.userContainerTag || `${CONFIG.containerTagPrefix}_user_${userHash}`;
  const projectTag = CONFIG.projectContainerTag || `${CONFIG.containerTagPrefix}_project_${projectHash}`;

  log("Tags generated", { userTag, projectTag, directory });

  return {
    user: userTag,
    project: projectTag,
  };
}
