interface FooterProps {
    isAboutOpen: boolean;
    onToggleAbout: () => void;
    isLoaded?: boolean;
    isMobile?: boolean; // Added isMobile prop
    mobileHeaderRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Footer({ isAboutOpen, onToggleAbout, isLoaded = true, isMobile = false, mobileHeaderRef }: FooterProps) {
    return (
        <footer
            className={`${isMobile ? 'absolute top-0' : 'fixed bottom-0 hidden md:block'} left-0 w-full z-40 transition-all ease-in-out pointer-events-none ${isMobile ? 'p-10' : 'p-6 md:p-12'}`}
            style={{
                transform: !isLoaded
                    ? 'translateY(80px)'
                    : isAboutOpen
                        ? (isMobile ? 'none' : 'translateY(calc(-100vh + 120px))') // Mobile stays put or handles own transition? User said "transition to white... displayed over". 
                        // Actually, if it's in Main, it moves with Main. Sticky? Relative?
                        // "Header scrolls with content". So absolute top-0 in Main is correct.
                        : 'translateY(0)',
                color: isAboutOpen ? '#fff' : '#000',
                opacity: isLoaded ? 1 : 0,
                transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                transitionDuration: !isLoaded ? '300ms' : '750ms'
            }}
        >
            <div className={`flex ${isMobile ? 'items-start justify-between' : 'items-end'} w-full pointer-events-auto text-[16px] transition-colors duration-300`}>
                <div
                    ref={mobileHeaderRef}
                    className={`flex flex-col ${isMobile ? 'w-auto' : 'w-[25%]'}`}
                    style={isMobile ? {
                        color: isAboutOpen ? '#ffffff' : '#000000',
                        transition: 'color 300ms ease-in-out'
                    } : undefined}
                >
                    <span className="font-bold">Fernando Paravela</span>
                    <span className="font-normal">Design Director, Experience Design</span>
                    {isMobile && (
                        <button
                            onClick={onToggleAbout}
                            className="custom-link mt-[20px] text-left outline-none w-fit cursor-pointer transition-colors duration-[300ms] delay-[600ms]"
                            style={{
                                color: isAboutOpen ? '#fff' : '#000'
                            }}
                        >
                            {isAboutOpen ? 'Back' : 'More info'}
                        </button>
                    )}
                </div>

                <div className={`flex flex-col w-[25%] ${isMobile ? 'hidden' : 'flex'}`}>
                    <span className="font-bold">20+ years of design</span>
                    <span className="font-normal">Itaú, Work & Co, Accenture Song, VML</span>
                </div>

                <div className={`flex flex-col w-[33.33%] ${isMobile ? 'hidden' : 'flex'}`}>
                    <span className="font-bold">Recognition</span>
                    <span className="font-normal">Webby Awards, iF, Red Dot, LAD Awards, and others</span>
                </div>

                <div className={`flex flex-col ${isMobile ? 'w-auto' : 'w-[16.66%]'} items-end self-center`}>
                    <button
                        onClick={onToggleAbout}
                        className={`outline-none transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 cursor-pointer ${isMobile ? 'hidden' : 'block'}`}
                        style={{
                            transform: isAboutOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                            filter: isAboutOpen ? 'invert(1)' : 'none' // To make the black icon white
                        }}
                    >
                        {/* Check if user wants + or text. User said "same footer". Footer has + icon. Using + icon. */}
                        <img src="/plus-close.svg" alt="Toggle About" className="w-[40px] h-[40px]" />
                    </button>
                </div>
            </div>
        </footer>
    );
}