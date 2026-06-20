import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "../../data");
const FILE_PATH = path.join(DATA_DIR, "djMentSettings.json");

async function ensureFile() {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
        await fs.access(FILE_PATH);
    } catch {
        await fs.writeFile(FILE_PATH, JSON.stringify({ guilds: {} }, null, 2), "utf8");
    }
}

async function readStore() {
    await ensureFile();

    const raw = await fs.readFile(FILE_PATH, "utf8");
    return JSON.parse(raw);
}

async function writeStore(data) {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function isDjMentEnabled(guildId) {
    const data = await readStore();
    const guild = data.guilds[guildId];

    return guild?.enabled ?? false;
}

export async function setDjMentEnabled(guildId, enabled) {
    const data = await readStore();

    if (!data.guilds[guildId]) {
        data.guilds[guildId] = {};
    }

    data.guilds[guildId].enabled = enabled;
    data.guilds[guildId].updatedAt = new Date().toISOString();

    await writeStore(data);

    return data.guilds[guildId];
}