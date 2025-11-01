import React from 'react';
import type { GenerationResult } from '../types';

interface ResultCardProps {
  result: GenerationResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { scene, imageUrl, isLoading, error } = result;

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the click from triggering the underlying link
    e.preventDefault();
    e.stopPropagation();

    if (!imageUrl) return;

    try {
      // Fetch the data URL to get the response as a Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a temporary URL for the Blob
      const objectUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = objectUrl;

      // Use the blob's MIME type to determine the correct file extension
      const extension = blob.type.split('/')[1] || 'png';
      link.download = `${scene.id}-mockup.${extension}`;
      
      // Append to body, click, and then perform cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the object URL to free up memory
      window.URL.revokeObjectURL(objectUrl);
    } catch (downloadError) {
      console.error("Failed to download image:", downloadError);
      alert("Sorry, the image could not be downloaded.");
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center text-gray-500">
            <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="mt-2 text-sm">Generating...</span>
          </div>
        )}
        {error && (
            <div className="p-4 flex flex-col items-center text-center text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-semibold">Generation Failed</p>
                <p className="text-xs mt-1">{error}</p>
            </div>
        )}
        {imageUrl && !isLoading && !error && (
            <div className="relative group w-full h-full">
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full" title="Open image in new tab">
                    <img src={imageUrl} alt={`Mockup of ${scene.title}`} className="w-full h-full object-cover" />
                </a>
                <button
                    onClick={handleDownload}
                    className="absolute top-3 right-3 bg-gray-800 bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label={`Download ${scene.title} mockup`}
                    title={`Download ${scene.title} mockup`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{scene.title}</h3>
      </div>
    </div>
  );
};

export default ResultCard;