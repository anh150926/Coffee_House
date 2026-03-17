import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Đang tải...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner-border" role="status" style={{ color: 'var(--orange)', width: '2rem', height: '2rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;
