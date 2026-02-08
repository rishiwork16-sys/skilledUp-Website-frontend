import React from 'react';
import Button from '../ui/Button';

const ImageModal = ({ 
  isOpen, 
  imageSrc, 
  zoom, 
  onClose, 
  onZoomIn, 
  onZoomOut, 
  onResetZoom 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-[10000] p-4"
      onClick={onClose}
    >
      <button
  onClick={onClose}
  aria-label="Close"
  className="
    absolute top-4 right-4 sm:top-8 sm:right-8
    w-9 h-9 sm:w-10 sm:h-10
    flex items-center justify-center
    rounded-full
    bg-white/10 backdrop-blur-md
    text-white text-xl sm:text-2xl
    hover:bg-white/20
    transition-all duration-200
    z-[10001]
  "
>
        &times;
      </button>
      
      <img 
        src={imageSrc} 
        alt="Zoomed Certificate" 
        className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg transition-transform duration-300 cursor-pointer"
        style={{ transform: `scale(${zoom})` }}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-2 sm:gap-4 bg-black/70 p-3 sm:p-4 rounded-xl sm:rounded-full w-full max-w-sm sm:max-w-none">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onZoomOut();
          }}
          variant="primary"
          size="small"
          className="flex-1 sm:flex-none sm:min-w-[120px] bg-blue-600/90 hover:bg-blue-700"
        >
          - Zoom Out
        </Button>
        
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onResetZoom();
          }}
          variant="primary"
          size="small"
          className="flex-1 sm:flex-none sm:min-w-[120px] bg-blue-600/90 hover:bg-blue-700"
        >
          Reset Zoom
        </Button>
        
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onZoomIn();
          }}
          variant="primary"
          size="small"
          className="flex-1 sm:flex-none sm:min-w-[120px] bg-blue-600/90 hover:bg-blue-700"
        >
          + Zoom In
        </Button>
      </div> */}
    </div>
  );
};

export default ImageModal;