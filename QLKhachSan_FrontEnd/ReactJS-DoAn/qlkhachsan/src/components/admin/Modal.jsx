import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
