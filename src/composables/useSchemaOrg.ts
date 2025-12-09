import { ref, watchEffect } from 'vue';
import { useHead } from '@vueuse/head';

export function useSchemaOrg() {
  const nodes = ref<any[]>([]);

  const addNode = (node: any) => {
    // Avoid duplicates if needed, or just push
    nodes.value.push(node);
  };

  const setSchema = (node: any) => {
    // For backward compatibility or single-node setting, we can just clear and add
    // But 'setSchema' implies setting generic schema. Let's make it add to graph.
    addNode(node);
  };

  // Auto-update head when nodes change
  watchEffect(() => {
    if (nodes.value.length === 0) return;

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': nodes.value
          }, null, 2)
        }
      ]
    });
  });

  // Helper for WebApplication schema
  const setWebApplication = (data: any) => {
    addNode({
      '@type': 'WebApplication',
      ...data
    });
  };

  // Helper for BreadcrumbList schema
  const setBreadcrumbs = (items: Array<{ name: string; item?: string }>) => {
    addNode({
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        ...(item.item ? { item: item.item } : {})
      }))
    });
  };

  // Helper for FAQPage schema
  const setFAQ = (faqs: Array<{ question: string; answer: string }>) => {
    addNode({
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  };

  // Helper for HowTo schema
  const setHowTo = (data: any) => {
    addNode({
      '@type': 'HowTo',
      ...data
    })
  }

  return {
    addNode,
    setSchema,
    setWebApplication,
    setBreadcrumbs,
    setFAQ,
    setHowTo
  };
}
