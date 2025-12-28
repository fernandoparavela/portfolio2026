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
        setIsMobile(window.innerWidth < 1080);
        const handleResize = () => setIsMobile(window.innerWidth < 1080);
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
                className={`${isMobile ? 'relative' : 'absolute h-full overflow-y-auto'} w-full no-scrollbar pointer-events-auto px-10 min-[1080px]:px-0`}
                style={{
                    paddingTop: isMobile
                        ? 'calc(100vh - (100vh / 1.618))'
                        : 'calc(100vh - (100vh / 1.618))',
                    paddingBottom: isMobile ? '100px' : '25vh'
                }}
            >
                <div className="flex flex-col min-[1080px]:flex-row w-full">
                    <div className="w-full min-[1080px]:w-[50%] hidden min-[1080px]:block"></div>
                    <div className="w-full min-[1080px]:w-[41.66%] flex flex-col gap-12 min-[1080px]:gap-[0.75em]">

                        {/* Mobile & Tablet (<1080px) Only: 20+ years and Recognition */}


                        {/* Bio Text */}
                        <div className="flex flex-col gap-[1.5em] min-[1080px]:gap-[2em]">
                            <p className="text-[16px] min-[1080px]:text-[28px] min-[1920px]:text-[40px] leading-[1.5] min-[1080px]:leading-[1.4] tracking-tight text-white m-0">
                                I’ve been working in digital design for over 20 years. Throughout this journey, across the different industry contexts that span these two decades, my work has consistently lived at the intersection of UX, Visual Design, and Brand Strategy—bringing these disciplines together with the goal of shaping digital products that are not only useful, but also meaningful and emotionally resonant.
                            </p>
                            <p className="text-[16px] min-[1080px]:text-[28px] min-[1920px]:text-[40px] leading-[1.5] min-[1080px]:leading-[1.4] tracking-tight text-white m-0">
                                Although my practice may appear deeply rooted in visual design, I see design as a holistic and strategic discipline. A coherent aesthetic is not decoration; it exists to support usability, clarify intent, and contribute to business outcomes. Form only matters when it is grounded in hypotheses, tested through evidence, and validated by data. I also believe that strong design requires a clear and intentional point of view; while many design frameworks aim for consensus among stakeholders, consensus often leads to average outcomes. Design demands a certain level of conviction—the courage to make informed choices, challenge the obvious, and move beyond the safest solution.                            </p>
                            <p className="text-[16px] min-[1080px]:text-[28px] min-[1920px]:text-[40px] leading-[1.5] min-[1080px]:leading-[1.4] tracking-tight text-white m-0">
                                Alongside hands-on work, I’ve spent many years building teams, mentoring designers, and supporting talent growth. I aim to lead with empathy and care, fostering environments where strong craft, critical thinking, brutally honest feedback, and thoughtful collaboration can thrive.</p>
                        </div>

                        {/* Mobile & Tablet (<1080px) Only: 20+ years and Recognition */}
                        <div className="min-[1080px]:hidden flex flex-col gap-8 text-white mt-12 mb-4">
                            <div className="flex flex-col">
                                <span className="font-medium text-[var(--fs-16)]">20+ years of design</span>
                                <span className="text-[var(--fs-16)]">Itaú, Work & Co, Accenture Song, VML</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-[var(--fs-16)]">Recognition</span>
                                <span className="text-[var(--fs-16)]">iF, Red Dot, Webby Awards, and others</span>
                            </div>
                        </div>

                        {/* Social Links - Mobile & Tablet (<1080px) Only (Scrolls with content) */}
                        <div className="flex flex-col min-[1080px]:hidden gap-4 text-[var(--fs-16)] text-white mt-12">
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
            <div className="hidden min-[1080px]:flex flex-row gap-8 text-[var(--fs-16)] text-white absolute bottom-[48px] left-[48px] z-50">
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
