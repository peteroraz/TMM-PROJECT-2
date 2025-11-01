
export interface UploadedImage {
  data: string; // base64 data without prefix
  mimeType: string;
  url: string; // data URL for preview
}

export interface MarketingScene {
  id: string;
  title: string;
  prompt: string;
}

export interface GenerationResult {
  scene: MarketingScene;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export type QualityOption = 'standard' | 'high';
