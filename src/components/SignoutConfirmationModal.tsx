import React from 'react';

interface SignoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SignoutConfirmationModal: React.FC<SignoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Click outside backdrop to close */}
      <div 
        className="absolute inset-0 w-full h-full" 
        onClick={onClose}
      />

      {/* Minimalist Card */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 max-w-sm w-full relative z-10 shadow-xl animate-fadeIn space-y-4 select-none">
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 leading-tight">End Session</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Are you sure you want to end your session?
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus:outline-none"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-lg transition-all duration-200 cursor-pointer focus:outline-none hover:scale-[1.01]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
