import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, History, Database, TrendingUp, Container } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Monitoring',
      description: 'Pantau data ketinggian, suhu, volume, dan massa CPO secara real-time untuk setiap tangki',
      path: '/dashboard',
      color: '#670E10'
    },
    {
      icon: History,
      title: 'Riwayat Data',
      description: 'Lihat histori data monitoring dengan filter tanggal dan tangki',
      path: '/history',
      color: '#10b981'
    },
    {
      icon: Database,
      title: 'Dataset Management',
      description: 'Kelola dataset massa jenis berdasarkan suhu',
      path: '/dataset',
      color: '#f59e0b'
    },
    {
      icon: Container,
      title: 'Tank Management',
      description: 'Kelola data nama, lokasi, ketinggian, dan jari-jari tangki. Serta, tambahkan atau hapus tangki.',
      path: '/tanks',
      color: '#2563eb'
    }
  ];

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content">
          <div className="home-container">
            <div className="home-header">
              <h1>Sistem Monitoring OST</h1>
              <p className="home-subtitle">
                Sistem monitoring ketinggian dan suhu Crude Palm Oil (CPO) 
                pada Oil Storage Tank berbasis IoT — mendukung multi-tangki
              </p>
            </div>

            <div className="home-stats">
              <div className="stat-card">
                <TrendingUp size={32} />
                <div>
                  <h3>Otomatis</h3>
                  <p>Monitoring real-time</p>
                </div>
              </div>
              <div className="stat-card">
                <BarChart3 size={32} />
                <div>
                  <h3>Akurat</h3>
                  <p>Perhitungan presisi</p>
                </div>
              </div>
              <div className="stat-card">
                <Database size={32} />
                <div>
                  <h3>Multi-Tangki</h3>
                  <p>Monitoring terpusat</p>
                </div>
              </div>
            </div>

            <div className="features-grid">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="feature-card"
                  onClick={() => navigate(feature.path)}
                  style={{ borderTopColor: feature.color }}
                >
                  <feature.icon size={48} style={{ color: feature.color }} />
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <button className="btn-secondary">
                    Akses Sekarang →
                  </button>
                </div>
              ))}
            </div>

            <div className="home-info">
              <h2>Tentang Sistem</h2>
              <p>
                Sistem ini dirancang untuk menggantikan metode pengukuran manual 
                (sounding) yang memiliki risiko tinggi dan rentan human error. 
                Dengan teknologi IoT, pengukuran dilakukan secara otomatis dan 
                data dapat diakses secara real-time melalui dashboard web.
                Sistem mendukung monitoring multi-tangki secara terpusat dalam 
                satu dashboard.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;