import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Upload, Wand2, ArrowRight, Loader2, Image as ImageIcon, Square, Monitor, Smartphone, RectangleHorizontal, RectangleVertical } from 'lucide-react';

export const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");

  const aspectRatios = [
    { value: "1:1", label: "Square (1:1)", icon: <Square className="w-4 h-4" /> },
    { value: "4:3", label: "Standard (4:3)", icon: <RectangleHorizontal className="w-4 h-4" /> },
    { value: "3:4", label: "Portrait (3:4)", icon: <RectangleVertical className="w-4 h-4" /> },
    { value: "16:9", label: "Widescreen (16:9)", icon: <Monitor className="w-4 h-4" /> },
    { value: "9:16", label: "Mobile (9:16)", icon: <Smartphone className="w-4 h-4" /> },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        setMimeType(file.type);
        setGeneratedImage(null); // Reset previous generation
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setLoading(true);
    setError(null);

    try {
      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Extract base64 data (remove data:image/xxx;base64, prefix)
      const base64Data = selectedImage.split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          }
        }
      });

      let foundImage = false;
      
      // The response might contain text or image or both. We look for the image part.
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const newImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            setGeneratedImage(newImageUrl);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        setError('The model processed the request but did not return an image. It might have returned text instead.');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during image generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        {/* Upload Section */}
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-2">Original Image</label>
          {!selectedImage ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors relative cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 mb-3" />
              <p className="text-sm">Click to upload or drag and drop</p>
            </div>
          ) : (
            <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <img src={selectedImage} alt="Original" className="max-h-64 object-contain mx-auto" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => { setSelectedImage(null); setGeneratedImage(null); }}
                  className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-medium"
                >
                  Change Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Aspect Ratio Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Output Aspect Ratio</label>
          <div className="flex flex-wrap gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => setAspectRatio(ratio.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  aspectRatio === ratio.value
                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {ratio.icon}
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Section */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your edit (e.g., 'Add a retro filter', 'Remove background')"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={!selectedImage || loading}
          />
          <button
            onClick={handleGenerate}
            disabled={!selectedImage || !prompt || loading}
            className={`px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-white transition-colors ${
              !selectedImage || !prompt || loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Generate
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Result Section */}
        {generatedImage && (
          <div className="animate-fade-in border-t border-slate-100 pt-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Result ({aspectRatio})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
               <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded z-10">Before</div>
                  <img src={selectedImage!} alt="Before" className="w-full h-auto object-contain" />
               </div>
               <div className="hidden md:flex justify-center text-slate-400 self-center">
                  <ArrowRight className="w-6 h-6" />
               </div>
               <div className="relative rounded-lg overflow-hidden border border-blue-200 shadow-md ring-2 ring-blue-100 bg-slate-50">
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded z-10">After</div>
                  <img src={generatedImage} alt="After" className="w-full h-auto object-contain" />
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
