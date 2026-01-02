
import { useRef, useEffect, useState } from 'react';
import { projects } from '../data/projects';
import Card from './Card';
import Lenis from 'lenis';

export default function Carousel({ isLoaded }: { isLoaded?: boolean }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isHugeScreen, setIsHugeScreen] = useState(false);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || isMobile) return;

        const lenis = new Lenis({
            wrapper: container,
            content: container.firstElementChild as HTMLElement,
            orientation: 'horizontal',
            gestureOrientation: 'both', // Allow vertical mouse wheel to scroll horizontal
            smoothWheel: true,
            lerp: 0.1,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        const handleScroll = () => {
            const maxScroll = container.scrollWidth - container.clientWidth;
            if (maxScroll <= 0) return;
            const progress = Math.min(1, Math.max(0, container.scrollLeft / maxScroll));

            // Logic: Base gap is static in layout. 
            // We calculate how much we want to shift each subsequent card.
            // Expansion (Positive offset) for all desktop breakpoints.
            // "Very very subtle" -> 5px total expansion over the scroll area.

            const gapDelta = 5;
            const offset = progress * gapDelta;

            // We use a CSS variable for the single shift unit, then multiply by index in CSS
            container.style.setProperty('--gap-offset', `${offset}px`);
        };

        lenis.on('scroll', handleScroll);
        handleScroll();

        return () => {
            lenis.destroy();
        };
    }, [isMobile, isHugeScreen]);

    useEffect(() => {
        const checkDimensions = () => {
            setIsMobile(window.innerWidth < 768);
            setIsHugeScreen(window.innerWidth >= 1920);
        };
        checkDimensions();

        window.addEventListener('resize', checkDimensions);
        return () => window.removeEventListener('resize', checkDimensions);
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
            className={`w-full ${isMobile ? 'touch-pan-y' : 'h-full md:overflow-x-auto overflow-y-auto md:overflow-y-hidden pointer-events-auto'} no-scrollbar bg-zinc-50 dark:bg-zinc-900`}
            style={{
                '--card-gap': isMobile ? '12px' : (isHugeScreen ? '80px' : '0px'),
                '--gap-offset': '0px',
                paddingTop: isMobile ? 'calc(100vh - (100vh / 1.618))' : '0'
            } as React.CSSProperties}
        >
            <div className={`flex flex-col md:flex-row items-center md:h-full ${isMobile ? 'p-[12px]' : 'p-0 md:pl-[33vw] md:pr-[96px] md:w-max'} gap-[12px] md:gap-0`}>
                {calculatedItems.map((item, index) => (
                    <div
                        key={item.id}
                        className={`w-full md:w-auto shrink-0 transition-all duration-700 ease-out ${index === 0 ? '' : 'md:ml-[var(--card-gap)]'}`}
                        style={{
                            transitionDelay: `${index * 50}ms`,
                            transform: isMobile
                                ? 'none'
                                : `translateX(calc(var(--gap-offset) * ${index})) rotate(${item.rotation}deg) scale(${isHugeScreen ? 1.25 : 1})`,
                            transitionProperty: isLoaded ? 'opacity, filter' : 'none'
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
