import { useState, useEffect } from 'react';

export default function AboutContent({ isVisible, onClose, isMobile: propIsMobile, onScroll }: { isVisible: boolean; onClose?: () => void; isMobile?: boolean; onScroll?: (scrollTop: number) => void }) {
    const [isMobile, setIsMobile] = useState(propIsMobile || false);

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

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (onScroll) {
            onScroll(e.currentTarget.scrollTop);
        }
    };

    return (
        <div
            onScroll={isMobile ? handleScroll : undefined}
            className={`fixed inset-0 z-[50] transition-transform duration-[750ms] bg-[#000] text-white ${isMobile ? 'overflow-y-auto' : ''}`}
            style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(100vh)',
                transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                pointerEvents: isVisible ? 'auto' : 'none'
            }}
        >
            {/* Header removed to use parent's instance */}
            {/* Bio Content Area */}
            <div
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
                                My work lies at the intersection of UX, Visual Design, and Brand Strategy. I aim to strategically combine these disciplines to create digital products that go beyond utility, building those additional layers of meaning and emotion that make people connect with brands and products on a deeper level.
                            </p>
                            <p className="text-[16px] md:text-[24px] leading-[1.5] tracking-tight text-white m-0">
                                This approach lead to projects that were internationally recognized by awards such as the  Brasil Design Award, UX Design Awards, Good Design Award, Latin America Design Awards, Bienal Iberoamericana de Diseño, CLAP Awards, Museu da Casa Brasileira and Awwwards.
                            </p>
                            <p className="text-[16px] md:text-[24px] leading-[1.5] tracking-tight text-white m-0">
                                I am also deeply invested in the management aspect of the work. I've been scouting new talent, building teams, and mentoring younger professionals for several years now, always aiming to lead by example, with empathy and care.
                            </p>

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
