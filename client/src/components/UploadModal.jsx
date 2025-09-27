import React, { useState } from "react";

export default function UploadModal({
  show,
  onClose,
  year,
  namuna,
  apiBase,
  onUploaded,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("year", year);
    fd.append("namuna", namuna);

    try {
      const response = await fetch(`${apiBase}/api/upload`, {
        method: "POST",
        body: fd,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data?.url && data?.public_id) {
        // Send correct structure to NamunaPage
        if (onUploaded) {
          onUploaded({
            public_id: data.public_id,
            url: data.url,
            raw: { resource_type: file.type.startsWith("image") ? "image" : "raw", format: file.name.split(".").pop() },
          });
        }
        onClose();
      } else {
        alert(
          "Upload failed: " +
            (data?.error || response.statusText || "Unknown error")
        );
      }
    } catch (err) {
      setLoading(false);
      console.error("Upload error:", err);
      alert("Upload error: " + err.message);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Upload - Namuna {namuna} ({year})
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={submit}>
            <div className="modal-body">
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,.pdf"
              />
              <small className="text-muted">
                Allowed: Images and PDFs. Max size 50MB.
              </small>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
