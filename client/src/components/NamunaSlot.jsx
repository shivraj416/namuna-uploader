import React, { useState, useEffect } from "react";
import UploadModal from "./UploadModal";

// ✅ Mapping of namuna numbers to their actual names
export const NAMUNA_MAP = {
  "34": "namuna no 34 takrar aarj",
  "35": "namuna no 35 passbook",
  "36": "namuna no 36 labharthi",
  "37": "namuna no 37 gharbhandhakam",
  "38": "namuna no 38 sammati-pattre",
  "39": "namuna no 39 vikas-kame",
  "40": "namuna no 40 audit report",
  "41": "namuna no 41 vivah-nondh",
  "42": "namuna no 42 masik-sabha",
  "43": "namuna no 43 gram-sabha",
  "44": "namuna no 44 itar",
  "45": "namuna no 5 gramnidhi",
  "46": "namuna no 5 MRE.GS",
  "47": "namuna no 5 15 va aayog",
  "48": "namuna no 5 panipuravatha",
  "49": "namuna no 5 16 va aayog",
  "50": "namuna no 5 dalit-vasti",
  "51": "namuna no 5 itar",
  "52": "namuna no 12 gramnidhi",
  "53": "namuna no 12 MRE.GS",
  "54": "namuna no 12 15 va aayog",
  "55": "namuna no 12 panipuravatha",
  "56": "namuna no 12 16 va aayog",
  "57": "namuna no 12 dalit-vasti",
  "58": "namuna no 12 itar",
};

// ✅ Fill defaults up to 100 without overriding existing
for (let i = 1; i <= 100; i++) {
  if (!Object.prototype.hasOwnProperty.call(NAMUNA_MAP, String(i))) {
    NAMUNA_MAP[String(i)] = `namuna no ${i}`;
  }
}

export default function NamunaSlot({ year, namuna, apiBase }) {
  const [files, setFiles] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // ✅ Correct display name
  const displayName = NAMUNA_MAP[String(namuna)] || `namuna no ${namuna}`;

  // ✅ For API use raw namuna (not displayName)
  const apiNamuna = namuna;

  // Fetch files
  useEffect(() => {
    let mounted = true;
    async function fetchFiles() {
      try {
        const url = `${apiBase}/api/files?year=${encodeURIComponent(
          year
        )}&namuna=${encodeURIComponent(apiNamuna)}`;
        const res = await fetch(url);

        if (!res.ok) {
          if (mounted) setFiles([]);
          return;
        }

        const data = await res.json();
        if (mounted) setFiles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading files:", err);
        if (mounted) setFiles([]);
      }
    }

    fetchFiles();
    return () => {
      mounted = false;
    };
  }, [year, apiNamuna, apiBase]);

  const handleUploadResponse = (fileMeta) => {
    setFiles((prev) => [...prev, fileMeta]);
  };

  const handleDelete = async (file) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(`${apiBase}/api/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: file.public_id,
          year,
          namuna: apiNamuna, // ✅ send raw id, not displayName
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {}

      if (res.ok && data?.success) {
        setFiles((prev) => prev.filter((f) => f.public_id !== file.public_id));
        alert("File deleted successfully");
      } else {
        alert("Delete failed: " + (data?.error || res.statusText));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete error: " + err.message);
    }
  };

  const makeCloudinaryThumb = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("res.cloudinary.com")) {
        return url.replace("/upload/", "/upload/w_120,h_120,c_fill/");
      }
    } catch {}
    return url;
  };

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column align-items-center text-center">
        <div className="mb-2 fw-bold">{displayName}</div>

        {!files.length && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowUpload(true)}
          >
            Upload
          </button>
        )}

        {files.map((file) => {
          const isPdf =
            file.url?.toLowerCase().endsWith(".pdf") ||
            file.raw?.resource_type === "raw";
          const thumbnailUrl = isPdf ? null : makeCloudinaryThumb(file.url);

          return (
            <div key={file.public_id} className="mb-2">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={displayName}
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => setPreviewFile(file)}
                />
              ) : (
                <div
                  style={{
                    width: 90,
                    height: 90,
                    border: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setPreviewFile(file)}
                >
                  PDF
                </div>
              )}
              <div className="mt-2 d-flex gap-2 justify-content-center">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(file)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <UploadModal
        show={showUpload}
        onClose={() => setShowUpload(false)}
        year={year}
        namuna={apiNamuna} // ✅ send raw id to backend
        apiBase={apiBase}
        onUploaded={(fileMeta) => {
          handleUploadResponse(fileMeta);
          setShowUpload(false);
        }}
      />

      {previewFile && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview - {displayName}</h5>
                <button
                  className="btn-close"
                  onClick={() => setPreviewFile(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                {previewFile.url.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={previewFile.url}
                    style={{ width: "100%", height: "60vh" }}
                    title="pdf-preview"
                  />
                ) : (
                  <img
                    src={previewFile.url}
                    alt="preview"
                    style={{ maxWidth: "100%", maxHeight: "60vh" }}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setPreviewFile(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const w = window.open("", "_blank");
                    if (!w) return alert("Please allow popups to print.");
                    if (previewFile.url.toLowerCase().endsWith(".pdf"))
                      w.location.href = previewFile.url;
                    else {
                      w.document.write(
                        `<img src="${previewFile.url}" style="max-width:100%;">`
                      );
                      w.document.close();
                      w.focus();
                      w.print();
                    }
                  }}
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
