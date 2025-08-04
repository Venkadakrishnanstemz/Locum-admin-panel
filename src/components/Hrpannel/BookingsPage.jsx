
// import React, { useState, useEffect } from "react";
// import { FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// const statusColors = {
//   Pending: "text-yellow-700 bg-yellow-100",
//   Confirmed: "text-green-700 bg-green-100",
//   Cancelled: "text-red-700 bg-red-100",
// };

// const BookingsPage = () => {
//   const [activeTab, setActiveTab] = useState("All");
//   const [search, setSearch] = useState("");
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("bookings")) || [];
//     setBookings(stored);
//   }, []);

//   const filteredBookings = bookings.filter((booking) => {
//     const matchesStatus = activeTab === "All" || booking.status === activeTab;
//     const matchesSearch =
//       booking.professional.toLowerCase().includes(search.toLowerCase()) ||
//       booking.reference.toLowerCase().includes(search.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-7xl bg-white p-6 shadow-md rounded-md">
//         <h2 className="text-2xl font-bold mb-2">Bookings</h2>
//         <p className="text-sm text-gray-500 mb-6">
//           Manage and track all your locum healthcare professional bookings.
//         </p>

//         {/* Tabs & Search */}
//         <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
//           <div className="flex gap-2 flex-wrap">
//             {["All", "Pending", "Confirmed", "Cancelled"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-1.5 rounded-md border text-sm ${
//                   activeTab === tab
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <input
//             type="text"
//             placeholder="Search bookings..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border px-4 py-2 rounded-md text-sm w-full sm:w-72"
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto border rounded-md">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-gray-100 text-gray-700 font-semibold">
//               <tr>
//                 <th className="p-3">Reference</th>
//                 <th className="p-3">Professional</th>
//                 <th className="p-3">Date</th>
//                 <th className="p-3">Time</th>
//                 <th className="p-3">Location</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Total</th>
//                 <th className="p-3 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBookings.length > 0 ? (
//                 filteredBookings.map((booking, index) => (
//                   <tr
//                     key={index}
//                     className="border-t hover:bg-gray-50 transition duration-200"
//                   >
//                     <td className="p-3 font-mono text-blue-600">{booking.reference}</td>
//                     <td className="p-3">
//                       <div className="font-medium text-gray-800">{booking.professional}</div>
//                       <div className="text-xs text-gray-500">{booking.specialty}</div>
//                     </td>
//                     <td className="p-3">{booking.date}</td>
//                     <td className="p-3">{booking.time}</td>
//                     <td className="p-3">{booking.location}</td>
//                     <td className="p-3">
//                       <span
//                         className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[booking.status]}`}
//                       >
//                         {booking.status}
//                       </span>
//                     </td>
//                     <td className="p-3 font-semibold">{booking.total}</td>
//                     <td className="p-3 flex justify-center gap-2 text-lg text-gray-600">
//                       <FaLock title="View" className="hover:text-blue-600 cursor-pointer" />
//                       <FaCheckCircle
//                         title="Confirm"
//                         className="text-green-500 hover:text-green-600 cursor-pointer"
//                       />
//                       <FaTimesCircle
//                         title="Cancel"
//                         className="text-red-500 hover:text-red-600 cursor-pointer"
//                       />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center p-4 text-gray-400">
//                     No bookings found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingsPage;

import React, { useState, useEffect, useRef } from "react";
import { FaLock, FaEllipsisV, FaFilter } from "react-icons/fa";

const statusIcons = {
  Pending: " ",
  Confirmed: " ",
  Cancelled: " ",
};

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // Mock data to match the screenshot
    const mockBookings = [
      {
        reference: "#BORIGER",
        professional: "Dr. Sarah Johnson",
        date: "Mon, Apr. 2, 2025",
        time: "0:00 - 12:00",
        location: "QMC Dash",
        status: "Pending",
        total: "Mr XXXX",
      },
      {
        reference: "#BORWAYM",
        professional: "Related Issues",
        date: "Week-Apr.4, 2025",
        time: "11:00 - 17:00",
        location: "QMC Bowl",
        status: "Pending",
        total: "Mr XXXX",
      },
    ];
    const stored = JSON.parse(localStorage.getItem("bookings")) || mockBookings;
    setBookings(stored);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      activeTab === "All" ||
      (activeTab === "Pending" && booking.status === "Funding") ||
      (activeTab === "Confirmed" && booking.status === "Confirmed") ||
      (activeTab === "Cancelled" && booking.status === "Cancelled");
    const matchesSearch =
      booking.professional.toLowerCase().includes(search.toLowerCase()) ||
      booking.reference.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-7xl bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-2">Bookings</h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage and track all your North NetPhone professional bookings.
        </p>

        {/* All Bookings box with table inside */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6 shadow-sm">
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', width: '100%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>All Bookings</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isSearchOpen && (
                <div ref={searchRef} style={{ position: 'relative', width: window.innerWidth >= 640 ? '16rem' : '100%' }}>
                  <input
                    type="text"
                    placeholder="Search booking"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      width: '100%',
                      borderBottom: '1px solid #d1d5db',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    className="focus-input"
                    autoFocus
                  />
                </div>
              )}
              <FaFilter
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                style={{ fontSize: '1rem' }}
                title="Filter"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap mb-4">
            {["All", "Pending", "Confirmed", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm ${
                  activeTab === tab
                    ? "font-semibold text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table inside the same box */}
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Professional</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition duration-200"
                    >
                      <td className="p-3 font-mono text-blue-600">{booking.reference}</td>
                      <td className="p-3 font-medium text-gray-800">{booking.professional}</td>
                      <td className="p-3">{booking.date}</td>
                      <td className="p-3">{booking.time}</td>
                      <td className="p-3">{booking.location}</td>
                      <td className="p-3">
                        <span className="text-lg">
                          {statusIcons[booking.status]} {booking.status}
                        </span>
                      </td>
                      <td className="p-3">{booking.total}</td>
                      <td className="p-3 flex justify-center gap-2 text-lg text-gray-600">
                        <span className="text-gray-400 hover:text-gray-600 cursor-pointer">💤</span>
                        <FaLock title="View" className="hover:text-blue-600 cursor-pointer" />
                        <FaEllipsisV className="hover:text-gray-800 cursor-pointer" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-4 text-gray-400">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;

