import { useEffect, useState } from "react";
import api from "../services/api";
import AnalyticsChart from "../components/AnalyticsChart";

function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const res = await api.get("/campaigns");
      setCampaigns(res.data);
      if (res.data.length > 0) {
        setSelectedCampaignId(res.data[0].id);
        loadAnalytics(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to load campaigns", err);
      setError("Failed to load campaigns.");
    }
  };

  const loadAnalytics = async (campaignId) => {
    if (!campaignId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/campaigns/${campaignId}/analytics`);
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics for the selected campaign.");
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignChange = (e) => {
    const campaignId = e.target.value;
    setSelectedCampaignId(campaignId);
    loadAnalytics(campaignId);
  };

  return (
    <div style={{ padding: "20px", textAlign: "left" }}>
      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

      {/* Campaign Selection Dropdown */}
      {campaigns.length > 0 ? (
        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "var(--text-h)" }}>
            Select Campaign to View Analytics
          </label>
          <select
            value={selectedCampaignId}
            onChange={handleCampaignChange}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg)",
              color: "var(--text-h)",
              width: "100%",
              maxWidth: "400px"
            }}
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.channel})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p style={{ color: "var(--text)", marginBottom: "20px" }}>No campaigns available. Create one to see analytics.</p>
      )}

      {error && (
        <div style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--text)" }}>Loading analytics...</p>
      ) : analytics ? (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            <div className="card" style={{ padding: "20px", borderLeft: "4px solid #6b7280" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", textTransform: "uppercase", color: "var(--text)" }}>Total Sent</h4>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-h)" }}>{analytics.total}</div>
            </div>
            <div className="card" style={{ padding: "20px", borderLeft: "4px solid #a855f7" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", textTransform: "uppercase", color: "var(--text)" }}>Delivered</h4>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-h)" }}>{analytics.delivered}</div>
            </div>
            <div className="card" style={{ padding: "20px", borderLeft: "4px solid #3b82f6" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", textTransform: "uppercase", color: "var(--text)" }}>Opened</h4>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-h)" }}>{analytics.opened}</div>
            </div>
            <div className="card" style={{ padding: "20px", borderLeft: "4px solid #10b981" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", textTransform: "uppercase", color: "var(--text)" }}>Read</h4>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-h)" }}>{analytics.read}</div>
            </div>
            <div className="card" style={{ padding: "20px", borderLeft: "4px solid #f59e0b" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", textTransform: "uppercase", color: "var(--text)" }}>Clicked</h4>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-h)" }}>{analytics.clicked}</div>
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ marginTop: 0, color: "var(--text-h)", marginBottom: "15px" }}>Delivery Funnel Visualization</h3>
            <AnalyticsChart analytics={analytics} />
          </div>
        </>
      ) : (
        selectedCampaignId && <p style={{ color: "var(--text)" }}>No analytics data returned for this campaign.</p>
      )}
    </div>
  );
}

export default Dashboard;