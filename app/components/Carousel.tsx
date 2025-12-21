'use client';

import { useRef, useEffect, useState } from 'react';
import { projects } from '../data/projects';
import Card from './Card';

export default function Carousel({ isLoaded }: { isLoaded?: boolean }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || isMobile) return;

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        };

        const handleScroll = () => {
            const maxScroll = container.scrollWidth - container.clientWidth;
            if (maxScroll <= 0) return;
            const progress = Math.min(1, Math.max(0, container.scrollLeft / maxScroll));
            const gap = 25 - (progress * 30);
            container.style.setProperty('--card-gap', `${gap}px`);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const calculatedItems = (() => {
        const result = [];
        let prevRotation = 0;

        for (let i = 0; i < projects.length; i++) {
            let rotation;
            if (i === 0) {
                const seed = i * 1337;
                const random = (Math.sin(seed) * 10000) % 1;
                rotation = (random * 20) - 10;
            } else {
                const seed = i * 1337;
                const random = Math.abs((Math.sin(seed) * 10000) % 1);
                const prevSign = prevRotation >= 0 ? 1 : -1;
                const targetSign = -prevSign;
                const minMag = Math.max(0, 5 - Math.abs(prevRotation));
                const maxMag = 10;
                const mag = minMag + (random * (maxMag - minMag));
                rotation = targetSign * mag;
            }
            prevRotation = rotation;
            result.push({ ...projects[i], rotation });
        }
        return result;
    })();

    return (
        <div
            ref={scrollContainerRef}
            className={`w-full ${isMobile ? 'touch-pan-y' : 'h-full md:overflow-x-auto overflow-y-auto md:overflow-y-hidden'} no-scrollbar bg-zinc-50 dark:bg-zinc-900`}
            style={{
                '--card-gap': isMobile ? '12px' : '25px',
                paddingTop: isMobile ? 'calc(100vh - (100vh / 1.618))' : '0'
            } as React.CSSProperties}
        >
            <div className={`flex flex-col md:flex-row items-center md:h-full ${isMobile ? 'p-[12px]' : 'p-0 md:pl-[33vw] md:pr-[96px] md:w-max'} gap-[12px] md:gap-0`}>
                {calculatedItems.map((item, index) => (
                    <div
                        key={item.id}
                        className="w-full md:w-auto shrink-0 transition-all duration-700 ease-out"
                        style={{
                            transitionDelay: `${index * 50}ms`,
                            marginLeft: index === 0 ? 0 : 'md:var(--card-gap)',
                            transform: isMobile ? 'none' : `rotate(${item.rotation}deg)`,
                            transitionProperty: isLoaded ? 'all' : 'none'
                        }}
                    >
                        <Card
                            project={item}
                            rotation={item.rotation}
                            index={index}
                            isMobile={isMobile}
                            isLoaded={isLoaded}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
