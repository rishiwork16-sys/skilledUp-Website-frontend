import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Settings } from 'lucide-react';
import { createSignedUrlAppender } from '../../utils/hlsSignedUrl';

const HlsPlayer = ({ src, poster, autoPlay = false }) => {
    const videoRef = useRef(null);
    const [hlsInstance, setHlsInstance] = useState(null);
    const [qualities, setQualities] = useState([]);
    const [currentQuality, setCurrentQuality] = useState(-1); // -1 is Auto
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        let hls;

        if (Hls.isSupported() && videoRef.current) {
            const appendSignedParams = createSignedUrlAppender(src);

            hls = new Hls({
                capLevelToPlayerSize: true, // Auto quality selection optimization
                autoStartLoad: true,
                // Critical: Forward CloudFront Signed URL parameters (Policy, Signature, Key-Pair-Id) 
                // to all segment requests (ts files) and sub-playlists
                xhrSetup: (xhr, url) => {
                    if (!url) return;
                    const signedUrl = appendSignedParams(url);
                    if (signedUrl !== url) {
                        xhr.open('GET', signedUrl, true);
                    }
                },
                fetchSetup: (context, initParams) => {
                    if (context?.url) {
                        context.url = appendSignedParams(context.url);
                    }
                    return initParams;
                }
            });

            hls.loadSource(src);
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                // Get available levels (240p, 360p, etc.)
                const levels = data.levels.map((level, index) => ({
                    id: index,
                    height: level.height,
                    bitrate: level.bitrate
                }));
                setQualities(levels);
                if (autoPlay) {
                    videoRef.current.play().catch(e => console.log("Autoplay failed:", e));
                }
            });

            // Update state when quality changes automatically
            hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
                // Only update if in Auto mode to show what's playing
                // console.log("Switched to level:", data.level);
            });

            setHlsInstance(hls);
        } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
            // Fallback for Safari (native HLS)
            videoRef.current.src = src;
            videoRef.current.addEventListener('loadedmetadata', () => {
                if (autoPlay) {
                    videoRef.current.play().catch(e => console.log("Autoplay failed:", e));
                }
            });
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src, autoPlay]);

    const handleQualityChange = (levelId) => {
        if (hlsInstance) {
            hlsInstance.currentLevel = levelId; // -1 for Auto
            setCurrentQuality(levelId);
            setShowSettings(false);
        }
    };

    return (
        <div className="relative group bg-black w-full h-full overflow-hidden">
            <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain"
                poster={poster}
                controlsList="nodownload" 
            />
            
            {/* Custom Quality Selector Overlay */}
            {qualities.length > 0 && (
                <div className="absolute top-4 right-4 z-20">
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition backdrop-blur-sm"
                        title="Video Quality"
                    >
                        <Settings size={20} />
                    </button>

                    {showSettings && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl overflow-hidden py-1 z-30 animate-in fade-in slide-in-from-top-2">
                            <button
                                onClick={() => handleQualityChange(-1)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${currentQuality === -1 ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-700'}`}
                            >
                                Auto
                            </button>
                            {qualities.map((q) => (
                                <button
                                    key={q.id}
                                    onClick={() => handleQualityChange(q.id)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${currentQuality === q.id ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-700'}`}
                                >
                                    {q.height}p
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HlsPlayer;
