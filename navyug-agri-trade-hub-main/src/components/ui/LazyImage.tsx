import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, ...props }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <img
                src={src}
                alt={alt}
                className={cn(
                    "transition-all duration-500 ease-in-out w-full h-full object-cover",
                    loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                )}
                onLoad={() => setLoaded(true)}
                loading="lazy"
                {...props}
            />
            {!loaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </div>
    );
};

export default LazyImage;
