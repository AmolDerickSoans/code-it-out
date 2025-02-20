import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="loading-overlay">
        <div className="loading-spinner">
            <div className="spinner-content">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        </div>
    </div>
);

export default LoadingSpinner; 