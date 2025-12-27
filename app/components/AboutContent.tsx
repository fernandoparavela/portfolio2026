import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function AboutContent({ isVisible, onClose, isMobile: propIsMobile, onScroll }: { isVisible: boolean; onClose?: () => void; isMobile?: boolean; onScroll?: (scrollTop: number) => void }) {
    const [isMobile, setIsMobile] = useState(propIsMobile || false);
    const rootRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (propIsMobile !== undefined) {
            setIsMobile(propIsMobile);
            return;
        }
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [propIsMobile]);

    useEffect(() => {
        if (!isVisible) return;

        const scrollContainer = isMobile ? rootRef.current : contentRef.current;
        if (!scrollContainer) return;

        const lenis = new Lenis({
            wrapper: scrollContainer,
            content: scrollContainer.firstElementChild as HTMLElement,
            lerp: 0.1,
            duration: 1.2,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        lenis.on('scroll', ({ scroll }: { scroll: number }) => {
            if (onScroll) {
                onScroll(scroll);
            }
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        const rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [isVisible, isMobile, onScroll]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (onScroll) {
            onScroll(e.currentTarget.scrollTop);
        }
    };

    return (
        <div
            ref={rootRef}
            onScroll={handleScroll}
            className={`fixed inset-0 z-[50] transition-transform duration-[750ms] bg-[#000] text-white ${isMobile ? 'overflow-y-auto' : ''}`}
            style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(100vh)',
                transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                pointerEvents: isVisible ? 'auto' : 'none'
            }}
        >
            {/* Bio Content Area */}
            <div
                ref={contentRef}
                onScroll={!isMobile ? handleScroll : undefined}
                className={`${isMobile ? 'relative' : 'absolute h-full overflow-y-auto'} w-full no-scrollbar pointer-events-auto px-10 md:px-0`}
                style={{
                    paddingTop: isMobile
                        ? 'calc(100vh - (100vh / 1.618))'
                        : 'calc(100vh - (100vh / 1.618))',
                    paddingBottom: '100px'
                }}
            >
                <div className="flex flex-col md:flex-row w-full">
                    <div className="w-full md:w-[50%] hidden md:block"></div>
                    <div className="w-full md:w-[33.33%] flex flex-col gap-12 md:gap-[0.75em]">

                        {/* Mobile Only: 20+ years and Recognition */}
                        <div className="md:hidden flex flex-col gap-8 text-white mb-4">
                            <div className="flex flex-col">
                                <span className="font-bold text-[16px]">20+ years of design</span>
                                <span className="opacity-70 text-[16px]">Itaú, Work & Co, Accenture Song, VML</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[16px]">Recognition</span>
                                <span className="opacity-70 text-[16px]">Webby Awards, iF, Red Dot, LAD Awards, and others</span>
                            </div>
                        </div>

                        {/* Bio Text */}
                        <div className="flex flex-col gap-[0.75em]">
                            <p className="text-[16px] md:text-[24px] leading-[1.5] tracking-tight text-white m-0">
                                I’ve been working in digital design for over 20 years. Throughout this journey, across the different industry contexts that span these two decades, my work has consistently lived at the intersection of UX, Visual Design, and Brand Strategy—bringing these disciplines together with the goal of shaping digital products that are not only useful, but also meaningful and emotionally resonant.
                            </p>
                            <p className="text-[16px] md:text-[24px] leading-[1.5] tracking-tight text-white m-0">
                                Although my practice may appear deeply rooted in visual design, I see design as a holistic and strategic discipline. A coherent aesthetic is not decoration; it exists to support usability, clarify intent, and contribute to business outcomes. Form only matters when it is grounded in hypotheses, tested through evidence, and validated by data. I also believe that strong design requires a clear and intentional point of view; while many design frameworks aim for consensus among stakeholders, consensus often leads to average outcomes. Design demands a certain level of conviction—the courage to make informed choices, challenge the obvious, and move beyond the safest solution.                            </p>
                            <p className="text-[16px] md:text-[24px] leading-[1.5] tracking-tight text-white m-0">
                                Alongside hands-on work, I’ve spent many years building teams, mentoring designers, and supporting talent growth. I aim to lead with empathy and care, fostering environments where strong craft, critical thinking, brutally honest feedback, and thoughtful collaboration can thrive.</p>

                        </div>

                        {/* Social Links - Mobile Only (Scrolls with content) */}
                        <div className="flex flex-col md:hidden gap-4 text-[16px] text-white mt-12">
                            <a href="mailto:oi@paravela.work" className="custom-link self-start">
                                oi@paravela.work
                            </a>
                            <a href="https://www.linkedin.com/in/paravela/" target="_blank" rel="noopener noreferrer" className="custom-link self-start">
                                Linkedin
                            </a>
                            <a href="https://medium.com/@fernandoparavela" target="_blank" rel="noopener noreferrer" className="custom-link self-start">
                                Medium
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Links - Desktop Only (Fixed Bottom Left) */}
            <div className="hidden md:flex flex-row gap-8 text-[16px] text-white absolute bottom-[48px] left-[48px] z-50">
                <a href="mailto:oi@paravela.work" className="custom-link">
                    oi@paravela.work
                </a>
                <a href="https://www.linkedin.com/in/paravela/" target="_blank" rel="noopener noreferrer" className="custom-link">
                    Linkedin
                </a>
                <a href="https://medium.com/@fernandoparavela" target="_blank" rel="noopener noreferrer" className="custom-link">
                    Medium
                </a>
            </div>
        </div>
    );
}
