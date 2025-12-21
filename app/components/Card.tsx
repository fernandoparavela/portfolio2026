import { Project } from '../data/projects';
import Link from 'next/link';

interface CardProps {
    project: Project;
    rotation: number;
    index: number;
    isMobile?: boolean;
    isLoaded?: boolean;
}

export default function Card({ project, rotation, index, isMobile, isLoaded = false }: CardProps) {
    if (project.slug === 'deutsche-telekom' || project.slug === 'claro-flex') {
        console.log(`Card ${project.slug} protected:`, project.protected);
    }
    const hoverRotate = rotation > 0 ? -Math.min(rotation, 5) : -Math.max(rotation, -5);

    return (
        <Link href={`/projects/${project.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-3xl group">
            <div
                className={`relative flex-shrink-0 md:w-[300px] w-full md:h-[450px] aspect-[2/3] md:aspect-auto rounded-3xl p-8 flex flex-col justify-between transition-transform duration-700 ease-in-out md:hover:scale-[1.02] md:hover:rotate-[var(--hover-rotate)] hover:z-10 ${project.textColor} overflow-hidden`}
                style={{
                    '--hover-rotate': `${hoverRotate}deg`,
                    transform: isMobile ? 'none' : undefined, // Rotation moved to parent wrapper in Carousel.tsx to avoid conflict with hover:scale
                    backgroundColor: project.color.replace('bg-[', '').replace(']', ''), // Fallback
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                } as React.CSSProperties}
            >
                <div className="relative z-10 flex flex-col gap-[4px]">
                    <h3 className="text-3xl font-medium tracking-[-0.5px]">{project.title}</h3>
                    <p className="text-sm opacity-80 font-normal">{project.category}</p>
                </div>

                {/* Lock icon */}
                {project.protected && (
                    <div
                        className="absolute top-6 right-6 z-10 w-6 h-6 opacity-60"
                        style={{
                            backgroundColor: project.iconColor || 'currentColor',
                            maskImage: 'url(/lock.svg)',
                            WebkitMaskImage: 'url(/lock.svg)',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain'
                        }}
                    />
                )}
            </div>
        </Link>
    );
}
