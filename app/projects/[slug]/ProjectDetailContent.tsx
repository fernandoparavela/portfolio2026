'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PasswordGate from '../../components/PasswordGate';
import { useRouter } from 'next/navigation';

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

export default function ProjectDetailContent({ project }: { project: Project }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [headerOpacity, setHeaderOpacity] = useState(1);
    const router = useRouter();

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        const handleScroll = () => {
            const descElement = document.getElementById('project-description');
            if (descElement) {
                const rect = descElement.getBoundingClientRect();
                // Fade out header when description reaches 100px from top
                if (rect.top <= 100) {
                    setHeaderOpacity(0);
                } else {
                    setHeaderOpacity(1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        const timer = setTimeout(() => setIsLoaded(true), 100);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                router.push('/');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [router]);

    const handleBack = (e: React.MouseEvent) => {
        // Only navigate if we're not clicking a link or button
        const target = e.target as HTMLElement;
        if (target.closest('a, button')) {
            return;
        }
        router.push('/');
    };

    const PageContent = (
        <div
            className={`flex flex-col md:flex-row ${isMobile ? 'min-h-[100dvh]' : 'min-h-screen'} bg-white dark:bg-zinc-900 text-black dark:text-white font-sans selection:bg-black selection:text-white relative`}
            onClick={handleBack}
            style={{
                cursor: `url('/close.svg') 16 16, auto`,
                overflowX: 'hidden'
            }}
        >
            <style jsx global>{`
                a, button, .cursor-pointer {
                    cursor: pointer !important;
                }
            `}</style>
            {/* Fixed Header - Desktop & Mobile */}
            <div
                className="fixed left-0 top-0 w-full md:w-1/4 p-10 md:p-[48px] z-30 transition-opacity duration-300"
                style={{ opacity: headerOpacity }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-[16px] md:text-sm">
                        <Link href="/" className="custom-link font-normal">
                            Projects
                        </Link>
                        <span>/</span>
                        <span className="truncate">{project.title}</span>
                    </div>
                </div>
            </div>

            {/* Left Column Content - Desktop scrolls naturally and anchors */}
            {!isMobile && (
                <div className="relative w-1/4 hidden md:flex flex-col min-h-screen">
                    <div
                        id="project-description"
                        className="sticky bottom-[48px] self-end p-[48px] flex flex-col gap-8 transition-all"
                        style={{
                            marginTop: 'calc(100vh - (100vh / 1.618))',
                            transform: isLoaded ? 'translateY(0)' : 'translateY(80px)',
                            opacity: isLoaded ? 1 : 0,
                            transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                            transitionDuration: '600ms',
                            transitionDelay: '500ms'
                        }}
                    >
                        {/* Description */}
                        <div className="max-w-md flex flex-col gap-4">
                            {Array.isArray(project.description) ? (
                                project.description.map((p, i) => (
                                    <p key={i} className="leading-relaxed text-base text-black dark:text-white">
                                        {p}
                                    </p>
                                ))
                            ) : (
                                <p className="leading-relaxed text-base text-black dark:text-white">
                                    {project.description || "Project description goes here."}
                                </p>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-col gap-1 text-[13px] text-black">
                            {/* Awards */}
                            {project.awards && (
                                <div className="opacity-50">
                                    <span>Awards: </span>
                                    <span className="leading-relaxed">
                                        {project.awards}
                                    </span>
                                </div>
                            )}

                            {/* Designed At */}
                            {project.designedAt && (
                                <div className="opacity-50">
                                    <span>Designed at: </span>
                                    <span>{project.designedAt}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Combined Content Container for Mobile Transition */}
            <div
                className="w-full flex flex-col md:flex-row"
            >
                {/* Mobile version of side content */}
                {isMobile && (
                    <div
                        id="project-description"
                        className="w-full p-10 flex flex-col gap-8 transition-all"
                        style={{
                            paddingTop: 'calc(100vh - (100vh / 1.618) - 100px)',
                            transform: isLoaded ? 'translateY(0)' : 'translateY(80px)',
                            opacity: isLoaded ? 1 : 0,
                            transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                            transitionDuration: '900ms'
                        }}
                    >
                        {/* Description */}
                        <div className="max-w-md flex flex-col gap-4">
                            {Array.isArray(project.description) ? (
                                project.description.map((p, i) => (
                                    <p key={i} className="leading-relaxed text-[16px] text-black dark:text-white">
                                        {p}
                                    </p>
                                ))
                            ) : (
                                <p className="leading-relaxed text-[16px] text-black dark:text-white">
                                    {project.description || "Project description goes here."}
                                </p>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-col gap-1 text-[16px] text-black">
                            {/* Awards */}
                            {project.awards && (
                                <div className="opacity-50">
                                    <span>Awards: </span>
                                    <span className="leading-relaxed">
                                        {project.awards}
                                    </span>
                                </div>
                            )}

                            {/* Designed At */}
                            {project.designedAt && (
                                <div className="opacity-50">
                                    <span>Designed at: </span>
                                    <span>{project.designedAt}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Right Column - Scrollable Gallery */}
                <div
                    className="md:ml-[25%] w-full md:w-3/4 p-[12px] md:p-[12px] transition-opacity mt-4 md:mt-0 pb-[12px]"
                    style={{
                        opacity: !isMobile && !isLoaded ? 0 : 1,
                        transitionTimingFunction: 'cubic-bezier(0.75, -0.01, 0.25, 1)',
                        transitionDuration: '600ms'
                    }}
                >
                    <div className="flex flex-col gap-[12px]">
                        {/* Placeholder Gallery if empty */}
                        {(!project.gallery || project.gallery.length === 0) && (
                            <>
                                <div className="w-full aspect-[3/2] bg-zinc-100 dark:bg-zinc-800 rounded-[8px] flex items-center justify-center text-black">
                                    Image 1
                                </div>
                                <div className="w-full aspect-[3/2] bg-zinc-100 dark:bg-zinc-800 rounded-[8px] flex items-center justify-center text-black">
                                    Image 2
                                </div>
                                <div className="w-full aspect-[3/2] bg-zinc-100 dark:bg-zinc-800 rounded-[8px] flex items-center justify-center text-black">
                                    Image 3
                                </div>
                            </>
                        )}

                        {project.gallery?.map((img, index) => (
                            <div key={index} className="w-full aspect-[3/2] rounded-[8px] overflow-hidden relative">
                                <Image
                                    src={img}
                                    alt={`${project.title} gallery ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 75vw"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (project.protected) {
        return <PasswordGate projectTitle={project.title}>{PageContent}</PasswordGate>;
    }

    return PageContent;
}
