import React from 'react';
import { X } from 'lucide-react';

const DeleteConfirmModal = ({ programName, onClose, onConfirm, isDeleting }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-red-400">Delete Plan?</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <p className="text-gray-300 mb-6">
        Are you sure you want to delete "<span className="font-semibold text-white">{programName}</span>"? 
        This action cannot be undone.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;