import './MonitoringChart.css';
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../api/axios';

// Konfigurasi data point
const DATA_POINTS = [
  { key: 'ketinggian', label: 'Ketinggian CPO (cm)', shortName: 'Ketinggian CPO', color: '#2563EB', unit: 'cm' },
  { key: 'suhu', label: 'Suhu CPO (°C)', shortName: 'Suhu CPO', color: '#DC2626', unit: '°C' },
  { key: 'volume', label: 'Volume CPO (L)', shortName: 'Volume CPO', color: '#16A34A', unit: 'L' },
  { key: 'massaTotal', label: 'Massa Total (ton)', shortName: 'Massa Total', color: '#9333EA', unit: 'ton' }
];

const MAX_ACTIVE = 2;

const MonitoringChart = ({ tankId = null }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  // Default: 2 data point pertama aktif
  const [activeKeys, setActiveKeys] = useState(['ketinggian', 'suhu']);

  // Toggle data point
  const toggleDataPoint = (key) => {
    setActiveKeys(prev => {
      // Jika sudah aktif, matikan
      if (prev.includes(key)) {
        // Minimal 1 harus aktif
        if (prev.length <= 1) return prev;
        return prev.filter(k => k !== key);
      }
      // Jika belum aktif, cek apakah sudah max
      if (prev.length >= MAX_ACTIVE) {
        // Ganti yang pertama (paling lama) dengan yang baru
        return [...prev.slice(1), key];
      }
      return [...prev, key];
    });
  };

  // Fetch data untuk chart
  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate.setHours(startDate.getHours() - 24);
      }

      const params = new URLSearchParams({
        start_date: startDate.toISOString(),
        end_date: now.toISOString(),
        limit: timeRange === '90d' ? 500 : timeRange === '30d' ? 300 : 100
      });

      if (tankId) {
        params.append('tank_id', tankId);
      }

      const response = await api.get(`/history/?${params}`);
      
      const transformedData = response.data
        .sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateA - dateB;
        })
        .map((item, index) => ({
          index: index,
          name: formatTimestamp(item.timestamp),
          fullTime: new Date(item.timestamp).toLocaleString('id-ID'),
          timestamp: new Date(item.timestamp).getTime(),
          ketinggian: parseFloat(parseFloat(item.ketinggian).toFixed(2)),
          suhu: parseFloat(parseFloat(item.suhu).toFixed(1)),
          volume: parseFloat(parseFloat(item.volume).toFixed(2)),
          massaTotal: parseFloat(parseFloat(item.massa_total).toFixed(2))
        }));

      setChartData(transformedData);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Gagal memuat data grafik');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (timeRange === '24h') {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else {
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) + 
        ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [timeRange, tankId]);

  // Custom tooltip — hanya tampilkan data point yang aktif
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const fullTime = payload[0]?.payload?.fullTime || label;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{fullTime}</p>
          {payload.map((entry, index) => {
            const dp = DATA_POINTS.find(d => d.key === entry.dataKey);
            return (
              <p key={index} style={{ color: entry.color }}>
                {dp ? dp.shortName : entry.name}: {entry.value} {dp ? dp.unit : ''}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Tentukan YAxis labels berdasarkan data point aktif
  const getYAxisConfig = () => {
    const activePoints = DATA_POINTS.filter(dp => activeKeys.includes(dp.key));
    
    if (activePoints.length === 0) return { left: '', right: '' };
    if (activePoints.length === 1) {
      return { left: activePoints[0].label, right: '' };
    }
    return { left: activePoints[0].label, right: activePoints[1].label };
  };

  const yAxisConfig = getYAxisConfig();

  if (loading) {
    return (
      <div className="chart-section">
        <div className="chart-loading">
          <div className="spinner"></div>
          <p>Memuat grafik...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-section">
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={fetchChartData} className="btn-primary">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h2>Grafik Monitoring</h2>
        
        <div className="time-range-selector">
          <button 
            className={`time-btn ${timeRange === '24h' ? 'active' : ''}`}
            onClick={() => setTimeRange('24h')}
          >
            24 Jam
          </button>
          <button 
            className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
            onClick={() => setTimeRange('7d')}
          >
            7 Hari
          </button>
          <button 
            className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
            onClick={() => setTimeRange('30d')}
          >
            30 Hari
          </button>
          <button 
            className={`time-btn ${timeRange === '90d' ? 'active' : ''}`}
            onClick={() => setTimeRange('90d')}
          >
            90 Hari
          </button>
        </div>
      </div>

      {/* Data Point Selector — toggle buttons */}
      <div className="chart-selector">
        {DATA_POINTS.map((dp) => {
          const isActive = activeKeys.includes(dp.key);
          return (
            <button
              key={dp.key}
              className={`selector-btn ${isActive ? 'selector-active' : ''}`}
              style={{
                '--dp-color': dp.color,
              }}
              onClick={() => toggleDataPoint(dp.key)}
            >
              <span
                className="selector-circle"
                style={{ backgroundColor: isActive ? dp.color : '#D1D5DB' }}
              ></span>
              <span className="selector-label">{dp.label}</span>
            </button>
          );
        })}
        <span className="selector-hint">Maks. 2 data point</span>
      </div>

      {/* Chart */}
      <div className="chart-container">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="index"
                tickFormatter={(idx) => {
                  const item = chartData[idx];
                  if (!item) return '';
                  const date = new Date(item.timestamp);
                  if (timeRange === '24h') {
                    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                  } else if (timeRange === '90d' || timeRange === '30d') {
                    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                  }
                  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) + 
                    ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                }}
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                interval={'preserveStartEnd'}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                label={yAxisConfig.left ? { 
                  value: yAxisConfig.left, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12 }
                } : undefined}
              />
              {activeKeys.length === 2 && (
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                  label={yAxisConfig.right ? { 
                    value: yAxisConfig.right, 
                    angle: 90, 
                    position: 'insideRight',
                    style: { fontSize: 12 }
                  } : undefined}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              
              {DATA_POINTS.map((dp, index) => {
                if (!activeKeys.includes(dp.key)) return null;
                const yAxisId = activeKeys.indexOf(dp.key) === 0 ? 'left' : 
                                (activeKeys.length === 2 ? 'right' : 'left');
                return (
                  <Line
                    key={dp.key}
                    yAxisId={yAxisId}
                    type="monotone"
                    dataKey={dp.key}
                    name={dp.label}
                    stroke={dp.color}
                    strokeWidth={2}
                    dot={{ fill: dp.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">
            <p>Tidak ada data untuk ditampilkan</p>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="chart-info">
          <p>Menampilkan {chartData.length} data point</p>
        </div>
      )}
    </div>
  );
};

export default MonitoringChart;