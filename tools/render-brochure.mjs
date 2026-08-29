#!/usr/bin/env node
/**
 * Render letter-landscape trifold proofs from the live HTML/CSS.
 * Writes brochure.pdf, brochure-outside.png, brochure-inside.png at the repo root.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, access, readFile, rm, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const chromeBin =
  process.env.CHROME ||
  "/usr/bin/google-chrome-stable";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

function startStaticServer() {
  return new Promise((resolveServer) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url || "/", "http://127.0.0.1");
      let filePath = decodeURIComponent(url.pathname);
      if (filePath === "/" || filePath === "/print" || filePath === "/print/") {
        filePath = "/index.html";
      }
      const abs = join(root, filePath.replace(/^\/+/, ""));
      if (!abs.startsWith(root)) {
        res.writeHead(403);
        res.end();
        return;
      }
      try {
        const data = await readFile(abs);
        res.writeHead(200, { "content-type": MIME[extname(abs)] || "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("not found");
      }
    });
    server.listen(0, "127.0.0.1", () => resolveServer(server));
  });
}

function run(cmd, args, { timeoutMs = 0 } = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    let timedOut = false;
    const timer =
      timeoutMs > 0
        ? setTimeout(() => {
            timedOut = true;
            child.kill("SIGKILL");
          }, timeoutMs)
        : null;
    child.on("error", (err) => {
      if (timer) clearTimeout(timer);
      reject(err);
    });
    child.on("exit", (code) => {
      if (timer) clearTimeout(timer);
      if (code === 0 || timedOut) resolveRun();
      else reject(new Error(`${cmd} exited ${code}`));
    });
  });
}

function chromeArgs(profile, extra) {
  return [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    ...extra,
  ];
}

const server = await startStaticServer();
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;
const pdfPath = join(root, "brochure.pdf");
const shotPath = join(root, ".print-capture.png");
const pdfProfile = await mkdtemp(join(tmpdir(), "brochure-pdf-"));
const shotProfile = await mkdtemp(join(tmpdir(), "brochure-shot-"));

try {
  await run(
    chromeBin,
    chromeArgs(pdfProfile, [
      "--no-pdf-header-footer",
      `--print-to-pdf=${pdfPath}`,
      "--virtual-time-budget=8000",
      `${origin}/print`,
    ]),
    { timeoutMs: 20000 },
  );

  // Two 11in×8.5in sheets stacked, 96 CSS px/in, deviceScaleFactor 2.
  await run(
    chromeBin,
    chromeArgs(shotProfile, [
      "--force-device-scale-factor=2",
      "--window-size=1056,1632",
      `--screenshot=${shotPath}`,
      "--virtual-time-budget=8000",
      `${origin}/print?capture=1`,
    ]),
    { timeoutMs: 18000 },
  );

  await access(pdfPath);
  await access(shotPath);

  await run("python3", [
    "-c",
    `
from pathlib import Path
from PIL import Image
im = Image.open(${JSON.stringify(shotPath)})
w, h = im.size
sheet_h = h // 2
im.crop((0, 0, w, sheet_h)).save(${JSON.stringify(join(root, "brochure-outside.png"))})
im.crop((0, sheet_h, w, min(h, sheet_h * 2))).save(${JSON.stringify(join(root, "brochure-inside.png"))})
print("split", im.size, "->", (w, sheet_h))
`,
  ]);
  await unlink(shotPath).catch(() => {});
  console.log("Wrote brochure.pdf, brochure-outside.png, brochure-inside.png");
} finally {
  server.close();
  await rm(pdfProfile, { recursive: true, force: true }).catch(() => {});
  await rm(shotProfile, { recursive: true, force: true }).catch(() => {});
}
