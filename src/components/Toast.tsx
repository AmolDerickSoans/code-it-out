import React, { useEffect } from 'react';

interface Props {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<Props> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`} role="alert">
            <span>{message}</span>
            <button
                onClick={onClose}
                className="toast-close"
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
};

export default Toast; 