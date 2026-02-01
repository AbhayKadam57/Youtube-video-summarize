import { useState } from "react";
import axios from "axios";
import "./App.css";
// Note: App.css can be kept minimal or removed if index.css handles everything,
// but we'll import it just in case generated setup needs it.
// Actually, let's rely on index.css for the main styles I defined.

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      // Use production URL if in production, otherwise localhost
      // You can also use explicit environment variables if preferred
      const API_BASE_URL = import.meta.env.DEV
        ? "http://localhost:3000"
        : "https://youtube-video-summarize.onrender.com";

      const response = await axios.post(`${API_BASE_URL}/api/summrize`, {
        url: url,
      });

      if (response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setError("No summary returned from server.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.details ||
          "Failed to fetch summary. Check console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>YouTube Summarizer</h1>

      <div className="main-layout">
        {/* Left Panel: Input & Controls */}
        <div className="left-panel">
          <div className="card">
            <p
              style={{
                marginBottom: "1.5rem",
                color: "#aaa",
                fontSize: "0.95rem",
              }}
            >
              Paste a YouTube URL to generate a comprehensive AI summary.
            </p>

            <form onSubmit={handleSubmit} className="input-group">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button type="submit" disabled={loading || !url}>
                {loading ? (
                  <>
                    <span className="loader"></span> Generating...
                  </>
                ) : (
                  "Summarize Video"
                )}
              </button>
            </form>

            {error && (
              <div className="error-message">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="right-panel">
          {summary ? (
            <div className="summary-container">
              <h2>Video Summary</h2>
              <div className="markdown-body" style={{ whiteSpace: "pre-wrap" }}>
                {summary}
              </div>
            </div>
          ) : (
            // Optional: Placeholder state when empty, or just render nothing
            // Render empty div to maintain layout if needed, or conditional.
            // Let's render a faint placeholder hint if desired, or keep clean.
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                opacity: 0.3,
                border: "2px dashed #444",
                borderRadius: "16px",
              }}
            >
              <p>Summary will appear here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
