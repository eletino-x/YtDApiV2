// ============================
//  YouTube Downloader Server
//  Kompatibel mit Render (Okt 2025)
// ============================

const express = require("express");
const path = require("path");
const ytdl = require("@distube/ytdl-core");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));

// --- Startseite ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// --- Download-Route ---
app.get("/download", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).send("Fehler: Keine URL angegeben!");

  try {
    // Video-Informationen abrufen
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "_");

    // Header setzen, um Download zu starten
    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);

    // Stream starten (mit User-Agent gegen 410-Fehler)
    ytdl(videoURL, {
      format: "mp4",
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      }
    }).pipe(res);

  } catch (err) {
    console.error("❌ Fehler beim Download:", err);
    res.status(500).send("Fehler beim Verarbeiten der URL oder Video nicht verfügbar.");
  }
});

// --- Server starten ---
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
