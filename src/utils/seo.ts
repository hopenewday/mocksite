import { useSchemaOrg } from '@/composables/useSchemaOrg';
import { useHead } from '@vueuse/head';

type ToolType = 'academic' | 'productivity' | 'conversion' | 'other';

interface ToolSEOConfig {
  name: string;
  description: string;
  slug: string;
  category: ToolType;
  features: string[];
  faqs?: Array<{ question: string; answer: string }>;
  howToSteps?: Array<{ name: string; text: string }>;
  keywords?: string[];
  imagePath?: string;
}

export function useToolSEO(config: ToolSEOConfig) {
  const baseUrl = window.location.origin;
  const toolUrl = `${baseUrl}/tools/${config.category}/${config.slug}`;
  const imageUrl = config.imagePath
    ? new URL(config.imagePath, baseUrl).toString()
    : `${baseUrl}/og/${config.slug}.jpg`;

  // Initialize schema org once to share the graph
  const { setWebApplication, setFAQ, setHowTo, setBreadcrumbs } = useSchemaOrg();

  // Set up schema.org structured data
  const setupStructuredData = () => {
    // WebApplication schema
    setWebApplication({
      name: config.name,
      description: config.description,
      url: toolUrl,
      applicationCategory: getApplicationCategory(config.category),
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      featureList: config.features
    });

    // FAQ schema if available
    if (config.faqs?.length) {
      setFAQ(config.faqs);
    }

    // HowTo schema if available
    if (config.howToSteps?.length) {
      setHowTo({
        name: `How to use ${config.name}`,
        description: config.description,
        step: config.howToSteps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text
        }))
      });
    }
  };

  // Set up meta tags
  const setupMetaTags = () => {
    useHead({
      title: `${config.name} - Free Online Tool`,
      meta: [
        // Basic meta
        { name: 'description', content: config.description },
        { name: 'keywords', content: ['free', 'online', 'tool', config.category, ...(config.keywords || [])].join(', ') },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: toolUrl },
        { property: 'og:title', content: `${config.name} - Free Online Tool` },
        { property: 'og:description', content: config.description },
        { property: 'og:image', content: imageUrl },

        // Twitter
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:url', content: toolUrl },
        { property: 'twitter:title', content: `${config.name} - Free Online Tool` },
        { property: 'twitter:description', content: config.description },
        { property: 'twitter:image', content: imageUrl }
      ]
    });
  };

  // Set up breadcrumbs
  const setupBreadcrumbs = () => {
    setBreadcrumbs([
      { name: 'Home', item: baseUrl },
      { name: 'Tools', item: `${baseUrl}/tools` },
      { name: config.category.charAt(0).toUpperCase() + config.category.slice(1), item: `${baseUrl}/tools/${config.category}` },
      { name: config.name }
    ]);
  };

  // Initialize all SEO components
  const initSEO = () => {
    setupStructuredData();
    setupMetaTags();
    setupBreadcrumbs();
  };

  return {
    initSEO,
    toolUrl,
    imageUrl
  };
}

function getApplicationCategory(category: ToolType): string {
  const categories = {
    academic: 'EducationalApplication',
    productivity: 'BusinessApplication',
    conversion: 'WebApplication',
    other: 'WebApplication'
  };
  return categories[category] || 'WebApplication';
}

// Example usage:
/*
// In your tool component:
const { initSEO } = useToolSEO({
  name: 'GPA Calculator',
  description: 'Calculate your GPA with our free online calculator',
  slug: 'gpa-calculator',
  category: 'academic',
  features: [
    '4.0, 5.0, and 10.0 grade scales',
    'Weighted GPA calculation',
    'Cumulative GPA tracking'
  ],
  faqs: [
    {
      question: 'How do I calculate my GPA?',
      answer: 'Enter your grades and credit hours for each course, and the calculator will compute your GPA.'
    }
  ],
  howToSteps: [
    {
      name: 'Enter your courses',
      text: 'Add each course with its grade and credit hours.'
    },
    {
      name: 'Add more courses',
      text: 'Click the "Add Course" button to include additional courses.'
    },
    {
      name: 'View results',
      text: 'Your GPA will be calculated and displayed automatically.'
    }
  ],
  keywords: ['gpa', 'calculator', 'grade point average', 'academic'],
  imagePath: '/images/og/gpa-calculator.jpg'
});

onMounted(() => {
  initSEO();
});
*/
