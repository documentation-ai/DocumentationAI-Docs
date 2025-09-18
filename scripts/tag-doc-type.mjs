#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();

// Map relative paths (folder/file) to document types
const typeMap = new Map([
  // Getting Started
  ['getting-started/introduction', 'Tutorial'],
  ['getting-started/quickstart', 'Tutorial'],
  ['getting-started/how-documentation-ai-works', 'Explanation'],
  ['getting-started/create-your-first-project', 'Tutorial'],
  ['getting-started/import-existing-docs', 'Tutorial'],

  // Writing Content
  ['writing-content/web-editor', 'How-to Guide'],
  ['writing-content/code-editor', 'How-to Guide'],
  ['writing-content/markdown-basics', 'Tutorial'],
  ['writing-content/markdown-syntax', 'Reference'],
  ['writing-content/images-and-media', 'How-to Guide'],
  ['writing-content/organize-content-structure', 'How-to Guide'],
  ['writing-content/content-versioning-and-history', 'How-to Guide'],
  ['writing-content/keyboard-shortcuts', 'Reference'],
  ['writing-content/documentation-best-practices', 'Explanation'],

  // Design and Customization
  ['design-and-customization/theme', 'How-to Guide'],
  ['design-and-customization/colors-and-typography', 'How-to Guide'],
  ['design-and-customization/navigation-and-sidebar', 'How-to Guide'],
  ['design-and-customization/header-and-footer', 'How-to Guide'],
  ['design-and-customization/branding', 'How-to Guide'],
  ['design-and-customization/custom-home-page', 'How-to Guide'],
  ['design-and-customization/custom-css-and-javascript', 'How-to Guide'],
  ['design-and-customization/accessibility', 'Explanation'],

  // API Documentation & Playground
  ['api-documentation-and-playground/openapi-schema-import', 'Tutorial'],
  ['api-documentation-and-playground/organize-api-reference', 'How-to Guide'],
  ['api-documentation-and-playground/interactive-playground-setup', 'How-to Guide'],
  ['api-documentation-and-playground/code-generation', 'How-to Guide'],
  ['api-documentation-and-playground/code-samples-and-sdks', 'Reference'],
  ['api-documentation-and-playground/api-authentication', 'How-to Guide'],
  ['api-documentation-and-playground/api-error-codes', 'Reference'],
  ['api-documentation-and-playground/rate-limits-and-headers', 'Reference'],
  ['api-documentation-and-playground/versioning-and-deprecation-policy', 'Explanation'],
  ['api-documentation-and-playground/api-changelog', 'Reference'],
  ['api-documentation-and-playground/graphql-support', 'Reference'],
  ['api-documentation-and-playground/postman-collection-export', 'How-to Guide'],

  // AI
  ['ai/ai-assistant-set-up', 'How-to Guide'],
  ['ai/search-configuration', 'How-to Guide'],
  ['ai/ai-menu', 'Reference'],
  ['ai/llms-txt', 'Reference'],
  ['ai/helpful-prompts', 'How-to Guide'],
  ['ai/using-cursor', 'How-to Guide'],
  ['ai/ai-usage-costs', 'Reference'],
  ['ai/ai-privacy-and-data', 'Explanation'],

  // Deployment & Hosting
  ['deployment-and-hosting/deploy-your-documentation', 'Tutorial'],
  ['deployment-and-hosting/custom-domain', 'How-to Guide'],
  ['deployment-and-hosting/custom-subpath', 'How-to Guide'],
  ['deployment-and-hosting/build-information', 'How-to Guide'],
  ['deployment-and-hosting/ci-cd-pipelines', 'How-to Guide'],
  ['deployment-and-hosting/redirects-and-rewrites', 'How-to Guide'],

  // Configuration
  ['configuration/documentation-json-site-configuration', 'Reference'],
  ['configuration/page-front-matter-configuration', 'Reference'],
  ['configuration/api-configuration', 'Reference'],
  ['configuration/page-metadata', 'Reference'],

  // Components
  ['components/components-overview', 'How-to Guide'],
  ['components/component-library', 'Reference'],
  ['components/component-library/api-components', 'Reference'],
  ['components/component-library/callout', 'Reference'],
  ['components/component-library/codeblock', 'Reference'],
  ['components/component-library/codegroup', 'Reference'],
  ['components/component-library/expandable', 'Reference'],
  ['components/component-library/expandablegroup', 'Reference'],
  ['components/component-library/heading', 'Reference'],
  ['components/component-library/iframe', 'Reference'],
  ['components/component-library/image', 'Reference'],
  ['components/component-library/interactive-components', 'Reference'],
  ['components/component-library/list', 'Reference'],
  ['components/component-library/media-components', 'Reference'],
  ['components/component-library/paragraph', 'Reference'],
  ['components/component-library/paramfield', 'Reference'],
  ['components/component-library/request', 'Reference'],
  ['components/component-library/response', 'Reference'],
  ['components/component-library/responsefield', 'Reference'],
  ['components/component-library/table', 'Reference'],
  ['components/component-library/video', 'Reference'],

  // SEO and GEO
  ['seo-and-geo/optimize-for-geo', 'Explanation'],
  ['seo-and-geo/meta-tags-setup', 'How-to Guide'],
  ['seo-and-geo/structured-data', 'How-to Guide'],
  ['seo-and-geo/robots-txt-and-llm-txt', 'How-to Guide'],
  ['seo-and-geo/sitemap', 'How-to Guide'],
  ['seo-and-geo/canonical-urls', 'Reference'],
  ['seo-and-geo/hreflang-setup', 'How-to Guide'],

  // Analytics & Insights
  ['analytics-and-insights/user-feedback', 'Explanation'],
  ['analytics-and-insights/user-analytics', 'How-to Guide'],
  ['analytics-and-insights/search-and-ai-assistant-analytics', 'How-to Guide'],

  // Integrations & Workflows
  ['integrations-and-workflows/github-integration', 'How-to Guide'],
  ['integrations-and-workflows/gitlab-integration', 'How-to Guide'],
  ['integrations-and-workflows/slack-notifications', 'How-to Guide'],
  ['integrations-and-workflows/zapier-integration', 'How-to Guide'],
  ['integrations-and-workflows/analytics-integration', 'How-to Guide'],
  ['integrations-and-workflows/issue-trackers', 'How-to Guide'],
  ['integrations-and-workflows/support-and-chat', 'How-to Guide'],
  ['integrations-and-workflows/third-party-tools', 'Reference'],
  ['integrations-and-workflows/webhook-setup', 'How-to Guide'],

  // Migrations
  ['migrations/from-mintlify', 'How-to Guide'],
  ['migrations/from-docusaurus', 'How-to Guide'],
  ['migrations/from-gitbook', 'How-to Guide'],
  ['migrations/from-readme', 'How-to Guide'],
  ['migrations/from-mkdocs', 'How-to Guide'],
  ['migrations/from-notion', 'How-to Guide'],
  ['migrations/from-markdown', 'How-to Guide'],
  ['migrations/migration-checklist', 'Reference'],

  // Account & Billing
  ['account-and-billing/account-management', 'How-to Guide'],
  ['account-and-billing/organizations-workspaces-and-projects', 'Explanation'],
  ['account-and-billing/team-management', 'How-to Guide'],
  ['account-and-billing/sso-saml-and-scim', 'How-to Guide'],
  ['account-and-billing/billing-and-subscriptions', 'How-to Guide'],
  ['account-and-billing/usage-limits', 'Reference'],
  ['account-and-billing/upgrade-downgrade', 'How-to Guide'],
  ['account-and-billing/data-export-and-account-deletion', 'How-to Guide'],
  ['account-and-billing/audit-logs', 'Reference'],

  // Support
  ['support/faqs', 'Reference'],
  ['support/debugging-your-documentation', 'Tutorial'],
  ['support/troubleshoot-build-failures', 'How-to Guide'],
  ['support/fix-performance-issues', 'How-to Guide'],
  ['support/resolve-authentication-problems', 'How-to Guide'],
  ['support/contact-support', 'How-to Guide'],
  ['support/report-bugs', 'How-to Guide'],
  ['support/error-codes', 'Reference'],
  ['support/browser-support', 'Reference'],
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (entry.endsWith('.mdx')) files.push(full);
  }
  return files;
}

function relPathNoExt(abs) {
  const rel = path.relative(root, abs).replace(/\\/g, '/');
  return rel.replace(/\.mdx$/, '');
}

function prefixFirstParagraph(src, tag) {
  // Find H1 and the first paragraph after it. If the first paragraph already starts with [..], leave it.
  const h1Match = src.match(/(^# .+?\n\n)([\s\S]*?)(\n|$)/m);
  if (!h1Match) return src;
  const lead = h1Match[2].trim();
  if (lead.startsWith('[')) return src; // already tagged
  const prefixed = `[${tag}] ${lead}`;
  return src.replace(h1Match[0], h1Match[1] + prefixed + h1Match[3]);
}

function processFile(abs) {
  // Skip changelog
  if (abs.includes('/changelog/')) return;
  const relNoExt = relPathNoExt(abs);
  const type = typeMap.get(relNoExt);
  if (!type) return; // no type specified
  const content = fs.readFileSync(abs, 'utf8');
  const updated = prefixFirstParagraph(content, type);
  if (updated !== content) fs.writeFileSync(abs, updated, 'utf8');
}

function main() {
  const files = walk(root);
  for (const f of files) processFile(f);
  console.log('Doc types tagged.');
}

main();


