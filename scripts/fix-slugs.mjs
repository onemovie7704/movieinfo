#!/usr/bin/env node

import fs from 'fs';

const filePath = 'data/videos.ts';

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// Replace pattern: find "title: "..."," followed by videoUrl without slug in between
content = content.replace(
  /^(\s+)(title: "[^"]+",)\s*$/gm,
  (match, indent, titleLine) => {
    // Extract title text
    const titleMatch = titleLine.match(/title: "([^"]+)"/);
    if (!titleMatch) return match;
    
    const titleText = titleMatch[1];
    // Check if next line isn't slug already
    const matchIndex = content.indexOf(match);
    const nextLineMatch = content.substring(matchIndex + match.length).match(/\n\s*(slug:|videoUrl:)/);
    
    if (nextLineMatch && nextLineMatch[1] === 'slug:') {
      return match; // slug already exists
    }
    
    // Add slug line
    return `${indent}${titleLine}\n${indent}slug: generateSlug("${titleText}"),`;
  }
);

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Successfully added slugs to all videos');
