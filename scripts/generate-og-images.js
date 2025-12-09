const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public/images/og');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// List of tools to generate OG images for
const tools = [
  {
    id: 'gpa-calculator',
    title: 'GPA Calculator',
    description: 'Calculate your Grade Point Average with our free online tool'
  },
  {
    id: 'cgpa-calculator',
    title: 'CGPA Calculator',
    description: 'Calculate your Cumulative Grade Point Average easily'
  },
  {
    id: 'grade-calculator',
    title: 'Grade Calculator',
    description: 'Calculate your final grade and see what you need to score'
  },
  {
    id: 'test-score-calculator',
    title: 'Test Score Calculator',
    description: 'Calculate your test scores and percentage'
  }
  // Add more tools as needed
];

// Read the template
const templatePath = path.join(__dirname, 'og-templates/template.html');
const template = fs.readFileSync(templatePath, 'utf8');

async function generateOGImage({ id, title, description }) {
  const outputPath = path.join(publicDir, `${id}.jpg`);
  
  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`Skipping ${id} - file already exists`);
    return;
  }

  console.log(`Generating OG image for ${title}...`);
  
  // Replace placeholders in template
  const html = template
    .replace('{{TITLE}}', title)
    .replace('{{DESCRIPTION}}', description);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to match OG image dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1
    });
    
    // Set the HTML content
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Take a screenshot
    await page.screenshot({
      path: outputPath,
      type: 'jpeg',
      quality: 90,
      fullPage: false
    });
    
    console.log(`✅ Generated: ${id}.jpg`);
  } catch (error) {
    console.error(`❌ Error generating ${id}:`, error);
  } finally {
    await browser.close();
  }
}

// Process all tools
async function generateAllOGImages() {
  console.log('Starting OG image generation...');
  
  for (const tool of tools) {
    await generateOGImage(tool);
  }
  
  console.log('\n🎉 All OG images have been generated!');
  console.log(`Location: ${publicDir}`);
}

// Run the generator
generateAllOGImages().catch(console.error);
