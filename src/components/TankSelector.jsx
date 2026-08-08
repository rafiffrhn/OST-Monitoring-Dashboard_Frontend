import React, { useState, useEffect } from 'react';
import { Container } from 'lucide-react';
import api from '../api/axios';
import './TankSelector.css';

const TankSelector = ({ selectedTankId, onTankChange, showAllOption = true }) => {
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTanks = async () => {
      try {
        const response = await api.get('/tanks/');
        setTanks(response.data);
        
        // Auto-select first tank if none selected and no "all" option
        if (!showAllOption && !selectedTankId && response.data.length > 0) {
          onTankChange(response.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching tanks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTanks();
  }, []);

  if (loading) {
    return (
      <div className="tank-selector">
        <div className="tank-selector-loading">Memuat tangki...</div>
      </div>
    );
  }

  if (tanks.length === 0) {
    return (
      <div className="tank-selector">
        <div className="tank-selector-empty">Belum ada tangki terdaftar</div>
      </div>
    );
  }

  return (
    <div className="tank-selector">
      <div className="tank-selector-label">
        <Container size={16} />
        <span>Pilih Tangki:</span>
      </div>
      <div className="tank-selector-options">
        {showAllOption && (
          <button
            className={`tank-option ${selectedTankId === null ? 'tank-option-active' : ''}`}
            onClick={() => onTankChange(null)}
          >
            Semua Tangki
          </button>
        )}
        {tanks.map((tank) => (
          <button
            key={tank.id}
            className={`tank-option ${selectedTankId === tank.id ? 'tank-option-active' : ''}`}
            onClick={() => onTankChange(tank.id)}
          >
            <span className="tank-option-name">{tank.name}</span>
            {tank.location && (
              <span className="tank-option-location">{tank.location}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TankSelector;