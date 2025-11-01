import React, { useState } from 'react';
import { removeBackground } from '../services/geminiService';
import type { UploadedImage } from '../types';

interface BackgroundRemoverProps {
  originalImage: UploadedImage;
  onComplete: (image: UploadedImage) => void;
  onSkip: () => void;
}

// FIX: Implement BackgroundRemover component.
const BackgroundRemover: React.FC<BackgroundRemoverProps> = ({ originalImage, onComplete, onSkip }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<UploadedImage | null>(null);

  const handleRemoveBackground = async () => {
    setIsLoading(true);
    setError(null);
    setProcessedImage(null);
    try {
      const base64Data = await removeBackground(originalImage);
      // Gemini API for image editing often returns PNG for transparency.
      const newMimeType = 'image/png';
      const newImage: UploadedImage = {
        data: base64Data,
        mimeType: newMimeType,
        url: `data:${newMimeType};base64,${base64Data}`,
      };
      setProcessedImage(newImage);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (processedImage) {
      onComplete(processedImage);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Optional: Remove Background</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2 text-center">Original</p>
          <img src={originalImage.url} alt="Original" className="w-full h-40 object-contain rounded-md border" />
        </div>
        <div className="relative">
          <p className="text-sm font-medium text-gray-600 mb-2 text-center">Result</p>
          <div className="w-full h-40 object-contain rounded-md border flex items-center justify-center bg-gray-100 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E')]">
            {isLoading && (
              <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {error && <p className="text-xs text-red-500 p-2 text-center">{error}</p>}
            {processedImage && !isLoading && <img src={processedImage.url} alt="Background removed" className="w-full h-full object-contain" />}
          </div>
        </div>
      </div>

      {!processedImage ? (
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
                onClick={handleRemoveBackground}
                disabled={isLoading}
                className="flex-1 text-white bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
            >
                {isLoading ? 'Processing...' : 'Remove Background'}
            </button>
            <button
                onClick={onSkip}
                className="flex-1 text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
            >
                Skip & Use Original
            </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
                onClick={handleConfirm}
                className="flex-1 text-white bg-brand-primary hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
            >
                Use This Version
            </button>
             <button
                onClick={onSkip}
                className="flex-1 text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
            >
                Use Original Instead
            </button>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
