const fs = require("fs");
const path = require("path");
const { SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");
const { pollyClient } = require("../config/pollyClient.cjs");

 const synthesizeSpeech = async (req, res) => {
  const { text, voiceId, engine } = req.body;

  if (!text || !voiceId || !engine) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  console.log(text, voiceId, engine);
  const params = {
    OutputFormat: "mp3",
    Text: text,
    VoiceId: voiceId,
    Engine: engine,
    TextType: "text"
  };

  try {
    const command = new SynthesizeSpeechCommand(params);
    const data = await pollyClient.send(command);

    const fileName = `${Date.now()}-${voiceId}.mp3`;
    const filePath = path.join("output", fileName);

    fs.mkdirSync("output", { recursive: true });

    const writeStream = fs.createWriteStream(filePath);
    data.AudioStream.pipe(writeStream);

    writeStream.on("finish", () => {
      res.json({ success: true, audioUrl: `/audio/${fileName}` });
    });
  } catch (error) {
    console.error("Polly error:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { synthesizeSpeech };