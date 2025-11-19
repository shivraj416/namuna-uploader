import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import UploadModal from "./UploadModal";
import { NAMUNA_MAP } from "../constants/namunaMap";

export default function NamunaPage({ apiBase }) {
  const { year, id } = useParams();
  const decodedYear = decodeURIComponent(year);

  const [namunaData, setNamunaData] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  // ------------------- Fetch Data -------------------
  const fetchNamuna = useCallback(async () => {
    try {
      const enc = encodeURIComponent(decodedYear);
      const res = await fetch(`${apiBase}/api/namuna/${enc}/${id}`, {
        cache: "no-store",
      });

      const data = res.ok ? await res.json() : [];
      setNamunaData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [decodedYear, id, apiBase]);

  useEffect(() => {
    fetchNamuna();
  }, [fetchNamuna]);

  const displayName = NAMUNA_MAP[String(id)] || `Namuna ${id}`;

  // ------------------- Delete File -------------------
  const handleDelete = async (file) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    // Instant UI update
    setNamunaData((prev) => prev.filter((f) => f.public_id !== file.public_id));

    try {
      const res = await fetch(`${apiBase}/api/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: file.public_id,
          year: decodedYear,
          namuna: id,
        }),
      });

      const result = await res.json();
      if (!result.success) {
        alert("Server delete failed!");
        fetchNamuna();
      }
    } catch {
      fetchNamuna();
    }
  };

  // ------------------- Print File -------------------
  const handlePrint = (file) => {
    const win = window.open(file.url, "_blank");
    if (win) {
      win.onload = () => win.print();
    }
  };

  return (
    <div className="container py-4">
      <h2>Namuna Details: {decodedYear} / {displayName}</h2>

      <button className="btn btn-primary mb-3" onClick={() => setShowUpload(true)}>
        Upload File
      </button>

      {/* Upload Modal */}
      <UploadModal
        show={showUpload}
        onClose={() => setShowUpload(false)}
        apiBase={apiBase}
        year={decodedYear}
        namuna={id}
        onUploaded={(file) => setNamunaData((prev) => [file, ...prev])}
      />

      {loading ? (
        <p>Loading...</p>
      ) : namunaData.length === 0 ? (
        <div className="alert alert-secondary text-center">No files uploaded yet.</div>
      ) : (
        <div className="row">
          {namunaData.map((file) => {
            const isPdf = file.raw?.format === "pdf";

            return (
              <div key={file.public_id} className="col-6 col-md-4 col-lg-3 mb-3">
                <div className="card h-100 shadow-sm">

                  {/* Thumbnail */}
                  <div
                    className="p-2"
                    style={{ cursor: "pointer", height: "150px", overflow: "hidden" }}
                    onClick={() => setPreviewFile(file)}
                  >
                    {isPdf ? (
                      <p className="text-center">📄 PDF File</p>
                    ) : (
                      <img
                        src={file.url}
                        alt="file"
                        style={{ width: "100%", height: "150px", objectFit: "contain" }}
                      />
                    )}
                  </div>

                  {/* Delete + Print Buttons */}
                  <div className="card-footer d-flex gap-2 p-2">
                    <button
                      className="btn btn-danger btn-sm w-50"
                      onClick={() => handleDelete(file)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn btn-secondary btn-sm w-50"
                      onClick={() => handlePrint(file)}
                    >
                      Print
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.85)" }}
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "95vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5>Preview - {displayName}</h5>
                <button className="btn-close" onClick={() => setPreviewFile(null)} />
              </div>

              <div className="modal-body text-center" style={{ maxHeight: "90vh" }}>
                {previewFile.raw?.format === "pdf" ? (
                  <iframe
                    src={previewFile.url}
                    style={{ width: "100%", height: "80vh", border: 0 }}
                  />
                ) : (
                  <img
                    src={previewFile.url}
                    style={{ maxWidth: "100%", maxHeight: "80vh" }}
                    alt="preview"
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
