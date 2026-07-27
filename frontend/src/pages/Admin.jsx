import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, BookOpen, FileText, Award, TrendingUp, 
  Activity, Settings, LogOut, Search, Plus, 
  Edit, Trash2, MoreVertical, Filter, Download
} from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1234,
    totalCourses: 45,
    totalQuizzes: 89,
    totalCertificates: 567,
    activeUsers: 234,
    revenue: 45678
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'LEARNER', joined: '2026-07-20', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'LEARNER', joined: '2026-07-19', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'ADMIN', joined: '2026-07-18', status: 'active' },
  ];

  const courses = [
    { id: 1, title: 'Advanced Web Development', instructor: 'Dr. Sarah Johnson', students: 234, status: 'published' },
    { id: 2, title: 'Machine Learning Basics', instructor: 'Prof. Michael Chen', students: 189, status: 'published' },
    { id: 3, title: 'Data Science Fundamentals', instructor: 'Dr. Emily Brown', students: 156, status: 'draft' },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  if (!isAdmin) {
    return (
      <div className="admin-error">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <Users size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon courses">
            <BookOpen size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon quizzes">
            <FileText size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalQuizzes}</h3>
            <p>Total Quizzes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon certificates">
            <Award size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalCertificates}</h3>
            <p>Certificates Issued</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <Activity size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">
            <TrendingUp size={32} />
          </div>
          <div className="stat-info">
            <h3>${stats.revenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <Users size={20} />
            </div>
            <div className="activity-content">
              <p>New user registered: John Doe</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Award size={20} />
            </div>
            <div className="activity-content">
              <p>Certificate issued to Jane Smith</p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <BookOpen size={20} />
            </div>
            <div className="activity-content">
              <p>New course published: Machine Learning Basics</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search users..." className="search-input" />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.joined}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button className="btn-icon danger" title="Delete">
                      <Trash2 size={18} />
                    </button>
                    <button className="btn-icon" title="More">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="admin-courses">
      <div className="section-header">
        <h2>Course Management</h2>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Filter size={18} />
            Filter
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            Create Course
          </button>
        </div>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search courses..." className="search-input" />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Instructor</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.instructor}</td>
                <td>{course.students}</td>
                <td>
                  <span className={`status ${course.status}`}>
                    {course.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button className="btn-icon danger" title="Delete">
                      <Trash2 size={18} />
                    </button>
                    <button className="btn-icon" title="More">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage your platform efficiently</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Settings size={18} />
            Settings
          </button>
          <button onClick={logout} className="btn btn-danger">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={20} />
              Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              Users
            </button>
            <button 
              className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen size={20} />
              Courses
            </button>
            <button 
              className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quizzes')}
            >
              <FileText size={20} />
              Quizzes
            </button>
            <button 
              className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              <Award size={20} />
              Certificates
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'courses' && renderCourses()}
          {activeTab === 'quizzes' && (
            <div className="admin-placeholder">
              <FileText size={48} />
              <h2>Quiz Management</h2>
              <p>Coming soon...</p>
            </div>
          )}
          {activeTab === 'certificates' && (
            <div className="admin-placeholder">
              <Award size={48} />
              <h2>Certificate Management</h2>
              <p>Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
