const fs = require("fs");

// === Dateien im Repo ===
const INPUT = "output/plutotv_de.m3u8";
const OUTPUT = "plutotv_de_custom.m3u8";

// === RAW CDN Basis ===
const LOGO_BASE = "https://raw.githubusercontent.com/calvinklein97/Pluto-TV-Playlists/main/PlutoLogos/";

// Cache-Buster (optional)
const CACHE = Date.now();

let content = fs.readFileSync(INPUT, "utf8");

let lines = content.split("\n");

let newLines = lines.map(line => {
  if (!line.startsWith("#EXTINF")) return line;

  // Kanalname extrahieren
  let name = line.substring(line.lastIndexOf(",") + 1).trim();

  // iOS-Dateiform (wichtig für deine Logos)
  name = name.normalize("NFD");

  // verbotene Zeichen entfernen
  let fileSafe = name.replace(/[\\/:*?"<>|]/g, "");

  // URL-encode
  let encoded = encodeURIComponent(fileSafe);

  // RAW CDN Link
  let newLogo = `${LOGO_BASE}${encoded}.png?v=${CACHE}`;

  return line.replace(/tvg-logo="[^"]*"/, `tvg-logo="${newLogo}"`);
});

fs.writeFileSync(OUTPUT, newLines.join("\n"));

console.log("M3U erfolgreich erstellt:", OUTPUT);
