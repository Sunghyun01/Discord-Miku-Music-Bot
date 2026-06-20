import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function readJson(filePath, defaultValue) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return structuredClone(defaultValue);
    }
    console.error(`JSON 읽기 실패: ${filePath}`, error);
    return structuredClone(defaultValue);
  }
}

export async function writeJson(filePath, value) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function updateJson(filePath, defaultValue, updater) {
  const data = await readJson(filePath, defaultValue);
  const next = await updater(data);
  await writeJson(filePath, next ?? data);
  return next ?? data;
}
