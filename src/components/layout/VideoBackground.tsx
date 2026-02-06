import { memo, useEffect, useRef } from 'react';

const VideoBackground = memo(function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS requires these attributes set via JS for autoplay
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.muted = true;
    video.src = '/videos/hero-bg.mp4';
    video.load();
    
    // iOS needs user interaction or proper setup for autoplay
    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay blocked, that's okay
      });
    };
    
    playVideo();
    
    // Retry play on visibility change (iOS sometimes blocks until visible)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) playVideo();
    });
    
    return () => {
      video.pause();
      video.src = '';
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        // @ts-ignore - webkit-playsinline is for iOS Safari
        webkit-playsinline="true"
        className="w-full h-full object-cover"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
});

export { VideoBackground };
