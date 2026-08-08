import React, { useState, useEffect } from 'react';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TankSelector from '../components/TankSelector';
import api from '../api/axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTankId, setSelectedTankId] = useState(null);

  // Fetch history data dari API
  const fetchHistory = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);
      if (params.tank_id) queryParams.append('tank_id', params.tank_id);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/history/?${queryString}` : '/history/';
      
      const response = await api.get(url);
      setHistory(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Gagal memuat data riwayat');
      
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleTankChange = (tankId) => {
    setSelectedTankId(tankId);
    const params = {};
    if (startDate) params.start_date = new Date(startDate).toISOString();
    if (endDate) params.end_date = new Date(endDate).toISOString();
    if (tankId) params.tank_id = tankId;
    fetchHistory(params);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    
    const params = {};
    if (startDate) params.start_date = new Date(startDate).toISOString();
    if (endDate) params.end_date = new Date(endDate).toISOString();
    if (selectedTankId) params.tank_id = selectedTankId;
    
    fetchHistory(params);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedTankId(null);
    fetchHistory();
  };

  const exportToCSV = () => {
    if (history.length === 0) {
      alert('Tidak ada data untuk di-export');
      return;
    }

    const headers = ['ID', 'Tank ID', 'Ketinggian (cm)', 'Suhu (°C)', 'Volume (L)', 'Massa Jenis (kg/m³)', 'Massa Total (ton)', 'Timestamp'];
    const rows = history.map(item => [
      item.id,
      item.tank_id || '-',
      parseFloat(item.ketinggian).toFixed(4),
      parseFloat(item.suhu).toFixed(2),
      parseFloat(item.volume).toFixed(4),
      parseFloat(item.massa_jenis).toFixed(4),
      parseFloat(item.massa_total).toFixed(4),
      new Date(item.timestamp).toLocaleString('id-ID')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riwayat-ost-${selectedTankId ? `tank${selectedTankId}-` : ''}${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content">
          <div className="history-container">
            <div className="history-header">
              <h1>Riwayat Data Monitoring</h1>
              <div className="header-actions">
                <button onClick={() => fetchHistory(selectedTankId ? { tank_id: selectedTankId } : {})} className="btn-icon" title="Refresh">
                  <RefreshCw size={20} />
                </button>
                <button onClick={exportToCSV} className="btn-secondary">
                  <Download size={20} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Tank Selector */}
            <TankSelector 
              selectedTankId={selectedTankId} 
              onTankChange={handleTankChange}
              showAllOption={false}
            />

            <form onSubmit={handleFilter} className="filter-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">
                    <Calendar size={16} />
                    Tanggal Mulai
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">
                    <Calendar size={16} />
                    Tanggal Akhir
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Filter
                </button>
                <button type="button" onClick={handleReset} className="btn-secondary">
                  Reset
                </button>
              </div>
            </form>

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => fetchHistory()} className="btn-primary">
                  Coba Lagi
                </button>
              </div>
            )}

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat data...</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Ketinggian (cm)</th>
                      <th>Suhu (°C)</th>
                      <th>Volume (L)</th>
                      <th>Massa Jenis (kg/m³)</th>
                      <th>Massa Total (ton)</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length > 0 ? (
                      history.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{parseFloat(item.ketinggian).toFixed(4)}</td>
                          <td>{parseFloat(item.suhu).toFixed(2)}</td>
                          <td>{parseFloat(item.volume).toFixed(4)}</td>
                          <td>{parseFloat(item.massa_jenis).toFixed(4)}</td>
                          <td>{parseFloat(item.massa_total).toFixed(4)}</td>
                          <td>{new Date(item.timestamp).toLocaleString('id-ID')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {history.length > 0 && (
                  <div className="table-footer">
                    <p>Total: {history.length} data</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default History;