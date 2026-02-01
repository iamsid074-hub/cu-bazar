import { memo, useEffect, useRef } from 'react';

const VideoBackground = memo(function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Manually set the video source to avoid React DOM issues
    if (videoRef.current) {
      videoRef.current.src = '/videos/hero-bg.mp4';
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay might fail on some browsers, that's okay
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
});

export { VideoBackground };
