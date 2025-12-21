import projectsData from './projects.json';

export interface Project {
    id: string;
    slug: string;
    title: string;
    category: string;
    color: string;
    textColor?: string;
    image: string;
    description?: string;
    awards?: string;
    designedAt?: string;
    gallery?: string[];
    protected?: boolean;
    iconColor?: string;
}

export const projects: Project[] = projectsData as Project[];

console.log('Projects Data Loaded:', projects.map(p => ({ slug: p.slug, protected: p.protected })));
