import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { basename } from "node:path";
import { existsSync, readFileSync } from "node:fs";
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

function getProjectName(directory: string): string {
  try {
    const packageJsonPath = directory + "/package.json";
    if (existsSync(packageJsonPath)) {
      const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      if (pkg.name) {
        return pkg.name.replace(/[^a-zA-Z0-9_-]/g, "_");
      }
    }
  } catch {}
  return basename(directory) || "project";
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
  const projectName = getProjectName(directory);

  const userTag = CONFIG.userContainerTag || `user_${userHash}`;
  const projectTag = CONFIG.projectContainerTag || `${projectName}_${projectHash}`;

  log("Tags generated", { userTag, projectTag, directory });

  return {
    user: userTag,
    project: projectTag,
  };
}
