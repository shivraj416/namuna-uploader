import React, { useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function UploadModal({
  show,
  onClose,
  year,
  namuna,
  apiBase,
  onUploaded,
}) {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const { getToken } = useAuth();

  if (!show) return null;

  // -------------------------------------------------
  // Preview File Before Upload
  // -------------------------------------------------
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (!selected) {
      setPreviewURL(null);
      return;
    }

    if (selected.type.startsWith("image/")) {
      setPreviewURL(URL.createObjectURL(selected));
    } else {
      setPreviewURL(null); // For PDF / other files
    }
  };

  // -------------------------------------------------
  // Upload FUNCTION WITH PROGRESS
  // -------------------------------------------------
  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const token = await getToken();

    const fd = new FormData();
    fd.append("file", file);
    fd.append("year", year);
    fd.append("namuna", namuna);

    // -------------------------------
    // XMLHttpRequest → supports progress events
    // -------------------------------
    const xhr = new XMLHttpRequest();

    xhr.open("POST", `${apiBase}/api/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setLoading(false);

      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);

          if (res?.url && res?.public_id) {
            if (onUploaded) onUploaded(res);
            onClose();
          } else {
            alert("Upload failed: Invalid server response");
          }
        } catch (err) {
          alert("Upload failed: Could not parse server response");
        }
      } else {
        alert("Upload failed: " + xhr.statusText);
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      alert("Network error during upload.");
    };

    xhr.send(fd);
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-sm modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">
              Upload — Namuna {namuna} ({year})
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={submit}>
            <div className="modal-body">

              {/* File Input */}
              <input
                ref={inputRef}
                type="file"
                className="form-control mb-2"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                disabled={loading}
              />

              {/* File Preview */}
              {previewURL && (
                <div className="text-center mb-2">
                  <img
                    src={previewURL}
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "180px",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              )}

              {/* PDF Preview Box */}
              {file && !file.type.startsWith("image/") && (
                <div
                  className="text-center p-3 border rounded"
                  style={{ background: "#f8f9fa" }}
                >
                  📄 PDF Selected  
                </div>
              )}

              {/* Progress Bar */}
              {loading && (
                <div className="progress mt-2">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    style={{ width: `${progress}%` }}
                  >
                    {progress}%
                  </div>
                </div>
              )}

              <small className="text-muted d-block mt-2">
                Allowed: Images and PDFs • Max size ~50MB
              </small>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
