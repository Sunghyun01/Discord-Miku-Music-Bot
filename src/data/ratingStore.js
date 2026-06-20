import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "../../data");
const FILE_PATH = path.join(DATA_DIR, "ratings.json");

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

export async function saveRating(guildId, ratingData) {
    const data = await readStore();

    if (!data.guilds[guildId]) {
        data.guilds[guildId] = [];
    }

    data.guilds[guildId].unshift({
        ...ratingData,
        createdAt: new Date().toISOString()
    });

    data.guilds[guildId] = data.guilds[guildId].slice(0, 100);

    await writeStore(data);

    return ratingData;
}

export async function getRecentRatings(guildId, limit = 10) {
    const data = await readStore();

    return (data.guilds[guildId] || []).slice(0, limit);
}