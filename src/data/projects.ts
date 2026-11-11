export interface Project {
  slug: string;
  title: string;
  description: string;
  /** One short line for the project index rows (Home, Projects). Falls back to `description`. */
  hook?: string;
  longDescription: string;
  tags: string[];
  href: string;
  category: 'civic' | 'community' | 'other';
  highlights?: string[];
  image?: string;
  /** Optional card-only image; cards prefer this over `image`, detail pages don't read it. */
  cardImage?: string;
  /** Live URL exists but is access-gated / internal — suppresses the "Visit" button so recruiters don't hit a login wall or 403. */
  restricted?: boolean;
}

/** Image for cards and index rows: the card-only image when set, else the main one (CLAUDE.md, "cardImage vs image"). */
export const cardShot = (p: Project): string | undefined => p.cardImage ?? p.image;

/** Base name of a screenshot in /images/projects/ (its derived WebPs live in thumbs/ and figures/);
 *  undefined for images anywhere else. scripts/check-assets.mjs mirrors this rule. */
const projectImageName = (src: string): string | undefined => src.match(/^\/images\/projects\/([^/]+)\.\w+$/)?.[1];

/** WebP srcset for a project screenshot on its detail page (800w and 1600w, made by `npm run thumbs`).
 *  Returns undefined for images outside /images/projects/, which then load as-is. */
export const figureSrcset = (src: string): string | undefined => {
  const name = projectImageName(src);
  return name && `/images/projects/figures/${name}-800.webp 800w, /images/projects/figures/${name}-1600.webp 1600w`;
};

/** Small WebP of a project screenshot for hover previews, made by `npm run thumbs`. Paths outside
 *  /images/projects/ are returned unchanged. */
export const thumbFor = (src: string): string => {
  const name = projectImageName(src);
  return name ? `/images/projects/thumbs/${name}.webp` : src;
};

/** BaseLayout props for a project page: its link-preview image (from `npm run og`) and a schema.org
 *  CreativeWork. Pass the page's meta description so both say the same thing. */
export function projectSeo(p: Project, site: URL, description: string = p.description) {
  const image = `/images/og/${p.slug}.png`;
  return {
    title: p.title,
    description,
    image,
    structuredData: {
      '@type': 'CreativeWork',
      name: p.title,
      description,
      url: new URL(`/projects/${p.slug}/`, site).href,
      image: new URL(image, site).href,
      keywords: p.tags.join(', '),
    },
  };
}

export const projects: Project[] = [
  {
    slug: 'building-cpal-data-operations',
    title: "Building CPAL's Data Operations",
    hook: 'From two people and a laptop to data operations that outlast any one person.',
    description:
      'Helping build a nonprofit\'s data operations from a two-person team into an in-house engineering team, with a cloud platform and a 30+ app decision-support suite.',
    longDescription:
      "The six-year story of helping build the Child Poverty Action Lab's data operations: turning the strategic analytics team's proven prototypes into durable, access-controlled tools, hiring the org's first data engineer, pairing vendor engineers with an in-house team to build the platform, selecting and migrating to Databricks, leading the data org through a CDO transition, and rolling out AI-enabled workflows across the team. A leadership case study, not a pipeline write-up.",
    tags: ['Data Leadership', 'Team Building', 'Data Strategy', 'Databricks'],
    href: '',
    category: 'civic',
    image: '/images/projects/cpal-data-function.png',
    highlights: [
      'Helped grow the team from 1 analyst to 2 in-house + 4 vendor engineers',
      'Led the data org through a CDO transition',
      'Selected and migrated to Databricks; shaped the org-wide Claude Enterprise rollout',
    ],
  },
  {
    slug: 'eviction-pipeline',
    title: 'Dallas County Eviction Data',
    hook: 'County court records to tenant outreach, every weekday.',
    description:
      'The data workstream that gets eviction filings across four North Texas counties to the legal-aid and outreach teams reaching tenants facing displacement.',
    longDescription:
      "The eviction data workstream behind the Child Poverty Action Lab's housing work: turning messy county court records into a daily feed that 12+ partners (the Dallas Eviction Advocacy Center, the Princeton Eviction Lab, Dallas HHS) use to reach tenants facing displacement, and into the public transparency of North Texas Evictions. Built in R in 2020, then rebuilt on Databricks by our data engineering team as it scaled to four North Texas counties. What mattered was always who the data reaches.",
    tags: ['Housing & Eviction', 'Public Records', 'Partner Data', 'Data for Outreach'],
    href: 'https://northtexasevictions.org',
    category: 'civic',
    image: '/images/projects/north-texas-evictions.png',
    highlights: [
      '~48,000 Dallas filings a year turned into tenant outreach',
      '~800 tenants a year connected to legal representation',
      'Feeds 12+ partners and North Texas Evictions',
    ],
  },
  {
    slug: 'homestead-map',
    title: 'Dallas Homestead Exemption Map',
    hook: 'Who claims property tax savings in Dallas, tract by tract.',
    description:
      'Interactive map visualizing homestead exemption take-up rates across Dallas.',
    longDescription:
      'Interactive R Shiny application mapping homestead exemption take-up rates across Dallas by census tract, zip code, and neighborhood. Filters by race/ethnicity and income level to surface disparities in who is claiming property tax savings. Built with Mapbox GL, sourcing data from the Dallas Central Appraisal District and American Community Survey.',
    tags: ['R Shiny', 'Mapbox', 'Housing', 'GIS'],
    href: 'https://dallashomesteads.tools.cpal.org',
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
    hook: 'Which doors to knock for an unclaimed homestead exemption.',
    description:
      'Field-outreach tool that maps which nearby homes are likely missing a homestead exemption, so canvassers know which doors to knock.',
    longDescription:
      "The on-the-ground companion to the Homestead Exemption Map. Around a canvasser's location, it flags every parcel likely eligible for an unclaimed homestead exemption (worth hundreds to thousands of dollars a year per household), estimates the tax savings left on the table, and tracks outreach status door to door. Built with R Shiny and Mapbox GL on Dallas Central Appraisal District data, it's used by roughly 20 field-team members across CPAL's outreach partners.",
    tags: ['R Shiny', 'Mapbox', 'Housing', 'Field Outreach'],
    href: 'https://blockwalking.tools.cpal.org',
    restricted: true,
    category: 'civic',
    image: '/images/projects/blockwalking.png',
    highlights: [
      'Flags homes likely missing a homestead exemption, with projected savings',
      '~20 active field-team users across outreach partners',
      'The door-to-door companion to the Homestead Exemption Map',
    ],
  },
  {
    slug: 'rodriguez-wellbeing',
    title: 'Rodriguez Wellbeing & Counseling',
    hook: 'A bilingual site for a counseling practice.',
    description:
      'Bilingual therapy practice website built with Astro and Tailwind CSS.',
    longDescription:
      'Professional practice website for a licensed counselor and professor, offering counseling, clinical supervision, trauma-informed yoga, and speaking services. Fully bilingual (English/Spanish) with i18n routing, JSON-LD structured data, scroll-reveal animations, and a warm earthy design system.',
    tags: ['Astro', 'Tailwind CSS', 'i18n', 'Web Development'],
    href: 'https://www.rodriguezwellbeing.com',
    category: 'other',
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
    hook: 'A community-run data platform with about 2,000 daily users.',
    description:
      'Production tournament tracking and meta analysis platform for the Digimon and Gundam card game communities.',
    longDescription:
      'A community-sourced tournament data platform for the Digimon and Gundam card game scenes. A 600-member Discord and a network of volunteer organizers keep the data flowing; the platform turns it into regional meta analysis, scene-aware leaderboards, and blog deep-dives players use to prep for events. So far: 10,800+ tournaments logged, 19,100+ players tracked, and around 2,000 daily active users. A public API powers external community tools. Built on Astro, Preact, and Neon Postgres.',
    tags: ['Community Data', 'Meta Analysis', 'Data Insights', 'Astro', 'Neon', 'Public API'],
    href: 'https://digilab.cards',
    category: 'community',
    image: '/images/projects/digilab.png',
    highlights: [
      '10,800+ tournaments logged · 600 Discord community members',
      'SSR Astro + Preact islands · Neon Postgres on Vercel edge',
      'Public token-authenticated API and admin CRUD subdomain',
    ],
  },
  {
    slug: 'atomtemplates',
    title: 'atomtemplates',
    hook: 'One standard way to start an R project.',
    description:
      'R package for standardized project creation and handling.',
    longDescription:
      'Open-source R package that standardizes project creation and handling. Streamlines setup of new data projects with consistent directory structure, documentation templates, and tooling. Used internally at CPAL to maintain consistency across the data team.',
    tags: ['R Package', 'Open Source', 'DevTools'],
    href: 'https://github.com/lopezmichael/atomtemplates',
    category: 'other',
    image: '/images/projects/atomtemplates.png',
    highlights: [
      'Consistent project scaffolding',
      'Used across CPAL data team',
      'Open source on GitHub',
    ],
  },
];

// Featured projects shown on homepage. Slug-based so reordering projects[] doesn't silently change the home page.
const featuredSlugs = ['building-cpal-data-operations', 'eviction-pipeline', 'digilab'];
export const featuredProjects = featuredSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is Project => p !== undefined);
