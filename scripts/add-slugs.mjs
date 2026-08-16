#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const videosFilePath = path.join(process.cwd(), 'data', 'videos.ts');

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

let content = fs.readFileSync(videosFilePath, 'utf-8');

// Pattern to find video objects without slug
const titlePattern = /title: "([^"]+)",/g;
let match;

// Replace all video object patterns that don't have slug
content = content.replace(
  /(\{\s*id: "[^"]+",\s*title: "([^"]+)",)\s*(?!slug:)/g,
  (match, prefix, title) => {
    const slug = generateSlug(title);
    return `${prefix}\n    slug: generateSlug("${title}"),`;
  }
);

fs.writeFileSync(videosFilePath, content, 'utf-8');
console.log('Successfully added slugs to all video objects');
