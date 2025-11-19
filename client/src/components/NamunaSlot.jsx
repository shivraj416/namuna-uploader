import React, { useState, useEffect, useCallback } from "react";
import UploadModal from "./UploadModal";
import { NAMUNA_MAP } from "../constants/namunaMap";

export default function NamunaSlot({ year, namuna, apiBase }) {
  const [files, setFiles] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const decodedYear = decodeURIComponent(year);
  const displayName = NAMUNA_MAP[String(namuna)] || `Namuna ${namuna}`;

  const loadFiles = useCallback(async () => {
    try {
      const encYear = encodeURIComponent(decodedYear);
      const res = await fetch(`${apiBase}/api/namuna/${encYear}/${namuna}`, {
        cache: "no-store",
      });

      const data = res.ok ? await res.json() : [];
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setFiles([]);
    }
  }, [decodedYear, namuna, apiBase]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleDelete = async (file) => {
    if (!window.confirm("Delete this file?")) return;

    setFiles((prev) => prev.filter((f) => f.public_id !== file.public_id));

    try {
      const res = await fetch(`${apiBase}/api/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: file.public_id,
          year: decodedYear,
          namuna,
        }),
      });

      const data = await res.json();
      if (!data.success) loadFiles();
    } catch {
      loadFiles();
    }
  };

  const makeThumb = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("cloudinary"))
        return url.replace("/upload/", "/upload/w_150,h_150,c_fill,q_70/");
    } catch {}
    return url;
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body text-center">
        <div className="fw-bold mb-2">{displayName}</div>

        {/* Upload button */}
        {!files.length && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowUpload(true)}
          >
            Upload
          </button>
        )}

        {/* Thumbnails */}
        {files.map((file) => {
          const isPdf =
            file.raw?.format === "pdf" ||
            file.url.toLowerCase().endsWith(".pdf");

          return (
            <div key={file.public_id} className="mb-3">
              <div
                onClick={() => setPreviewFile(file)}
                style={{
                  width: 90,
                  height: 90,
                  background: "#f8f9fa",
                  borderRadius: 4,
                  cursor: "pointer",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isPdf ? (
                  <span className="fw-bold">PDF</span>
                ) : (
                  <img
                    src={makeThumb(file.url)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>

              {/* Delete Button */}
              <button
                className="btn btn-danger btn-sm w-100 mt-2"
                onClick={() => handleDelete(file)}
              >
                Delete
              </button>
            </div>
          );
        })}

      </div>

      {/* Upload Modal */}
      <UploadModal
        show={showUpload}
        onClose={() => setShowUpload(false)}
        apiBase={apiBase}
        year={decodedYear}
        namuna={namuna}
        onUploaded={(file) => {
          setFiles((prev) => [file, ...prev]);
          setShowUpload(false);
        }}
      />

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5>Preview - {displayName}</h5>
                <button className="btn-close" onClick={() => setPreviewFile(null)} />
              </div>

              <div className="modal-body text-center p-0">
                {previewFile.raw?.format === "pdf" ? (
                  <iframe
                    src={previewFile.url}
                    style={{ width: "100%", height: "70vh" }}
                  />
                ) : (
                  <img
                    src={previewFile.url}
                    style={{ maxWidth: "100%", maxHeight: "70vh" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
