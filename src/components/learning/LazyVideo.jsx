import React, { useEffect, useRef, useState } from 'react';
import { isSafeHttpUrl } from '../../utils/security';

const isLocalMediaPath = (value) => typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');

export default function LazyVideo({ src, poster, title = 'Course video', className = '' }) {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (!src || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: '240px' });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [src]);

  if (!src) return null;
  if (!isLocalMediaPath(src) && !isSafeHttpUrl(src)) {
    return <p role="status" className="text-sm text-rose-700">This video source is not allowed.</p>;
  }

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad ? (
        <video
          controls
          playsInline
          preload="none"
          poster={poster && (isLocalMediaPath(poster) || isSafeHttpUrl(poster)) ? poster : undefined}
          aria-label={title}
          className="w-full h-full object-cover"
        >
          <source src={src} />
          Your browser does not support HTML video.
        </video>
      ) : (
        <div className="w-full h-full min-h-48 bg-slate-900 text-white flex items-center justify-center" role="status">
          Video will load when you reach this lesson media.
        </div>
      )}
    </div>
  );
}
