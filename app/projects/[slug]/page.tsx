import { projects } from '../../data/projects';
import { notFound } from 'next/navigation';
import ProjectDetailContent from './ProjectDetailContent';

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) return { title: 'Paravela' };

    return {
        title: `Paravela / ${project.title}`
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    return <ProjectDetailContent project={project} />;
}

