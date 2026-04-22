export interface Project {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  href: string;
  gradient: string;
  category: 'civic' | 'open-source' | 'personal';
  highlights?: string[];
  image?: string;
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
    image: '/images/projects/north-texas-evictions.png',
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
    title: 'Dallas Homestead Exemption Map',
    description:
      'Interactive map visualizing homestead exemption take-up rates across Dallas.',
    longDescription:
      'Interactive R Shiny application mapping homestead exemption take-up rates across Dallas by census tract, zip code, and neighborhood. Filters by race/ethnicity and income level to surface disparities in who is claiming property tax savings. Built with Mapbox GL, sourcing data from the Dallas Central Appraisal District and American Community Survey.',
    tags: ['R Shiny', 'Mapbox', 'Housing', 'GIS'],
    href: 'https://dallashomesteads.tools.cpal.org',
    gradient: 'from-primary to-cool',
    category: 'civic',
    image: '/images/projects/dallas-homesteads.png',
    highlights: [
      'Choropleth mapping by tract, zip, and neighborhood',
      'Equity-focused filters by race/ethnicity and income',
      'Downloadable report and open data',
    ],
  },
  {
    title: 'Dallas Block Walking Tool',
    description:
      'Internal parcel lookup and canvassing tool for community outreach teams.',
    longDescription:
      'Map-based parcel lookup tool for door-to-door outreach workers in Dallas. Lets canvassers search or GPS-locate addresses, view nearby parcels on an interactive map, filter by outreach status, and export target lists. Built with R Shiny and Mapbox GL, sourcing property data from the Dallas Central Appraisal District. Access restricted to authorized outreach teams.',
    tags: ['R Shiny', 'Mapbox', 'Internal Tool', 'GIS'],
    href: 'https://blockwalking.tools.cpal.org',
    gradient: 'from-cool to-secondary',
    category: 'civic',
    image: '/images/projects/blockwalking.png',
    highlights: [
      'GPS-enabled address lookup for field canvassers',
      'Tracks outreach status per parcel',
      'Export to Excel, CSV, or PDF',
    ],
  },
  {
    title: 'DigiLab TCG Standings (R Shiny)',
    description:
      'Original community-driven Shiny dashboard that became the foundation for DigiLab.',
    longDescription:
      'The original R Shiny dashboard tracking Digimon card game tournaments in North Texas. What started as a personal project became a community hub — players contribute match data collaboratively. This project evolved into the full DigiLab platform built with Astro.',
    tags: ['R Shiny', 'Community', 'Personal'],
    href: 'https://github.com/lopezmichael/digimon-tcg-standings',
    gradient: 'from-cool to-primary',
    category: 'personal',
    image: '/images/projects/digilab-shiny.png',
    highlights: [
      'Community-driven data collection',
      'Evolved into the full DigiLab platform',
      'Open source on GitHub',
    ],
  },
  {
    title: 'Rodriguez Wellbeing & Counseling',
    description:
      'Bilingual therapy practice website built with Astro and Tailwind CSS.',
    longDescription:
      'Professional practice website for a licensed counselor and professor, offering counseling, clinical supervision, trauma-informed yoga, and speaking services. Fully bilingual (English/Spanish) with i18n routing, JSON-LD structured data, scroll-reveal animations, and a warm earthy design system.',
    tags: ['Astro', 'Tailwind CSS', 'i18n', 'Web Development'],
    href: 'https://www.rodriguezwellbeing.com',
    gradient: 'from-secondary to-accent',
    category: 'personal',
    image: '/images/projects/rodriguez-wellbeing.png',
    highlights: [
      'Full English/Spanish bilingual support',
      'JSON-LD structured data and strong SEO',
      'Accessibility-first design with skip links and ARIA',
    ],
  },
  {
    title: 'DigiLab',
    description:
      'Tournament tracking and competitive rating platform for the Digimon TCG community.',
    longDescription:
      'Full-featured tournament tracking platform for the Digimon TCG community. Includes player ratings with competitive tiers, deck meta analysis, decklists database, tournament history, and store/organizer management. Built as a PWA with Astro for on-the-go use at events.',
    tags: ['Astro', 'PWA', 'Community', 'Web Development'],
    href: 'https://digilab.cards',
    gradient: 'from-cool to-primary',
    category: 'personal',
    image: '/images/projects/digilab.png',
    highlights: [
      'Player rating system with competitive leaderboards',
      'Deck meta analysis and decklists database',
      'PWA for mobile use at tournaments',
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
    image: '/images/projects/atomtemplates.png',
    highlights: [
      'Consistent project scaffolding',
      'Used across CPAL data team',
      'Open source on GitHub',
    ],
  },
];

// Featured projects shown on homepage
export const featuredProjects = [projects[0], projects[6], projects[7]];
