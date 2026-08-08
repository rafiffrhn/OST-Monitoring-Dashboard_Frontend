import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, History, Database, Container } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

const Sidebar = () => {
  const { isOpen } = useSidebar();

  const menuItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard Monitoring' },
    { path: '/history', icon: History, label: 'Riwayat Data' },
    { path: '/dataset', icon: Database, label: 'Dataset Management' },
    { path: '/tanks', icon: Container, label: 'Tank Management' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? '' : 'sidebar-collapsed'}`}>
      {isOpen && (
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
      )}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
            title={!isOpen ? item.label : ''}
          >
            <item.icon size={20} />
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;