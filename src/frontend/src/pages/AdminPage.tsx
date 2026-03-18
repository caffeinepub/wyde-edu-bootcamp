import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import type { Registration } from "../backend";
import { createActorWithConfig } from "../config";

function downloadCSV(data: Registration[]) {
  const headers = [
    "Name",
    "WhatsApp",
    "Email",
    "College",
    "Course Level",
    "Referral",
    "Payment Screenshot",
    "Timestamp",
  ];
  const rows = data.map((r) => [
    r.fullName,
    r.whatsapp,
    r.email,
    r.college,
    r.courseLevel,
    r.referral,
    r.paymentScreenshot.startsWith("data:")
      ? "[image stored]"
      : r.paymentScreenshot,
    r.timestamp,
  ]);
  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${(cell || "").replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wyde_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ScreenshotCell({ value }: { value: string }) {
  const [lightbox, setLightbox] = useState(false);

  const isImage = value.startsWith("data:image") || value.startsWith("http");

  if (!isImage) {
    return <span className="text-wyde-muted text-xs">{value || "—"}</span>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="group relative block"
        title="Click to view full screenshot"
        data-ocid="admin.open_modal_button"
      >
        <img
          src={value}
          alt="Payment screenshot"
          className="max-w-full max-h-64 object-contain rounded-lg border-2 transition-all group-hover:border-[#00e676] group-hover:scale-[1.02]"
          style={{ borderColor: "rgba(0,230,118,0.35)" }}
        />
      </button>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          data-ocid="admin.modal"
        >
          {/* Backdrop close button */}
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={() => setLightbox(false)}
            onKeyDown={(e) => e.key === "Escape" && setLightbox(false)}
            aria-label="Close screenshot viewer"
            tabIndex={-1}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-2xl w-full z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={value}
              alt="Payment screenshot full"
              className="w-full rounded-2xl"
              style={{ border: "2px solid rgba(0,230,118,0.4)" }}
            />
            <div className="flex gap-3 mt-4 justify-center">
              <button
                type="button"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = value;
                  a.download = "payment_screenshot.jpg";
                  a.click();
                }}
                className="glow-btn px-5 py-2 text-sm font-bold"
                data-ocid="admin.primary_button"
              >
                ⬇ Download
              </button>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                className="px-5 py-2 text-sm font-semibold rounded-full text-wyde-muted"
                style={{
                  border: "1px solid rgba(0,230,118,0.3)",
                  background: "transparent",
                }}
                data-ocid="admin.close_button"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchRegistrations() {
    setIsLoading(true);
    setError("");
    try {
      const actor = await createActorWithConfig();
      const result = await actor.getAllRegistrations("wydeedu2026");
      if (result === null) {
        setError("Access denied. Wrong password.");
        setAuthenticated(false);
      } else {
        setRegistrations(result);
      }
    } catch {
      setError("Failed to fetch registrations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === "wydeedu2026") {
      setAuthenticated(true);
      setError("");
      await fetchRegistrations();
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    setRegistrations([]);
    setPassword("");
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 w-full max-w-sm"
        >
          <h1
            className="text-2xl font-extrabold font-display text-center mb-2"
            style={{ color: "#00e676" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-wyde-muted text-sm text-center mb-6">
            Wyde Edu — Registration Management
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-wyde-muted mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className="form-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                data-ocid="admin.input"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400" data-ocid="admin.error_state">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="glow-btn py-3 font-bold"
              data-ocid="admin.submit_button"
            >
              Login
            </button>
          </form>

          <Link
            to="/"
            className="block text-center mt-4"
            data-ocid="admin.link"
          >
            <span className="text-sm text-wyde-muted hover:text-neon transition-colors">
              ← Back to Site
            </span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl md:text-3xl font-extrabold font-display"
              style={{ color: "#00e676" }}
            >
              Admin Dashboard
            </h1>
            <p className="text-wyde-muted text-sm mt-1">
              Wyde Edu Registrations —{" "}
              {isLoading ? "Loading..." : `${registrations.length} total`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={fetchRegistrations}
              disabled={isLoading}
              className="px-5 py-2 text-sm font-semibold rounded-full"
              style={{
                border: "1px solid rgba(0,230,118,0.4)",
                background: "rgba(0,230,118,0.1)",
                color: "#00e676",
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              data-ocid="admin.secondary_button"
            >
              {isLoading ? "Refreshing..." : "↻ Refresh"}
            </button>
            <button
              type="button"
              onClick={() => downloadCSV(registrations)}
              className="glow-btn px-5 py-2 text-sm font-bold"
              data-ocid="admin.primary_button"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-5 py-2 text-sm font-semibold rounded-full text-wyde-muted"
              style={{
                border: "1px solid rgba(0,230,118,0.3)",
                background: "transparent",
              }}
              data-ocid="admin.cancel_button"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading ? (
          <div
            className="glass-card p-10 text-center"
            data-ocid="admin.loading_state"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="inline-block text-3xl mb-3"
            >
              ⟳
            </motion.div>
            <p className="text-wyde-muted">
              Loading registrations from database...
            </p>
          </div>
        ) : registrations.length === 0 ? (
          <div
            className="glass-card p-10 text-center"
            data-ocid="admin.empty_state"
          >
            <p className="text-3xl mb-3">📋</p>
            <p className="text-wyde-muted">No registrations yet.</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden" data-ocid="admin.table">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(0,230,118,0.2)",
                      background: "rgba(0,230,118,0.05)",
                    }}
                  >
                    {[
                      "#",
                      "Name",
                      "WhatsApp",
                      "Email",
                      "College",
                      "Course",
                      "Referral",
                      "Screenshot",
                      "Timestamp",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-wyde-muted whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r, i) => (
                    <tr
                      key={`reg-${r.timestamp}-${i}`}
                      style={{
                        borderBottom:
                          i < registrations.length - 1
                            ? "1px solid rgba(0,230,118,0.1)"
                            : "none",
                      }}
                      className="hover:bg-[rgba(0,230,118,0.03)] transition-colors"
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-wyde-muted">{i + 1}</td>
                      <td className="px-4 py-3 text-wyde-text font-medium whitespace-nowrap">
                        {r.fullName}
                      </td>
                      <td className="px-4 py-3 text-wyde-muted whitespace-nowrap">
                        {r.whatsapp}
                      </td>
                      <td className="px-4 py-3 text-wyde-muted whitespace-nowrap">
                        {r.email}
                      </td>
                      <td className="px-4 py-3 text-wyde-muted max-w-[200px] truncate">
                        {r.college}
                      </td>
                      <td className="px-4 py-3 text-wyde-muted whitespace-nowrap">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: "rgba(0,230,118,0.12)",
                            color: "#00e676",
                          }}
                        >
                          {r.courseLevel || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-wyde-muted whitespace-nowrap">
                        {r.referral || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <ScreenshotCell value={r.paymentScreenshot} />
                      </td>
                      <td className="px-4 py-3 text-wyde-muted whitespace-nowrap text-xs">
                        {new Date(r.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" data-ocid="admin.link">
            <span className="text-sm text-wyde-muted hover:text-neon transition-colors">
              ← Back to Site
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
