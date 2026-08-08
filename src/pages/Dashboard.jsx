import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Settings, Monitor, Droplets, Thermometer, Clock, Container } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import './DashboardOverview.css';

const Dashboard = () => {
  const [tanks, setTanks] = useState([]);
  const [tankData, setTankData] = useState({});
  const [loading, setLoading] = useState(true);
  const [requestingTank, setRequestingTank] = useState(null);
  const navigate = useNavigate();

  const fetchTanks = async () => {
    try {
      const response = await api.get('/tanks/');
      setTanks(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching tanks:', err);
      return [];
    }
  };

  const fetchTankData = async (tankId) => {
    try {
      const response = await api.get(`/monitoring/current?tank_id=${tankId}`);
      return response.data;
    } catch (err) {
      return null;
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    const tankList = await fetchTanks();
    const dataMap = {};
    for (const tank of tankList) {
      dataMap[tank.id] = await fetchTankData(tank.id);
    }
    setTankData(dataMap);
    setLoading(false);
  };

  const handleRequestData = async (tankId) => {
    try {
      setRequestingTank(tankId);
      await api.post(`/monitoring/request-data?tank_id=${tankId}`);
      alert('Permintaan data dikirim ke perangkat IoT');
      setTimeout(async () => {
        const data = await fetchTankData(tankId);
        setTankData(prev => ({ ...prev, [tankId]: data }));
        setRequestingTank(null);
      }, 3000);
    } catch (err) {
      alert('Gagal mengirim permintaan data');
      setRequestingTank(null);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getPercentage = (data, tank) => {
    if (!data) return 0;
    const height = parseFloat(data.ketinggian);
    const maxHeight = tank.max_height || 1067.5;
    return Math.min((height / maxHeight) * 100, 100);
  };

  const getStatusBadge = (percentage) => {
    if (percentage >= 70) return { label: 'High', className: 'ov-status-high' };
    if (percentage >= 30) return { label: 'Medium', className: 'ov-status-medium' };
    return { label: 'Low', className: 'ov-status-low' };
  };

  const getLiquidColor = (percentage) => {
    if (percentage >= 70) return '#ef4444';
    if (percentage >= 30) return '#eab308';
    return '#22c55e';
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <main className="content">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Memuat data tangki...</p>
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
          <div className="ov-container">
            <div className="ov-header">
              <div>
                <h1>Monitoring Storage Tanks</h1>
                <p className="text-muted">{tanks.length} tangki aktif</p>
              </div>
            </div>

            <div className="ov-grid">
              {tanks.map((tank) => {
                const data = tankData[tank.id];
                const percentage = getPercentage(data, tank);
                const status = getStatusBadge(percentage);
                const liquidColor = getLiquidColor(percentage);

                return (
                  <div key={tank.id} className="ov-card">
                    {/* Header */}
                    <div className="ov-card-header">
                      <div className="ov-card-header-left">
                        <div className="ov-card-icon">
                          <Container size={20} />
                        </div>
                        <div>
                          <h3 className="ov-card-name">{tank.name}</h3>
                          <p className="ov-card-location">{tank.location || '-'}</p>
                        </div>
                      </div>
                      <span className={`ov-status-badge ${data ? status.className : 'ov-status-none'}`}>
                        {data ? status.label : 'No Data'}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="ov-card-body">
                      {/* Left: Info text */}
                      <div className="ov-info-col">
                        <div className="ov-info-block">
                          <span className="ov-info-title">Tank Level</span>
                          <span className="ov-info-subtitle">Visualization</span>
                        </div>
                        <div className="ov-info-block">
                          <span className="ov-info-label">Volume</span>
                          <span className="ov-info-value">
                            {data ? `${parseFloat(data.volume).toFixed(2)} L` : '-'}
                          </span>
                        </div>
                        <div className="ov-info-block">
                          <span className="ov-info-label">Massa Total</span>
                          <span className="ov-info-value">
                            {data ? `${parseFloat(data.massa_total).toFixed(2)} ton` : '-'}
                          </span>
                        </div>
                      </div>

                      {/* Center: Tank Visual */}
                      <div className="ov-visual-col">
                        <div className="ov-tank-wrap">
                          <div className="ov-tank-box">
                            <div
                              className="ov-tank-liquid"
                              style={{
                                height: `${data ? percentage : 0}%`,
                                background: data
                                  ? `linear-gradient(180deg, ${liquidColor}bb 0%, ${liquidColor} 100%)`
                                  : '#e5e7eb'
                              }}
                            >
                              {percentage > 5 && <div className="ov-tank-wave"></div>}
                            </div>
                            <span className="ov-tank-pct">
                              {data ? `${percentage.toFixed(1)}%` : '-'}
                            </span>
                            <div className="ov-tank-scale">
                              <span>100%</span>
                              <span>75%</span>
                              <span>50%</span>
                              <span>25%</span>
                              <span>0%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Readings */}
                      <div className="ov-readings-col">
                        <div className="ov-reading">
                          <div className="ov-reading-head">
                            <Droplets size={14} style={{ color: '#2563eb' }} />
                            <span>Tinggi</span>
                          </div>
                          <span className="ov-reading-val">
                            {data ? `${parseFloat(data.ketinggian).toFixed(2)} cm` : '-'}
                          </span>
                        </div>
                        <div className="ov-reading">
                          <div className="ov-reading-head">
                            <Thermometer size={14} style={{ color: '#dc2626' }} />
                            <span>Suhu</span>
                          </div>
                          <span className="ov-reading-val">
                            {data ? `${parseFloat(data.suhu).toFixed(1)} °C` : '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="ov-card-footer">
                      <div className="ov-card-time">
                        <Clock size={12} />
                        <span>
                          {data
                            ? new Date(data.timestamp).toLocaleString('id-ID')
                            : 'Belum ada data'}
                        </span>
                      </div>
                      <div className="ov-card-actions">
                        <button
                          className="ov-btn ov-btn-request"
                          onClick={() => handleRequestData(tank.id)}
                          disabled={requestingTank === tank.id}
                        >
                          <RefreshCw size={13} className={requestingTank === tank.id ? 'spinning' : ''} />
                          Request
                        </button>
                        <button
                          className="ov-btn ov-btn-configure"
                          onClick={() => navigate('/tanks')}
                        >
                          <Settings size={13} />
                          Configure
                        </button>
                        <button
                          className="ov-btn ov-btn-monitor"
                          onClick={() => navigate(`/dashboard/monitor/${tank.id}`)}
                        >
                          <Monitor size={13} />
                          Monitor
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;