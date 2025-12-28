'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PasswordGate from '../../components/PasswordGate';
import { useRouter } from 'next/navigation';
import { projects } from '../../data/projects';

interface Project {
    id: string;
    title: string;
    description?: string | string[];
    awards?: string;
    designedAt?: string;
    protected?: boolean;
    gallery?: string[];
    slug: string;
}

function ProjectContent({ project }: { project: Project }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mobileSidebarRef = useRef<HTMLDivElement>(null);
    const mobileContentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        const timer = setTimeout(() => setIsLoaded(true), 100);
        window.scrollTo(0, 0);

        const handleScroll = () => {
            // Header Fade Logic (Overlap Dependent)
            if (headerRef.current) {
                const headerRect = headerRef.current.getBoundingClientRect();
                const headerBottom = headerRect.bottom;

                // Use the relevant sidebar ref based on current view
                const activeSidebar = window.innerWidth < 768 ? mobileContentRef.current : sidebarRef.current;

                if (activeSidebar) {
                    const sidebarRect = activeSidebar.getBoundingClientRect();
                    const sidebarTop = sidebarRect.top;

                    // Fade out ONLY during physical overlap
                    // Start fading exactly when sidebarTop <= headerBottom
                    const fadeRange = 40;
                    let opacity = 1;

                    if (sidebarTop < headerBottom) {
                        opacity = Math.max(0, (sidebarTop - (headerBottom - fadeRange)) / fadeRange);
                    }
                    headerRef.current.style.opacity = opacity.toString();
                }
            }

            if (window.innerWidth < 768 || !sidebarRef.current || !containerRef.current || !isLoaded) {
                // If refs aren't ready yet, we still want a reasonable starting position
                const vh = window.innerHeight;
                const goldenRatio = vh - (vh / 1.618);

                if (sidebarRef.current) {
                    sidebarRef.current.style.position = 'absolute';
                    sidebarRef.current.style.top = `${goldenRatio}px`;
                    sidebarRef.current.style.width = '100%';
                    sidebarRef.current.style.padding = '48px';
                    sidebarRef.current.style.bottom = 'auto'; // Reset
                }
                return;
            }

            const vh = window.innerHeight;
            const containerRect = containerRef.current.getBoundingClientRect();
            const galleryHeight = containerRect.height;

            if (galleryHeight === 0) {
                const vh = window.innerHeight;
                const goldenRatio = vh - (vh / 1.618);
                if (sidebarRef.current) {
                    sidebarRef.current.style.position = 'absolute';
                    sidebarRef.current.style.top = `${goldenRatio}px`;
                    sidebarRef.current.style.width = '100%';
                    sidebarRef.current.style.padding = '48px';
                    sidebarRef.current.style.bottom = 'auto';
                }
                return;
            }

            // "Short" project: total content matches or is less than viewport height
            // simply position at the bottom edge for these cases
            if (galleryHeight <= vh + 10) {
                sidebarRef.current.style.position = 'absolute';
                sidebarRef.current.style.bottom = '0px';
                sidebarRef.current.style.width = '100%';
                sidebarRef.current.style.padding = '48px';
                sidebarRef.current.style.top = 'auto'; // Reset
                return;
            }

            // "Long" project: Needs editorial Golden Ratio start and bottom stickiness
            const goldenRatio = vh - (vh / 1.618);
            const contentHeight = sidebarRef.current.offsetHeight;
            const anchorBottom = vh;

            // Natural position of the content bottom as it scrolls
            const naturalTop = containerRect.top + goldenRatio;
            const naturalBottom = naturalTop + contentHeight;

            if (naturalBottom <= anchorBottom) {
                const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;
                sidebarRef.current.style.position = 'fixed';
                sidebarRef.current.style.bottom = '0px';
                sidebarRef.current.style.width = isTablet ? '40%' : '25%'; // 40% for tablet, 25% for desktop
                sidebarRef.current.style.padding = '48px';
                sidebarRef.current.style.top = 'auto'; // Reset
            } else {
                sidebarRef.current.style.position = 'absolute';
                sidebarRef.current.style.top = `${goldenRatio}px`;
                sidebarRef.current.style.width = '100%';
                sidebarRef.current.style.padding = '48px';
                sidebarRef.current.style.bottom = 'auto'; // Reset
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        // Use ResizeObserver to handle cases where height changes dynamically 
        // (e.g. Password entry or images loading)
        const resizeObserver = new ResizeObserver(() => {
            handleScroll();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        if (sidebarRef.current) {
            resizeObserver.observe(sidebarRef.current);
        }

        if (isLoaded) {
            // Force check a few times to handle layout settling
            requestAnimationFrame(() => {
                handleScroll();
                requestAnimationFrame(() => {
                    handleScroll();
                    setTimeout(handleScroll, 100);
                });
            });
        } else {
            handleScroll();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') router.push('/');
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearTimeout(timer);
            resizeObserver.disconnect();
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [router, isLoaded]);

    const handleBack = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a, button')) return;
        router.push('/');
    };

    return (
        <div
            className={`flex flex-col md:flex-row ${isMobile ? 'min-h-[100dvh]' : 'min-h-screen'} bg-white dark:bg-zinc-900 text-black dark:text-white font-sans selection:bg-black selection:text-white relative`}
            onClick={handleBack}
            style={{ cursor: `url('/close.svg') 16 16, auto` }}
        >
            <style jsx global>{`
                a, button, .cursor-pointer { cursor: pointer !important; }
            `}</style>

            <div className="fixed left-0 top-0 w-full md:w-[40%] xl:w-1/4 p-10 md:p-[48px] z-30 pointer-events-none">
                <div ref={headerRef} className="flex flex-col gap-1 pointer-events-auto transition-opacity duration-300">
                    <div className="flex items-center gap-1 text-[16px]">
                        <Link href="/" className="custom-link font-normal">Projects</Link>
                        <span>/</span>
                        <span className="truncate">{project.title}</span>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col md:flex-row md:items-stretch flex-grow" ref={containerRef}>
                {!isMobile && (
                    <div className="relative w-full md:w-[40%] xl:w-1/4 hidden md:flex flex-col h-full">
                        <div
                            ref={sidebarRef}
                            className="flex flex-col"
                            style={{
                                position: 'absolute',
                                top: '38.2vh',
                                width: '100%',
                                opacity: isLoaded ? 1 : 0,
                                transform: isLoaded ? 'translateY(0)' : 'translateY(80px)',
                                transitionProperty: 'opacity, transform',
                                transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                                transitionDuration: '750ms',
                            }}
                        >
                            <div className="max-w-md flex flex-col gap-[12px]">
                                {Array.isArray(project.description) ? (
                                    (project.description as string[]).map((p, i) => (
                                        <p key={i} className="leading-relaxed text-[16px] text-black dark:text-white">{p}</p>
                                    ))
                                ) : (
                                    <p className="leading-relaxed text-[16px] text-black dark:text-white">
                                        {project.description || "Project description goes here."}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-0 text-[16px] text-black mt-[24px]">
                                {project.awards && (
                                    <div className="opacity-50 leading-relaxed">
                                        <span>Awards: </span>
                                        <span>{project.awards}</span>
                                    </div>
                                )}
                                {project.designedAt && (
                                    <div className="opacity-50 leading-relaxed">
                                        <span>Designed at </span>
                                        <span>{project.designedAt}</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}

                <div className="w-full flex flex-col md:flex-row md:w-[60%] xl:w-3/4">
                    {isMobile && (
                        <div
                            ref={mobileSidebarRef}
                            className="w-full p-10 flex flex-col"
                            style={{
                                paddingTop: 'calc(100vh - (100vh / 1.618) - 100px)',
                                transform: isLoaded ? 'translateY(0)' : 'translateY(80px)',
                                opacity: isLoaded ? 1 : 0,
                                transitionProperty: 'opacity, transform',
                                transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                                transitionDuration: '750ms'
                            }}
                        >
                            <div ref={mobileContentRef} className="max-w-md flex flex-col gap-[12px]">
                                {Array.isArray(project.description) ? (
                                    (project.description as string[]).map((p, i) => (
                                        <p key={i} className="leading-relaxed text-[16px] text-black dark:text-white">{p}</p>
                                    ))
                                ) : (
                                    <p className="leading-relaxed text-[16px] text-black dark:text-white">
                                        {project.description || "Project description goes here."}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-0 text-[16px] text-black mt-[24px]">
                                {project.awards && (
                                    <div className="opacity-50 leading-relaxed">
                                        <span>Awards: </span>
                                        <span>{project.awards}</span>
                                    </div>
                                )}
                                {project.designedAt && (
                                    <div className="opacity-50 leading-relaxed">
                                        <span>Designed at </span>
                                        <span>{project.designedAt}</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                    <div
                        className="w-full p-[12px] md:p-[12px] transition-opacity mt-4 md:mt-0 pb-[12px]"
                        style={{
                            opacity: !isMobile && !isLoaded ? 0 : 1,
                            transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                            transitionDuration: '600ms'
                        }}
                    >
                        <div className="flex flex-col gap-[12px]">
                            {(!project.gallery || project.gallery.length === 0) && (
                                <>
                                    <div className="w-full aspect-[3/2] bg-zinc-100 dark:bg-zinc-800 rounded-[8px] flex items-center justify-center text-black">Image 1</div>
                                    <div className="w-full aspect-[3/2] bg-zinc-100 dark:bg-zinc-800 rounded-[8px] flex items-center justify-center text-black">Image 2</div>
                                    <div className="w-full aspect-[3/2] bg-zinc-100 dark:bg-zinc-800 rounded-[8px] flex items-center justify-center text-black">Image 3</div>
                                </>
                            )}
                            {project.gallery?.map((img, index) => (
                                <div key={index} className="w-full aspect-[3/2] rounded-[8px] overflow-hidden relative">
                                    <Image src={img} alt={`${project.title} gallery ${index + 1}`} fill className="object-cover" sizes="(max-width: 1080px) 100vw, 75vw" priority={index === 0} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default function ProjectDetailContent({ project }: { project: Project }) {
    if (project.protected) {
        return (
            <PasswordGate projectTitle={project.title}>
                <ProjectContent project={project} />
            </PasswordGate>
        );
    }

    return <ProjectContent project={project} />;
}
