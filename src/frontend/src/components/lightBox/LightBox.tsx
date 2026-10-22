import { useEffect, useState } from 'react';

interface LightboxImage {
  src: string;
  title: string;
}

interface LightboxProps {
  open: boolean;
  images: LightboxImage[];
  startIndex?: number;
  onClose: () => void;
}

export function Lightbox({
  open,
  images,
  startIndex = 0,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  //use the index that was clicked
  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  //change between image slides
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  //fucntion for user off image click back to the job page
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!images || images.length === 0 || !images[currentIndex]) return null;

  if (open) {
    return (
      <div
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => onClose()}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '32px',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#5a0000')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
        >
          ✕
        </button>

        {/* Image counter */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '16px',
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>

        {/* Prev button */}
        {images.length > 1 && (
          <button
            onClick={goPrev}
            style={{
              position: 'absolute',
              left: '20px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '48px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#5a0000')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
          >
            ‹
          </button>
        )}

        {/* Image */}
        <img
          src={images[currentIndex].src}
          style={{
            maxHeight: '90vh',
            maxWidth: '90vw',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
        />

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={goNext}
            style={{
              position: 'absolute',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '48px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#5a0000')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
          >
            ›
          </button>
        )}
        {/* Image Name */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '16px',
          }}
        >
          {images[currentIndex].title}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
