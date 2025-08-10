import React, { useState, useEffect } from "react";
import { englishVoiceData } from "./voiceData";
import { motion } from "framer-motion";
import "./App.css";

const VoiceSelector = () => {
  const engines = Object.keys(englishVoiceData);
  const [engine, setEngine] = useState(engines[0]);
  const [language, setLanguage] = useState("");
  const [voice, setVoice] = useState("");
  const [gender, setGender] = useState("");
  const [text, setText] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    const firstLang = englishVoiceData[engine].available_languages[0];
    setLanguage(firstLang);
    const firstVoice = englishVoiceData[engine].voices[firstLang][0];
    setVoice(firstVoice.name);
    setGender(firstVoice.gender);
  }, [engine]);

  useEffect(() => {
    const voices = englishVoiceData[engine].voices[language];
    if (voices && voices.length > 0) {
      setVoice(voices[0].name);
      setGender(voices[0].gender);
    } else {
      setVoice("");
      setGender("");
    }
  }, [language]);

  const handleVoiceChange = (e) => {
    const selectedVoice = englishVoiceData[engine].voices[language].find(v => v.name === e.target.value);
    setVoice(selectedVoice.name);
    setGender(selectedVoice.gender);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text.");
      return;
    }

    const payload = {
      text,
      voiceId: voice,
      engine: engine === "neural" ? "neural" : "standard"
    };

    try {
      const response = await fetch("http://localhost:5000/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setResultMessage(`http://localhost:5000${result.audioUrl}`);
      } else {
        setResultMessage(`⚠️ Error: ${result.error || "Unknown error occurred"}`);
      }
    } catch (error) {
      setResultMessage(`❌ Request failed: ${error.message}`);
    }
  };

  return (
    <motion.div className="voice-selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="header">
        <h1>🎙️ Text to Speech Converter </h1>
        <p>Choose your preferred English accent and voice</p>
      </div>

      <div className="selection-panel">
        <div className="form-group">
          <label>Engine Type</label>
          <select value={engine} onChange={(e) => setEngine(e.target.value)}>
            {engines.map((eng) => (
              <option key={eng} value={eng}>
                {eng.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>English Accent</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {englishVoiceData[engine].available_languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Voice</label>
          <select value={voice} onChange={handleVoiceChange}>
            {englishVoiceData[engine].voices[language]?.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.gender})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Enter Text</label>
          <textarea
            rows="4"
            placeholder="Type something to speak..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-input"
          />
        </div>

        <div className="form-group">
          <button className="submit-button" onClick={handleSubmit}>
            Submit to Backend
          </button>
        </div>
      </div>

      <motion.div className="summary-card" initial={{ y: 20 }} animate={{ y: 0 }}>
        <h3>Selected Configuration</h3>
        <div className="summary-details">
          <div className="summary-item">
            <span className="label">Engine:</span>
            <span className="value">{engine.replace(/_/g, " ").toUpperCase()}</span>
          </div>
          <div className="summary-item">
            <span className="label">Accent:</span>
            <span className="value">{language}</span>
          </div>
          <div className="summary-item">
            <span className="label">Voice:</span>
            <span className="value">{voice}</span>
          </div>
          <div className="summary-item">
            <span className="label">Gender:</span>
            <span className="value">{gender}</span>
          </div>
        </div>
      </motion.div>

      {/* Result Message */}
      {resultMessage && (
        <motion.div className="result-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          
          <a href={`${resultMessage}`}> Click here to play the audio </a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VoiceSelector;
