import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, Droplets, Thermometer, Container, Scale, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TankVisualization from '../components/TankVisualization';
import MonitoringChart from '../components/MonitoringChart';
import api from '../api/axios';

const DashboardMonitor = () => {
  const { tankId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [tankInfo, setTankInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');

  const fetchTankInfo = async () => {
    try {
      const response = await api.get(`/tanks/${tankId}`);
      setTankInfo(response.data);
    } catch (err) {
      console.error('Error fetching tank info:', err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/monitoring/current?tank_id=${tankId}`);
      setData(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setData(null);
        setError('');
      } else {
        setError('Gagal mengambil data monitoring');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const requestOnDemand = async () => {
    try {
      setRequesting(true);
      await api.post(`/monitoring/request-data?tank_id=${tankId}`);
      alert('Permintaan data dikirim ke perangkat IoT');
      setTimeout(() => fetchData(), 3000);
    } catch (err) {
      alert('Gagal mengirim permintaan data');
    } finally {
      setRequesting(false);
    }
  };

  useEffect(() => {
    fetchTankInfo();
    fetchData();
    const interval = setInterval(fetchData, 3600000);
    return () => clearInterval(interval);
  }, [tankId]);

  if (loading && !data) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <main className="content">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Memuat data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content">
          <div className="dashboard-container">
            <div className="dashboard-header">
              <div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                  style={{ marginBottom: '0.75rem', padding: '6px 14px', fontSize: '0.85rem' }}
                >
                  <ArrowLeft size={16} />
                  Kembali ke Overview
                </button>
                <h1>{tankInfo?.name || `Tank ${tankId}`} — Detail Monitoring</h1>
                <p className="text-muted">
                  Data terakhir: {data ? new Date(data.timestamp).toLocaleString('id-ID') : '-'}
                  {tankInfo?.location && ` — ${tankInfo.location}`}
                </p>
              </div>
              <button
                onClick={requestOnDemand}
                className="btn-primary"
                disabled={requesting}
              >
                <RefreshCw size={20} className={requesting ? 'spinning' : ''} />
                {requesting ? 'Meminta Data...' : 'Request Data On-Demand'}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-grid">
              <div className="dashboard-card tank-card">
                <h3>Visualisasi OST — {tankInfo?.name || `Tank ${tankId}`}</h3>
                <TankVisualization
                  height={data ? parseFloat(data.ketinggian) : 0}
                  maxHeight={tankInfo?.max_height || 1067.5}
                />
              </div>

              <div className="dashboard-metrics">
                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#2563eb1a' }}>
                    <Droplets size={32} style={{ color: '#2563eb' }} />
                  </div>
                  <div className="metric-content">
                    <h4>Ketinggian CPO</h4>
                    <p className="metric-value">
                      {data ? `${parseFloat(data.ketinggian).toFixed(2)} cm` : '-'}
                    </p>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#dc26261a' }}>
                    <Thermometer size={32} style={{ color: '#dc2626' }} />
                  </div>
                  <div className="metric-content">
                    <h4>Suhu CPO</h4>
                    <p className="metric-value">
                      {data ? `${parseFloat(data.suhu).toFixed(1)} °C` : '-'}
                    </p>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#16a34a1a' }}>
                    <Container size={32} style={{ color: '#16a34a' }} />
                  </div>
                  <div className="metric-content">
                    <h4>Volume CPO</h4>
                    <p className="metric-value">
                      {data ? `${parseFloat(data.volume).toFixed(2)} L` : '-'}
                    </p>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon" style={{ backgroundColor: '#f59e0b1a' }}>
                    <Scale size={32} style={{ color: '#f59e0b' }} />
                  </div>
                  <div className="metric-content">
                    <h4>Massa Jenis</h4>
                    <p className="metric-value">
                      {data ? `${parseFloat(data.massa_jenis).toFixed(2)} kg/m³` : '-'}
                    </p>
                  </div>
                </div>

                <div className="metric-card metric-card-highlight">
                  <div className="metric-icon" style={{ backgroundColor: '#9333ea1a' }}>
                    <Scale size={32} style={{ color: '#9333ea' }} />
                  </div>
                  <div className="metric-content">
                    <h4>Massa Total CPO</h4>
                    <p className="metric-value">
                      {data ? `${parseFloat(data.massa_total).toFixed(2)} ton` : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <MonitoringChart tankId={parseInt(tankId)} />

            <div className="dashboard-info">
              <h3>Informasi Sistem</h3>
              <ul>
                <li>Data diperbarui otomatis setiap 1 jam</li>
                <li>Gunakan tombol "Request Data On-Demand" untuk pembacaan real-time</li>
                <li>Massa jenis ditentukan berdasarkan dataset kalibrasi</li>
                <li>Volume dihitung menggunakan rumus: V = π × r² × t</li>
                <li>Massa total dihitung menggunakan rumus: m = ρ × V</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardMonitor;