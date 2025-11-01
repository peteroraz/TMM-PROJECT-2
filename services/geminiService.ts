import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedImage, QualityOption } from '../types';

// FIX: Initialize the GoogleGenAI client according to the guidelines.
// The API key must be provided via an environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a marketing mockup image.
 * 
 * @param image The user's uploaded image/logo.
 * @param prompt The descriptive prompt for the scene.
 * @param quality The desired output quality.
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const generateMockup = async (
  image: UploadedImage,
  prompt: string,
  quality: QualityOption
): Promise<string> => {
  // FIX: Use `gemini-2.5-flash-image` as it's the designated model for image editing tasks.
  const modelName = 'gemini-2.5-flash-image';

  // FIX: Enhance the prompt for higher quality requests, as the model does not have a separate quality parameter.
  const finalPrompt = quality === 'high' 
    ? `${prompt} The final image should be very high quality, professional, and photorealistic.` 
    : prompt;

  // FIX: Use `generateContent` for image editing tasks as per the guidelines.
  // The content includes the user's image and the text prompt.
  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        {
          inlineData: {
            data: image.data,
            mimeType: image.mimeType,
          },
        },
        {
          text: finalPrompt,
        },
      ],
    },
    // FIX: Specify `Modality.IMAGE` as the response modality for image generation/editing.
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  // FIX: Extract the base64 image data from the response.
  const firstPart = response.candidates?.[0]?.content?.parts?.[0];
  if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
    return firstPart.inlineData.data;
  }
  
  throw new Error('Image generation failed. No image data received from API.');
};

/**
 * Removes the background from an image.
 * 
 * @param image The image to process.
 * @returns A promise that resolves to the base64 string of the processed image with a transparent background.
 */
export const removeBackground = async (image: UploadedImage): Promise<string> => {
  // FIX: Use `gemini-2.5-flash-image` as it's specified for general image editing tasks.
  const modelName = 'gemini-2.5-flash-image';
  
  const prompt = 'Remove the background from this image, leaving only the main subject. The output must be a transparent PNG.';

  // FIX: Use `generateContent` for image editing tasks as per the guidelines.
  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        {
          inlineData: {
            data: image.data,
            mimeType: image.mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    // FIX: Specify `Modality.IMAGE` as the response modality for image editing.
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  // FIX: Extract the base64 image data from the response.
  const firstPart = response.candidates?.[0]?.content?.parts?.[0];
  if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
    return firstPart.inlineData.data;
  }
  
  throw new Error('Failed to remove background. No image data received from API.');
};
