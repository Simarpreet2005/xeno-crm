import { useState } from "react";
import api from "../services/api";

function AIStudio() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const generate = async () => {
    setResult(null);
    setSaved(false);
    setSaveError("");
    const res = await api.post(
      "/ai/generate",
      {
        prompt,
      }
    );

    setResult(res.data);
  };

  const saveCampaign = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      await api.post("/campaigns", {
        name: result.segmentName,
        segmentPrompt: prompt,
        channel: result.channel,
        message: result.message,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error("Error saving campaign:", err);
      setSaveError("Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "left" }}>
      <h2 style={{ marginBottom: "20px" }}>AI Campaign Generator</h2>

      <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
        <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", color: "var(--text)" }}>
          Describe the audience segment you want to target (e.g. "Customers with spending above 15000")
        </label>
        <textarea
          rows="4"
          placeholder="Enter prompt for audience segment generation..."
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg)",
            color: "var(--text-h)",
            boxSizing: "border-box",
            fontSize: "16px",
            fontFamily: "inherit",
            marginBottom: "15px"
          }}
        />

        <button 
          onClick={generate}
          style={{
            backgroundColor: "var(--text-h)",
            color: "var(--bg)",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Generate Campaign
        </button>
      </div>

      {result && (
        <div className="card" style={{ padding: "24px", maxWidth: "600px" }}>
          <h3 style={{ marginTop: 0, color: "var(--text-h)", marginBottom: "15px" }}>{result.segmentName}</h3>
          
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "var(--text)", textTransform: "uppercase" }}>Audience Size</span>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-h)" }}>{result.audienceSize}</div>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "var(--text)", textTransform: "uppercase" }}>Channel</span>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--accent)" }}>{result.channel}</div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: "var(--code-bg)",
            padding: "15px",
            borderRadius: "6px",
            color: "var(--text-h)",
            marginBottom: "20px",
            lineHeight: "1.5"
          }}>
            {result.message}
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button 
              onClick={saveCampaign}
              disabled={saving}
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? "Saving..." : "Save Campaign"}
            </button>

            {saved && (
              <span style={{ color: "#10b981", fontSize: "14px", fontWeight: "500" }}>
                ✓ Saved successfully!
              </span>
            )}

            {saveError && (
              <span style={{ color: "#ef4444", fontSize: "14px", fontWeight: "500" }}>
                ✗ {saveError}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIStudio;