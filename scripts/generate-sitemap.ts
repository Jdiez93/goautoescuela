// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://campusready2go.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/home", changefreq: "weekly", priority: "0.9" },
  { path: "/centro-estudios", changefreq: "monthly", priority: "0.8" },
  { path: "/la-teorica", changefreq: "monthly", priority: "0.8" },
  { path: "/las-practicas", changefreq: "monthly", priority: "0.8" },
  { path: "/autoescuela-online", changefreq: "monthly", priority: "0.8" },
  { path: "/autoescuelas-ready2go/villanueva-del-pardillo", changefreq: "monthly", priority: "0.8" },
  { path: "/autoescuelas-ready2go/valdemorillo", changefreq: "monthly", priority: "0.8" },
  { path: "/actualidad", changefreq: "monthly", priority: "0.7" },
  { path: "/consejos", changefreq: "monthly", priority: "0.6" },
  { path: "/matriculate", changefreq: "monthly", priority: "0.7" },
  { path: "/login", changefreq: "yearly", priority: "0.3" },
  { path: "/registro", changefreq: "yearly", priority: "0.4" },
  { path: "/politica-privacidad", changefreq: "yearly", priority: "0.2" },
  { path: "/aviso-legal", changefreq: "yearly", priority: "0.2" },
  { path: "/condiciones-contratacion", changefreq: "yearly", priority: "0.2" },
  { path: "/cookies", changefreq: "yearly", priority: "0.2" },
];

function generateSitemap(list: SitemapEntry[]) {
  const urls = list.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
