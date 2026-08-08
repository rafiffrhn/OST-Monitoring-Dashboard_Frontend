import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

const Navbar = () => {
  const { logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <button onClick={toggleSidebar} className="sidebar-toggle" title="Toggle Menu">
            <Menu size={22} />
          </button>
          <h1>OST Monitoring System</h1>
          <span className="navbar-subtitle">PT. CPKA</span>
        </div>
        <div className="navbar-actions">
          <div className="user-info">
            <User size={20} />
            <span>Admin</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;