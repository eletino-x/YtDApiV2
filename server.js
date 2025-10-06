import express from "express";
import ytdl from "ytdl-core";

const app = express();

app.get("/", (req, res) => {
  res.send("✅ YouTube Download API läuft!");
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  const type = req.query.type || "video";

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send("❌ Bitte gültige YouTube-URL angeben");
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "_");
    res.header(
      "Content-Disposition",
      `attachment; filename="${title}.${type === "audio" ? "mp3" : "mp4"}"`
    );

    const format = type === "audio" ? { filter: "audioonly" } : { quality: "highestvideo" };
    ytdl(url, format).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("⚠️ Fehler beim Download" + err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
