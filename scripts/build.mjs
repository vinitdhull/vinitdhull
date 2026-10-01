import { cp, mkdir, rm } from "node:fs/promises";

const output = new URL("../dist/", import.meta.url);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(
  ["index.html", "styles.css", "main.js", "favicon.svg", "vinit-dhull.jpg"].map((file) =>
    cp(new URL(`../${file}`, import.meta.url), new URL(`../dist/${file}`, import.meta.url)),
  ),
);

console.log("Built static site in dist/");
