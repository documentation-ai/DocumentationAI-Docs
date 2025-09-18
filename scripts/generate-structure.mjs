#!/usr/bin/env node
/*
  Generator: Builds docs folder/file structure and navigation based on a fixed table.
  Actions:
  - Deletes all top-level folders/files except: changelog/, documentation.json, scripts/
  - Creates folders/files with minimal front-matter and placeholders
  - Rewrites documentation.json navigation/groups and initialRoute
*/

import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(path.join(process.cwd()));

const entries = [
  // account-and-billing
  { folder: 'account-and-billing', file: 'account-management', nav: 'Account Management', title: 'Account Management' },
  { folder: 'account-and-billing', file: 'audit-logs', nav: 'Audit Logs', title: 'Audit Logs' },
  { folder: 'account-and-billing', file: 'billing-and-subscriptions', nav: 'Billing & Subscriptions', title: 'Billing & Subscriptions / Invoices & Taxes' },
  { folder: 'account-and-billing', file: 'data-export-and-account-deletion', nav: 'Data Export & Account Deletion', title: 'Data Export & Account Deletion' },
  { folder: 'account-and-billing', file: 'organizations-workspaces-and-projects', nav: 'Organizations, Workspaces & Projects', title: 'Organizations, Workspaces & Projects' },
  { folder: 'account-and-billing', file: 'sso-saml-and-scim', nav: 'SSO/SAML & SCIM Provisioning', title: 'SSO/SAML & SCIM Provisioning' },
  { folder: 'account-and-billing', file: 'team-management', nav: 'Team Management / Roles & Permissions', title: 'Team Management / Roles & Permissions' },
  { folder: 'account-and-billing', file: 'upgrade-downgrade', nav: 'Upgrade / Downgrade', title: 'Upgrade / Downgrade' },
  { folder: 'account-and-billing', file: 'usage-limits', nav: 'Usage Limits', title: 'Usage Limits' },

  // ai
  { folder: 'ai', file: 'ai-privacy-and-data', nav: 'AI Privacy & Data Handling', title: 'AI Privacy & Data Handling' },
  { folder: 'ai', file: 'ai-usage-costs', nav: 'AI Usage, Costs & Limits', title: 'AI Usage, Costs & Limits' },
  { folder: 'ai', file: 'helpful-prompts', nav: 'Helpful Prompts', title: 'Helpful Prompts' },
  { folder: 'ai', file: 'ai-menu', nav: 'On-Page AI Menu', title: 'On-Page AI Menu' },
  { folder: 'ai', file: 'llms-txt', nav: 'llms.txt', title: 'llms.txt' },
  { folder: 'ai', file: 'search-configuration', nav: 'Search Configuration', title: 'Search Configuration' },
  { folder: 'ai', file: 'ai-assistant-set-up', nav: 'Set Up the AI Assistant', title: 'Set Up the AI Assistant' },
  { folder: 'ai', file: 'using-cursor', nav: 'Use Cursor with Documentation.AI', title: 'Use Cursor with Documentation.AI' },

  // analytics-and-insights
  { folder: 'analytics-and-insights', file: 'user-feedback', nav: 'Collect & Triage User Feedback', title: 'Collect & Triage User Feedback' },
  { folder: 'analytics-and-insights', file: 'search-and-ai-assistant-analytics', nav: 'Search and AI Assistant Analytics', title: 'Search and AI Assistant Analytics — Track what users are searching for' },
  { folder: 'analytics-and-insights', file: 'user-analytics', nav: 'User Behavior Analytics', title: 'User Behavior Analytics' },

  // api-documentation-and-playground
  { folder: 'api-documentation-and-playground', file: 'api-authentication', nav: 'API Authentication', title: 'API Authentication' },
  { folder: 'api-documentation-and-playground', file: 'api-changelog', nav: 'API Changelog', title: 'API Changelog' },
  { folder: 'api-documentation-and-playground', file: 'api-error-codes', nav: 'API Errors & Error Codes', title: 'API Errors & Error Codes' },
  { folder: 'api-documentation-and-playground', file: 'code-generation', nav: 'Code Generation', title: 'Code Generation' },
  { folder: 'api-documentation-and-playground', file: 'code-samples-and-sdks', nav: 'Code Samples & SDKs', title: 'Code Samples & SDKs' },
  { folder: 'api-documentation-and-playground', file: 'graphql-support', nav: 'GraphQL Support', title: 'GraphQL Support' },
  { folder: 'api-documentation-and-playground', file: 'interactive-playground-setup', nav: 'Interactive Playground Setup', title: 'Interactive Playground Setup' },
  { folder: 'api-documentation-and-playground', file: 'openapi-schema-import', nav: 'OpenAPI / JSON Schema Import', title: 'OpenAPI / JSON Schema Import — Import API specs' },
  { folder: 'api-documentation-and-playground', file: 'organize-api-reference', nav: 'Organize API Reference', title: 'Organize API Reference (Tags, Groups, Ordering)' },
  { folder: 'api-documentation-and-playground', file: 'postman-collection-export', nav: 'Postman Collection / Export', title: 'Postman Collection / Export' },
  { folder: 'api-documentation-and-playground', file: 'rate-limits-and-headers', nav: 'Rate Limits & Headers', title: 'Rate Limits & Headers' },
  { folder: 'api-documentation-and-playground', file: 'versioning-and-deprecation-policy', nav: 'Versioning & Deprecation Policy', title: 'Versioning & Deprecation Policy' },

  // components
  { folder: 'components', file: 'component-library', nav: 'Component Library', title: 'Component Library' },
  { folder: 'components', file: 'components-overview', nav: 'Components Overview', title: 'Components Overview' },

  // components/component-library
  { folder: 'components/component-library', file: 'api-components', nav: 'Api Components', title: 'api-components' },
  { folder: 'components/component-library', file: 'callout', nav: 'Callout', title: 'callout' },
  { folder: 'components/component-library', file: 'codeblock', nav: 'Codeblock', title: 'codeblock' },
  { folder: 'components/component-library', file: 'codegroup', nav: 'Codegroup', title: 'codegroup' },
  { folder: 'components/component-library', file: 'expandable', nav: 'Expandable', title: 'expandable' },
  { folder: 'components/component-library', file: 'expandablegroup', nav: 'Expandablegroup', title: 'expandablegroup' },
  { folder: 'components/component-library', file: 'heading', nav: 'Heading', title: 'heading' },
  { folder: 'components/component-library', file: 'iframe', nav: 'Iframe', title: 'iframe' },
  { folder: 'components/component-library', file: 'image', nav: 'Image', title: 'image' },
  { folder: 'components/component-library', file: 'interactive-components', nav: 'Interactive Components', title: 'interactive-components' },
  { folder: 'components/component-library', file: 'list', nav: 'List', title: 'list' },
  { folder: 'components/component-library', file: 'media-components', nav: 'Media Components', title: 'media-components' },
  { folder: 'components/component-library', file: 'paragraph', nav: 'Paragraph', title: 'paragraph' },
  { folder: 'components/component-library', file: 'paramfield', nav: 'Paramfield', title: 'paramfield' },
  { folder: 'components/component-library', file: 'request', nav: 'Request', title: 'request' },
  { folder: 'components/component-library', file: 'response', nav: 'Response', title: 'response' },
  { folder: 'components/component-library', file: 'responsefield', nav: 'Responsefield', title: 'responsefield' },
  { folder: 'components/component-library', file: 'table', nav: 'Table', title: 'table' },
  { folder: 'components/component-library', file: 'video', nav: 'Video', title: 'video' },

  // configuration
  { folder: 'configuration', file: 'page-front-matter-configuration', nav: 'Advanced Page / Front-matter Configuration', title: 'Advanced Page / Front-matter Configuration' },
  { folder: 'configuration', file: 'api-configuration', nav: 'API Configuration', title: 'API Configuration' },
  { folder: 'configuration', file: 'documentation-json-site-configuration', nav: 'documentation.json / Advanced Site Configuration', title: 'documentation.json / Advanced Site Configuration' },
  { folder: 'configuration', file: 'page-metadata', nav: 'Page Metadata', title: 'Page Metadata' },

  // deployment-and-hosting
  { folder: 'deployment-and-hosting', file: 'build-information', nav: 'Build Information', title: 'Build Information' },
  { folder: 'deployment-and-hosting', file: 'ci-cd-pipelines', nav: 'CI/CD Pipelines', title: 'CI/CD Pipelines' },
  { folder: 'deployment-and-hosting', file: 'custom-domain', nav: 'Custom Domain Setup', title: 'Custom Domain Setup' },
  { folder: 'deployment-and-hosting', file: 'custom-subpath', nav: 'Custom Subpath Setup', title: 'Custom Subpath Setup' },
  { folder: 'deployment-and-hosting', file: 'deploy-your-documentation', nav: 'Deploy Your Documentation', title: 'Deploy Your Documentation — End-to-end deployment' },
  { folder: 'deployment-and-hosting', file: 'redirects-and-rewrites', nav: 'Redirects & Rewrites', title: 'Redirects & Rewrites' },

  // design-and-customization
  { folder: 'design-and-customization', file: 'accessibility', nav: 'Accessibility', title: 'Accessibility (a11y)' },
  { folder: 'design-and-customization', file: 'branding', nav: 'Branding', title: 'Branding (Logo, Favicon)' },
  { folder: 'design-and-customization', file: 'colors-and-typography', nav: 'Colors & Typography', title: 'Colors & Typography' },
  { folder: 'design-and-customization', file: 'custom-css-and-javascript', nav: 'Custom CSS & JavaScript', title: 'Custom CSS & JavaScript — Advanced styling and functionality' },
  { folder: 'design-and-customization', file: 'custom-home-page', nav: 'Custom Home Page', title: 'Custom Home Page' },
  { folder: 'design-and-customization', file: 'header-and-footer', nav: 'Header & Footer', title: 'Header & Footer' },
  { folder: 'design-and-customization', file: 'navigation-and-sidebar', nav: 'Navigation & Sidebar', title: 'Navigation & Sidebar' },
  { folder: 'design-and-customization', file: 'theme', nav: 'Theme', title: 'Theme' },

  // getting-started
  { folder: 'getting-started', file: 'create-your-first-project', nav: 'Create Your First Project', title: 'Create Your First Project' },
  { folder: 'getting-started', file: 'how-documentation-ai-works', nav: 'How Documentation.AI Works', title: 'How Documentation.AI Works' },
  { folder: 'getting-started', file: 'import-existing-docs', nav: 'Import Existing Docs', title: 'Import Existing Docs' },
  { folder: 'getting-started', file: 'introduction', nav: 'Introduction', title: 'Introduction' },
  { folder: 'getting-started', file: 'quickstart', nav: 'Quickstart', title: 'Quickstart' },

  // integrations-and-workflows
  { folder: 'integrations-and-workflows', file: 'analytics-integration', nav: 'Analytics Integration', title: 'Analytics Integration (Google Analytics, etc.)' },
  { folder: 'integrations-and-workflows', file: 'github-integration', nav: 'GitHub Integration', title: 'GitHub Integration' },
  { folder: 'integrations-and-workflows', file: 'gitlab-integration', nav: 'GitLab Integration', title: 'GitLab Integration' },
  { folder: 'integrations-and-workflows', file: 'issue-trackers', nav: 'Issue Trackers', title: 'Issue Trackers (Jira, Linear)' },
  { folder: 'integrations-and-workflows', file: 'slack-notifications', nav: 'Slack Notifications', title: 'Slack Notifications' },
  { folder: 'integrations-and-workflows', file: 'support-and-chat', nav: 'Support & Chat', title: 'Support & Chat (Zendesk, Intercom)' },
  { folder: 'integrations-and-workflows', file: 'third-party-tools', nav: 'Third-party Tools', title: 'Third-party Tools (All Integrations)' },
  { folder: 'integrations-and-workflows', file: 'webhook-setup', nav: 'Webhook Setup', title: 'Webhook Setup' },
  { folder: 'integrations-and-workflows', file: 'zapier-integration', nav: 'Zapier Integration', title: 'Zapier Integration' },

  // migrations
  { folder: 'migrations', file: 'from-docusaurus', nav: 'From Docusaurus', title: 'From Docusaurus' },
  { folder: 'migrations', file: 'from-gitbook', nav: 'From GitBook', title: 'From GitBook' },
  { folder: 'migrations', file: 'from-markdown', nav: 'From Markdown Files', title: 'From Markdown Folders' },
  { folder: 'migrations', file: 'from-mintlify', nav: 'From Mintlify', title: 'From Mintlify' },
  { folder: 'migrations', file: 'from-mkdocs', nav: 'From MkDocs', title: 'From MkDocs' },
  { folder: 'migrations', file: 'from-notion', nav: 'From Notion', title: 'From Notion' },
  { folder: 'migrations', file: 'from-readme', nav: 'From ReadMe', title: 'From ReadMe' },
  { folder: 'migrations', file: 'migration-checklist', nav: 'Migration Checklist', title: 'Migration Checklist' },

  // seo-and-geo
  { folder: 'seo-and-geo', file: 'canonical-urls', nav: 'Canonical URLs', title: 'Canonical URLs' },
  { folder: 'seo-and-geo', file: 'hreflang-setup', nav: 'Hreflang', title: 'Hreflang / GEO Targeting' },
  { folder: 'seo-and-geo', file: 'meta-tags-setup', nav: 'Meta Tags Setup', title: 'Meta Tags Setup' },
  { folder: 'seo-and-geo', file: 'optimize-for-geo', nav: 'Optimize for GEO', title: 'Optimize for GEO' },
  { folder: 'seo-and-geo', file: 'robots-txt-and-llm-txt', nav: 'Robots.txt & llm.txt', title: 'Robots.txt & llm.txt (link to AI)' },
  { folder: 'seo-and-geo', file: 'sitemap', nav: 'Sitemap', title: 'Sitemap' },
  { folder: 'seo-and-geo', file: 'structured-data', nav: 'Structured Data', title: 'Structured Data (JSON-LD)' },

  // support
  { folder: 'support', file: 'browser-support', nav: 'Browser Support', title: 'Browser Support — Supported browsers and versions' },
  { folder: 'support', file: 'contact-support', nav: 'Contact Support', title: 'Contact Support — How to get help effectively' },
  { folder: 'support', file: 'debugging-your-documentation', nav: 'Debugging Your Documentation', title: 'Debugging Your Documentation — Systematic troubleshooting approach' },
  { folder: 'support', file: 'error-codes', nav: 'Error Codes', title: 'Error Codes — Complete error code reference' },
  { folder: 'support', file: 'faqs', nav: 'FAQs', title: 'FAQs' },
  { folder: 'support', file: 'fix-performance-issues', nav: 'Fix Performance Issues', title: 'Fix Performance Issues — Site optimization techniques' },
  { folder: 'support', file: 'report-bugs', nav: 'Report Bugs', title: 'Report Bugs — Bug reporting best practices' },
  { folder: 'support', file: 'resolve-authentication-problems', nav: 'Resolve Authentication Problems', title: 'Resolve Authentication Problems — Auth troubleshooting' },
  { folder: 'support', file: 'troubleshoot-build-failures', nav: 'Troubleshoot Build Failures', title: 'Troubleshoot Build Failures — Common build issues and solutions' },

  // writing-content
  { folder: 'writing-content', file: 'code-editor', nav: 'Code Editor', title: 'Code Editor' },
  { folder: 'writing-content', file: 'content-versioning-and-history', nav: 'Content Versioning & History', title: 'Content Versioning & History — Track and manage content changes' },
  { folder: 'writing-content', file: 'documentation-best-practices', nav: 'Documentation Best Practices', title: 'Documentation Best Practices' },
  { folder: 'writing-content', file: 'images-and-media', nav: 'Images & Media', title: 'Images & Media' },
  { folder: 'writing-content', file: 'keyboard-shortcuts', nav: 'Keyboard Shortcuts', title: 'Keyboard Shortcuts' },
  { folder: 'writing-content', file: 'markdown-basics', nav: 'Markdown Basics', title: 'Markdown Basics (hands-on intro)' },
  { folder: 'writing-content', file: 'markdown-syntax', nav: 'Markdown Syntax', title: 'Markdown Syntax (single canonical table; remove duplicate)' },
  { folder: 'writing-content', file: 'organize-content-structure', nav: 'Organize Content Structure', title: 'Organize Content Structure' },
  { folder: 'writing-content', file: 'web-editor', nav: 'Web Editor', title: 'Web Editor' }
];

const keepDirs = new Set(['changelog', 'scripts']);
const keepFiles = new Set(['documentation.json']);

function titleCase(str) {
  return str
    .split(/[-\s]+/)
    .map(w => w.length ? w[0].toUpperCase() + w.slice(1) : w)
    .join(' ');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function purgeRoot() {
  const items = fs.readdirSync(repoRoot);
  for (const name of items) {
    if (name.startsWith('.')) continue;
    if (keepFiles.has(name) || keepDirs.has(name)) continue;
    const full = path.join(repoRoot, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      fs.rmSync(full, { recursive: true, force: true });
    } else {
      // remove top-level files like introduction.mdx
      fs.rmSync(full, { force: true });
    }
  }
}

function writeMdx(fullPath, fileTitle) {
  const content = `---\n` +
    `title: ${fileTitle}\n` +
    `description: Placeholder — content coming soon.\n` +
    `---\n\n` +
    `# ${fileTitle}\n\n` +
    `This page is a placeholder. Content will be added soon.\n`;
  fs.writeFileSync(fullPath, content, 'utf8');
}

function buildFiles() {
  for (const { folder, file, title } of entries) {
    const dirPath = path.join(repoRoot, folder);
    ensureDir(dirPath);
    const filePath = path.join(dirPath, `${file}.mdx`);
    writeMdx(filePath, title);
  }
}

function groupByFolder() {
  const map = new Map();
  for (const e of entries) {
    if (!map.has(e.folder)) map.set(e.folder, []);
    map.get(e.folder).push(e);
  }
  return map;
}

function computeGroupTitle(folderSlug) {
  const special = new Map([
    ['ai', 'AI'],
    ['seo-and-geo', 'SEO and GEO'],
    ['api-documentation-and-playground', 'API Documentation & Playground'],
  ]);
  if (special.has(folderSlug)) return special.get(folderSlug);
  return titleCase(folderSlug.replace(/-/g, ' '));
}

function writeDocumentationJson() {
  const docPath = path.join(repoRoot, 'documentation.json');
  const groups = [];
  const grouped = groupByFolder();
  for (const [folder, list] of grouped) {
    const pages = list.map(e => ({ title: e.nav, path: `${folder}/${e.file}` }));
    groups.push({ group: computeGroupTitle(folder), pages });
  }
  // Add Updates group for changelog if present
  const changelogPath = path.join('changelog', 'changelog');
  if (fs.existsSync(path.join(repoRoot, 'changelog', 'changelog.mdx'))) {
    groups.push({ group: 'Updates', pages: [{ title: 'Changelog', path: changelogPath }] });
  }

  const json = {
    name: 'Documentation.AI',
    initialRoute: 'getting-started/introduction',
    navigation: { groups }
  };
  fs.writeFileSync(docPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
}

function main() {
  purgeRoot();
  buildFiles();
  writeDocumentationJson();
  // success
  console.log('Docs structure generated successfully.');
}

main();


