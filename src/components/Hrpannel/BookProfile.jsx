// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const BookProfile = ({ embedded, onClose }) => {
//   const navigate = useNavigate();

//   const [selectedDate, setSelectedDate] = useState("Mon 2 Oct"); // Default selected date
//   const [selectedTime, setSelectedTime] = useState("13:00 - 17:00");
//   const [jobTitle, setJobTitle] = useState("GP for walkin clinic");
//   const [department, setDepartment] = useState("Primary Care");
//   const [location, setLocation] = useState("QMC Delhi");
//   const [notes, setNotes] = useState("");

//   const handleBook = () => {
//     if (embedded) {
//       onClose();
//     } else {
//       navigate("/BookingsPage");
//     }
//   };

//   const availableDates = ['Sun 1 Oct', 'Mon 2 Oct', 'Tue 3 Oct', 'Thu 5 Oct'];

//   return (
//     <div className={`booking-modal-wrapper ${embedded ? 'embedded' : 'container mt-4'}, ${embedded ? 'p-3' : ''}`}>
//       <div className="booking-modal">
//         {/* Header */}
//         <div className="booking-header d-flex justify-content-between align-items-start">
//           <div>
//             <h5>Book Dr. Sarah Johnson</h5>
//             <p className="text-muted">GP - Delhi <span className="badge bg-warning text-dark ms-2">★ 4.5</span></p>
//           </div>
//           {embedded && (
//             <button className="btn-close" onClick={onClose}>&times;</button>
//           )}
//         </div>

//         {/* Available Dates */}
//         <div className="card p-3 mt-3">
//           <p><strong>Available Dates:</strong></p>
//           <div className="d-flex gap-2 flex-wrap">
//             {availableDates.map(date => (
//               <button
//                 key={date}
//                 className={`btn btn-outline-secondary ${selectedDate === date ? "active" : ""}`}
//                 onClick={() => setSelectedDate(date)}
//               >
//                 {date}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Time Selector */}
//         <div className="card p-3 mt-3">
//           <p><strong>Select Time:</strong></p>
//           <div className="d-flex gap-2 mb-2">
//             {["09:00 - 13:00", "13:00 - 17:00", "17:00 - 21:00"].map(time => (
//               <button
//                 key={time}
//                 className={`btn btn-outline-primary ${selectedTime === time ? "active" : ""}`}
//                 onClick={() => setSelectedTime(time)}
//               >
//                 {time}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Booking Details */}
//         <div className="card p-3 mt-3">
//           <p><strong>Booking Details:</strong></p>
//           <input
//             type="text"
//             className="form-control mb-2"
//             placeholder="Job Title"
//             value={jobTitle}
//             onChange={(e) => setJobTitle(e.target.value)}
//           />
//           <select
//             className="form-control mb-2"
//             value={department}
//             onChange={(e) => setDepartment(e.target.value)}
//           >
//             <option>Primary Care</option>
//             <option>Emergency</option>
//             <option>Pediatrics</option>
//           </select>
//           <input
//             type="text"
//             className="form-control mb-2"
//             placeholder="Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//           <textarea
//             className="form-control mb-3"
//             placeholder="Any special requirements or information"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//           ></textarea>
//         </div>

//         {/* Booking Summary */}
//         <div className="card p-3 mt-3">
//           <p><strong>Booking Summary</strong> <span className="text-muted float-end">Reference: #BK12345</span></p>
//           <p>Dr. Sarah Johnson (GP)</p>
//           <p>{selectedDate}</p>
//           <p>Shift Time: {selectedTime}</p>
//           <p>Hourly Rate: ₹xxxx</p>
//           <p><strong>Total:</strong> ₹xxxx</p>
//         </div>

//         {/* Action Buttons */}
//         <div className="d-flex justify-content-end gap-2 mt-3">
//           <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
//           <button className="btn btn-primary" onClick={handleBook}>Confirm Booking</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookProfile;
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const BookProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { professional } = location.state || {
    name: "Professional",
    profession: "GP",
    rating: 4.0,
    hourlyRate: 1000,
    image: "https://via.placeholder.com/80",
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [jobTitle, setJobTitle] = useState(`${professional.profession} for walk-in clinic`);
  const [department, setDepartment] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [notes, setNotes] = useState("");

  const availableDates = ["Sun 1 Oct", "Mon 2 Oct", "Tue 3 Oct", "Thu 5 Oct"];

  const calculateTotal = () => {
    const hours = 4;
    return professional.hourlyRate * hours;
  };

  const handleBook = () => {
    const booking = {
      reference: "BK" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      professional: professional.name,
      profession: professional.profession,
      image: professional.image,
      specialty: department,
      date: selectedDate,
      time: selectedTime,
      location: locationInput,
      status: "Confirmed",
      total: `₹${calculateTotal()}`,
      notes: notes,
    };

    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    localStorage.setItem("bookings", JSON.stringify([...existingBookings, booking]));

    navigate("/bookings");
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        style={{
          fill: i < Math.floor(rating) ? "#f59e0b" : "none",
          color: i < Math.floor(rating) ? "#f59e0b" : "#d1d5db",
          marginRight: 2,
        }}
      />
    ));

  return (
    <div style={styles.container}>
      {/* LEFT PANEL */}
      <div style={styles.leftColumn}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ← Back to Professionals
        </button>
        <h2 style={styles.title}>Book Professional</h2>

        <div style={styles.professionalInfo}>
          <img src={professional.image} alt={professional.name} style={styles.avatar} />
          <div>
            <h3 style={styles.professionalName}>{professional.name}</h3>
            <div style={styles.metaContainer}>
              <span style={styles.professionBadge}>{professional.profession}</span>
              <div style={styles.ratingContainer}>
                {renderStars(professional.rating)}
                <span style={styles.ratingText}>{professional.rating}</span>
              </div>
              
            </div>
            
          </div>
        </div>
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Available Dates</h4>
            <div style={styles.optionsContainer}>
              {availableDates.map((date) => (
                <button
                  key={date}
                  style={{
                    ...styles.optionButton,
                    ...(selectedDate === date ? styles.activeOption : {}),
                  }}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Select Time Slot</h4>
            <div style={styles.optionsContainer}>
              {["09:00 - 13:00", "13:00 - 17:00", "17:00 - 21:00"].map((time) => (
                <button
                  key={time}
                  style={{
                    ...styles.optionButton,
                    ...(selectedTime === time ? styles.activeTimeOption : {}),
                  }}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.rightColumn}>
        <div style={styles.sectionsContainer}>
        

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Booking Details</h4>
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={styles.input}
              >
                <option value="">-- Select Department --</option>
                <option>Primary Care</option>
                <option>Emergency</option>
                <option>Pediatrics</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Special Requirements</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special notes..."
                style={{ ...styles.input, minHeight: 100 }}
              />
            </div>
          </div>
        </div>

        <div style={styles.summaryContainer}>
          <h4 style={styles.sectionTitle}>Booking Summary</h4>
          <div style={styles.summaryDetails}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Professional:</span>
              <span>{professional.name}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Date:</span>
              <span>{selectedDate || "Not selected"}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Time:</span>
              <span>{selectedTime || "Not selected"}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Hourly Rate:</span>
              <span>₹{professional.hourlyRate}/hr</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
              <span style={styles.summaryLabel}>Total:</span>
              <span style={styles.totalAmount}>₹{calculateTotal()}</span>
            </div>
          </div>

          {(!selectedDate || !selectedTime || !department || !locationInput) && (
            <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>
              Please select date, time, department, and location before booking.
            </p>
          )}

          <div style={styles.actionButtons}>
            <button style={styles.cancelButton} onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              style={{
                ...styles.confirmButton,
                opacity: selectedDate && selectedTime && department && locationInput ? 1 : 0.5,
                cursor: selectedDate && selectedTime && department && locationInput ? "pointer" : "not-allowed",
              }}
              onClick={handleBook}
              disabled={!selectedDate || !selectedTime || !department || !locationInput}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    maxWidth: 1200,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Segoe UI",
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  leftColumn: {
    flex: 1,
    paddingRight: 20,
    borderRight: "1px solid #e5e7eb",
  },
  rightColumn: {
    flex: 2,
    paddingLeft: 20,
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    cursor: "pointer",
    fontSize: 14,
    padding: 0,
    marginBottom: 10,
  },
  title: { fontSize: 24, fontWeight: 600, color: "#1f2937", margin: 0, marginBottom: 16 },
  professionalInfo: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: "1px solid #e5e7eb",
  },
  avatar: { width: 80, height: 80, borderRadius: "50%", objectFit: "cover" },
  professionalName: { fontSize: 20, fontWeight: 600, margin: 0, color: "#1f2937" },
  metaContainer: { display: "flex", alignItems: "center", gap: 12 },
  professionBadge: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "4px 8px",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
  },
  ratingContainer: { display: "flex", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 14, color: "#4b5563", marginLeft: 4 },
  sectionsContainer: { display: "flex", flexDirection: "column", gap: 24, marginBottom: 24 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
  },
  sectionTitle: { fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1f2937" },
  optionsContainer: { display: "flex", flexWrap: "wrap", gap: 8 },
  optionButton: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s",
    color: "#4b5563",
  },
  activeOption: {
    backgroundColor: "#e5e7eb",
    borderColor: "#9ca3af",
    color: "#1f2937",
  },
  activeTimeOption: {
    backgroundColor: "#dbeafe",
    borderColor: "#3b82f6",
    color: "#1e40af",
  },
  formGroup: { marginBottom: 16 },
  label: { display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#4b5563" },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: 14,
    boxSizing: "border-box",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    marginBottom: 24,
  },
  summaryDetails: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 14 },
  summaryLabel: { fontWeight: 500, color: "#4b5563" },
  totalRow: { paddingTop: 12, borderTop: "1px solid #e5e7eb", marginTop: 8 },
  totalAmount: { fontWeight: 600, color: "#1f2937" },
  actionButtons: { display: "flex", justifyContent: "flex-end", gap: 12 },
  cancelButton: {
    padding: "10px 16px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#4b5563",
  },
  confirmButton: {
    padding: "10px 16px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#3b82f6",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "white",
  },
};

export default BookProfile;
