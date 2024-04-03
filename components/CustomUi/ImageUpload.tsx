// Import React
import React from 'react';
// Import Cloudinary Upload Widget
import { CldUploadWidget } from 'next-cloudinary';
// Import Button Component
import { Button } from '../ui/button';
// Import Lucide React Icons
import { Plus, Trash } from 'lucide-react';
// Import Next.js Image Component
import Image from 'next/image';

// Define props interface
interface ImageUploadProps {
  value?: string[]; // Make value prop optional
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

// ImageUpload Component
const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value = [], // Provide a default value of an empty array
}) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                size="sm"
                className="bg-red-1 text-white"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="collection"
              className="object-cover rounded-lg"
              fill
            />
          </div>
        ))}
      </div>

      <CldUploadWidget uploadPreset="a5hcgw9x" onUpload={onUpload}>
        {({ open }) => {
          return (
            <Button
              type="button"
              onClick={() => open()}
              className="bg-grey-1 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
