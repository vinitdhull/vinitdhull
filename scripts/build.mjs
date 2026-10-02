import { cp, mkdir, rm } from "node:fs/promises";

const output = new URL("../dist/", import.meta.url);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(
  ["index.html", "styles.css", "main.js", "favicon.svg", "vinit-dhull.jpg"].map((file) =>
    cp(new URL(`../${file}`, import.meta.url), new URL(`../dist/${file}`, import.meta.url)),
  ),
);
await cp(new URL("../assets/", import.meta.url), new URL("../dist/assets/", import.meta.url), {
  recursive: true,
});

console.log("Built static site in dist/");
