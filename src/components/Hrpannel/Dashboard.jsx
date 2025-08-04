// import React from "react";
// import { Box, Typography, Grid, Paper, Button, Avatar } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { FaUserMd, FaCalendarAlt, FaFileInvoiceDollar, FaSearch } from "react-icons/fa";

// const StatCard = ({ title, value, subtitle, icon }) => (
//   <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
//     <Box display="flex" alignItems="center" mb={1}>
//       {icon}
//       <Typography variant="subtitle2" color="textSecondary" ml={1}>{title}</Typography>
//     </Box>
//     <Typography variant="h4" fontWeight="bold">{value}</Typography>
//     <Typography variant="caption" color="textSecondary">{subtitle}</Typography>
    
//   </Paper>
// );

// const ActionCard = ({ title, description, buttonLabel, onClick, icon }) => (
//   <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
//     <Box display="flex" alignItems="center" mb={1}>
//       {icon}
//       <Typography variant="subtitle1" ml={1}>{title}</Typography>
//     </Box>
//     <Typography variant="body2" sx={{ my: 1, flexGrow: 1 }}>{description}</Typography>
//     <Button variant="contained" onClick={onClick} sx={{ alignSelf: 'flex-start' }}>{buttonLabel}</Button>
//   </Paper>
// );

// const RecentBookingItem = ({ professional, date, status }) => {
//   const statusColors = {
//     Confirmed: { bg: '#e6fffa', color: '#38b2ac' },
//     Pending: { bg: '#fffaf0', color: '#ed8936' },
//     Cancelled: { bg: '#fff5f5', color: '#f56565' }
//   };

//   return (
//     <Box display="flex" alignItems="center" p={2} borderBottom="1px solid #eee">
//       <Avatar sx={{ bgcolor: '#3182ce', mr: 2 }}>{professional.charAt(0)}</Avatar>
//       <Box flexGrow={1}>
//         <Typography fontWeight="bold">{professional}</Typography>
//         <Typography variant="body2" color="textSecondary">{date}</Typography>
//       </Box>
//       <Box 
//         sx={{ 
//           bgcolor: statusColors[status]?.bg, 
//           color: statusColors[status]?.color,
//           px: 1.5,
//           py: 0.5,
//           borderRadius: 4,
//           fontSize: 12,
//           fontWeight: 'bold'
//         }}
//       >
//         {status}
//       </Box>
//     </Box>
//   );
// };

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));

//   const handleLogout = () => {
//     localStorage.removeItem('currentUser');
//     navigate('/login');
//   };

//   // Sample data - replace with real data from your backend
//   const stats = {
//     totalBookings: 12,
//     availableProfessionals: 6,
//     pendingBookings: 3,
//     confirmedBookings: 9
//   };

//   const recentBookings = [
//     { professional: "Dr. Sarah Johnson", date: "Today, 09:00 - 17:00", status: "Confirmed" },
//     { professional: "Dr. Michael Patel", date: "Tomorrow, 13:00 - 21:00", status: "Pending" },
//     { professional: "Nurse Rebecca", date: "Oct 17, 08:00 - 16:00", status: "Confirmed" }
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Box>
//           <Typography variant="h4" fontWeight="bold">Welcome, {currentUser?.name || 'User'}</Typography>
//           <Typography variant="body2" color="textSecondary">
//             Manage your healthcare staffing needs efficiently with LocumLink.
//           </Typography>
//         </Box>
//         <Button variant="outlined" onClick={handleLogout}>Logout</Button>
//       </Box>

//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Total Bookings" 
//             value={stats.totalBookings} 
//             subtitle="Across all departments"
//             icon={<FaCalendarAlt color="#3182ce" />}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Available Professionals" 
//             value={stats.availableProfessionals} 
//             subtitle="Ready to be booked"
//             icon={<FaUserMd color="#38a169" />}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Pending Bookings" 
//             value={stats.pendingBookings} 
//             subtitle="Awaiting confirmation"
//             icon={<FaFileInvoiceDollar color="#dd6b20" />}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Confirmed Bookings" 
//             value={stats.confirmedBookings} 
//             subtitle="Ready to go"
//             icon={<FaCalendarAlt color="#38b2ac" />}
//           />
//         </Grid>
//       </Grid>

//       <Typography variant="h6" fontWeight="bold" mb={2}>Quick Actions</Typography>
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} md={4}>
//           <ActionCard
//             title="Find Professionals"
//             description="Search for healthcare professionals based on your requirements."
//             buttonLabel="Find Now"
//             onClick={() => navigate("/find-professionals")}
//             icon={<FaSearch color="#3182ce" />}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <ActionCard
//             title="Manage Bookings"
//             description="View and manage all your current bookings in one place."
//             buttonLabel="View Bookings"
//             onClick={() => navigate("/BookingsPage")}
//             icon={<FaCalendarAlt color="#3182ce" />}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <ActionCard
//             title="Staffing Reports"
//             description="Generate reports on your staffing needs and utilization."
//             buttonLabel="Coming Soon"
//             icon={<FaFileInvoiceDollar color="#3182ce" />}
//           />
//         </Grid>
//       </Grid>

//       <Typography variant="h6" fontWeight="bold" mb={2}>Recent Activity</Typography>
//       <Paper elevation={1}>
//         {recentBookings.length > 0 ? (
//           recentBookings.map((booking, index) => (
//             <RecentBookingItem
//               key={index}
//               professional={booking.professional}
//               date={booking.date}
//               status={booking.status}
//             />
//           ))
//         ) : (
//           <Box p={3} textAlign="center">
//             <Typography mb={2}>No recent activity to show</Typography>
//             <Button 
//               variant="contained" 
//               onClick={() => navigate("/find-professionals")}
//             >
//               Book Your First Professional
//             </Button>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default Dashboard;


import React from "react";
import { Box, Typography, Grid, Paper, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaFileInvoiceDollar, FaSearch } from "react-icons/fa";
import "./Dashboard.css";

// ========== Stat Card ========== //
const StatCard = ({ title, value, subtitle, icon }) => (
  <Paper elevation={1} className="stat-card">
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      {icon}
    </Box>
    <Typography variant="h5" fontWeight="bold">{value}</Typography>
    <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
  </Paper>
);

// ========== Action Card ========== //
const ActionCard = ({ title, description, buttonLabel, onClick, icon }) => (
  <Paper elevation={1} className="action-card">
    <Box display="flex" alignItems="center" gap={1}>
      {icon}
      <Typography variant="subtitle1">{title}</Typography>
    </Box>
    <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 1 }}>{description}</Typography>
    <Button
      variant={buttonLabel === "Coming Soon" ? "outlined" : "contained"}
      disabled={buttonLabel === "Coming Soon"}
      onClick={onClick}
      sx={{ mt: 1, textTransform: 'none' }}
    >
      {buttonLabel}
    </Button>
  </Paper>
);

// ========== Recent Booking Item ========== //
const RecentBookingItem = ({ professional, date, status }) => {
  const statusColors = {
    Confirmed: { bg: '#e6fffa', color: '#38b2ac' },
    Pending: { bg: '#fffaf0', color: '#ed8936' },
    Cancelled: { bg: '#fff5f5', color: '#f56565' }
  };

  return (
    <Box display="flex" alignItems="center" p={2} borderBottom="1px solid #eee">
      <Avatar sx={{ bgcolor: '#3182ce', width: 40, height: 40, mr: 2 }}>
        {professional.charAt(0)}
      </Avatar>
      <Box flexGrow={1}>
        <Typography fontWeight="bold">{professional}</Typography>
        <Typography variant="body2" color="text.secondary">{date}</Typography>
      </Box>
      <Box sx={{
        bgcolor: statusColors[status]?.bg,
        color: statusColors[status]?.color,
        px: 1.5,
        py: 0.5,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 'bold'
      }}>
        {status}
      </Box>
    </Box>
  );
};

// ========== Dashboard ========== //
const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const stats = {
    totalBookings: 0,
    availableProfessionals: 6,
    pendingBookings: 0,
    confirmedBookings: 0
  };

  const recentBookings = [];

  return (
    <Box className="dashboard-wrapper">
      <Box className="dashboard-header">
        <Box>
          <Typography variant="h4" fontWeight="bold" mb={0.5}>
            Welcome, {currentUser?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your healthcare staffing needs efficiently with LocumLink.
          </Typography>
        </Box>
        {/* Logout button removed */}
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 , display: 'flex' }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            subtitle="Across all departments"
            icon={<FaCalendarAlt color="#3182ce" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available Professionals"
            value={stats.availableProfessionals}
            subtitle="Ready to be booked"
            icon={<FaUserMd color="#38a169" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            subtitle="Awaiting confirmation"
            icon={<FaFileInvoiceDollar color="#dd6b20" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Confirmed Bookings"
            value={stats.confirmedBookings}
            subtitle="Ready to go"
            icon={<FaCalendarAlt color="#38b2ac" />}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" fontWeight="bold" mb={2}>Quick Actions</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <ActionCard
                title="Find Professionals"
                description="Search for healthcare professionals based on your choice."
                buttonLabel="Find Now"
                onClick={() => navigate("/find-professionals")}
                icon={<FaSearch color="#3182ce" />}
              />
            </Grid>
            <Grid item xs={4}>
              <ActionCard
                title="Manage Bookings"
                description="View and manage all your current bookings in one place."
                buttonLabel="View Bookings"
                onClick={() => navigate("/BookingsPage")}
                icon={<FaCalendarAlt color="#3182ce" />}
              />
            </Grid>
            <Grid item xs={4}>
              <ActionCard
                title="Staffing Reports"
                description="Generate reports on your staffing needs and utilization."
                buttonLabel="Coming Soon"
                onClick={() => {}}
                icon={<FaFileInvoiceDollar color="#3182ce" />}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Typography variant="h6" fontWeight="bold" mb={2}>Recent Activity</Typography>
      <Paper elevation={1}>
        {recentBookings.length > 0 ? (
          recentBookings.map((booking, index) => (
            <RecentBookingItem
              key={index}
              professional={booking.professional}
              date={booking.date}
              status={booking.status}
            />
          ))
        ) : (
          <Box p={3} textAlign="center">
            <Typography mb={2}>No recent activity to show</Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/find-professionals")}
            >
              Book Your First Professional
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;