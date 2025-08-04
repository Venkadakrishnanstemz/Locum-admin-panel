// import { useParams } from "react-router-dom";
// import { fetchUserById } from "../../services/api";
// import axios from "axios";
// import { FaEye } from "react-icons/fa";
// import "./verificationdetail.css";
// import React, { useState, useEffect } from "react";

// const VerificationDetail = () => {
//   const { docId } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [previewDocId, setPreviewDocId] = useState(null);
//   const [docStatus, setDocStatus] = useState({});
//   const [finalStatus, setFinalStatus] = useState(null);
//   const [error, setError] = useState(null);
//   const [fileData, setFileData] = useState(null);
//   const [documentList, setDocumentList] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [rating, setRating] = useState(0);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const userData = await fetchUserById(docId);
//         setUser(userData || {});
//         setSpecializations([userData?.userrole?.[0]?.name || 'General Practice']);
//         setRating(userData?.rating || 0);

//         const docList = (userData.files || []).map(file => {
//           const rawTitle = file.file_name.replace(/\.[^/.]+$/, "");
//           const capitalizedTitle = rawTitle
//             .split(/[_\s-]/)
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join("") + "Document";

//           return {
//             title: capitalizedTitle,
//             file: `http://localhost:8000/media/${file.file_path}`,
//             fileName: file.file_name,
//             docid: file.id,
//           };
//         });
//         setDocumentList(docList);
//       } catch (err) {
//         setError(err.message || "Failed to load user data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadUser();
//   }, [docId]);

//   const filegetfun = (userid, docid) => {
//     const userdatasend = { userid, docid };

//     axios
//       .post("http://localhost:8000/api/users/user/docget", userdatasend)
//       .then((response) => {
//         setFileData(response.data[0]);
//         const clickedDoc = documentList.find((doc) => doc.docid === docid);
//         if (clickedDoc) {
//           setSelectedDoc(clickedDoc);
//           setPreviewDocId(docid);
//         }
//       })
//       .catch((error) => {
//         console.error("Error downloading file:", error);
//       });
//   };

//   const handleClosePreview = () => {
//     setSelectedDoc(null);
//     setFileData(null);
//     setPreviewDocId(null);
//   };

//   const allVerified = documentList.every(
//     (doc) => docStatus[doc.title]?.status === "verified"
//   );
//   const anyRejected = documentList.some(
//     (doc) => docStatus[doc.title]?.status === "rejected"
//   );

//   const submitFinalStatus = async (status) => {
//   const statusValue = status === "verified" ? 1 : status === "rejected" ? 3 : null;

//   const formData = new FormData();
//   formData.append("status", statusValue); // Ensure "status" matches your serializer field

//   try {
//     // ✅ Use correct backend route
//     await axios.put(
//       `http://localhost:8000/api/users/user/create_user/${docId}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     // 📤 Submit verification details separately
//     const payload = {
//       user_id: docId,
//       final_status: status,
//       documents: docStatus,
//     };

//     // const response = await fetch("/api/submit-verification", {
//     //   method: "POST",
//     //   headers: { "Content-Type": "application/json" },
//     //   body: JSON.stringify(payload),
//     // });

//     // const result = await response.json();
//     // console.log("Submitted:", result);

//     const updatedUser = await fetchUserById(docId);
//     setUser(updatedUser || {});
//   } catch (error) {
//     console.error("Submission failed:", error);
//     setError("Failed to update user status or submit verification");
//   }
// };


//   if (loading) return <div className="verification-detail-container">Loading...</div>;
//   if (error) return <div className="verification-detail-container">{error}</div>;
//   if (!user || !user.files || user.files.length === 0)
//     return <div className="verification-detail-container">No user data or files found</div>;

//   const {
//     name, profilePicture, id,
//     email, mobile_number, gender, date_of_birth, address, qualification,
//     experience, userrole
//   } = user;

//   const avatar = profilePicture || `https://i.pravatar.cc/150?u=${id}`;

//   return (
//     <div className="verification-detail-container">
//       {/* Profile Section */}
//       <div className="profile-section">
//         <div className="profile-left">
//           <img src={avatar} alt={`${name}'s profile`} className="profile-image" />
//           <h3 className="profile-name">{name}</h3>
          
//           {/* Specialization Section */}
//           {specializations.length > 0 && (
//             <div className="profile-specialization">
//               <h4>Specialization</h4>
//               <div className="specialization-tags">
//                 {specializations.map((spec, index) => (
//                   <span key={index} className="tag">{spec}</span>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Rating Section */}
//           <div className="profile-rating">
//             <h4>Rating</h4>
//             <div className="stars">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <span 
//                   key={star} 
//                   className={`star ${rating >= star ? 'filled' : ''}`}
//                 >
//                   ★
//                 </span>
//               ))}
//               <span className="rating-value">{rating.toFixed(1)}</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="profile-right">
//           <div className="info-tables-container">
//             <table className="info-table">
//               <tbody>
//                 <tr>
//                   <td><strong>Email:</strong></td>
//                   <td>{email}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Phone:</strong></td>
//                   <td>{mobile_number}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Gender:</strong></td>
//                   <td>{gender}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>DOB:</strong></td>
//                   <td>{date_of_birth}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <table className="info-table">
//               <tbody>
//                 <tr>
//                   <td><strong>Address:</strong></td>
//                   <td>{address}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Qualification:</strong></td>
//                   <td>{qualification}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Experience:</strong></td>
//                   <td>{experience}</td>
//                 </tr>
//                 <tr>
//                   <td><strong>Role:</strong></td>
//                   <td>{typeof userrole === 'object' ? userrole?.[0]?.name : userrole}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Document Section */}
//       <div className="doc-section">
//         <div className="final-status-bar">
//           {!finalStatus && allVerified && !anyRejected && (
//             <button className="final-verify-btn" onClick={() => {
//               setFinalStatus("verified");
//               submitFinalStatus("verified");
//             }}>
//               Submit All as Verified
//             </button>
//           )}
//           {!finalStatus && anyRejected && (
//             <button className="final-reject-btn" onClick={() => {
//               setFinalStatus("rejected");
//               submitFinalStatus("rejected");
//             }}>
//               Submit as Rejected
//             </button>
//           )}
//           {finalStatus && (
//             <div className="final-confirmation-msg">
//               <p className={`status-message ${finalStatus}`}>
//                 Final status set as <strong>{finalStatus.toUpperCase()}</strong>
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="doc-tabs">
//           {documentList.map((doc, i) => (
//             <div 
//               key={i} 
//               className={`doc-tab ${previewDocId === doc.docid ? 'active' : ''}`}
//               onClick={() => filegetfun(user.id, doc.docid)}
//             >
//               {doc.title}
//               {docStatus[doc.title]?.status === "verified" && <span className="tab-status verified">✓</span>}
//               {docStatus[doc.title]?.status === "rejected" && <span className="tab-status rejected">✗</span>}
//             </div>
//           ))}
//         </div>

//         {previewDocId && fileData && (
//           <div className="doc-preview-container">
//             <div className="preview-content">
//               {fileData.type === ".pdf" ? (
//                 <embed
//                   src={`data:application/pdf;base64,${fileData.content}`}
//                   type="application/pdf"
//                   width="100%"
//                   height="600px"
//                 />
//               ) : (
//                 <img
//                   src={`data:image/*;base64,${fileData.content}`}
//                   alt="preview"
//                   style={{ maxWidth: "100%", maxHeight: "600px" }}
//                 />
//               )}
//               <PreviewPanel
//                 doc={selectedDoc}
//                 docStatus={docStatus}
//                 setDocStatus={setDocStatus}
//                 finalStatus={finalStatus}
//                 onClose={handleClosePreview}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const PreviewPanel = ({ doc, docStatus, setDocStatus, finalStatus, onClose }) => {
//   const currentStatus = docStatus[doc.title]?.status || "";
//   const currentReason = docStatus[doc.title]?.reason || "";
//   const [localStatus, setLocalStatus] = useState(currentStatus);
//   const [rejectReason, setRejectReason] = useState(currentReason);

//   const handleVerify = () => {
//     setDocStatus(prev => ({ ...prev, [doc.title]: { status: "verified", reason: "" } }));
//     setLocalStatus("verified");
//     setRejectReason("");
//   };

//   const handleReject = () => {
//     if (!rejectReason.trim()) return;
//     setDocStatus(prev => ({ ...prev, [doc.title]: { status: "rejected", reason: rejectReason } }));
//     setLocalStatus("rejected");
//   };

//   const resetStatus = () => {
//     setLocalStatus("");
//     setRejectReason("");
//   };

//   return (
//     <div className="preview-panel">
//       <div className="preview-header">
//         <h3>{doc.title}</h3>
//         {finalStatus ? (
//           <p className={`card-status ${finalStatus}`}>
//             {finalStatus === "verified" && " All Verified"}
//             {finalStatus === "rejected" && " Final Rejected"}
//           </p>
//         ) : (
//           <>
//             {localStatus === "" && (
//               <div className="verification-actions">
//                 <button className="verify-btn" onClick={() => { handleVerify(doc.id); onClose(); }}>Verify</button>
//                 <button className="reject-btn" onClick={() => setLocalStatus("rejecting")}>Reject</button>
//               </div>
//             )}
//             {localStatus === "verified" && <p className="card-status verified">Verified</p>}
//             {localStatus === "rejected" && <p className="card-status rejected">Rejected: {rejectReason}</p>}
//             {localStatus === "rejecting" && (
//               <div className="reject-box">
//                 <textarea
//                   placeholder="Enter rejection reason"
//                   value={rejectReason}
//                   onChange={(e) => setRejectReason(e.target.value)}
//                 />
//                 <div className="reject-actions">
//                   <button onClick={() => { handleReject(); onClose(); }}>OK</button>
//                   <button onClick={() => { resetStatus(); onClose(); }}>Cancel</button>
//                 </div>
//               </div>
//             )}
//             {(localStatus === "verified" || localStatus === "rejected") && (
//               <div className="reverify">
//                 <button onClick={resetStatus}>Edit Verification</button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerificationDetail;
// TOP: Imports
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchUserById } from "../../services/api";
import "./verificationdetail.css";

// 📄 PreviewPanel Component (same as your original)
const PreviewPanel = ({ doc, docStatus, setDocStatus, finalStatus, onClose, status, reassigned, docIndex }) => {
  const currentStatus = docStatus[doc.title]?.status || "";
  const currentReason = docStatus[doc.title]?.reason || "";
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [rejectReason, setRejectReason] = useState(currentReason);

  const showButtons = () => {
    if (status === 1) return false;
    if (status === 3 && !reassigned) return false;
    if (status === 3 && reassigned && docIndex > 3) return false;
    return true;
  };

  const handleVerify = () => {
    setDocStatus((prev) => ({ ...prev, [doc.title]: { status: "verified", reason: "" } }));
    setLocalStatus("verified");
    setRejectReason("");
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    setDocStatus((prev) => ({ ...prev, [doc.title]: { status: "rejected", reason: rejectReason } }));
    setLocalStatus("rejected");
  };

  const resetStatus = () => {
    setLocalStatus("");
    setRejectReason("");
  };

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <h3>{doc.title}</h3>
        {finalStatus ? (
          <p className={`card-status ${finalStatus}`}>
            {finalStatus === "verified" && " All Verified"}
            {finalStatus === "rejected" && " Final Rejected"}
          </p>
        ) : (
          <>
            {showButtons() && localStatus === "" && (
              <div className="verification-actions">
                <button className="verify-btn" onClick={() => { handleVerify(); onClose(); }}>Verify</button>
                <button className="reject-btn" onClick={() => setLocalStatus("rejecting")}>Reject</button>
              </div>
            )}
            {localStatus === "verified" && <p className="card-status verified">Verified</p>}
            {localStatus === "rejected" && <p className="card-status rejected">Rejected: {rejectReason}</p>}
            {localStatus === "rejecting" && showButtons() && (
              <div className="reject-box">
                <textarea
                  placeholder="Enter rejection reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="reject-actions">
                  <button onClick={() => { handleReject(); onClose(); }}>OK</button>
                  <button onClick={() => { resetStatus(); onClose(); }}>Cancel</button>
                </div>
              </div>
            )}
            {showButtons() && (localStatus === "verified" || localStatus === "rejected") && (
              <div className="reverify">
                <button onClick={resetStatus}>Edit Verification</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// 🔍 Main Component
const VerificationDetail = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [previewDocId, setPreviewDocId] = useState(null);
  const [docStatus, setDocStatus] = useState({});
  const [finalStatus, setFinalStatus] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [documentList, setDocumentList] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [reassigned, setReassigned] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserById(docId);
        setUser(userData || {});
        setSpecializations([userData?.userrole?.[0]?.name || "General Practice"]);
        setRating(userData?.rating || 0);

        const docList = (userData.files || []).map((file) => {
          const rawTitle = file.file_name.replace(/\.[^/.]+$/, "");
          const capitalizedTitle =
            rawTitle
              .split(/[_\s-]/)
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join("") + "Document";

          return {
            title: capitalizedTitle,
            file: `http://192.168.60.118:8000/media/${file.file_path}`,
            fileName: file.file_name,
            docid: file.id,
          };
        });
        setDocumentList(docList);
      } catch (err) {
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [docId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClosePreview();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filegetfun = (userid, docid) => {
    axios
      .post("http://192.168.60.118:8000/api/users/user/docget", { userid, docid })
      .then((response) => {
        setFileData(response.data[0]);
        const clickedDoc = documentList.find((doc) => doc.docid === docid);
        if (clickedDoc) {
          setSelectedDoc(clickedDoc);
          setPreviewDocId(docid);
        }
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  const handleClosePreview = () => {
    setSelectedDoc(null);
    setFileData(null);
    setPreviewDocId(null);
  };

  const allVerified = documentList.every((doc) => docStatus[doc.title]?.status === "verified");
  const anyRejected = documentList.some((doc) => docStatus[doc.title]?.status === "rejected");

  const submitFinalStatus = async (status) => {
    const statusValue = status === "verified" ? 1 : 3;
    const formData = new FormData();
    formData.append("status", statusValue);

    setIsSubmitting(true);
    setSubmitProgress(0);

    const interval = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);

    try {
      await axios.put(`http://192.168.60.118:8000/api/users/user/create_user/${docId}`, formData);
      const updatedUser = await fetchUserById(docId);
      setUser(updatedUser || {});
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/hrverification");
      }, 10000);
    } catch (error) {
      console.error("Submission failed:", error);
      setError("Failed to update user status or submit verification");
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const {
    name,
    profilePicture,
    email,
    mobile_number,
    gender,
    date_of_birth,
    address,
    qualification,
    experience,
    userrole,
    status,
  } = user;

  const avatar = profilePicture ? `http://192.168.60.118:8000/media/${profilePicture}` : null;
  const firstLetter = name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="verification-detail-container">
      {/* Your existing Profile section here... */}
 <div className="profile-section">
        <div className="profile-left">
          {avatar ? (
            <img src={avatar} alt={`${name}'s profile`} className="profile-image" />
          ) : (
            <div className="fallback-avatar">{firstLetter}</div>
          )}
          <h3 className="profile-name">{name}</h3>
          {specializations.length > 0 && (
            <div className="profile-specialization">
              <h4>Specialization</h4>
              <div className="specialization-tags">
                {specializations.map((spec, index) => (
                  <span key={index} className="tag">{spec}</span>
                ))}
              </div>
            </div>
          )}
          <div className="profile-rating">
            <h4>Rating</h4>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`star ${rating >= star ? "filled" : ""}`}>★</span>
              ))}
              <span className="rating-value">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="info-tables-container">
            <table className="info-table">
              <tbody>
                <tr><td><strong>Email:</strong></td><td>{email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>{mobile_number}</td></tr>
                <tr><td><strong>Gender:</strong></td><td>{gender}</td></tr>
                <tr><td><strong>DOB:</strong></td><td>{date_of_birth}</td></tr>
              </tbody>
            </table>
            <table className="info-table">
              <tbody>
                <tr><td><strong>Address:</strong></td><td>{address}</td></tr>
                <tr><td><strong>Qualification:</strong></td><td>{qualification}</td></tr>
                <tr><td><strong>Experience:</strong></td><td>{experience}</td></tr>
                <tr><td><strong>Role:</strong></td><td>{userrole?.[0]?.name || "N/A"}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Documents Section */}
      <div className="doc-section">
        <div className="final-status-bar">
          {status === 1 && <p className="status-message completed">Already <strong>VERIFIED</strong>.</p>}
          {status === 3 && !reassigned && (
            <>
              <p className="status-message rejected">Already <strong>REJECTED</strong>.</p>
              <button className="final-verify-btn" onClick={() => setReassigned(true)}>Reassign Verification</button>
            </>
          )}
          {!finalStatus && allVerified && !anyRejected && (
            <button className="final-verify-btn" onClick={() => { setFinalStatus("verified"); submitFinalStatus("verified"); }}>Submit All as Verified</button>
          )}
          {!finalStatus && anyRejected && (
            <button className="final-reject-btn" onClick={() => { setFinalStatus("rejected"); submitFinalStatus("rejected"); }}>Submit as Rejected</button>
          )}
          {finalStatus && (
            <p className={`status-message ${finalStatus}`}>Final status: <strong>{finalStatus.toUpperCase()}</strong></p>
          )}
        </div>

        {isSubmitting && (
          <div className="submission-progress">
            <p>Submitting as {finalStatus}...</p>
            <div className="progress-bar-wrapper">
              <div className="progress-bar" style={{ width: `${submitProgress}%`, backgroundColor: finalStatus === "verified" ? "green" : "red" }} />
            </div>
          </div>
        )}

        <div className="doc-tabs">
          {documentList.map((doc, i) => (
            <div
              key={i}
              className={`doc-tab ${previewDocId === doc.docid ? "active" : ""}`}
              onClick={() => filegetfun(user.id, doc.docid)}
            >
              {doc.title}
              {docStatus[doc.title]?.status === "verified" && <span className="tab-status verified">✓</span>}
              {docStatus[doc.title]?.status === "rejected" && <span className="tab-status rejected">✗</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 📄 File Preview Modal */}
      {previewDocId && fileData && (
        <div className="modal-overlay" onClick={handleClosePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={handleClosePreview}>&times;</span>
            {fileData.type === ".pdf" ? (
              <embed
                src={`data:application/pdf;base64,${fileData.content}`}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            ) : (
              <img
                src={`data:image/*;base64,${fileData.content}`}
                alt="preview"
              />
            )}
            <PreviewPanel
              doc={selectedDoc}
              docStatus={docStatus}
              setDocStatus={setDocStatus}
              finalStatus={finalStatus}
              onClose={handleClosePreview}
              status={status}
              reassigned={reassigned}
              docIndex={documentList.findIndex(d => d.docid === previewDocId)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationDetail;


