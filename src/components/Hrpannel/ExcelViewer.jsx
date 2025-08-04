import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ExcelViewer = ({ fileUrl }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setData(jsonData);
      } catch (err) {
        console.error("Failed to load Excel file", err);
      }
    };

    loadExcel();
  }, [fileUrl]);

  if (!data.length) return <p>No Excel data to display.</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell?.toString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelViewer;
