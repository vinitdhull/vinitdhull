import { cp, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const source = new URL("../src/", import.meta.url);
const output = new URL("../dist/", import.meta.url);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

console.log("Built static site in dist/");
