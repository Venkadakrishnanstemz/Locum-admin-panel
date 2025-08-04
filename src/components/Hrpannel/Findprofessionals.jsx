

// import React, { useState, useEffect } from 'react';
// import { Search, Bell, Calendar, MapPin, Star, Eye, User, List, Grid2X2, Grid3X3, Square, ListTodo } from 'lucide-react';
// import './Findprofessional.css';
// import { useNavigate } from "react-router-dom";
// import { Modal, Button, Rate, Tag, Input, Select, Divider, Row, Col, Typography } from 'antd';
// import { EnvironmentOutlined, CloseOutlined } from '@ant-design/icons';
// import { fetchAllUsers, fetchAllAvailability, fetchAllQualifications, fetchAllLocations, fetchAllRoles } from '../../services/api';

// export default function FindProfessionals() {
//   const [viewMode, setViewMode] = useState('list');
//   const [selectedFilters, setSelectedFilters] = useState({
//     profession: [],
//     location: [],
//     qualifications: [],
//     availability: { from: '', to: '' }
//   });
//   const [selectedProfessional, setSelectedProfessional] = useState(null);
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAll, setShowAll] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const professionalsPerPage = 4;
//   const navigate = useNavigate();
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [additionalNotes, setAdditionalNotes] = useState('');
//   const [professions, setProfessions] = useState([]);
//   const [professionalsData, setProfessionalsData] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [qualificationsList, setQualificationsList] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const roles = await fetchAllRoles();
//         const professionList = Array.isArray(roles) ? roles.map(role => role) : [];
//         setProfessions(professionList);

//         const users = await fetchAllUsers();
//         const formattedUsers = users.map(user => ({
//           id: user.id || user._id || Math.random().toString(36).substr(2, 9),
//           name: user?.username || 'Unknown',
//           image: user.image || null,
//           rating: user.rating || 0,
//           experience: user.experience || 'No experience data',
//           location: user?.location?.[0]?.name || 'Unknown location',
//           availability: user?.availability?.label || 'No availability data',
//           profession: user?.userrole?.[0]?.name || 'Unknown',
//           qualifications: user.qualification || [],
//           hourlyRate: user.consultation_fee || 0,
//           gender: user.gender || 'Unknown',
//           date_of_birth: user.date_of_birth || 'Unknown',
//           marital_status: user.marital_status || 'Unknown',
//           nationality: user.nationality || 'Unknown',
//           position: user.position || 'Unknown',
//           email: user.email || 'Unknown',
//           mobile_number: user.mobile_number || 'Unknown',
//           work_number: user.work_number || 'Unknown',
//           residence_number: user.residence_number || 'Unknown',
//           start_date: user.start_date || 'Unknown',
//           end_date: user.end_date || 'Unknown',
//           description: user.description || 'Unknown',
//           status: user.status || null,
//         }));
//         setProfessionalsData(formattedUsers);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const loadFilters = async () => {
//       try {
//         const locData = await fetchAllLocations();
//         const qualData = await fetchAllQualifications();
//         setLocations(locData.map(loc => loc.name));
//         setQualificationsList(qualData.map(qual => qual.name));
//       } catch (error) {
//         console.error("Failed to fetch filters:", error);
//       }
//     };
//     loadFilters();
//   }, []);

//   const viewModes = [
//     { id: 'list', icon: <List size={20} />, title: 'List view' },
//     { id: 'details', icon: <ListTodo size={20} />, title: 'Detailed list' },
//     { id: 'large', icon: <Square size={20} />, title: 'Large cards' },
//     { id: 'medium', icon: <Grid2X2 size={20} />, title: 'Medium cards' },
//     { id: 'small', icon: <Grid3X3 size={20} />, title: 'Small cards' }
//   ];

//   const filteredProfessionals = professionalsData.filter(prof => {
//     if (prof.status !== 1) return false;
//     if (selectedFilters.profession.length > 0 && !selectedFilters.profession.some(p => p.name === prof.profession)) return false;
//     if (selectedFilters.location.length > 0 && !selectedFilters.location.some(loc => prof.location.includes(loc))) return false;
//     if (selectedFilters.qualifications.length > 0 && !selectedFilters.qualifications.every(q => prof.qualifications.includes(q))) return false;
//     if (selectedFilters.availability.from && !prof.availability.toLowerCase().includes(selectedFilters.availability.from.split("-")[0].toLowerCase())) return false;
//     if (selectedFilters.availability.to && !prof.availability.toLowerCase().includes(selectedFilters.availability.to.split("-")[0].toLowerCase())) return false;
//     if (
//       searchTerm &&
//       !(
//         prof.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         prof.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         prof.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         String(prof.experience)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         prof.qualifications?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     ) return false;
//     return true;
//   });

//   const totalProfessionals = filteredProfessionals.length;
//   const totalPages = Math.ceil(totalProfessionals / professionalsPerPage);
//   const paginatedProfessionals = showAll
//     ? filteredProfessionals
//     : filteredProfessionals.slice((currentPage - 1) * professionalsPerPage, currentPage * professionalsPerPage);

//   const handleFilterChange = (type, value) => {
//     setCurrentPage(1);
//     if (type === "profession") {
//       setSelectedFilters(prev => {
//         const exists = prev.profession.some(p => p.id === value.id);
//         return { ...prev, profession: exists ? prev.profession.filter(p => p.id !== value.id) : [...prev.profession, value] };
//       });
//     } else if (type === "location") {
//       setSelectedFilters(prev => {
//         const updated = prev.location.includes(value) ? prev.location.filter(l => l !== value) : [...prev.location, value];
//         return { ...prev, location: updated };
//       });
//     } else if (type === "qualifications") {
//       setSelectedFilters(prev => {
//         const updated = prev.qualifications.includes(value) ? prev.qualifications.filter(q => q !== value) : [...prev.qualifications, value];
//         return { ...prev, qualifications: updated };
//       });
//     }
//   };

//   const handleAvailabilityChange = (field, value) => {
//     setCurrentPage(1);
//     setSelectedFilters(prev => ({
//       ...prev,
//       availability: { ...prev.availability, [field]: value }
//     }));
//   };

//   const removeFilter = (type, value) => {
//     if (type === 'profession') {
//       setSelectedFilters(prev => ({
//         ...prev,
//         profession: prev.profession.filter(p => p.id !== value.id)
//       }));
//     } else if (type === 'location') {
//       setSelectedFilters(prev => ({
//         ...prev,
//         location: prev.location.filter(l => l !== value)
//       }));
//     } else if (type === 'qualifications') {
//       setSelectedFilters(prev => ({
//         ...prev,
//         qualifications: prev.qualifications.filter(q => q !== value)
//       }));
//     } else if (type === 'availability') {
//       setSelectedFilters(prev => ({
//         ...prev,
//         availability: { from: '', to: '' }
//       }));
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleShowAllToggle = () => setShowAll(prev => !prev);

//   const handlePageChange = (page) => setCurrentPage(page);

//   const handleBookNow = (professional) => {
//     setSelectedProfessional(professional);
//     setIsBookingModalOpen(true);
//   };

//   const handleViewProfile = (professional) => {
//     setSelectedProfessional(professional);
//     setIsProfileModalOpen(true);
//   };

//   const renderStars = (rating) => (
//     Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         size={12}
//         className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
//       />
//     ))
//   );

//   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const getAvailabilityMap = (availability) => {
//     const map = Array(7).fill(false);
//     if (availability) {
//       const dayIndex = daysOfWeek.indexOf(availability);
//       if (dayIndex !== -1) map[dayIndex] = true;
//     }
//     return map;
//   };

//   const renderAvatar = (name, viewMode) => {
//     const firstLetter = name ? name.charAt(0).toUpperCase() : 'U';
//     const size = viewMode === 'small' ? '50px' : viewMode === 'medium' ? '70px' : '100px';
//     return (
//       <div
//         className="avatar-placeholder"
//         style={{
//           width: size,
//           height: size,
//           borderRadius: '80px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: '#1890ff',
//           color: '#fff',
//           fontSize: viewMode === 'small' ? '20px' : viewMode === 'medium' ? '24px' : '30px',
//           fontWeight: 'bold',
//         }}
//       >
//         {firstLetter}
//       </div>
//     );
//   };

//   return (
//     <div className="container">
//       <div className="main-content">
//         <div className="top-header">
//           <h1>Find Healthcare Professionals</h1>
//           <div className="notification-icon"><Bell size={20} /></div>
//         </div>
//         <div className="content-wrapper">
//           <div className="filters-panel-container">
//             <div className="filters-panel">
//               <h2 className="filters-title">Filters</h2>
//               <div className="filter-group">
//                 <h3>Profession</h3>
//                 <div className="checkbox-group">
//                   {professions.length > 0 ? (
//                     professions.map((prof, ind) => (
//                       <div className="checkbox-item" key={ind}>
//                         <input
//                           type="checkbox"
//                           id={prof.id}
//                           checked={selectedFilters.profession.some(p => p.id === prof.id)}
//                           onChange={() => handleFilterChange("profession", prof)}
//                         />
//                         <label htmlFor={prof.id}>{prof.name}</label>
//                       </div>
//                     ))
//                   ) : (
//                     <p style={{ color: '#888' }}>No professions available</p>
//                   )}
//                 </div>
//               </div>
//               <div className="filter-group">
//                 <h3>Availability</h3>
//                 <div className="date-group">
//                   <div className="date-input">
//                     <label>From</label>
//                     <input
//                       type="date"
//                       value={selectedFilters.availability.from}
//                       onChange={(e) => handleAvailabilityChange("from", e.target.value)}
//                       min={new Date().toISOString().split('T')[0]}
//                     />
//                   </div>
//                   <div className="date-input">
//                     <label>To</label>
//                     <input
//                       type="date"
//                       value={selectedFilters.availability.to}
//                       onChange={(e) => handleAvailabilityChange("to", e.target.value)}
//                       min={selectedFilters.availability.from || new Date().toISOString().split('T')[0]}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="filter-group">
//                 <h3>Location</h3>
//                 <div className="checkbox-group">
//                   {locations.map((loc) => (
//                     <div className="checkbox-item" key={loc}>
//                       <input
//                         type="checkbox"
//                         id={loc}
//                         checked={selectedFilters.location.includes(loc)}
//                         onChange={() => handleFilterChange("location", loc)}
//                       />
//                       <label htmlFor={loc}>{loc}</label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="filter-group">
//                 <h3>Qualifications</h3>
//                 <div className="checkbox-group">
//                   {qualificationsList.map((q) => (
//                     <div className="checkbox-item" key={q}>
//                       <input
//                         type="checkbox"
//                         id={q}
//                         checked={selectedFilters.qualifications.includes(q)}
//                         onChange={() => handleFilterChange("qualifications", q)}
//                       />
//                       <label htmlFor={q}>{q}</label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="filter-buttons">
//                 <button
//                   className="btn-primary"
//                   onClick={() => setCurrentPage(1)}
//                 >
//                   Apply Filters
//                 </button>
//                 <button
//                   className="btn-secondary"
//                   onClick={() => {
//                     setSelectedFilters({
//                       profession: [],
//                       location: [],
//                       qualifications: [],
//                       availability: { from: '', to: '' },
//                     });
//                     setSearchTerm('');
//                     setCurrentPage(1);
//                   }}
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="results-area">
//   <div className="search-section">
//     {/* Search Bar - Now separate from filter tags container */}
//     <div className="search-bar-container">
//       <div className="search-input-wrapper">
//         <Search size={24} className="search-icon" />
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Search for healthcare professionals..."
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//         <button className="search-btn">Search</button>
//       </div>
//     </div>
    
//     {/* Filter Tags - Now as a separate div below search bar */}
//     <div className="filter-tags-container">
//       {selectedFilters.profession.map(prof => (
//         <Tag
//           key={prof.id}
//           closable
//           onClose={() => removeFilter('profession', prof)}
//           className="filter-tag"
//           closeIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
//         >
//           {prof.name}
//         </Tag>
//       ))}
      
//       {selectedFilters.location.map(loc => (
//         <Tag
//           key={loc}
//           closable
//           onClose={() => removeFilter('location', loc)}
//           className="filter-tag"
//           closeIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
//         >
//           {loc}
//         </Tag>
//       ))}
      
//       {selectedFilters.qualifications.map(qual => (
//         <Tag
//           key={qual}
//           closable
//           onClose={() => removeFilter('qualifications', qual)}
//           className="filter-tag"
//           closeIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
//         >
//           {qual}
//         </Tag>
//       ))}
      
//       {(selectedFilters.availability.from || selectedFilters.availability.to) && (
//         <Tag
//           closable
//           onClose={() => removeFilter('availability')}
//           className="filter-tag"
//           closeIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
//         >
//           {`${selectedFilters.availability.from || ''} ${selectedFilters.availability.to ? 'to ' + selectedFilters.availability.to : ''}`}
//         </Tag>
//       )}
//     </div>
    
              
//               <div className="results-header">
//                 <div>
//                   <p className="results-count">{filteredProfessionals.length} professionals found</p>
//                 </div>
//                 <div className="view-controls">
//                   <div className="sort-section">
//                     <label>Sort by:</label>
//                     <select className="sort-select">
//                       <option>Relevance</option>
//                       <option>Distance</option>
//                       <option>Rating</option>
//                     </select>
//                   </div>
//                   <div className="view-mode-selector">
//                     {viewModes.map((mode) => (
//                       <button
//                         key={mode.id}
//                         className={`view-mode-btn ${viewMode === mode.id ? 'active' : ''}`}
//                         title={mode.title}
//                         onClick={() => setViewMode(mode.id)}
//                       >
//                         {mode.icon}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className={`professionals-grid ${viewMode}`}>
//               {paginatedProfessionals.length === 0 && (
//                 <div className="no-results">
//                   No verified professionals found.
//                 </div>
//               )}
              
//               {paginatedProfessionals.map((prof) => {
//                 const availabilityMap = getAvailabilityMap(prof.availability);

//                 return (
//                   <div className={`professional-card ${viewMode}`} key={prof.id}>
//                     <div className="two-column-layout">
//                       <div className="left-box">
//                         <div className="card-header">
//                           {prof.image ? (
//                             <img
//                               src={prof.image}
//                               alt={`${prof.name}'s profile`}
//                               className="professional-avatar"
//                             />
//                           ) : (
//                             renderAvatar(prof.name, viewMode)
//                           )}
//                           <div className="professional-info">
//                             <h3 className="professional-name">{prof.name}</h3>
//                             <div className="rating">
//                               {renderStars(prof.rating)}
//                               <span className="rating-score">{prof.rating}</span>
//                             </div>
//                             <div className="profession">{prof.profession}</div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="right-box">
//                         <div className="info-section">
//                           <h4 className="info-title">Experience & Qualifications:</h4>
//                           <p className="info-content">
//                             {prof.description} &nbsp; | &nbsp;
//                             {prof.qualifications} &nbsp; | &nbsp;
//                             {prof.profession} &nbsp; | &nbsp;
//                             {prof.start_date} - {prof.end_date}
//                           </p>
//                         </div>
//                         <div className="info-section">
//                           <h4 className="info-title">Location:</h4>
//                           <div className="info-content location-content">
//                             <MapPin size={14} style={{ marginRight: 4 }} />
//                             <span>{prof.location}</span>
//                           </div>
//                         </div>
//                         <div className="info-section">
//                           <h4 className="info-title">Availability:</h4>
//                           <div className="availability-calendar">
//                             {daysOfWeek.map((day, index) => (
//                               <div
//                                 key={day}
//                                 className={`day-cell ${availabilityMap[index] ? 'day-available' : 'day-unavailable'}`}
//                               >
//                                 {day.charAt(0)}
//                               </div>
//                             ))}
//                           </div>
//                           <p className="info-content">{prof.availability}</p>
//                         </div>
//                         <div className="card-actions">
//                           <button className="btn-book" onClick={() => handleBookNow(prof)}>
//                             Book Now
//                           </button>
//                           <button className="btn-view" onClick={() => handleViewProfile(prof)}>
//                             <Eye size={14} />
//                             <span>View Profile</span>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {!showAll && totalPages > 1 && (
//               <div className="pagination">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => handlePageChange(i + 1)}
//                     className={currentPage === i + 1 ? 'active' : ''}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Profile Modal */}
//       <Modal
//         title={`${selectedProfessional?.name}'s Profile`}
//         open={isProfileModalOpen}
//         onCancel={() => setIsProfileModalOpen(false)}
//         footer={[
//           <Button key="close" onClick={() => setIsProfileModalOpen(false)}>
//             Close
//           </Button>
//         ]}
//         width={900}
//         className="professional-profile-modal"
//       >
//         {selectedProfessional && (
//           <div className="profile-content">
//             <Row gutter={16} align="middle" className="profile-header">
//               <Col span={4}>
//                 {selectedProfessional.image ? (
//                   <img
//                     src={selectedProfessional.image}
//                     alt="Profile"
//                     className="profile-image"
//                   />
//                 ) : (
//                   <div className="avatar-placeholder">
//                     {selectedProfessional.name ? selectedProfessional.name.charAt(0).toUpperCase() : 'U'}
//                   </div>
//                 )}
//               </Col>
//               <Col span={20} className="profile-info">
//                 <h3>{selectedProfessional.name}</h3>
//                 <p className="profession">{selectedProfessional.profession}</p>
//                 <Rate disabled allowHalf value={selectedProfessional.rating} className="rating" />
//               </Col>
//             </Row>
//             <Row gutter={[16, 16]} className="details-row">
//               <Col span={8}>
//                 <div className="details-card">
//                   <h4>Personal Details</h4>
//                   <p><strong>Name:</strong> {selectedProfessional.name}</p>
//                   <p><strong>Gender:</strong> {selectedProfessional.gender || '-Not Set-'}</p>
//                   <p><strong>Date of Birth:</strong> {selectedProfessional.date_of_birth || '-Not Set-'}</p>
//                   <p><strong>Marital Status:</strong> {selectedProfessional.marital_status || '-Not Set-'}</p>
//                   <p><strong>Nationality:</strong> {selectedProfessional.nationality || '-Not Set-'}</p>
//                 </div>
//               </Col>
//               <Col span={8}>
//                 <div className="details-card">
//                   <h4>Professional Details</h4>
//                   <p><strong>Qualification:</strong> {selectedProfessional.qualifications || '-Not Set-'}</p>
//                   <p><strong>Position:</strong> {selectedProfessional.position || '-Not Set-'}</p>
//                   <p><strong>Experience:</strong> {selectedProfessional.experience} years</p>
//                   <p><strong>Location:</strong> <EnvironmentOutlined /> {selectedProfessional.location}</p>
//                   <p><strong>Availability:</strong> {selectedProfessional.availability}</p>
//                 </div>
//               </Col>
//               <Col span={8}>
//                 <div className="details-card">
//                   <h4>Contact Information</h4>
//                   <p><strong>Email:</strong> {selectedProfessional.email || '-Not Set-'}</p>
//                   <p><strong>Mobile Number:</strong> {selectedProfessional.mobile_number || '-Not Set-'}</p>
//                   <p><strong>Work Number:</strong> {selectedProfessional.work_number || '-Not Set-'}</p>
//                   <p><strong>Residence Number:</strong> {selectedProfessional.residence_number || '-Not Set-'}</p>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         )}
//       </Modal>

//       {/* Booking Modal */}
//       <Modal
//         // title={`Book ${selectedProfessional?.name}`}
//         title={`Bookig Confirmation`}
//         open={isBookingModalOpen}
//         onCancel={() => setIsBookingModalOpen(false)}
//         footer={null}
//         width={800}
//         className="booking-modal"
//       >
//         {selectedProfessional && (
//           <div className="booking-container">
//             <div className="doctor-info-section">
//               <div className="doctor-avatar">
//                 {selectedProfessional.image ? (
//                   <img src={selectedProfessional.image} alt="Doctor" />
//                 ) : (
//                   <div className="avatar-placeholder">
//                     {selectedProfessional.name.charAt(0)}
//                   </div>
//                 )}
//               </div>
//               <div className="doctor-details">
//                 <h2> {selectedProfessional.name}</h2>
//                 <div className="specialty">
//                   {selectedProfessional.profession} - {selectedProfessional.location}
//                 </div>
//                 <div className="rating">
//                   <Star className="filled" />
//                   <Star className="filled" />
//                   <Star className="filled" />
//                   <Star className="filled" />
//                   <Star className="half-filled" />
//                   <span>4.5</span>
//                 </div>
//               </div>
//             </div>

//             <div className="booking-content">
//               <div className="dates-section">
//                 <h3>Available Dates</h3>
//                 <div className="dates-grid">
//                   {['1 Oct', '2 Oct', '3 Oct', '5 Oct'].map(date => (
//                     <div
//                       key={date}
//                       className={`date-cell ${selectedDate === date ? 'selected' : ''}`}
//                       onClick={() => setSelectedDate(date)}
//                     >
//                       <div>{date.split(' ')[1] === '1' ? 'Sun' : 
//                             date.split(' ')[1] === '2' ? 'Mon' :
//                             date.split(' ')[1] === '3' ? 'Tue' : 'Thu'}</div>
//                       <div>{date}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="times-section">
//                 <h3>Select Time</h3>
//                 <div className="time-slots-horizontal">
//                   {['09:00 - 13:00', '13:00 - 17:00', '17:00 - 21:00'].map(time => (
//                     <div
//                       key={time}
//                       className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
//                       onClick={() => setSelectedTime(time)}
//                     >
//                       {time}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="divider"></div>

//               <div className="booking-details">
//                 <h3>Booking Details</h3>
//                 <div className="detail-row">
//                   <label>Name</label>
//                   <Input placeholder="Your name" />
//                 </div>
//                 <div className="detail-row">
//                   <label>Service</label>
//                   <Input defaultValue={`${selectedProfessional.profession} for walk-in clinic`} />
//                 </div>
//                 <div className="detail-row">
//                   <label>Department</label>
//                   <Select
//                     defaultValue="Primary Care"
//                     style={{ width: '100%' }}
//                     optionLabelProp="label"
//                   >
//                     <Select.Option value="Primary Care" label="Primary Care">
//                       <div className="full-option">
//                         <div className="option-title">Primary Care</div>
//                         <div className="option-description">General medical services</div>
//                       </div>
//                     </Select.Option>
//                     <Select.Option value="Cardiology" label="Cardiology">
//                       <div className="full-option">
//                         <div className="option-title">Cardiology</div>
//                         <div className="option-description">Heart and vascular services</div>
//                       </div>
//                     </Select.Option>
//                     <Select.Option value="Neurology" label="Neurology">
//                       <div className="full-option">
//                         <div className="option-title">Neurology</div>
//                         <div className="option-description">Brain and nervous system</div>
//                       </div>
//                     </Select.Option>
//                   </Select>
//                 </div>
//                 <div className="detail-row">
//                   <label>Location</label>
//                   <Select
//                     defaultValue="CMC Delhi"
//                     style={{ width: '100%' }}
//                     optionLabelProp="label"
//                   >
//                     <Select.Option value="CMC Delhi" label="CMC Delhi">
//                       <div className="full-option">
//                         <div className="option-title">CMC Delhi</div>
//                         <div className="option-description">Main hospital campus</div>
//                       </div>
//                     </Select.Option>
//                     <Select.Option value="CMC Mumbai" label="CMC Mumbai">
//                       <div className="full-option">
//                         <div className="option-title">CMC Mumbai</div>
//                         <div className="option-description">West region branch</div>
//                       </div>
//                     </Select.Option>
//                   </Select>
//                 </div>
//                 <div className="detail-row">
//                   <label>Additional Notes</label>
//                   <Input.TextArea 
//                     placeholder="Any special requirements or information"
//                     rows={3}
//                     value={additionalNotes}
//                     onChange={(e) => setAdditionalNotes(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="divider"></div>

//               <div className="booking-summary">
//                 <h3>Booking Summary</h3>
//                 <div className="summary-row">
//                   <span>Dr. {selectedProfessional.name} ({selectedProfessional.profession})</span>
//                 </div>
//                 <div className="summary-row">
//                   <span>Shift Time</span>
//                   <span>{selectedTime || 'Not selected'}</span>
//                 </div>
//                 <div className="summary-row">
//                   <span>Hourly Rate</span>
//                   <span>₹{selectedProfessional.hourlyRate}/hr</span>
//                 </div>
//                 <div className="summary-row">
//                   <span>Total</span>
//                   <span className="total-amount">₹{selectedProfessional.hourlyRate}</span>
//                 </div>
//               </div>

//               <div className="action-buttons">
//                 <Button 
//                   className="cancel-btn"
//                   onClick={() => setIsBookingModalOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   type="primary" 
//                   className="confirm-btn"
//                   disabled={!selectedDate || !selectedTime}
//                   onClick={() => {
//                     console.log("Booking confirmed:", { 
//                       selectedProfessional, 
//                       selectedDate, 
//                       selectedTime, 
//                       additionalNotes 
//                     });
//                     setIsBookingModalOpen(false);
//                   }}
//                 >
//                   Confirm Booking
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Search, Bell, MapPin, Star, Eye, User, List, Grid2X2, Grid3X3, Square, ListTodo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Rate, Tag, Input, Select, Divider, Row, Col, Spin, Alert } from 'antd';
import { EnvironmentOutlined, CloseOutlined } from '@ant-design/icons';
import { fetchAllUsers, fetchAllAvailability, fetchAllQualifications, fetchAllLocations, fetchAllRoles } from '../../services/api';
import './Findprofessional.css';

export default function FindProfessionals() {
  // State for UI controls
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const professionalsPerPage = 4;

  // State for filters
  const [selectedFilters, setSelectedFilters] = useState({
    profession: [],
    location: [],
    qualifications: [],
    availability: { from: '', to: '' },
  });

  // State for modals
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Stores day (e.g., "Monday")
  const [selectedTime, setSelectedTime] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // State for data fetching
  const [professions, setProfessions] = useState([]);
  const [professionalsData, setProfessionalsData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [qualificationsList, setQualificationsList] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  const navigate = useNavigate();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch initial data (roles, users, filters)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roles, users, locData, qualData] = await Promise.all([
          fetchAllRoles(),
          fetchAllUsers(),
          fetchAllLocations(),
          fetchAllQualifications(),
        ]);

        setProfessions(Array.isArray(roles) ? roles : []);
        setLocations(locData.map(loc => loc.name));
        setQualificationsList(qualData.map(qual => qual.name));

        const formattedUsers = users.map(user => ({
          id: user.id || user._id || Math.random().toString(36).substr(2, 9),
          name: user?.username || 'Unknown',
          image: user.image || null,
          rating: user.rating || 0,
          experience: user.experience || 'No experience data',
          location: user?.location?.[0]?.name || 'Unknown location',
          availability: user?.availability?.label || 'No availability data',
          profession: user?.userrole?.[0]?.name || 'Unknown',
          qualifications: user.qualification || [],
          hourlyRate: user.consultation_fee || 0,
          gender: user.gender || 'Unknown',
          date_of_birth: user.date_of_birth || 'Unknown',
          marital_status: user.marital_status || 'Unknown',
          nationality: user.nationality || 'Unknown',
          position: user.position || 'Unknown',
          email: user.email || 'Unknown',
          mobile_number: user.mobile_number || 'Unknown',
          work_number: user.work_number || 'Unknown',
          residence_number: user.residence_number || 'Unknown',
          start_date: user.start_date || 'Unknown',
          end_date: user.end_date || 'Unknown',
          description: user.description || 'Unknown',
          status: user.status || null,
        }));
        setProfessionalsData(formattedUsers);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // Fetch availability for booking modal
  useEffect(() => {
    if (isBookingModalOpen && selectedProfessional?.id) {
      const fetchAvailability = async () => {
        setIsLoadingAvailability(true);
        setAvailabilityError(null);
        try {
          const availabilityData = await fetchAllAvailability(selectedProfessional.id);
          setAvailableDays(availabilityData.days || 
            (selectedProfessional.availability !== 'No availability data' 
              ? [selectedProfessional.availability] 
              : []));
          setAvailableTimeSlots(availabilityData.timeSlots || ['09:00 - 13:00', '13:00 - 17:00', '17:00 - 21:00']);
        } catch (error) {
          console.error('Failed to fetch availability:', error);
          setAvailabilityError('Unable to load availability. Please try again later.');
        } finally {
          setIsLoadingAvailability(false);
        }
      };
      fetchAvailability();
    } else {
      setAvailableDays([]);
      setAvailableTimeSlots([]);
      setAvailabilityError(null);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [isBookingModalOpen, selectedProfessional]);

  // Filter professionals
  const filteredProfessionals = professionalsData.filter(prof => {
    if (prof.status !== 1) return false;
    if (selectedFilters.profession.length > 0 && !selectedFilters.profession.some(p => p.name === prof.profession)) return false;
    if (selectedFilters.location.length > 0 && !selectedFilters.location.some(loc => prof.location.includes(loc))) return false;
    if (selectedFilters.qualifications.length > 0 && !selectedFilters.qualifications.every(q => prof.qualifications.includes(q))) return false;
    if (selectedFilters.availability.from && !prof.availability.toLowerCase().includes(selectedFilters.availability.from.split('-')[0].toLowerCase())) return false;
    if (selectedFilters.availability.to && !prof.availability.toLowerCase().includes(selectedFilters.availability.to.split('-')[0].toLowerCase())) return false;
    if (
      searchTerm &&
      !(
        prof.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(prof.experience)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.qualifications?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) return false;
    return true;
  });

  const totalProfessionals = filteredProfessionals.length;
  const totalPages = Math.ceil(totalProfessionals / professionalsPerPage);
  const paginatedProfessionals = showAll
    ? filteredProfessionals
    : filteredProfessionals.slice((currentPage - 1) * professionalsPerPage, currentPage * professionalsPerPage);

  // Handlers
  const handleFilterChange = (type, value) => {
    setCurrentPage(1);
    if (type === 'profession') {
      setSelectedFilters(prev => ({
        ...prev,
        profession: prev.profession.some(p => p.id === value.id)
          ? prev.profession.filter(p => p.id !== value.id)
          : [...prev.profession, value],
      }));
    } else if (type === 'location' || type === 'qualifications') {
      setSelectedFilters(prev => ({
        ...prev,
        [type]: prev[type].includes(value) ? prev[type].filter(l => l !== value) : [...prev[type], value],
      }));
    }
  };

  const handleAvailabilityChange = (field, value) => {
    setCurrentPage(1);
    setSelectedFilters(prev => ({
      ...prev,
      availability: { ...prev.availability, [field]: value },
    }));
  };

  const removeFilter = (type, value) => {
    if (type === 'profession') {
      setSelectedFilters(prev => ({
        ...prev,
        profession: prev.profession.filter(p => p.id !== value.id),
      }));
    } else if (type === 'location' || type === 'qualifications') {
      setSelectedFilters(prev => ({
        ...prev,
        [type]: prev[type].filter(l => l !== value),
      }));
    } else if (type === 'availability') {
      setSelectedFilters(prev => ({
        ...prev,
        availability: { from: '', to: '' },
      }));
    }
  };

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleShowAllToggle = () => setShowAll(prev => !prev);
  const handlePageChange = page => setCurrentPage(page);
  const handleBookNow = professional => {
    setSelectedProfessional(professional);
    setIsBookingModalOpen(true);
  };
  const handleViewProfile = professional => {
    setSelectedProfessional(professional);
    setIsProfileModalOpen(true);
  };

  // Helpers
  const renderStars = rating => (
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ))
  );

  const getAvailabilityMap = availability => {
    const map = Array(7).fill(false);
    if (availability) {
      const dayIndex = daysOfWeek.indexOf(availability);
      if (dayIndex !== -1) map[dayIndex] = true;
    }
    return map;
  };

  const renderAvatar = (name, viewMode) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : 'U';
    const size = viewMode === 'small' ? '50px' : viewMode === 'medium' ? '70px' : '100px';
    return (
      <div
        className="avatar-placeholder"
        style={{
          width: size,
          height: size,
          borderRadius: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1890ff',
          color: '#fff',
          fontSize: viewMode === 'small' ? '20px' : viewMode === 'medium' ? '24px' : '30px',
          fontWeight: 'bold',
        }}
      >
        {firstLetter}
      </div>
    );
  };

  const getShortDayName = day => day.substring(0, 3);

  const viewModes = [
    { id: 'list', icon: <List size={20} />, title: 'List view' },
    { id: 'details', icon: <ListTodo size={20} />, title: 'Detailed list' },
    { id: 'large', icon: <Square size={20} />, title: 'Large cards' },
    { id: 'medium', icon: <Grid2X2 size={20} />, title: 'Medium cards' },
    { id: 'small', icon: <Grid3X3 size={20} />, title: 'Small cards' },
  ];

  return (
    <div className="container">
      <div className="main-content">
        <div className="top-header">
          <h1>Find Healthcare Professionals</h1>
          <div className="notification-icon">
            <Bell size={20} />
          </div>
        </div>
        <div className="content-wrapper">
          <div className="filters-panel-container">
            <div className="filters-panel">
              <h2 className="filters-title">Filters</h2>
              <div className="filter-group">
                <h3>Profession</h3>
                <div className="checkbox-group">
                  {professions.length > 0 ? (
                    professions.map(prof => (
                      <div className="checkbox-item" key={prof.id}>
                        <input
                          type="checkbox"
                          id={prof.id}
                          checked={selectedFilters.profession.some(p => p.id === prof.id)}
                          onChange={() => handleFilterChange('profession', prof)}
                        />
                        <label htmlFor={prof.id}>{prof.name}</label>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#888' }}>No professions available</p>
                  )}
                </div>
              </div>
              <div className="filter-group">
                <h3>Availability</h3>
                <div className="date-group">
                  <div className="date-input">
                    <label>From</label>
                    <input
                      type="date"
                      value={selectedFilters.availability.from}
                      onChange={e => handleAvailabilityChange('from', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="date-input">
                    <label>To</label>
                    <input
                      type="date"
                      value={selectedFilters.availability.to}
                      onChange={e => handleAvailabilityChange('to', e.target.value)}
                      min={selectedFilters.availability.from || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
              <div className="filter-group">
                <h3>Location</h3>
                <div className="checkbox-group">
                  {locations.map(loc => (
                    <div className="checkbox-item" key={loc}>
                      <input
                        type="checkbox"
                        id={loc}
                        checked={selectedFilters.location.includes(loc)}
                        onChange={() => handleFilterChange('location', loc)}
                      />
                      <label htmlFor={loc}>{loc}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h3>Qualifications</h3>
                <div className="checkbox-group">
                  {qualificationsList.map(q => (
                    <div className="checkbox-item" key={q}>
                      <input
                        type="checkbox"
                        id={q}
                        checked={selectedFilters.qualifications.includes(q)}
                        onChange={() => handleFilterChange('qualifications', q)}
                      />
                      <label htmlFor={q}>{q}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="filter-buttons">
                <button className="btn-primary" onClick={() => setCurrentPage(1)}>
                  Apply Filters
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedFilters({ profession: [], location: [], qualifications: [], availability: { from: '', to: '' } });
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
          <div className="results-area">
            <div className="search-section">
              <div className="search-bar-container">
                <div className="search-input-wrapper">
                  <Search size={24} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search for healthcare professionals..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <button className="search-btn">Search</button>
                </div>
              </div>
              <div className="filter-tags-container">
                {selectedFilters.profession.map(prof => (
                  <Tag
                    key={prof.id}
                    closable
                    onClose={() => removeFilter('profession', prof)}
                    className="filter-tag"
                    closeIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
                  >
                    {prof.name}
                  </Tag>
                ))}
                {selectedFilters.location.map(loc => (
                  <Tag
                    key={loc}
                    closable
                    onClose={() => removeFilter('location', loc)}
                    className="filter-tag"
                    closeIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
                  >
                    {loc}
                  </Tag>
                ))}
                {selectedFilters.qualifications.map(qual => (
                  <Tag
                    key={qual}
                    closable
                    onClose={() => removeFilter('qualifications', qual)}
                    className="filter-tag"
                    closeIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
                  >
                    {qual}
                  </Tag>
                ))}
                {/* (selectedFilters.availability.from || selectedFilters.availability.to) && (
                  <Tag
                    closable
                    onClose={() => removeFilter('availability')}
                    className="filter-tag"
                    closeIcon={<CloseOutlined style={{ fontSize: '12px' }} />}
                  >
                    {`${selectedFilters.availability.from || ''} ${selectedFilters.availability.to ? 'to ' + selectedFilters.availability.to : ''}`}
                  </Tag>
                ) */}
              </div>
              <div className="results-header">
                <p className="results-count">{filteredProfessionals.length} professionals found</p>
                <div className="view-controls">
                  <div className="sort-section">
                    <label>Sort by:</label>
                    <select className="sort-select">
                      <option>Relevance</option>
                      <option>Distance</option>
                      <option>Rating</option>
                    </select>
                  </div>
                  <div className="view-mode-selector">
                    {viewModes.map(mode => (
                      <button
                        key={mode.id}
                        className={`view-mode-btn ${viewMode === mode.id ? 'active' : ''}`}
                        title={mode.title}
                        onClick={() => setViewMode(mode.id)}
                      >
                        {mode.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={`professionals-grid ${viewMode}`}>
              {paginatedProfessionals.length === 0 && <div className="no-results">No verified professionals found.</div>}
              {paginatedProfessionals.map(prof => {
                const availabilityMap = getAvailabilityMap(prof.availability);
                return (
                  <div className={`professional-card ${viewMode}`} key={prof.id}>
                    <div className="two-column-layout">
                      <div className="left-box">
                        <div className="card-header">
                          {prof.image ? (
                            <img src={prof.image} alt={`${prof.name}'s profile`} className="professional-avatar" />
                          ) : (
                            renderAvatar(prof.name, viewMode)
                          )}
                          <div className="professional-info">
                            <h3 className="professional-name">{prof.name}</h3>
                            <div className="rating">
                              {renderStars(prof.rating)}
                              <span className="rating-score">{prof.rating}</span>
                            </div>
                            <div className="profession">{prof.profession}</div>
                          </div>
                        </div>
                      </div>
                      <div className="right-box">
                        <div className="info-section">
                          <h4 className="info-title">Experience & Qualifications:</h4>
                          <p className="info-content">
                            {prof.description} | {prof.qualifications} | {prof.profession} | {prof.start_date} - {prof.end_date}
                          </p>
                        </div>
                        <div className="info-section">
                          <h4 className="info-title">Location:</h4>
                          <div className="info-content location-content">
                            <MapPin size={14} style={{ marginRight: 4 }} />
                            <span>{prof.location}</span>
                          </div>
                        </div>
                        <div className="info-section">
                          <h4 className="info-title">Availability:</h4>
                          <div className="availability-calendar">
                            {daysOfWeek.map((day, index) => (
                              <div
                                key={day}
                                className={`day-cell ${availabilityMap[index] ? 'day-available' : 'day-unavailable'}`}
                              >
                                {day.charAt(0)}
                                <span className="status-icon">{availabilityMap[index] ? '✔️' : '❌'}</span>
                              </div>
                            ))}
                          </div>
                          <p className="info-content">{prof.availability}</p>
                        </div>
                        <div className="card-actions">
                          <button className="btn-book" onClick={() => handleBookNow(prof)}>
                            Book Now
                          </button>
                          <button className="btn-view" onClick={() => handleViewProfile(prof)}>
                            <Eye size={14} />
                            <span>View Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {!showAll && totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Modal
        title={`${selectedProfessional?.name}'s Profile`}
        open={isProfileModalOpen}
        onCancel={() => setIsProfileModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsProfileModalOpen(false)}>Close</Button>]}
        width={900}
        className="professional-profile-modal"
      >
        {selectedProfessional && (
          <div className="profile-content">
            <Row gutter={16} align="middle" className="profile-header">
              <Col span={4}>
                {selectedProfessional.image ? (
                  <img src={selectedProfessional.image} alt="Profile" className="profile-image" />
                ) : (
                  <div className="avatar-placeholder">
                    {selectedProfessional.name ? selectedProfessional.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </Col>
              <Col span={20} className="profile-info">
                <h3>{selectedProfessional.name}</h3>
                <p className="profession">{selectedProfessional.profession}</p>
                <Rate disabled allowHalf value={selectedProfessional.rating} className="rating" />
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="details-row">
              <Col span={8}>
                <div className="details-card">
                  <h4>Personal Details</h4>
                  <p><strong>Name:</strong> {selectedProfessional.name}</p>
                  <p><strong>Gender:</strong> {selectedProfessional.gender || '-Not Set-'}</p>
                  <p><strong>Date of Birth:</strong> {selectedProfessional.date_of_birth || '-Not Set-'}</p>
                  <p><strong>Marital Status:</strong> {selectedProfessional.marital_status || '-Not Set-'}</p>
                  <p><strong>Nationality:</strong> {selectedProfessional.nationality || '-Not Set-'}</p>
                </div>
              </Col>
              <Col span={8}>
                <div className="details-card">
                  <h4>Professional Details</h4>
                  <p><strong>Qualification:</strong> {selectedProfessional.qualifications || '-Not Set-'}</p>
                  <p><strong>Position:</strong> {selectedProfessional.position || '-Not Set-'}</p>
                  <p><strong>Experience:</strong> {selectedProfessional.experience} years</p>
                  <p><strong>Location:</strong> <EnvironmentOutlined /> {selectedProfessional.location}</p>
                  <p><strong>Availability:</strong> {selectedProfessional.availability}</p>
                </div>
              </Col>
              <Col span={8}>
                <div className="details-card">
                  <h4>Contact Information</h4>
                  <p><strong>Email:</strong> {selectedProfessional.email || '-Not Set-'}</p>
                  <p><strong>Mobile Number:</strong> {selectedProfessional.mobile_number || '-Not Set-'}</p>
                  <p><strong>Work Number:</strong> {selectedProfessional.work_number || '-Not Set-'}</p>
                  <p><strong>Residence Number:</strong> {selectedProfessional.residence_number || '-Not Set-'}</p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Booking Modal */}
      <Modal
        title={`Book ${selectedProfessional?.name}`}
        open={isBookingModalOpen}
        onCancel={() => setIsBookingModalOpen(false)}
        footer={null}
        width={800}
        className="booking-modal"
      >
        {selectedProfessional && (
          <div className="booking-container">
            <div className="doctor-info-section">
              <div className="doctor-avatar">
                {selectedProfessional.image ? (
                  <img src={selectedProfessional.image} alt="Doctor" />
                ) : (
                  <div className="avatar-placeholder">{selectedProfessional.name.charAt(0)}</div>
                )}
              </div>
              <div className="doctor-details">
                <h2>Dr. {selectedProfessional.name}</h2>
                <div className="specialty">
                  {selectedProfessional.profession} - {selectedProfessional.location}
                </div>
                <div className="rating">
                  <Star className="filled" />
                  <Star className="filled" />
                  <Star className="filled" />
                  <Star className="filled" />
                  <Star className="half-filled" />
                  <span>4.5</span>
                </div>
              </div>
            </div>
            <div className="booking-content">
              <div className="dates-section">
                <h3>Available Days</h3>
                {isLoadingAvailability ? (
                  <Spin tip="Loading availability..." />
                ) : availabilityError ? (
                  <Alert message={availabilityError} type="error" showIcon />
                ) : availableDays.length === 0 ? (
                  <p>No available days found.</p>
                ) : (
                  <div className="dates-grid">
                    {availableDays.map(day => (
                      <div
                        key={day}
                        className={`date-cell ${selectedDate === day ? 'selected' : ''}`}
                        onClick={() => setSelectedDate(day)}
                      >
                        {getShortDayName(day)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="times-section">
                <h3>Select Time</h3>
                {isLoadingAvailability ? (
                  <Spin tip="Loading time slots..." />
                ) : availabilityError ? (
                  <Alert message={availabilityError} type="error" showIcon />
                ) : availableTimeSlots.length === 0 ? (
                  <p>No available time slots found.</p>
                ) : (
                  <div className="time-slots-horizontal">
                    {availableTimeSlots.map(time => (
                      <div
                        key={time}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="divider" />
              <div className="booking-details">
                <h3>Booking Details</h3>
                <div className="detail-row">
                  <label>Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div className="detail-row">
                  <label>Service</label>
                  <Input defaultValue={`${selectedProfessional.profession} for walk-in clinic`} />
                </div>
                <div className="detail-row">
                  <label>Department</label>
                  <Select defaultValue="Primary Care" style={{ width: '100%' }} optionLabelProp="label">
                    <Select.Option value="Primary Care" label="Primary Care">
                      <div className="full-option">
                        <div className="option-title">Primary Care</div>
                        <div className="option-description">General medical services</div>
                      </div>
                    </Select.Option>
                    <Select.Option value="Cardiology" label="Cardiology">
                      <div className="full-option">
                        <div className="option-title">Cardiology</div>
                        <div className="option-description">Heart and vascular services</div>
                      </div>
                    </Select.Option>
                    <Select.Option value="Neurology" label="Neurology">
                      <div className="full-option">
                        <div className="option-title">Neurology</div>
                        <div className="option-description">Brain and nervous system</div>
                      </div>
                    </Select.Option>
                  </Select>
                </div>
                <div className="detail-row">
                  <label>Location</label>
                  <Select defaultValue="CMC Delhi" style={{ width: '100%' }} optionLabelProp="label">
                    <Select.Option value="CMC Delhi" label="CMC Delhi">
                      <div className="full-option">
                        <div className="option-title">CMC Delhi</div>
                        <div className="option-description">Main hospital campus</div>
                      </div>
                    </Select.Option>
                    <Select.Option value="CMC Mumbai" label="CMC Mumbai">
                      <div className="full-option">
                        <div className="option-title">CMC Mumbai</div>
                        <div className="option-description">West region branch</div>
                      </div>
                    </Select.Option>
                  </Select>
                </div>
                <div className="detail-row">
                  <label>Additional Notes</label>
                  <Input.TextArea
                    placeholder="Any special requirements or information"
                    rows={3}
                    value={additionalNotes}
                    onChange={e => setAdditionalNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="divider" />
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-row">
                  <span>Dr. {selectedProfessional.name} ({selectedProfessional.profession})</span>
                </div>
                <div className="summary-row">
                  <span>Day</span>
                  <span>{selectedDate || 'Not selected'}</span>
                </div>
                <div className="summary-row">
                  <span>Shift Time</span>
                  <span>{selectedTime || 'Not selected'}</span>
                </div>
                <div className="summary-row">
                  <span>Hourly Rate</span>
                  <span>₹{selectedProfessional.hourlyRate}/hr</span>
                </div>
                <div className="summary-row">
                  <span>Total</span>
                  <span className="total-amount">₹{selectedProfessional.hourlyRate}</span>
                </div>
              </div>
              <div className="action-buttons">
                <Button className="cancel-btn" onClick={() => setIsBookingModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  className="confirm-btn"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => {
                    console.log('Booking confirmed:', {
                      professionalId: selectedProfessional.id,
                      name: selectedProfessional.name,
                      profession: selectedProfessional.profession,
                      selectedDay: selectedDate,
                      selectedTime,
                      additionalNotes,
                    });
                    setIsBookingModalOpen(false);
                  }}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}