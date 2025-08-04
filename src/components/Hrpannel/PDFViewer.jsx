import React from "react";

const PDFViewer = ({ fileUrl }) => {
  return (
    <iframe
      src={fileUrl}
      title="PDF Preview"
      width="100%"
      height="600px"
      style={{ border: "1px solid #ccc", borderRadius: "8px" }}
    />
  );
};

export default PDFViewer;
