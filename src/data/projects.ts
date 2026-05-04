export interface Project {
  slug: string;
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
    slug: 'eviction-pipeline',
    title: 'Dallas County Eviction Pipeline',
    description:
      'Production data pipeline processing 40,000+ eviction records annually.',
    longDescription:
      'Production data pipeline processing 40,000+ eviction records annually, serving 12+ partners including Dallas Eviction Advocacy Center, Eviction Lab, and Dallas HHS. Built the initial pipeline in R and have iterated on it for nearly five years as the system scaled.',
    tags: ['R', 'Data Pipeline', 'ETL', 'Housing'],
    href: '/resume/',
    gradient: 'from-canyon to-secondary',
    category: 'civic',
    highlights: [
      '40,000+ records processed annually',
      '12+ partner organizations served',
      'Foundation for northtexasevictions.org',
    ],
  },
  {
    slug: 'north-texas-evictions',
    title: 'North Texas Evictions',
    description:
      'Public-facing data transparency tool tracking eviction filings across Dallas County.',
    longDescription:
      'Public-facing data transparency tool tracking eviction filings across Dallas County, helping residents and advocates understand displacement patterns. Built with R Shiny, it visualizes trends over time, maps filing hotspots, and provides downloadable data for researchers and journalists.',
    tags: ['R Shiny', 'Housing', 'Public Data', 'GIS'],
    href: 'https://northtexasevictions.org',
    gradient: 'from-canyon to-secondary',
    category: 'civic',
    image: '/images/projects/north-texas-evictions.png',
    highlights: [
      'Used by advocates, journalists, and researchers',
      'Interactive mapping of filing hotspots',
      'Downloadable open data',
    ],
  },
  {
    slug: 'homestead-map',
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
    slug: 'block-walking',
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
    slug: 'digilab-shiny',
    title: 'DigiLab TCG Standings (R Shiny, archived)',
    description:
      'Original R Shiny prototype that proved the concept and seeded the data model behind DigiLab.',
    longDescription:
      'The original R Shiny dashboard tracking Digimon TCG tournaments in North Texas. Validated community demand for tournament tracking and seeded the data model, then was superseded by the full DigiLab platform. Still hosted on Posit Connect for archival reference.',
    tags: ['R Shiny', 'Archived', 'Prototype'],
    href: 'https://github.com/lopezmichael/digimon-tcg-standings',
    gradient: 'from-cool to-primary',
    category: 'personal',
    image: '/images/projects/digilab-shiny.png',
    highlights: [
      'Proved community demand for tournament tracking',
      'Superseded by the current DigiLab platform',
      'Archived; open source on GitHub',
    ],
  },
  {
    slug: 'rodriguez-wellbeing',
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
    slug: 'digilab',
    title: 'DigiLab',
    description:
      'Production tournament tracking and meta analysis platform for the global Digimon TCG community.',
    longDescription:
      'Full-stack data platform I designed and built for the Digimon TCG community. SSR-rendered entity pages (tamers, stores, decks, tournaments) with Highcharts visualizations and Mapbox maps, scene-aware leaderboards, regional meta analysis, MDX blog, dynamic OG images, a public token-authenticated API for external apps, and a separate admin subdomain for CRUD. Backed by a Discord community of 350+ members and 3,000+ tournaments logged worldwide.',
    tags: ['Astro', 'Preact', 'Neon', 'Vercel', 'Mapbox', 'Highcharts', 'TypeScript'],
    href: 'https://digilab.cards',
    gradient: 'from-cool to-primary',
    category: 'personal',
    image: '/images/projects/digilab.png',
    highlights: [
      '3,000+ tournaments logged · 350+ Discord community members',
      'SSR Astro + Preact islands · Neon Postgres on Vercel edge',
      'Public token-authenticated API and admin CRUD subdomain',
    ],
  },
  {
    slug: 'atomtemplates',
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

// Slugs that have a full case study at /projects/[slug]/. Used to pick the case-study card
// variant on the Projects page and the routing component in pages/projects/[slug].astro.
export const caseStudySlugs = new Set<string>(['eviction-pipeline', 'homestead-map', 'digilab']);

// Featured projects shown on homepage. Slug-based so reordering projects[] doesn't silently change the home page.
const featuredSlugs = ['eviction-pipeline', 'homestead-map', 'digilab'];
export const featuredProjects = featuredSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is Project => p !== undefined);
