var express = require("express");
var router = express.Router();
// 環境変数からAPIキーを取得
const apiKey = process.env.API_KEY;

/* GET users listing. */
router.get("/", async (req, res, next) => {
  // 'text' パラメータを取得
  const { text } = req.query;
  if (!text) {
    return res.status(400).send("text parameter is required");
  }

  try {
    // 外部APIを呼び出し
    const apiResponse = await fetch(
      `https://api.tts.quest/v3/voicevox/synthesis?text=${text}&speaker=3&key=${apiKey}`,
      {
        cache: "force-cache",
      },
    );
    const apiData = await apiResponse.json();

    const { mp3DownloadUrl, audioStatusUrl } = apiData;

    // URLがundefinedの場合はエラーを返す
    if (!mp3DownloadUrl || !audioStatusUrl) {
      console.log(mp3DownloadUrl, audioStatusUrl);

      return res.status(500).send("Failed to retrieve audio URLs from API.");
    }

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const statusResponse = await fetch(audioStatusUrl, {
        cache: "force-cache",
      });
      const statusJson = await statusResponse.json();

      if (statusJson.isAudioReady) break;
      if (statusJson.isAudioError) {
        return res.status(500).send("Error in generating audio");
      }
    }

    const audioResponse = await fetch(mp3DownloadUrl);
    const audioBuffer = await audioResponse.arrayBuffer(); // arrayBuffer()を使用

    // 音声ファイルを返す
    res.setHeader("Content-Type", "audio/mpeg");
    return res.send(Buffer.from(audioBuffer)); // Bufferに変換して送信
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
