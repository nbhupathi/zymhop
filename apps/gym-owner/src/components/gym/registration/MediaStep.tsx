import React from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { GymFormData } from '../../../types/gym';

interface MediaStepProps {
  formData: GymFormData;
  onChange: (data: Partial<GymFormData>) => void;
}

const MediaStep: React.FC<MediaStepProps> = ({ formData, onChange }) => {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just use a placeholder URL
      onChange({ logo: URL.createObjectURL(file) });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // In a real app, you would upload the files to a server
      // For now, we'll just use placeholder URLs
      const newImages = files.map(file => URL.createObjectURL(file));
      onChange({ images: [...formData.images, ...newImages] });
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    onChange({ images: newImages });
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gym Logo
        </label>
        <div className="flex items-center gap-4">
          {formData.logo ? (
            <div className="relative">
              <img
                src={formData.logo}
                alt="Gym Logo"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <button
                onClick={() => onChange({ logo: '' })}
                className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-xs text-gray-500">Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gym Photos
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Gym Photo ${index + 1}`}
                className="w-full h-32 rounded-lg object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Add Photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-700">
          Tip: Upload high-quality images to showcase your gym's facilities and equipment.
          Recommended size: 1920x1080px for gallery images and 400x400px for logo.
        </p>
      </div>
    </div>
  );
};

export default MediaStep;