import React from 'react';
import { X, Maximize2, Download } from 'lucide-react';

const FilePreviewModal = ({ isOpen, onClose, fileUrl, fileType }) => {
    if (!isOpen) return null;

    const isVideo = fileType === 'video' || fileUrl?.includes('.mp4') || fileUrl?.includes('.webm') || fileUrl?.includes('.mov');
    const isPDF = fileUrl?.includes('.pdf');
    const isImage = fileUrl?.includes('.jpg') || fileUrl?.includes('.jpeg') || fileUrl?.includes('.png') || fileUrl?.includes('.gif');

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFullscreen = () => {
        window.open(fileUrl, '_blank');
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h3 className="text-lg font-bold text-slate-800">
                            {isVideo ? '🎥 Video Preview' : isPDF ? '📄 Document Preview' : isImage ? '🖼️ Image Preview' : '📁 File Preview'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors group"
                            title="Download"
                        >
                            <Download size={20} className="text-slate-600 group-hover:text-indigo-600" />
                        </button>
                        <button
                            onClick={handleFullscreen}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors group"
                            title="Open in new tab"
                        >
                            <Maximize2 size={20} className="text-slate-600 group-hover:text-indigo-600" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                            title="Close"
                        >
                            <X size={20} className="text-slate-600 group-hover:text-red-600" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-auto max-h-[calc(95vh-140px)] bg-slate-50">
                    {isVideo ? (
                        <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                            <video
                                controls
                                autoPlay
                                className="w-full"
                                style={{ maxHeight: '75vh' }}
                            >
                                <source src={fileUrl} type="video/mp4" />
                                <source src={fileUrl} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : isPDF ? (
                        <iframe
                            src={fileUrl}
                            className="w-full rounded-xl shadow-2xl border border-slate-200"
                            style={{ height: '75vh' }}
                            title="PDF Preview"
                        />
                    ) : isImage ? (
                        <div className="flex items-center justify-center">
                            <img
                                src={fileUrl}
                                alt="Preview"
                                className="max-w-full h-auto rounded-xl shadow-2xl border border-slate-200"
                                style={{ maxHeight: '75vh' }}
                            />
                        </div>
                    ) : (
                        <iframe
                            src={fileUrl}
                            className="w-full rounded-xl shadow-2xl border border-slate-200"
                            style={{ height: '75vh' }}
                            title="File Preview"
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                        <span className="font-medium">Tip:</span> Use the controls above to download or open in a new tab
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-medium transition-all shadow-lg shadow-indigo-500/30">
                        Close Preview
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default FilePreviewModal;
