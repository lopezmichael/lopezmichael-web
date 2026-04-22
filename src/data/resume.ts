export interface Experience {
  title: string;
  company: string;
  dates: string;
  summary?: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface SkillCategory {
  label: string;
  items: string[];
}

export interface SelectedProject {
  name: string;
  description: string;
  href?: string;
}

export const experience: Experience[] = [
  {
    title: 'Director, Data',
    company: 'Child Poverty Action Lab',
    dates: 'May 2023 - Present',
    summary:
      'Leading data strategy, infrastructure, and team operations for a nonprofit focused on reducing child poverty in Dallas.',
    bullets: [
      'Assumed data team management, vendor relationships, and stakeholder management responsibilities following CDO departure (Dec 2024 - Dec 2025), reporting to CTO',
      'Built project management system in Notion adopted org-wide by multiple departments',
      'Architecting migration to Databricks, systematizing 35-40 data pipelines to transition from file-based storage to scalable infrastructure',
      'Built eviction data pipeline processing 40,000+ Dallas County records annually, used by 12+ partners including Dallas Eviction Advocacy Center, Eviction Lab, and Dallas HHS',
      'Designed parcel-level housing tool with 20 active users identifying residents eligible for assistance programs',
      'Built data function from the ground up; led hiring for all data roles including organization\'s first data engineer',
      'Managed team of up to 4 (3 analysts + 1 engineer); created onboarding documentation and mentored team in R, SQL, and data visualization',
      'Evaluated and selected enterprise tools including Databricks, Claude Enterprise, Lucidchart, and data vendors (MySidewalk, DataAxle)',
      'Oversaw development of 30+ R Shiny dashboards informing decisions on housing stability, public safety, and resource allocation',
    ],
  },
  {
    title: 'Manager, Data Analytics',
    company: 'Child Poverty Action Lab',
    dates: 'May 2022 - May 2023',
    summary:
      'Transitioned from individual contributor to project leadership, managing cross-functional data initiatives and mentoring junior team members.',
    bullets: [
      'Led development of R Shiny applications, shifting organization toward interactive data products',
      'Contributed to development of northtexasevictions.org, a public-facing eviction data transparency tool',
      'Mentored analytics interns; one intern subsequently hired as full-time analyst',
      'Managed projects spanning afterschool programming, child care accessibility, and housing stability',
      'Established data collection and sharing procedures that became organizational standards',
    ],
  },
  {
    title: 'Associate, Analytics',
    company: 'Child Poverty Action Lab',
    dates: 'June 2020 - April 2022',
    summary:
      'Early analytics team member who built foundational data infrastructure and reporting systems.',
    bullets: [
      'Created initial eviction data pipeline in R, laying groundwork for system now processing 40K+ records annually',
      'Developed dashboards and reports in R, QGIS, Tableau, and ArcGIS for internal teams and community partners',
      'Automated routine data processes, establishing repeatable frameworks used across the organization',
      'Presented findings on housing instability, afterschool programming, and public safety to partner organizations',
    ],
  },
  {
    title: 'Research Project Assistant',
    company: 'UT Southwestern Medical Center',
    dates: 'Dec 2019 - May 2020',
    bullets: [
      'Conducted participant interviews and assessments for biomedical research projects',
      'Analyzed data and produced reports for internal research findings',
      'Performed literature and policy reviews; coordinated project logistics across departments',
    ],
  },
  {
    title: 'Health and Social Policy Intern',
    company: 'Children at Risk',
    dates: 'June 2019 - August 2019',
    bullets: [
      'Led policy research on early childhood development and school performance',
      'Developed policy briefs on Texas education best practices for senior leadership and state stakeholders',
    ],
  },
  {
    title: 'Research Coordinator',
    company: 'University of Texas at Dallas',
    dates: 'Aug 2016 - Dec 2018',
    bullets: [
      'Managed research operations for the Developmental Neurolinguistics Lab',
      'Recruited, trained, and supervised 10-15 research assistants each semester',
      'Recruited 300+ participants from local schools and youth programs',
      'Conducted community outreach, presenting findings to families and local organizations',
    ],
  },
  {
    title: 'Research Assistant',
    company: 'Florida International University',
    dates: 'May 2013 - May 2015',
    bullets: [
      "Assessed pre-kindergarten children's spatial abilities and verbal intelligence",
      'Trained research assistants on assessment protocols and transcription procedures',
      'Recruited participants across Miami-Dade County schools',
    ],
  },
];

export const education: Education[] = [
  {
    degree: 'Master of Public Policy',
    school: 'University of Texas at Dallas',
    year: '2021',
  },
  {
    degree: 'Bachelor of Arts, Psychology & Anthropology',
    school: 'Florida International University',
    year: '2015',
  },
];

export const skills: SkillCategory[] = [
  {
    label: 'Languages & Analytics',
    items: ['R', 'SQL', 'Python', 'Statistical Modeling', 'ETL'],
  },
  {
    label: 'Data Infrastructure',
    items: ['Databricks', 'CKAN', 'Jenkins', 'Git', 'CI/CD'],
  },
  {
    label: 'Visualization & Apps',
    items: ['R Shiny', 'Tableau', 'ggplot2', 'Quarto'],
  },
  {
    label: 'Geospatial',
    items: ['QGIS', 'ArcGIS', 'Leaflet', 'sf'],
  },
  {
    label: 'Platforms & Tools',
    items: ['Notion', 'Lucidchart', 'Claude Enterprise', 'PostgreSQL'],
  },
  {
    label: 'Domains',
    items: ['Housing', 'Public Safety', 'Social Policy', 'Community Development'],
  },
];

export const selectedProjects: SelectedProject[] = [
  {
    name: 'Dallas County Eviction Pipeline',
    description:
      'Processing 40,000+ records annually, used by 12+ partners for outreach and intervention',
  },
  {
    name: 'North Texas Evictions',
    description: 'Public-facing data transparency tool',
    href: 'https://northtexasevictions.org',
  },
  {
    name: 'Parcel Block Walking Tool',
    description:
      'Housing assistance eligibility identifier with 20 active users',
  },
  {
    name: '30+ R Shiny Dashboards',
    description:
      'Interactive tools for housing stability, public safety, and resource allocation',
  },
  {
    name: 'DigiLab TCG Standings',
    description:
      'Shiny dashboard tracking Digimon TCG events in North Texas; built community for collaborative data collection',
    href: 'https://digilab.cards',
  },
  {
    name: 'atomtemplates',
    description: 'R package for standardized project creation and handling',
    href: 'https://github.com/lopezmichael/atomtemplates',
  },
];
