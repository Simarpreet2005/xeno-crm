import { useEffect, useState } from "react";
import api from "../services/api";
import AnalyticsChart from "../components/AnalyticsChart";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  
  // Form State
  const [name, setName] = useState("");
  const [segmentPrompt, setSegmentPrompt] = useState("");
  const [channel, setChannel] = useState("EMAIL");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  // Analytics State
  const [selectedAnalytics, setSelectedAnalytics] = useState(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/campaigns");
      setCampaigns(res.data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  const launchCampaign = async (id) => {
    try {
      await api.post(`/campaigns/${id}/launch`);
      alert("Campaign launched successfully");
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      alert("Failed to launch campaign");
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!name || !segmentPrompt || !message) {
      setFormError("All fields are required.");
      return;
    }

    try {
      await api.post("/campaigns", {
        name,
        segmentPrompt,
        channel,
        message,
      });

      setSuccessMessage("Campaign created successfully!");
      setName("");
      setSegmentPrompt("");
      setChannel("EMAIL");
      setMessage("");

      fetchCampaigns();

      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (err) {
      console.error("Error creating campaign:", err);
      setFormError("Failed to create campaign.");
    }
  };

  const viewAnalytics = async (campaign) => {
    setSelectedCampaignName(campaign.name);
    try {
      const res = await api.get(`/campaigns/${campaign.id}/analytics`);
      setSelectedAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      alert("Failed to fetch campaign analytics.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "left" }}>
      <h2 style={{ marginBottom: "24px" }}>Campaigns</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "30px",
        alignItems: "start"
      }}>
        {/* Creation Form */}
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "var(--text-h)" }}>Create New Campaign</h3>
          
          {successMessage && (
            <div style={{
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "14px",
              border: "1px solid rgba(16, 185, 129, 0.3)"
            }}>
              {successMessage}
            </div>
          )}

          {formError && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "14px",
              border: "1px solid rgba(239, 68, 68, 0.3)"
            }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateCampaign} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "var(--text-h)" }}>
                Campaign Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Win Back Dormant Users"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text-h)",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "var(--text-h)" }}>
                Segment Prompt
              </label>
              <textarea
                value={segmentPrompt}
                onChange={(e) => setSegmentPrompt(e.target.value)}
                placeholder="e.g. Customers who spent over 5000 and haven't ordered in 60 days"
                rows="3"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text-h)",
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "var(--text-h)" }}>
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text-h)",
                  boxSizing: "border-box"
                }}
              >
                <option value="EMAIL">EMAIL</option>
                <option value="WHATSAPP">WHATSAPP</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "var(--text-h)" }}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. We miss you! Enjoy 15% off."
                rows="3"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text-h)",
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "opacity 0.2s",
                marginTop: "10px"
              }}
            >
              Create Campaign
            </button>
          </form>
        </div>

        {/* Campaign List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "5px", color: "var(--text-h)" }}>Active Campaigns</h3>
          {campaigns.length === 0 ? (
            <p style={{ color: "var(--text)" }}>No campaigns created yet.</p>
          ) : (
            campaigns.map((c) => (
              <div
                key={c.id}
                className="card"
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontSize: "18px", color: "var(--text-h)" }}>{c.name}</h4>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    backgroundColor: "var(--accent-bg)",
                    color: "var(--accent)",
                    border: "1px solid var(--accent-border)"
                  }}>
                    {c.channel}
                  </span>
                </div>
                
                <p style={{ fontSize: "14px", color: "var(--text)" }}>
                  <strong>Prompt:</strong> {c.segmentPrompt}
                </p>
                
                <p style={{ fontSize: "15px", backgroundColor: "var(--code-bg)", padding: "10px", borderRadius: "6px", color: "var(--text-h)" }}>
                  {c.message}
                </p>

                <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                  <button
                    onClick={() => launchCampaign(c.id)}
                    style={{
                      backgroundColor: "var(--text-h)",
                      color: "var(--bg)",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Launch
                  </button>
                  
                  <button
                    onClick={() => viewAnalytics(c)}
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--text-h)",
                      border: "1px solid var(--border)",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Analytics Modal */}
      {selectedAnalytics && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div className="card" style={{
            backgroundColor: "var(--bg)",
            padding: "24px",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "var(--shadow)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "var(--text-h)" }}>{selectedCampaignName} Analytics</h3>
              <button
                onClick={() => setSelectedAnalytics(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "var(--text)",
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div style={{ padding: "10px", background: "var(--code-bg)", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text)", textTransform: "uppercase" }}>Total Sent</span>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--text-h)" }}>{selectedAnalytics.total}</div>
              </div>
              <div style={{ padding: "10px", background: "var(--code-bg)", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text)", textTransform: "uppercase" }}>Delivered</span>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--text-h)" }}>{selectedAnalytics.delivered}</div>
              </div>
            </div>

            <AnalyticsChart analytics={selectedAnalytics} />

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                onClick={() => setSelectedAnalytics(null)}
                style={{
                  backgroundColor: "var(--text-h)",
                  color: "var(--bg)",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;