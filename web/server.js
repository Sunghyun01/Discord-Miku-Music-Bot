import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { getGuildSettings, saveGuildSettings } from "../src/data/settingsStore.js";
import { getFavoritesData } from "../src/data/favoritesStore.js";
import { getPlaylistsData } from "../src/data/playlistsStore.js";
import { getDisplayTitle } from "../src/music/trackStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function dashboardEnabled() {
    return String(process.env.DASHBOARD_ENABLED || "false").toLowerCase() === "true";
}

function checkToken(req, res, next) {
    const token = process.env.DASHBOARD_TOKEN;
    if (!token) return next();
    const supplied = req.query.token || req.headers["x-dashboard-token"];
    if (supplied === token) return next();
    return res.status(401).json({ error: "Unauthorized" });
}

export function startDashboard(client, distube) {
    if (!dashboardEnabled()) {
        console.log("Dashboard disabled");
        return;
    }

    const app = express();
    const port = Number(process.env.DASHBOARD_PORT || 3000);

    app.use(express.json());
    app.use(checkToken);
    app.use(express.static(join(__dirname, "public")));

    app.get("/api/guilds", (req, res) => {
        res.json(client.guilds.cache.map(guild => ({ id: guild.id, name: guild.name })));
    });

    app.get("/api/guilds/:guildId/status", async (req, res) => {
        const { guildId } = req.params;
        const guild = client.guilds.cache.get(guildId);
        const queue = distube.getQueue(guildId);
        const settings = await getGuildSettings(guildId);

        res.json({
            guild: guild ? { id: guild.id, name: guild.name } : { id: guildId, name: "Unknown" },
            settings,
            queue: queue?.songs?.map(song => ({ title: getDisplayTitle(song), url: song.url })) || []
        });
    });

    app.post("/api/guilds/:guildId/settings", async (req, res) => {
        const { guildId } = req.params;
        const current = await getGuildSettings(guildId);
        const next = {
            ...current,
            ...req.body,
            autoDj: {
                ...current.autoDj,
                ...(req.body.autoDj || {})
            }
        };
        await saveGuildSettings(guildId, next);
        res.json(next);
    });

    app.get("/api/guilds/:guildId/favorites", async (req, res) => {
        res.json(await getFavoritesData(req.params.guildId));
    });

    app.get("/api/guilds/:guildId/playlists", async (req, res) => {
        res.json(await getPlaylistsData(req.params.guildId));
    });

    app.listen(port, () => {
        console.log(`Dashboard running: http://localhost:${port}`);
    });
}
