export interface Project {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  href: string;
  gradient: string;
  category: 'civic' | 'open-source' | 'personal';
  highlights?: string[];
}

export const projects: Project[] = [
  {
    title: 'Dallas County Eviction Pipeline',
    description:
      'Production data pipeline processing 40,000+ eviction records annually.',
    longDescription:
      'Production data pipeline processing 40,000+ eviction records annually, serving 12+ partners including Dallas Eviction Advocacy Center, Eviction Lab, and Dallas HHS. Built the initial pipeline in R and have iterated on it for nearly five years as the system scaled.',
    tags: ['R', 'Data Pipeline', 'ETL', 'Housing'],
    href: '/resume/',
    gradient: 'from-primary to-secondary',
    category: 'civic',
    highlights: [
      '40,000+ records processed annually',
      '12+ partner organizations served',
      'Foundation for northtexasevictions.org',
    ],
  },
  {
    title: 'North Texas Evictions',
    description:
      'Public-facing data transparency tool tracking eviction filings across Dallas County.',
    longDescription:
      'Public-facing data transparency tool tracking eviction filings across Dallas County, helping residents and advocates understand displacement patterns. Built with R Shiny, it visualizes trends over time, maps filing hotspots, and provides downloadable data for researchers and journalists.',
    tags: ['R Shiny', 'Housing', 'Public Data', 'GIS'],
    href: 'https://northtexasevictions.org',
    gradient: 'from-primary to-secondary',
    category: 'civic',
    highlights: [
      'Used by advocates, journalists, and researchers',
      'Interactive mapping of filing hotspots',
      'Downloadable open data',
    ],
  },
  {
    title: '30+ R Shiny Dashboards',
    description:
      'Suite of interactive dashboards informing decisions on housing, public safety, and resource allocation.',
    longDescription:
      'Suite of 30+ interactive R Shiny dashboards built at CPAL informing decisions on housing stability, public safety, resource allocation, and funding strategies. Range from internal operational tools to partner-facing products, each tailored to specific stakeholder needs.',
    tags: ['R Shiny', 'Tableau', 'ggplot2', 'Dashboards'],
    href: '/resume/',
    gradient: 'from-cool to-secondary',
    category: 'civic',
    highlights: [
      '30+ dashboards in production',
      'Used across housing, safety, and policy teams',
      'Internal and partner-facing products',
    ],
  },
  {
    title: 'DigiLab TCG Standings',
    description:
      'Community-driven Shiny dashboard tracking Digimon TCG tournaments in North Texas.',
    longDescription:
      'Shiny dashboard tracking Digimon card game tournament events in North Texas. What started as a personal project became a community hub — players contribute match data collaboratively, making it both a data product and a community-building tool.',
    tags: ['R Shiny', 'Community', 'Personal'],
    href: 'https://digilab.cards',
    gradient: 'from-cool to-primary',
    category: 'personal',
    highlights: [
      'Community-driven data collection',
      'Tracks events across multiple venues',
      'Live at digilab.cards',
    ],
  },
  {
    title: 'atomtemplates',
    description:
      'R package for standardized project creation and handling.',
    longDescription:
      'Open-source R package that standardizes project creation and handling. Streamlines setup of new data projects with consistent directory structure, documentation templates, and tooling. Used internally at CPAL to maintain consistency across the data team.',
    tags: ['R Package', 'Open Source', 'DevTools'],
    href: 'https://github.com/lopezmichael/atomtemplates',
    gradient: 'from-secondary to-accent',
    category: 'open-source',
    highlights: [
      'Consistent project scaffolding',
      'Used across CPAL data team',
      'Open source on GitHub',
    ],
  },
  {
    title: 'Digimon TCG Standings (Source)',
    description:
      'Open source repository for the DigiLab standings tracker.',
    longDescription:
      'Open source repository for the DigiLab standings tracker. Demonstrates Shiny app architecture patterns including modular UI components, community-driven data pipelines, and reactive data processing for live tournament tracking.',
    tags: ['GitHub', 'R Shiny', 'Open Source'],
    href: 'https://github.com/lopezmichael/digimon-tcg-standings',
    gradient: 'from-neutral to-cool',
    category: 'open-source',
    highlights: [
      'Modular Shiny architecture',
      'Reactive data processing',
      'Community contribution workflows',
    ],
  },
];

// Featured projects shown on homepage (indices into projects array)
export const featuredProjects = [projects[0], projects[1], projects[3]];
