import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UploadModal from "./UploadModal";
import { NAMUNA_MAP } from "./NamunaSlot"; // ✅ import NAMUNA_MAP

export default function NamunaPage({ apiBase }) {
  const { year, id } = useParams();
  const decodedYear = decodeURIComponent(year);

  const [namunaData, setNamunaData] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    if (!decodedYear || !id) return;

    const fetchNamuna = async () => {
      try {
        const encodedYear = encodeURIComponent(decodedYear);
        const res = await fetch(`${apiBase}/api/namuna/${encodedYear}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch Namuna data");
        const data = await res.json();
        setNamunaData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNamuna();
  }, [decodedYear, id, apiBase]);

  const handleDelete = async (file) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(`${apiBase}/api/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: file.public_id,
          year: decodedYear,
          namuna: id,
          resource_type: file.raw?.resource_type || "image",
        }),
      });
      const result = await res.json();
      if (result.success) {
        setNamunaData((prev) =>
          prev.filter((f) => f.public_id !== file.public_id)
        );
      } else {
        alert("Failed to delete file");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting file");
    }
  };

  const handlePrint = (file) => {
    const printWindow = window.open(file.url, "_blank");
    printWindow.focus();
    printWindow.print();
  };

  if (!decodedYear || !id) return <p>Invalid Namuna URL</p>;

  const displayName = NAMUNA_MAP[String(id)] || `Namuna ${id}`;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-primary">
        Namuna Details: {decodedYear} / {displayName}
      </h2>

      <button
        className="btn btn-primary mb-4"
        onClick={() => setShowUpload(true)}
      >
        Upload File
      </button>

      <UploadModal
        show={showUpload}
        onClose={() => setShowUpload(false)}
        apiBase={apiBase}
        year={decodedYear}
        namuna={id}
        onUploaded={(newFile) => setNamunaData((prev) => [...prev, newFile])}
      />

      {loading ? (
        <p>Loading files...</p>
      ) : namunaData.length === 0 ? (
        <div className="alert alert-secondary text-center">
          Please Upload Images or PDFs here.
        </div>
      ) : (
        <div className="row">
          {namunaData.map((file) => {
            if (!["image", "raw"].includes(file.raw?.resource_type) &&
                file.raw?.format !== "pdf") return null;

            return (
              <div
                key={file.public_id || file.id}
                className="col-6 col-md-4 col-lg-3 mb-3"
              >
                <div className="card shadow-sm h-100">
                  {file.raw?.resource_type === "image" ? (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        cursor: "pointer",
                        padding: "3px",
                      }}
                      onClick={() => setPreviewFile(file)}
                    >
                      <img
                        src={file.url}
                        alt="uploaded"
                        style={{
                          width: "80%",
                          height: "auto",
                          maxHeight: "150px",
                          objectFit: "contain",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center p-2"
                      style={{
                        width: "100%",
                        height: "120px",
                        background: "#f8f9fa",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                      onClick={() => setPreviewFile(file)}
                    >
                      <p className="mb-0 text-center">
                        📄 PDF / File: {file.raw?.format || "unknown"}
                      </p>
                    </div>
                  )}
                  <div className="card-footer d-flex justify-content-between p-2">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(file)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
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

      {previewFile && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.8)" }}
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              maxWidth: "95vw",
              width: "95vw",
              margin: "1rem auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {previewFile.raw?.resource_type === "image"
                    ? "Image Preview"
                    : "PDF Preview"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPreviewFile(null)}
                ></button>
              </div>
              <div
                className="modal-body p-0 d-flex justify-content-center"
                style={{ maxHeight: "90vh", overflow: "auto" }}
              >
                {previewFile.raw?.resource_type === "image" ? (
                  <img
                    src={previewFile.url}
                    alt="preview"
                    style={{
                      maxHeight: "90vh",
                      maxWidth: "100%",
                      objectFit: "contain",
                      borderRadius: "5px",
                    }}
                  />
                ) : (
                  <iframe
                    src={previewFile.url}
                    title="PDF Preview"
                    style={{ height: "90vh", width: "100%", border: "none" }}
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
