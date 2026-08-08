import React from 'react';

const TankVisualization = ({ height, maxHeight = 10.675 }) => {
  const percentage = (height / maxHeight) * 100;

  return (
    <div className="tank-container">
      <div className="tank">
        <div 
          className="tank-liquid" 
          style={{ height: `${percentage}%` }}
        >
          <div className="tank-wave"></div>
        </div>
        <div className="tank-measurements">
          <span className="tank-height">{height.toFixed(2)} cm</span>
          <span className="tank-percentage">{percentage.toFixed(1)}%</span>
        </div>
      </div>
      <div className="tank-label">
        <span>Ketinggian CPO</span>
        <span className="tank-max">Max: {maxHeight} cm</span>
      </div>
    </div>
  );
};

export default TankVisualization;