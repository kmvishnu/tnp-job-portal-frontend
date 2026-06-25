import React from 'react';
import { Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  isLoading: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Subtle backdrop close handler (disabled when loading) */}
      <div 
        className="absolute inset-0 w-full h-full" 
        onClick={isLoading ? undefined : onClose}
      />
      
      {/* Minimalist Card */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 max-w-sm w-full relative z-10 shadow-xl animate-fadeIn space-y-4 select-none">
        
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-900 leading-tight">Archive Opportunity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Are you sure you want to archive this posting? This structural action cannot be reversed.
          </p>
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs font-semibold text-slate-700 font-mono break-all leading-tight">
            Role: {jobTitle}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-2.5 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none"
          >
            Cancel
          </button>
          
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-lg transition-all duration-200 disabled:bg-red-400 disabled:cursor-not-allowed cursor-pointer focus:outline-none hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
