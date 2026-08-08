import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

const DatasetManagement = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    suhu: '',
    massa_jenis: ''
  });

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dataset/');
      setDatasets(response.data);
    } catch (err) {
      console.error('Error fetching datasets:', err);
      alert('Gagal mengambil data dataset');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dataset/', formData);
      alert('Dataset berhasil ditambahkan');
      setFormData({ suhu: '', massa_jenis: '' });
      setShowAddForm(false);
      fetchDatasets();
    } catch (err) {
      console.error('Error adding dataset:', err);
      alert('Gagal menambahkan dataset');
    }
  };

  const handleEdit = async (id) => {
    try {
      await api.put(`/dataset/${id}`, formData);
      alert('Dataset berhasil diupdate');
      setEditingId(null);
      setFormData({ suhu: '', massa_jenis: '' });
      fetchDatasets();
    } catch (err) {
      console.error('Error updating dataset:', err);
      alert('Gagal mengupdate dataset');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus dataset ini?')) return;
    
    try {
      await api.delete(`/dataset/${id}`);
      alert('Dataset berhasil dihapus');
      fetchDatasets();
    } catch (err) {
      console.error('Error deleting dataset:', err);
      alert('Gagal menghapus dataset');
    }
  };

  const startEdit = (dataset) => {
    setEditingId(dataset.id);
    setFormData({
      suhu: dataset.suhu,
      massa_jenis: dataset.massa_jenis
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ suhu: '', massa_jenis: '' });
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main className="content">
          <div className="dataset-container">
            <div className="dataset-header">
              <div>
                <h1>Dataset Management</h1>
                <p className="text-muted">
                  Kelola dataset massa jenis berdasarkan suhu
                </p>
              </div>
              <button 
                onClick={() => setShowAddForm(!showAddForm)} 
                className="btn-primary"
              >
                <Plus size={20} />
                Tambah Dataset
              </button>
            </div>

            {showAddForm && (
              <div className="add-form-card">
                <h3>Tambah Dataset Baru</h3>
                <form onSubmit={handleAdd} className="dataset-form">
                  <div className="form-group">
                    <label>Suhu (°C)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.suhu}
                      onChange={(e) => setFormData({...formData, suhu: e.target.value})}
                      placeholder="Contoh: 25.00"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Massa Jenis (kg/m³)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.massa_jenis}
                      onChange={(e) => setFormData({...formData, massa_jenis: e.target.value})}
                      placeholder="Contoh: 913.9000"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      <Save size={16} />
                      Simpan
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowAddForm(false);
                        setFormData({ suhu: '', massa_jenis: '' });
                      }}
                      className="btn-secondary"
                    >
                      <X size={16} />
                      Batal
                    </button>
                  </div>
                </form>
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
                      <th>Suhu (°C)</th>
                      <th>Massa Jenis (kg/m³)</th>
                      <th>Dibuat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datasets.map((dataset) => (
                      <tr key={dataset.id}>
                        <td>{dataset.id}</td>
                        <td>
                          {editingId === dataset.id ? (
                            <input
                              type="number"
                              step="0.01"
                              value={formData.suhu}
                              onChange={(e) => setFormData({...formData, suhu: e.target.value})}
                              className="inline-input"
                            />
                          ) : (
                            parseFloat(dataset.suhu).toFixed(2)
                          )}
                        </td>
                        <td>
                          {editingId === dataset.id ? (
                            <input
                              type="number"
                              step="0.0001"
                              value={formData.massa_jenis}
                              onChange={(e) => setFormData({...formData, massa_jenis: e.target.value})}
                              className="inline-input"
                            />
                          ) : (
                            parseFloat(dataset.massa_jenis).toFixed(4)
                          )}
                        </td>
                        <td>{new Date(dataset.created_at).toLocaleDateString('id-ID')}</td>
                        <td>
                          <div className="action-buttons">
                            {editingId === dataset.id ? (
                              <>
                                <button 
                                  onClick={() => handleEdit(dataset.id)}
                                  className="btn-icon btn-success"
                                  title="Simpan"
                                >
                                  <Save size={16} />
                                </button>
                                <button 
                                  onClick={cancelEdit}
                                  className="btn-icon btn-secondary"
                                  title="Batal"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => startEdit(dataset)}
                                  className="btn-icon btn-warning"
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(dataset.id)}
                                  className="btn-icon btn-danger"
                                  title="Hapus"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DatasetManagement;