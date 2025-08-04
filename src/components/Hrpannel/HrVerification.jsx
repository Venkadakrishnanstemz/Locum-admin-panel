
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchAllUsers, fetchUserById } from "../../services/api";
// import "./hrverification.css";
// import { FiEye } from "react-icons/fi";
// const HRVerification = () => {
//   const navigate = useNavigate();

//   const [counts, setCounts] = useState({
//     pending: 0,
//     resigned: 0,
//     junior_verified: 0,
//     senior_verified: 0,
//     completed: 0,
//   });
//   const [documents, setDocuments] = useState([]);
//   const [filteredDocs, setFilteredDocs] = useState([]);
//   const [globalSearch, setGlobalSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const users = await fetchAllUsers();
//         console.log("Fetched users:", users);

//         if (!users || users.length === 0) {
//           setError("No users found.");
//           return;
//         }

//         const statusCounts = {
//           pending: 0,
//           resigned: 0,
//           junior_verified: 0,
//           senior_verified: 0,
//           completed: 0,
//         };

//         const processedDocuments = users.map((user) => {
//           let status = "Pending";
//           if (user.status === 1 || user.status === "1") {
//             status = "Completed";
//             statusCounts.completed += 1;
//           } else if (typeof user.status === "string") {
//             const lowerStatus = user.status.toLowerCase();
//             if (lowerStatus.includes("resigned")) {
//               status = "Resigned";
//               statusCounts.resigned += 1;
//             } else if (lowerStatus.includes("junior")) {
//               status = "Junior Verified";
//               statusCounts.junior_verified += 1;
//             } else if (lowerStatus.includes("senior")) {
//               status = "Senior Verified";
//               statusCounts.senior_verified += 1;
//             } else {
//               status = "Pending";
//               statusCounts.pending += 1;
//             }
//           } else {
//             statusCounts.pending += 1;
//           }

//           return {
//             id: user?.data?.id || user.id, // Fallback to user.id if data.id is undefined
//             name: user.name || user.username || "Unknown",
//             department: user.department || "General",
//             uploaded_on: user.created_at?.split("T")[0] || "N/A",
//             status,
//             location: user.location || "Unknown", // Ensure location is included
//             action: "View", // Placeholder for action column
//           };
//         });

//         setCounts(statusCounts);
//         setDocuments(processedDocuments);
//         setFilteredDocs(processedDocuments); // Show all documents initially
//       } catch (err) {
//         console.error("Error fetching HR data:", err);
//         setError("Failed to fetch user data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const [filters, setFilters] = useState({
//     id: "",
//     name: "",
//     department: "",
//     uploaded_on: "",
//     status: "",
//   });

//   const [visibleFilters, setVisibleFilters] = useState({
//     id: false,
//     name: false,
//     department: false,
//     uploaded_on: false,
//     status: false,
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const handleView = async (doc) => {
//     try {
//       const userData = await fetchUserById(doc.id);
//       console.log("Fetched user data:", userData);
//       navigate(`/verification/${doc.id}`, { state: { user: userData, location: doc.location } }); // Pass location
//     } catch (err) {
//       console.error("Error fetching user details:", err);
//       setError("Failed to fetch user details. Please try again.");
//       // navigate(`/verification/${doc.id}`, { state: { user: doc, location: doc.location } }); // Fallback with doc data including location
//     }
//   };

//   useEffect(() => {
//     const filtered = documents.filter((doc) =>
//       Object.values(doc).join(" ").toLowerCase().includes(globalSearch.toLowerCase())
//     );
//     setFilteredDocs(filtered);
//     setCurrentPage(1);
//   }, [globalSearch, documents]);

//   const handleFilterChange = (key, value) => {
//     const updatedFilters = { ...filters, [key]: value };
//     setFilters(updatedFilters);

//     const filtered = documents.filter((doc) =>
//       Object.keys(updatedFilters).every((filterKey) => {
//         const val = updatedFilters[filterKey];
//         return !val || doc[filterKey]?.toString().toLowerCase().includes(val.toLowerCase());
//       })
//     );
//     setFilteredDocs(filtered);
//     setCurrentPage(1);
//   };

//   const filterByStatus = (status) => {
//     setGlobalSearch("");
//     setFilters({ id: "", name: "", department: "", uploaded_on: "", status });
//     const filtered = documents.filter((doc) =>
//       doc.status.toLowerCase().includes(status.toLowerCase())
//     );
//     setFilteredDocs(filtered);
//     setCurrentPage(1);
//   };

//   const resetFilters = () => {
//     setGlobalSearch("");
//     setFilters({ id: "", name: "", department: "", uploaded_on: "", status: "" });
//     setFilteredDocs(documents); // Show all documents on reset
//     setCurrentPage(1);
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentDocs = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="hr-verification-container">
//       <h2 className="dashboard-title">HR Worklist</h2>

//       <div className="card-grid">
//         <Card label="Pending Documents" count={counts.pending} color="#f39c12" onClick={() => filterByStatus("Pending")} />
//         <Card label="Resigned Documents" count={counts.resigned} color="#e74c3c" onClick={() => filterByStatus("Resigned")} />
//         <Card label="Junior Verified" count={counts.junior_verified} color="#3498db" onClick={() => filterByStatus("Junior Verified")} />
//         <Card label="Senior Verified" count={counts.senior_verified} color="#9b59b6" onClick={() => filterByStatus("Senior Verified")} />
//         <Card label="Completed" count={counts.completed} color="#2ecc71" onClick={() => filterByStatus("Completed")} />
//       </div>

//       <div className="document-table-section">
//         <div className="document-header">
//           <h3>Document Details</h3>
//           <div className="search-bar-container">
//             <input
//               type="text"
//               placeholder="Search by name, department, status..."
//               value={globalSearch}
//               onChange={(e) => setGlobalSearch(e.target.value)}
//               className="search-bar"
//             />
//             {(globalSearch || filters.status) && (
//               <button className="reset-button" onClick={resetFilters}>Reset</button>
//             )}
//           </div>
//         </div>

//         <table className="document-table">
//           <thead>
//             <tr>
//               {["id", "name", "department", "uploaded_on", "status"].map((col) => (
//                 <th key={col}>
//                   {col.toUpperCase()}
//                   <button className="filter-icon" onClick={() =>
//                     setVisibleFilters((prev) => ({ ...prev, [col]: !prev[col] }))
//                   }>
//                     🔍
//                   </button>
//                   {visibleFilters[col] && (
//                     <input
//                       type="text"
//                       placeholder="Filter"
//                       value={filters[col]}
//                       onChange={(e) => handleFilterChange(col, e.target.value)}
//                       className="column-filter"
//                     />
//                   )}
//                 </th>
//               ))}
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentDocs.map((doc) => (
//               <tr key={doc.id}>
//                 <td>{doc.id}</td>
//                 <td>{doc.name}</td>
//                 <td>{doc.department}</td>
//                 <td>{doc.uploaded_on}</td>
//                 <td>
//                   <span className={`status-tag ${doc.status.toLowerCase().replace(" ", "-")}`}>
//                     {doc.status}
//                   </span>
//                 </td>
//                 <td>
//                   {/* <button className="view-button" onClick={() => handleView(doc)}>View</button> */}
//     <span
//   className="icon-eye"
//   onClick={() => handleView(doc)}
//   title="View Document"
// >
//   <FiEye />
// </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {totalPages > 1 && (
//           <div className="pagination-controls">
//             <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 className={currentPage === i + 1 ? "active-page" : ""}
//                 onClick={() => setCurrentPage(i + 1)}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const Card = ({ label, count, color, onClick }) => (
//   <div className="worklist-card" style={{ borderTop: `4px solid ${color}` }} onClick={onClick}>
//     <h3 className="card-label">{label}</h3>
//     <p className="card-count">{count}</p>
//   </div>
// );

// export default HRVerification;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllUsers, fetchUserById } from "../../services/api";
import "./hrverification.css";
import { FiEye } from "react-icons/fi";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { FiFilter } from "react-icons/fi"; // For the filter icon

const HRVerification = () => {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    pending: 0,
    reassigned: 0,
    resigned: 0,
    junior_verified: 0,
    senior_verified: 0,
    completed: 0,
  });
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await fetchAllUsers();
        console.log("Fetched users:", users);

        if (!users || users.length === 0) {
          setError("No users found.");
          return;
        }

        const statusCounts = {
          pending: 0,
          resigned: 0,
          reassigned: 0,
          junior_verified: 0,
          senior_verified: 0,
          completed: 0,
        };

        const processedDocuments = users.map((user) => {
  let status = "Pending";

  if (user.status === 1 || user.status === "1") {
    status = "Completed";
    statusCounts.completed += 1;

  } else if (user.status === 3 || user.status === "3") {
    status = "Reassigned";
    statusCounts.reassigned = (statusCounts.reassigned || 0) + 1;

  } else if (typeof user.status === "string") {
    const lowerStatus = user.status.toLowerCase();
    if (lowerStatus.includes("resigned")) {
      status = "Resigned";
      statusCounts.resigned += 1;

    } else if (lowerStatus.includes("junior")) {
      status = "Junior Verified";
      statusCounts.junior_verified += 1;

    } else if (lowerStatus.includes("senior")) {
      status = "Senior Verified";
      statusCounts.senior_verified += 1;

    } else {
      statusCounts.pending += 1;
    }

  } else {
    statusCounts.pending += 1;
  }
          return {
            id: user?.data?.id || user.id, // Fallback to user.id if data.id is undefined
            name: user.name || user.username || "Unknown",
            department: user.department || "General",
            uploaded_on: user.created_at?.split("T")[0] || "N/A",
            status,
            location: user.location || "Unknown", // Ensure location is included
            action: "View", // Placeholder for action column
          };
        });

        setCounts(statusCounts);
        setDocuments(processedDocuments);
        setFilteredDocs(processedDocuments); // Show all documents initially
      } catch (err) {
        console.error("Error fetching HR data:", err);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [filters, setFilters] = useState({
    id: "",
    name: "",
    department: "",
    uploaded_on: "",
    status: "",
  });

  const [visibleFilters, setVisibleFilters] = useState({
    id: false,
    name: false,
    department: false,
    uploaded_on: false,
    status: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleView = async (doc) => {
    try {
      const userData = await fetchUserById(doc.id);
      console.log("Fetched user data:", userData);
      navigate(`/verification/${doc.id}`, { state: { user: userData, location: doc.location } }); // Pass location
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details. Please try again.");
      // navigate(`/verification/${doc.id}`, { state: { user: doc, location: doc.location } }); // Fallback with doc data including location
    }
  };

  useEffect(() => {
    const filtered = documents.filter((doc) =>
      Object.values(doc).join(" ").toLowerCase().includes(globalSearch.toLowerCase())
    );
    setFilteredDocs(filtered);
    setCurrentPage(1);
  }, [globalSearch, documents]);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);

    const filtered = documents.filter((doc) =>
      Object.keys(updatedFilters).every((filterKey) => {
        const val = updatedFilters[filterKey];
        return !val || doc[filterKey]?.toString().toLowerCase().includes(val.toLowerCase());
      })
    );
    setFilteredDocs(filtered);
    setCurrentPage(1);
  };

  const filterByStatus = (status) => {
    setGlobalSearch("");
    setFilters({ id: "", name: "", department: "", uploaded_on: "", status });
    const filtered = documents.filter((doc) =>
      doc.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredDocs(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setGlobalSearch("");
    setFilters({ id: "", name: "", department: "", uploaded_on: "", status: "" });
    setFilteredDocs(documents); // Show all documents on reset
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);

  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="hr-verification-container">
      <h2 className="dashboard-title">HR Worklist</h2>

      <div className="card-grid">
        <Card label="Pending Documents" count={counts.pending} color="#f39c12" onClick={() => filterByStatus("Pending")} />
        <Card label="Reassigned Documents" count={counts.reassigned} color="#e74c3c" onClick={() => filterByStatus("Reassigned")} />
        <Card label="Junior Verification" count={counts.junior_verified} color="#3498db" onClick={() => filterByStatus("Junior Verified")} />
        <Card label="Senior Verified" count={counts.senior_verified} color="#9b59b6" onClick={() => filterByStatus("Senior Verified")} />
        <Card label="Completed" count={counts.completed} color="#2ecc71" onClick={() => filterByStatus("Completed")} />
      </div>

      <div className="document-table-section">
        <div className="document-header">
          <h3>Document List </h3>
          <div className="search-bar-container">
            {showSearch ?(<input
              type="text"
              placeholder="Search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="search-bar"
            />):
            (
               <IconButton onClick={() => setShowSearch(true)}>
               <SearchIcon />
               </IconButton>
            )}

            
            {(globalSearch || filters.status) && (
              <button className="reset-button" onClick={resetFilters}>Reset</button>
            )}
          </div>
        </div>

        <table className="document-table">
          <thead>
            <tr>
              {/* {["id", "name", "department", "uploaded_on", "status"].map((col) => (
                <th key={col}>
                  {col.toUpperCase()}
                  <button className="filter-icon" onClick={() =>
                    setVisibleFilters((prev) => ({ ...prev, [col]: !prev[col] }))
                  }>

                  </button>
                  {visibleFilters[col] && (
                    <input
                      type="text"
                      placeholder="Filter"
                      value={filters[col]}
                      onChange={(e) => handleFilterChange(col, e.target.value)}
                      className="column-filter"
                    />
                  )}
                </th>
              ))} */}

              {["Id", "Name", "Department", "Status"].map((col) => (
  <th key={col}>
    {col}
    <button
      className="filter-icon"
      onClick={() =>
        setVisibleFilters((prev) => ({ ...prev, [col]: !prev[col] }))
      }
      title="Toggle Filter"
    >
      <FiFilter />
    </button>
    {visibleFilters[col] && (
      <input
        type="text"
        placeholder="Filter"
        value={filters[col]}
        onChange={(e) => handleFilterChange(col, e.target.value)}
        className="column-filter"
      />
    )}
  </th>
))}

              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentDocs.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.name}</td>
                <td>{doc.department}</td>
                <td>
                  <span className={`status-tag ${doc.status.toLowerCase().replace(" ", "-")}`}>
                    {doc.status}
                  </span>
                </td>
                <td>
                  {/* <button className="view-button" onClick={() => handleView(doc)}>View</button> */}
                <span
                className="icon-eye"
                onClick={() => handleView(doc)}
                title="View Document"
                >
              <FiEye />
                </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ label, count, color, onClick }) => (
  <div className="worklist-card" style={{ borderTop: `4px solid ${color}` }} onClick={onClick}>
    <h3 className="card-label">{label}</h3>
    <p className="card-count">{count}</p>
  </div>
);


export default HRVerification;