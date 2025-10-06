const express = require("express");
const ytdl = require("ytdl-core");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Statische Dateien bereitstellen
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));

// Startseite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// API-Endpunkt zum Generieren des Download-Links
app.get("/download", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) {
    return res.status(400).send("Fehler: Keine URL angegeben!");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");
    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
    ytdl(videoURL, { format: "mp4" }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Fehler beim Verarbeiten der URL.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
