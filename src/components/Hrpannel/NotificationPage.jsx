import React from 'react';
import './NotificationPage.css';
import { Bell, MoreVertical } from 'lucide-react';

const notifications = [
  {
    id: 1,
    name: 'Jackie Monroe',
    message: 'requests permission to change Design System',
    time: '5 min ago',
    category: 'Project',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Chris Graham',
    message: 'has added a new employee',
    time: '28 min ago',
    category: 'Employee',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'Paul Miller',
    message: 'has added a new project Mobile App',
    time: '12 hours ago',
    category: 'Project',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    name: 'Oliver Wilson',
    message: 'has added a new vendor and changed the client',
    time: '3 days ago',
    category: 'Vendor & Client',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 5,
    name: 'Marilyn Cooper',
    message: 'mentioned you in a comment: “The new UI colors look vibrant and stunning.”',
    time: '1 week ago',
    category: 'Project',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 6,
    name: 'Edward Simpson',
    message: 'requests permission to change Keynote Presentation',
    time: '2 weeks ago',
    category: 'Project',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
];

const NotificationPage = () => {
  return (
    <div className="notification-wrapper">
      <div className="notification-container">
        <div className="notification-header">
          <h2>Notifications</h2>
          <div className="notification-bell">
            <Bell size={20} />
            <div className="notification-badge">2</div>
          </div>
        </div>
        <div className="notification-list">
          {notifications.map((item, index) => (
            <div key={item.id} className={`notification-item ${index % 2 === 0 ? 'highlight' : ''}`}>
              <img src={item.avatar} alt={item.name} className="avatar" />
              <div className="notification-content">
                <span>
                  <strong>{item.name}</strong> {item.message}
                </span>
                <p className="meta">
                  {item.category} • {item.time}
                </p>
              </div>
              <MoreVertical size={18} className="more-icon" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
