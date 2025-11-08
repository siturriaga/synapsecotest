// apply_patches.mjs
// Run with: node apply_patches.mjs
// It updates/creates the exact files discussed (Netlify + src + functions) and appends styles idempotently.

import { promises as fs } from 'fs';
import path from 'path';

const root = process.cwd();

const files = [
  {
    path: 'netlify.toml',
    content: `[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
  # Single-line CSP; no triple quotes; no newlines
  Content-Security-Policy = "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' https://accounts.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebasestorage.googleapis.com https://generativelanguage.googleapis.com; img-src 'self' data: https:; frame-src https://accounts.google.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none';"
  Cross-Origin-Opener-Policy = "same-origin-allow-popups"
`
  },
  {
    path: '_redirects',
    content: `/api/*   /.netlify/functions/:splat   200
`
  },
  {
    path: 'src/utils/netlifyTargets.ts',
    content: `// All server functions resolve through /api to avoid 404/CORS/env drift.
export const FUNCTIONS_BASE = "/api";
export const getRemoteFunctionBase = () => FUNCTIONS_BASE;
export const getDefaultRemoteFunctionBase = () => FUNCTIONS_BASE;
export const getRemoteFunctionBaseOverride = () => FUNCTIONS_BASE;
export const setRemoteFunctionBaseOverride = () => FUNCTIONS_BASE;
export const clearRemoteFunctionBaseOverride = () => FUNCTIONS_BASE;
`
  },
  {
    path: 'src/utils/safeFetch.ts',
    content: `// Normalizes URLs so legacy "/.netlify/functions/*" and "generateAssignment"
// become clean "/api/*". Adds JSON defaults and strong error messages.
export async function safeFetch(url: string, init: RequestInit = {}) {
  let finalUrl = url;

  // Absolute URLs remain as-is
  const isAbs = url.startsWith("http://") || url.startsWith("https://");

  if (!isAbs) {
    // Normalize legacy Netlify path to /api/*
    if (url.startsWith("/.netlify/functions/")) {
      finalUrl = "/api/" + url.replace(/^\\/\\.netlify\\/functions\\//, "");
    } else if (url.startsWith("/api/")) {
      finalUrl = url;
    } else {
      // bare "generateAssignment" -> "/api/generateAssignment"
      finalUrl = "/api/" + url.replace(/^\\/+/, "");
    }
  }

  const res = await fetch(finalUrl, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(\`safeFetch \${finalUrl} → \${res.status} \${res.statusText} :: \${text}\`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
`
  },
  {
    path: 'src/firebase.ts',
    content: `import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,      // NO "https://"
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missing: string[] = Object.entries(cfg)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error("Firebase config missing:", missing.join(", "));
  throw new Error("Firebase config is incomplete. Check VITE_FIREBASE_* variables.");
}

const app = getApps().length ? getApps()[0] : initializeApp(cfg);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
`
  },
  {
    path: 'src/firebaseConfig.ts',
    content: `import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,      // NO "https://"
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missing = Object.entries(config).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error("Firebase configuration is incomplete:", missing.join(", "));
  throw new Error("Firebase config is incomplete. Check VITE_FIREBASE_* variables.");
}

const app = getApps().length ? getApps()[0] : initializeApp(config);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
`
  },
  {
    path: 'netlify/functions/health.ts',
    content: `import type { Handler } from "@netlify/functions";

export const handler: Handler = async () => {
  const need = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_STORAGE_BUCKET",
    "GEMINI_API_KEY",
  ];
  const missing = need.filter(k => !process.env[k]);
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ok: missing.length === 0, missing }),
  };
};
`
  },
  {
    path: 'netlify/functions/generateAssignment.ts',
    content: `import type { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, "\\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: "Missing body" };
    const payload = JSON.parse(event.body);

    // Support both {prompt} and standards-based requests
    const prompt =
      payload?.prompt ??
      payload?.standard ??
      "Create a 10-question multiple-choice quiz aligned to the provided standard, with answer key.";

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateText({ prompt });
    const text = result?.response?.text?.() ?? "";

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, text }),
    };
  } catch (e) {
    const msg = (e && typeof e === 'object' && 'message' in e) ? e.message : String(e);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: msg }),
    };
  }
};
`
  },
  {
    path: 'src/components/DynamicWelcome.tsx',
    content: `import { useEffect, useMemo } from "react";

type Scene = "morning" | "afternoon" | "sunset" | "night";
const sceneByTime = (d = new Date()): Scene => {
  const h = d.getHours();
  if (h < 11) return "morning";
  if (h < 17) return "afternoon";
  if (h < 20) return "sunset";
  return "night";
};

export default function DynamicWelcome() {
  const scene = useMemo(() => sceneByTime(), []);
  useEffect(() => {
    document.body.setAttribute("data-scene", scene);
    document.body.setAttribute("data-micro", "on");
    document.body.setAttribute("data-texture", "soft");
  }, [scene]);

  return (
    <section className="dynamic-welcome" aria-label="Ghibli welcome">
      <div className="welcome-sky" />
      <div className="sunmoon-arc"><div className="sun" /><div className="moon" /></div>
      <div className="mountains m-1 soft" />
      <div className="mountains m-2 soft" />
      <div className="forest" />
      <div className="clouds">
        <div className="cloud c-1" /><div className="cloud c-2" /><div className="cloud c-3" />
        <div className="cloud c-4" /><div className="cloud c-5" />
      </div>
      <div className="lanterns">
        <div className="lantern l-1" /><div className="lantern l-2" /><div className="lantern l-3" />
        <div className="lantern l-4" /><div className="lantern l-5" /><div className="lantern l-6" />
        <div className="lantern l-7" /><div className="lantern l-8" />
      </div>
      <div className="welcome-caption">
        <h1>Good {scene === "night" ? "evening" : scene}</h1>
        <p>Synapse is ready — lessons, groups, and insights at your fingertips.</p>
      </div>
    </section>
  );
}
`
  },
];

const STYLE_MARK_START = "/* === GHIBLI_C_PLUS_BEGIN === */";
const STYLE_MARK_END = "/* === GHIBLI_C_PLUS_END === */";
const stylesAppend = `
${STYLE_MARK_START}
.dynamic-welcome{position:relative;overflow:hidden;border-radius:20px;padding:clamp(20px,4vw,32px);contain:paint layout;isolation:isolate}
.welcome-sky{position:absolute;inset:0;background:linear-gradient(180deg,var(--sky-top,#a8edea),var(--sky-bottom,#fed6e3));transition:background 1200ms ease;will-change:transform,opacity,filter}
body[data-scene="morning"]{--sky-top:#ffecd2;--sky-bottom:#fcb69f;--ridge1:#54735b;--ridge2:#3e5f49;--forest:#2b4b39;--glow:#ffdfa9}
body[data-scene="afternoon"]{--sky-top:#a8edea;--sky-bottom:#fed6e3;--ridge1:#446f58;--ridge2:#355a46;--forest:#244635;--glow:#fff7cc}
body[data-scene="sunset"]{--sky-top:#ff9a9e;--sky-bottom:#fad0c4;--ridge1:#34564c;--ridge2:#28433a;--forest:#1f372d;--glow:#ffd28c}
body[data-scene="night"]{--sky-top:#1e3052;--sky-bottom:#0b1629;--ridge1:#203a37;--ridge2:#182d2a;--forest:#13261d;--glow:#8fd3ff}

.sunmoon-arc{position:absolute;inset:0;pointer-events:none}
.sun,.moon{position:absolute;width:56px;height:56px;border-radius:50%;filter:blur(.5px);will-change:transform,opacity}
.sun{background:radial-gradient(circle at 30% 30%,#fff7c9,#ffc36b 60%,#f49f42 90%);animation:sun-path 48s linear infinite;opacity:var(--sun-o,1)}
.moon{background:radial-gradient(circle at 35% 35%,#e9f5ff,#b7cbe0 65%,#8296ad 95%);animation:moon-path 48s linear infinite;opacity:var(--moon-o,0)}
body[data-scene="morning"]{--sun-o:1;--moon-o:0}
body[data-scene="afternoon"]{--sun-o:1;--moon-o:0}
body[data-scene="sunset"]{--sun-o:.8;--moon-o:.2}
body[data-scene="night"]{--sun-o:0;--moon-o:1}
@keyframes sun-path{0%{transform:translate(8%,70%)}50%{transform:translate(50%,-10%)}100%{transform:translate(92%,70%)}}
@keyframes moon-path{0%{transform:translate(92%,70%)}50%{transform:translate(50%,-10%)}100%{transform:translate(8%,70%)}}

.mountains{position:absolute;inset:auto 0 0 0;height:42%;pointer-events:none}
.mountains.m-1{height:44%;background:radial-gradient(120% 80% at 0% 100%,var(--ridge1) 0 60%,transparent 61%),radial-gradient(160% 90% at 50% 100%,var(--ridge1) 0 62%,transparent 63%),radial-gradient(120% 90% at 100% 100%,var(--ridge1) 0 60%,transparent 61%);opacity:.9;transform:translateY(2%);animation:ridge-drift-1 60s ease-in-out infinite}
.mountains.m-2{height:50%;background:radial-gradient(140% 100% at 10% 100%,var(--ridge2) 0 63%,transparent 64%),radial-gradient(140% 110% at 80% 100%,var(--ridge2) 0 65%,transparent 66%);opacity:.85;transform:translateY(0);animation:ridge-drift-2 70s ease-in-out infinite}
@keyframes ridge-drift-1{0%,100%{transform:translateY(2%) translateX(0)}50%{transform:translateY(1%) translateX(-1%)}}
@keyframes ridge-drift-2{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-1%) translateX(1%)}}

.forest{position:absolute;inset:auto 0 0 0;height:36%;background:radial-gradient(130% 120% at 10% 100%,var(--forest) 0 64%,transparent 65%),radial-gradient(130% 120% at 50% 100%,var(--forest) 0 64%,transparent 65%),radial-gradient(130% 120% at 90% 100%,var(--forest) 0 64%,transparent 65%);filter:drop-shadow(0 -6px 12px rgba(0,0,0,.25));will-change:transform;transform:translateZ(0)}

.clouds{position:absolute;inset:0;pointer-events:none}
.cloud{position:absolute;top:10%;width:180px;height:70px;border-radius:60px;background:radial-gradient(60% 80% at 30% 50%,rgba(255,255,255,.9),rgba(255,255,255,.5) 70%,transparent 71%),radial-gradient(60% 80% at 60% 60%,rgba(255,255,255,.85),rgba(255,255,255,.4) 70%,transparent 71%),radial-gradient(60% 80% at 80% 40%,rgba(255,255,255,.75),rgba(255,255,255,.35) 70%,transparent 71%);filter:blur(.6px);animation:cloud-drift 64s linear infinite}
.cloud.c-1{left:10%;animation-duration:56s}.cloud.c-2{left:35%;top:18%;animation-duration:62s}.cloud.c-3{left:58%;top:12%;animation-duration:70s}.cloud.c-4{left:78%;top:20%;animation-duration:66s}.cloud.c-5{left:5%;top:24%;animation-duration:72s}
@keyframes cloud-drift{0%{transform:translateX(-6%)}100%{transform:translateX(6%)}}

.lanterns{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen}
.lantern{position:absolute;width:6px;height:6px;border-radius:50%;background:radial-gradient(circle,var(--glow),transparent 60%);opacity:0;animation:float-up 8s ease-in-out infinite}
.l-1{left:14%;bottom:14%;animation-delay:.2s}.l-2{left:22%;bottom:10%;animation-delay:.8s}.l-3{left:32%;bottom:16%;animation-delay:1.4s}.l-4{left:46%;bottom:11%;animation-delay:2.1s}.l-5{left:58%;bottom:12%;animation-delay:2.7s}.l-6{left:68%;bottom:9%;animation-delay:3.3s}.l-7{left:78%;bottom:15%;animation-delay:3.9s}.l-8{left:86%;bottom:12%;animation-delay:4.4s}
@keyframes float-up{0%{transform:translateY(0) scale(.8);opacity:0}15%{opacity:.7}50%{transform:translateY(-24px) scale(1)}85%{opacity:.7}100%{transform:translateY(-40px) scale(.9);opacity:0}}

.welcome-caption{position:relative;z-index:10;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.24)}
@media (max-width:720px){.cloud{width:130px;height:52px}.lantern{display:none}}
${STYLE_MARK_END}
`;

async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function writeFileRelative(rel, content) {
  const filePath = path.join(root, rel);
  await ensureDir(filePath);
  await fs.writeFile(filePath, content, 'utf8');
  console.log(`✔ wrote ${rel}`);
}

async function appendStyles() {
  const rel = 'src/styles/global.css';
  const filePath = path.join(root, rel);
  await ensureDir(filePath);
  let existing = '';
  try {
    existing = await fs.readFile(filePath, 'utf8');
  } catch {
    // file may not exist yet
  }
  if (existing.includes(STYLE_MARK_START)) {
    console.log(`• styles already present in ${rel}`);
    return;
  }
  const next = existing + (existing.endsWith('\n') ? '' : '\n') + stylesAppend;
  await fs.writeFile(filePath, next, 'utf8');
  console.log(`✔ appended Ghibli C+ styles to ${rel}`);
}

async function main() {
  for (const f of files) {
    await writeFileRelative(f.path, f.content);
  }
  await appendStyles();
  console.log('All patches applied. Commit and push to trigger Netlify.');
}

main().catch(err => {
  console.error('Patch script failed:', err);
  process.exit(1);
});
