import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import BackgroundRemover from './components/BackgroundRemover';
import SceneSelector from './components/SceneSelector';
import GenerateButton from './components/GenerateButton';
import ResultCard from './components/ResultCard';
import { MARKETING_SCENES } from './constants';
import { generateMockup } from './services/geminiService';
import type {
  UploadedImage,
  QualityOption,
  GenerationResult,
  MarketingScene,
} from './types';

/**
 * The main application component that orchestrates the mockup generation workflow.
 */
const App: React.FC = () => {
  // State for the raw image uploaded by the user.
  const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);

  // State for the image to be used in mockups (can be the original or the one with background removed).
  const [finalImage, setFinalImage] = useState<UploadedImage | null>(null);

  // Controls the visibility of the background removal step.
  const [showBgRemover, setShowBgRemover] = useState(false);

  // State for the user-selected marketing scenes.
  const [selectedSceneIds, setSelectedSceneIds] = useState<string[]>(
    MARKETING_SCENES.map((s) => s.id)
  );

  // State for the selected generation quality ('standard' or 'high').
  const [quality, setQuality] = useState<QualityOption>('standard');

  // State to hold the results of the image generation for each scene.
  const [results, setResults] = useState<GenerationResult[]>([]);

  // State to track the overall generation process.
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State to track the zipping process for "Download All".
  const [isZipping, setIsZipping] = useState(false);

  /**
   * Handles the initial image upload.
   * Sets the original image and triggers the background removal step.
   */
  const handleImageUpload = (image: UploadedImage) => {
    setOriginalImage(image);
    setShowBgRemover(true);
    setFinalImage(null);
    setResults([]);
    // Reset scene selection to all when a new image is uploaded.
    setSelectedSceneIds(MARKETING_SCENES.map((s) => s.id));
  };

  /**
   * Handles the completion of the background removal process.
   * Sets the processed image as the final image to be used.
   */
  const handleBackgroundRemovalComplete = (image: UploadedImage) => {
    setFinalImage(image);
    setShowBgRemover(false);
  };

  /**
   * Handles skipping the background removal step.
   * Sets the original image as the final image to be used.
   */
  const handleSkipBackgroundRemoval = () => {
    if (originalImage) {
      setFinalImage(originalImage);
    }
    setShowBgRemover(false);
  };

  /**
   * Triggers the mockup generation for all selected marketing scenes.
   */
  const handleGenerate = useCallback(async () => {
    if (!finalImage || selectedSceneIds.length === 0) return;

    setIsGenerating(true);

    const scenesToGenerate = MARKETING_SCENES.filter((scene) =>
      selectedSceneIds.includes(scene.id)
    );

    // Set up initial loading states for all result cards.
    const initialResults: GenerationResult[] = scenesToGenerate.map(
      (scene) => ({
        scene,
        imageUrl: null,
        isLoading: true,
        error: null,
      })
    );
    setResults(initialResults);

    // Run generation for all scenes in parallel.
    await Promise.all(
      scenesToGenerate.map(async (scene: MarketingScene) => {
        try {
          const base64Data = await generateMockup(
            finalImage,
            scene.prompt,
            quality
          );
          const imageUrl = `data:image/png;base64,${base64Data}`;

          // Update the specific result with the generated image.
          setResults((prevResults) =>
            prevResults.map((r) =>
              r.scene.id === scene.id
                ? { ...r, imageUrl, isLoading: false }
                : r
            )
          );
        } catch (e) {
          const errorMessage =
            e instanceof Error ? e.message : 'An unknown error occurred.';
          // Update the specific result with an error message.
          setResults((prevResults) =>
            prevResults.map((r) =>
              r.scene.id === scene.id
                ? { ...r, error: errorMessage, isLoading: false }
                : r
            )
          );
        }
      })
    );

    setIsGenerating(false);
  }, [finalImage, quality, selectedSceneIds]);

  /**
   * Zips and downloads all successfully generated mockup images.
   */
  const handleDownloadAll = async () => {
    const successfulResults = results.filter(r => r.imageUrl && !r.error);
    if (successfulResults.length === 0) return;

    setIsZipping(true);

    try {
        const zip = new JSZip();

        await Promise.all(
            successfulResults.map(async (result) => {
                if (result.imageUrl) {
                    const response = await fetch(result.imageUrl);
                    const blob = await response.blob();
                    const extension = blob.type.split('/')[1] || 'png';
                    const filename = `${result.scene.id}-mockup.${extension}`;
                    zip.file(filename, blob);
                }
            })
        );

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'marketing-mockups.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

    } catch (error) {
        console.error("Failed to create zip file:", error);
        alert("Sorry, there was an error creating the zip file for download.");
    } finally {
        setIsZipping(false);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <ImageUploader
            onImageUpload={handleImageUpload}
            uploadedImage={originalImage}
          />

          {originalImage && showBgRemover && (
            <BackgroundRemover
              originalImage={originalImage}
              onComplete={handleBackgroundRemovalComplete}
              onSkip={handleSkipBackgroundRemoval}
            />
          )}

          {finalImage && (
            <>
              <SceneSelector 
                scenes={MARKETING_SCENES}
                selectedIds={selectedSceneIds}
                onSelectionChange={setSelectedSceneIds}
              />
              <GenerateButton
                onClick={handleGenerate}
                disabled={!finalImage || isGenerating || selectedSceneIds.length === 0}
                isLoading={isGenerating}
                quality={quality}
                onQualityChange={setQuality}
              />
            </>
          )}
        </div>

        {results.length > 0 && (
          <section className="pt-12">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                  Your Generated Visuals
                </h2>
                {results.some(r => r.imageUrl && !r.isLoading) && (
                  <button
                    onClick={handleDownloadAll}
                    disabled={isZipping || isGenerating}
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-gray-400 transition-colors"
                  >
                    {isZipping ? 'Zipping...' : 'Download All'}
                  </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <ResultCard key={result.scene.id} result={result} />
              ))}
            </div>
          </section>
        )}
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;