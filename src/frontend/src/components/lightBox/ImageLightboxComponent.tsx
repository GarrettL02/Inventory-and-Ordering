import { useState } from 'react';
import { Lightbox } from './LightBox';
import { useTheme } from '../../hooks/userSettings/useTheme';

export interface ImageLightboxComponentProps {
  imageSrc: string;
  imageAlt: string;
  filename?: string | null;
}

export function ImageLightboxComponent({
  imageSrc,
  imageAlt,
  filename,
}: ImageLightboxComponentProps) {
  const themeType = useTheme();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasImage = Boolean(filename);

  return (
    <>
      {hasImage ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          onClick={() => setLightboxOpen(true)}
          style={{
            display: 'block',
            maxWidth: '220px',
            maxHeight: '220px',
            objectFit: 'contain',
            borderRadius: '6px',
            border: `1px solid ${themeType.borderStrongColor}`,
            cursor: 'zoom-in',
            marginBottom: '12px',
          }}
        />
      ) : (
        <div style={{ color: themeType.textMutedColor, marginBottom: '12px' }}>
          No image yet
        </div>
      )}
      <Lightbox
        open={lightboxOpen}
        images={hasImage ? [{ src: imageSrc, title: imageAlt }] : []}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
