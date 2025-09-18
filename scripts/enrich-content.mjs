#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (entry.endsWith('.mdx')) {
      files.push(full);
    }
  }
  return files;
}

function topFolder(filePath) {
  const rel = path.relative(root, filePath);
  const parts = rel.split(path.sep);
  return parts[0];
}

function subFolder(filePath) {
  const rel = path.relative(root, filePath);
  const parts = rel.split(path.sep);
  return parts.slice(0, -1).join('/');
}

function getTitleFromFrontMatter(src) {
  const m = src.match(/^---[\s\S]*?\ntitle:\s*(.*)\n[\s\S]*?---/);
  if (!m) return null;
  return m[1].trim().replace(/^"|"$/g, '');
}

function generateDescription(title, folder) {
  const main = title.replace(/\s*[–—].*$/, '').replace(/\s*\/.*$/, '');
  switch (folder) {
    case 'getting-started':
      return `Start with ${main}: overview, setup, and first steps in Documentation.AI.`;
    case 'design-and-customization':
      return `Customize your docs site: ${main} in Documentation.AI.`;
    case 'deployment-and-hosting':
      return `Deploy and host your docs: ${main} configuration and best practices.`;
    case 'api-documentation-and-playground':
      return `Document and explore your API: ${main} in the API docs and playground.`;
    case 'components':
      return `Reference for ${main} in the Documentation.AI component library.`;
    case 'analytics-and-insights':
      return `Measure and learn from usage: ${main} in Documentation.AI.`;
    case 'ai':
      return `AI features and controls: ${main} configuration and guidance.`;
    case 'account-and-billing':
      return `Manage account, teams, and billing: ${main}.`;
    case 'seo-and-geo':
      return `SEO and geographic targeting: ${main} setup for your site.`;
    case 'integrations-and-workflows':
      return `Integrations and workflows: ${main} with Documentation.AI.`;
    case 'migrations':
      return `Migrate to Documentation.AI: ${main} guide.`;
    case 'configuration':
      return `Site configuration: ${main} options and examples.`;
    case 'support':
      return `Support and troubleshooting: ${main}.`;
    case 'writing-content':
      return `Write and manage content: ${main} in Documentation.AI.`;
    default:
      return `${main} in Documentation.AI.`;
  }
}

function generateIntroParagraph(title, folder) {
  const main = title;
  switch (folder) {
    case 'getting-started':
      return `${main} covers the essentials to get productive quickly — what it is, why it matters, and the exact steps to use it in Documentation.AI.`;
    case 'design-and-customization':
      return `Use ${main} to tailor the look and feel of your docs while maintaining accessibility and performance.`;
    case 'deployment-and-hosting':
      return `Learn how to set up ${main} for reliable builds, fast delivery, and a smooth release workflow.`;
    case 'api-documentation-and-playground':
      return `This guide shows how to use ${main} to build clear, testable API documentation and a great developer experience.`;
    case 'components':
      return `${main} is part of the component library. Use it to structure content consistently and accessibly.`;
    case 'analytics-and-insights':
      return `Understand ${main} and how to turn product usage and search behavior into actionable insights.`;
    case 'ai':
      return `Configure ${main} to balance capability, privacy, and cost for your documentation.`;
    case 'account-and-billing':
      return `Manage ${main} to keep your organization secure, compliant, and cost‑effective.`;
    case 'seo-and-geo':
      return `Set up ${main} to help search engines discover, understand, and correctly localize your docs.`;
    case 'integrations-and-workflows':
      return `Connect ${main} to automate workflows and integrate Documentation.AI with your tooling.`;
    case 'migrations':
      return `Follow this ${main} guide to move your content with minimal friction and preserved structure.`;
    case 'configuration':
      return `Configure ${main} with practical examples and recommendations for common setups.`;
    case 'support':
      return `Use ${main} to diagnose issues quickly and resolve common problems.`;
    case 'writing-content':
      return `Learn ${main} to create clear, maintainable documentation content at scale.`;
    default:
      return `This page explains ${main} and how to apply it in Documentation.AI.`;
  }
}

function updateFile(filePath) {
  if (filePath.endsWith('changelog/changelog.mdx')) return; // leave changelog
  const content = fs.readFileSync(filePath, 'utf8');
  const title = getTitleFromFrontMatter(content) || path.basename(filePath, '.mdx');
  const top = topFolder(filePath);
  const folder = top === 'components' ? 'components' : top;
  const newDesc = generateDescription(title, folder);
  const intro = generateIntroParagraph(title, folder);

  let updated = content;

  // Replace description if it's a placeholder or missing
  if (/^---[\s\S]*?\ndescription:\s*.*\n[\s\S]*?---/m.test(updated)) {
    updated = updated.replace(/(^---[\s\S]*?\ndescription:)\s*.*(\n[\s\S]*?---)/m, (m, p1, p2) => `${p1} "${newDesc}"${p2}`);
  } else if (/^---[\s\S]*?\n(---)/m.test(updated)) {
    updated = updated.replace(/(^---[\s\S]*?)\n(---)/m, (m, p1, p2) => `${p1}\ndescription: "${newDesc}"\n${p2}`);
  }

  // Replace the placeholder paragraph below the H1
  updated = updated.replace(/^(# .+?)\n\nThis page is a placeholder\. Content will be added soon\./m, `$1\n\n${intro}`);

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

function main() {
  const files = walk(root);
  for (const f of files) updateFile(f);
  console.log('Enrichment complete.');
}

main();


