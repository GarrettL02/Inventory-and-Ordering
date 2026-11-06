import { useRef, useState } from 'react';
import { GeneralButton } from '../../components/buttons/generalButton/GeneralButton';
import { Lightbox } from '../../components/lightBox/LightBox';
import { partImageUrl } from '../../services/parts/partsService';
import { usePartImage } from '../hooks/usePartImage';
import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { ImageLightboxComponent } from '../../components/lightBox/ImageLightboxComponent';

interface PartImageSectionProps {
  partId: number;
  partName: string;
  // File name of the part's picture, or null/undefined when it has none.
  // It also makes the image URL change after each upload (see partImageUrl).
  filename?: string | null;
  // Called after the picture was uploaded or removed, so the page reloads the part
  onChanged: () => void;
}

// The picture of a part (one per part): thumbnail that opens in the lightbox,
// plus Upload / Replace and Remove buttons.
export function PartImageSection({
  partId,
  partName,
  filename,
  onChanged,
}: PartImageSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { uploadImage, removeImage, saving, error } = usePartImage(
    partId,
    onChanged,
  );

  const hasImage = Boolean(filename);
  const src = partImageUrl(partId, filename);

  const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Clear the input so choosing the same file again still fires onChange
    e.target.value = '';
    if (file) uploadImage(file);
  };

  return (
    <AccordianMenu
      title="Attachments"
      shrinkable
      sideTitleSection={
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              background: 'none',
              color: '#9c9c9c',
              cursor: 'pointer',
            }}
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9c9c9c')}
          >
            {saving ? 'Saving...' : hasImage ? 'Replace Image' : 'Upload Image'}
          </button>
          {hasImage && (
            <button
              style={{
                background: 'none',
                color: '#9c9c9c',
                cursor: 'pointer',
              }}
              onClick={removeImage}
              disabled={saving}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9c9c9c')}
            >
              Remove Image
            </button>
          )}
        </div>
      }
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '4fr',
        }}
      >
        <div style={{ gridColumn: 1 }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
            <ImageLightboxComponent
              imageSrc={src}
              imageAlt={`Image of ${partName}`}
              filename={filename}
            />

            {/* Hidden input, opened by the button above. Only the types the backend accepts. */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleFileChosen}
            />

            {error && (
              <div role="alert" style={{ color: '#ff6b6b', marginTop: '8px' }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </AccordianMenu>
  );
}
