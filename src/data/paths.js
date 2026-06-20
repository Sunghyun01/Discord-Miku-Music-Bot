import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const projectRoot = join(__dirname, "..", "..");
export const dataRoot = join(projectRoot, "data");

export function guildDir(guildId) {
  return join(dataRoot, "guilds", String(guildId));
}

export function guildFile(guildId, filename) {
  return join(guildDir(guildId), filename);
}
