import React from 'react';

const Toast = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg">
    {message}
    <button onClick={onClose} className="ml-4 text-sm underline">
      Close
    </button>
  </div>
);

export { Toast };