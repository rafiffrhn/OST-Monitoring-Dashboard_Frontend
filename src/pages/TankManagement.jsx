import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Container, Ruler, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';

const TankManagement = () => {
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    max_height: '',
    radius: ''
  });

  const fetchTanks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tanks/');
      setTanks(response.data);
    } catch (err) {
      console.error('Error fetching tanks:', err);
      alert('Gagal mengambil data tangki');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTanks();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', location: '', max_height: '', radius: '' });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        location: formData.location || null,
        max_height: formData.max_height ? parseFloat(formData.max_height) : 1067.5,
        radius: formData.radius ? parseFloat(formData.radius) : null
      };
      await api.post('/tanks/', payload);
      alert('Tangki berhasil ditambahkan');
      resetForm();
      setShowAddForm(false);
      fetchTanks();
    } catch (err) {
      console.error('Error adding tank:', err);
      alert('Gagal menambahkan tangki');
    }
  };

  const handleEdit = async (id) => {
    try {
      const payload = {
        name: formData.name,
        location: formData.location || null,
        max_height: formData.max_height ? parseFloat(formData.max_height) : null,
        radius: formData.radius ? parseFloat(formData.radius) : null
      };
      await api.put(`/tanks/${id}`, payload);
      alert('Tangki berhasil diupdate');
      setEditingId(null);
      resetForm();
      fetchTanks();
    } catch (err) {
      console.error('Error updating tank:', err);
      alert('Gagal mengupdate tangki');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus tangki "${name}"? Data monitoring tangki ini tidak akan terhapus.`)) return;
    
    try {
      await api.delete(`/tanks/${id}`);
      alert('Tangki berhasil dihapus');
      fetchTanks();
    } catch (err) {
      console.error('Error deleting tank:', err);
      alert('Gagal menghapus tangki');
    }
  };

  const startEdit = (tank) => {
    setEditingId(tank.id);
    setFormData({
      name: tank.name,
      location: tank.location || '',
      max_height: tank.max_height || '',
      radius: tank.radius || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
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
                <h1>Tank Management</h1>
                <p className="text-muted">
                  Kelola dimensi dan informasi tangki OST
                </p>
              </div>
              <button
                onClick={() => { setShowAddForm(!showAddForm); resetForm(); }}
                className="btn-primary"
              >
                <Plus size={20} />
                Tambah Tangki
              </button>
            </div>

            {showAddForm && (
              <div className="add-form-card">
                <h3>Tambah Tangki Baru</h3>
                <form onSubmit={handleAdd} className="dataset-form">
                  <div className="form-group">
                    <label>
                      <Container size={16} />
                      Nama Tangki
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: OST 3"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <MapPin size={16} />
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Contoh: Area Barat"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <Ruler size={16} />
                      Tinggi Maksimum (cm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.max_height}
                      onChange={(e) => setFormData({ ...formData, max_height: e.target.value })}
                      placeholder="Contoh: 1067.5"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <Ruler size={16} />
                      Jari-jari (cm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.radius}
                      onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                      placeholder="Contoh: 968.75"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      <Save size={16} />
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); resetForm(); }}
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
                      <th>Nama</th>
                      <th>Lokasi</th>
                      <th>Tinggi Maks (cm)</th>
                      <th>Jari-jari (cm)</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tanks.length > 0 ? (
                      tanks.map((tank) => (
                        <tr key={tank.id}>
                          <td>{tank.id}</td>
                          <td>
                            {editingId === tank.id ? (
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="inline-input"
                              />
                            ) : (
                              <strong>{tank.name}</strong>
                            )}
                          </td>
                          <td>
                            {editingId === tank.id ? (
                              <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="inline-input"
                              />
                            ) : (
                              tank.location || '-'
                            )}
                          </td>
                          <td>
                            {editingId === tank.id ? (
                              <input
                                type="number"
                                step="0.01"
                                value={formData.max_height}
                                onChange={(e) => setFormData({ ...formData, max_height: e.target.value })}
                                className="inline-input"
                              />
                            ) : (
                              tank.max_height ? parseFloat(tank.max_height).toFixed(2) : '-'
                            )}
                          </td>
                          <td>
                            {editingId === tank.id ? (
                              <input
                                type="number"
                                step="0.01"
                                value={formData.radius}
                                onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                                className="inline-input"
                              />
                            ) : (
                              tank.radius ? parseFloat(tank.radius).toFixed(4) : '-'
                            )}
                          </td>
                          <td>
                            <div className="action-buttons">
                              {editingId === tank.id ? (
                                <>
                                  <button
                                    onClick={() => handleEdit(tank.id)}
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
                                    onClick={() => startEdit(tank)}
                                    className="btn-icon btn-warning"
                                    title="Edit"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(tank.id, tank.name)}
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Belum ada tangki terdaftar
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="dashboard-info" style={{ marginTop: '2rem' }}>
              <h3>Informasi Dimensi Tangki</h3>
              <ul>
                <li>Tinggi Maksimum: Ketinggian maksimum tangki dalam satuan sentimeter (cm)</li>
                <li>Jari-jari: Jari-jari tangki silinder dalam satuan meter (m)</li>
                <li>Kapasitas Maks: Volume maksimum dihitung dengan rumus V = π × r² × h</li>
                <li>Dimensi tangki digunakan untuk perhitungan volume dan massa total CPO</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TankManagement;