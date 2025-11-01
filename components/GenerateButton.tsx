import React from 'react';
import type { QualityOption } from '../types';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  quality: QualityOption;
  onQualityChange: (quality: QualityOption) => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, disabled, isLoading, quality, onQualityChange }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">3. Generation Settings</h2>
        
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Quality</label>
            <fieldset className="grid grid-cols-2 gap-4">
                <legend className="sr-only">Select image quality</legend>
                <div>
                    <input type="radio" name="quality-option" id="quality-standard" value="standard" className="sr-only peer" checked={quality === 'standard'} onChange={() => onQualityChange('standard')} />
                    <label htmlFor="quality-standard" className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:text-gray-900 peer-checked:border-brand-primary peer-checked:ring-1 peer-checked:ring-brand-primary cursor-pointer transition-all duration-200">
                        <span className="font-semibold text-gray-800">Standard</span>
                        <span className="text-xs text-gray-500 mt-1 text-center">Faster generation</span>
                    </label>
                </div>
                <div>
                    <input type="radio" name="quality-option" id="quality-high" value="high" className="sr-only peer" checked={quality === 'high'} onChange={() => onQualityChange('high')} />
                    <label htmlFor="quality-high" className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:text-gray-900 peer-checked:border-brand-primary peer-checked:ring-1 peer-checked:ring-brand-primary cursor-pointer transition-all duration-200">
                        <span className="font-semibold text-gray-800">High</span>
                        <span className="text-xs text-gray-500 mt-1 text-center">Better detail</span>
                    </label>
                </div>
            </fieldset>
        </div>

        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className="w-full flex items-center justify-center text-white bg-brand-primary hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium rounded-lg text-lg px-5 py-3.5 text-center transition-colors duration-300"
        >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
            </>
        ) : (
            'Generate Visuals'
        )}
        </button>
    </div>
  );
};

export default GenerateButton;
