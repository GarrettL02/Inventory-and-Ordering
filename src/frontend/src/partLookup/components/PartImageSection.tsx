import { useState } from 'react';
import { GeneralButton } from '../../components/buttons/generalButton/GeneralButton';
import { Lightbox } from '../../components/lightBox/LightBox';
import { partImageUrl } from '../../services/parts/partsService';
import { usePartImage } from '../../hooks/parts/usePartImage';
import { AccordianMenu } from '../../components/accordianMenu/AccordianMenu';
import { ImageLightboxComponent } from '../../components/lightBox/ImageLightboxComponent';
import { FileDrop } from '../../components/formInputs/FileDrop';
import { useTheme } from '../../hooks/userSettings/useTheme';

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
// a drop zone to upload / replace it, and a Remove Image button.
export function PartImageSection({
  partId,
  partName,
  filename,
  onChanged,
}: PartImageSectionProps) {
  const themeType = useTheme();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { uploadImage, removeImage, clearError, saving, error } = usePartImage(
    partId,
    onChanged,
  );

  const hasImage = Boolean(filename);
  const src = partImageUrl(partId, filename);

  // FileDrop hands over the files it holds (0 or 1 here). A dropped / chosen file is
  // uploaded straight away; an empty list means the user removed it from the drop zone.
  const handleFilesChange = (files: File[]) => {
    const file = files[0];
    if (file) uploadImage(file);
    else clearError();
  };

  return (
    <AccordianMenu
      title="Attachments"
      shrinkable
      sideTitleSection={
        <div style={{ display: 'flex', gap: '10px' }}>
          {hasImage && (
            <button
              style={{
                background: 'none',
                color: themeType.textMutedColor,
                cursor: 'pointer',
              }}
              onClick={removeImage}
              disabled={saving}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = themeType.textPrimaryColor)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = themeType.textMutedColor)
              }
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

            {/* Drop zone. The key changes whenever the part's picture changes (a new file
                name after every upload, null after a remove), which remounts it and
                clears the file it was showing. If an upload fails the key stays the same,
                so the file stays listed next to the error message. */}
            <div
              style={{
                maxWidth: '420px',
                opacity: saving ? 0.5 : 1,
                pointerEvents: saving ? 'none' : 'auto',
              }}
            >
              <FileDrop
                key={filename ?? 'no-image'}
                id={`part-image-drop-${partId}`}
                inputTitle={hasImage ? 'Replace image' : 'Add image'}
                multiple={false}
                accept="image/jpeg,image/png,image/webp"
                onFilesChange={handleFilesChange}
              />
            </div>

            {saving && <div style={{ marginTop: '8px' }}>Saving...</div>}

            {error && (
              <div
                role="alert"
                style={{ color: themeType.errorTextColor, marginTop: '8px' }}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </AccordianMenu>
  );
}
