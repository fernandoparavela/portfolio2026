interface HeaderProps {
    onOpenAbout?: () => void;
    isAboutOpen?: boolean;
}

export default function Header({ onOpenAbout, isAboutOpen }: HeaderProps) {
    return (
        <header className={`absolute md:fixed top-0 left-0 w-full p-10 md:p-12 z-50 pointer-events-none transition-colors duration-[750ms] ${isAboutOpen ? 'text-white' : 'text-current'}`}>
            <div className="flex justify-between items-start pointer-events-auto">
                <div className="flex flex-col">
                    <h1 className="text-[var(--fs-16)] font-bold text-current">Fernando Paravela</h1>
                    <p className="text-[var(--fs-16)] opacity-70">Design Director, Experience Design</p>

                    {/* Mobile Only "More info" / "Back" link */}
                    <button
                        onClick={onOpenAbout}
                        className="md:hidden text-[var(--fs-16)] underline mt-4 text-left outline-none"
                    >
                        {isAboutOpen ? 'Back' : 'More info'}
                    </button>
                </div>
            </div>
        </header>
    );
}
