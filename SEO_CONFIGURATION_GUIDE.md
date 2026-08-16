# SEO-Optimized Movie Website - Configuration & Usage Guide

## Quick Start

The movie streaming platform has been enhanced with comprehensive SEO optimization. No configuration changes are required - the system works out of the box!

## Key Features

### 1. Slug-Based URLs
All movie pages now use SEO-friendly slugs instead of IDs:
- **Old**: `/video/1` → `/movie/the-dark-knight-returns`
- **New**: `/movie/[slug]` format
- Both formats continue to work for backward compatibility

### 2. Automatic Sitemap
Visit `https://yourdomain.com/sitemap.xml` to see:
- Homepage with priority 1.0
- 10 category pages with priority 0.8
- 50+ movie pages with priority 0.9
- Automatic last-modified dates

### 3. Robots Configuration
The file `app/robots.ts` controls crawler access:
- **Googlebot**: 1-second crawl delay
- **Bingbot**: 2-second crawl delay
- **Others**: 2-second crawl delay by default
- Disallows: `/admin`, `/api`, `/private`

### 4. Structured Data
Every movie page includes:
- Movie schema with ratings and metadata
- Video object schema
- Organization schema
- Website schema with search capability
- Breadcrumb navigation

### 5. Social Sharing
All movie pages include:
- **Open Graph tags** for Facebook, LinkedIn, Pinterest
- **Twitter Card tags** for Twitter/X
- **Custom preview images**
- **Rich descriptions**

## How to Customize

### Add Movie Metadata
Edit `/data/videos.ts` to add SEO fields:

```typescript
{
  id: "1",
  title: "Movie Title",
  slug: generateSlug("Movie Title"), // Auto-generated
  // New SEO fields:
  director: "Director Name",
  cast: ["Actor 1", "Actor 2"],
  keywords: ["custom", "keywords"],
  seoDescription: "Extended description for search results...",
  // ... other fields
}
```

### Update SEO Utilities
All SEO functions are in `/lib/seo-utils.ts`:

```typescript
// Generate slug from title
generateSlug("The Dark Knight") // → "the-dark-knight"

// Generate canonical URL
generateCanonicalUrl("the-dark-knight") 
// → "https://onemovie.app/movie/the-dark-knight"

// Optimize description
generateMetaDescription(longDescription, 160)
// → First 160 chars with proper ellipsis

// Create SEO title
generateSEOTitle("Movie", "Hollywood", 60)
// → "Movie - Watch on Onemovie"
```

### Configure Structured Data
Edit `/lib/structured-data.ts` to customize:

```typescript
// Update Organization details
generateOrganizationSchema() // Edit org name, logo, URLs

// Update Website schema
generateWebsiteSchema() // Edit search endpoint
```

### Customize Internal Linking
Edit `/lib/internal-links.ts` to modify recommendation algorithms:

```typescript
// Get related movies with custom limit
getRelatedMovies(videoId, limit: 12)

// Get popular movies
getPopularMovies(limit: 5)

// Get trending content
getTrendingMovies(limit: 10)
```

## Environment Configuration

### Optional: Google Search Console
Add your verification meta tag to `app/layout.tsx`:

```typescript
// In metadata object:
{
  // ... other metadata
  verification: {
    google: "your-verification-code-here"
  }
}
```

### Optional: Analytics Setup
Add Google Analytics ID:
1. Set environment variable: `NEXT_PUBLIC_GA_ID`
2. Add to `app/layout.tsx`

### Optional: Base URL Configuration
Update base URL in these files:
- `/lib/seo-utils.ts` (line ~31)
- `/app/robots.ts` (line ~22)
- `/app/sitemap.ts` (line ~4)

Change `https://onemovie.app` to your domain.

## Testing & Verification

### 1. Check Sitemap
```bash
curl https://yourdomain.com/sitemap.xml
```
Should return XML with all movie URLs.

### 2. Check Robots.txt
```bash
curl https://yourdomain.com/robots.txt
```
Should show crawler rules.

### 3. Test Movie Page Metadata
```bash
# Check meta tags in page source
curl https://yourdomain.com/movie/the-dark-knight-returns
```
Look for: title, description, og:*, twitter:*

### 4. Validate Structured Data
Use Google's Structured Data Testing Tool:
- Visit: https://schema.org/
- Test your movie pages
- Verify Movie and Organization schemas

### 5. Check SEO Score
Use Lighthouse:
```bash
lighthouse https://yourdomain.com/movie/the-dark-knight-returns
```
Target: SEO score 95+

## File Structure Reference

```
/app
  /movie/[slug]/
    page.tsx              # Main movie page with SEO
  robots.ts              # Crawler instructions
  sitemap.ts             # Dynamic sitemap
  not-found.tsx          # 404 page with SEO
  layout.tsx             # Enhanced with schemas

/lib
  seo-utils.ts           # URL, title, description utilities
  structured-data.ts     # JSON-LD schema generation
  internal-links.ts      # Link strategy & recommendations

/data
  videos.ts              # Video data with SEO fields

/components
  video-card.tsx         # Updated with better alt text
```

## Performance Tips

### 1. Image Optimization
- Images use Next.js Image component (auto-optimized)
- Lazy loading enabled
- Responsive sizes configured

### 2. Caching
- Movie pages: Static generation with ISR
- Recommended movies: Cached via internal-links
- Sitemap: Generated at build time

### 3. Bundle Size
- No external SEO libraries added
- All utilities are lightweight
- Schemas generated on-demand

## Monitoring

### Google Search Console
1. Add property: `https://yourdomain.com`
2. Verify ownership (meta tag, DNS, or file)
3. Monitor:
   - Indexing status
   - Search performance
   - Coverage errors
   - Mobile usability

### Google Analytics
1. Create GA property
2. Add tracking ID to `.env.local`
3. Monitor:
   - Organic search traffic
   - Landing pages
   - User behavior
   - Conversion tracking

### PageSpeed Insights
Test monthly at: https://pagespeed.web.dev/
Monitor:
- Core Web Vitals (LCP, FID, CLS)
- Lighthouse scores
- Mobile vs desktop performance

## Troubleshooting

### Issue: Movie slugs not generating
**Solution**: Ensure `generateSlug()` is called in `/data/videos.ts`
```typescript
slug: generateSlug("Movie Title"), // Add this
```

### Issue: Sitemap showing 404
**Solution**: Clear Next.js cache
```bash
rm -rf .next
npm run build
```

### Issue: Meta tags not appearing
**Solution**: 
1. Check `app/layout.tsx` has metadata export
2. Verify `generateMetadata()` in movie page
3. Check browser DevTools

### Issue: Structured data validation fails
**Solution**: 
1. Validate at https://schema.org/
2. Check JSON format in browser console
3. Verify required fields in schema

## Support Resources

### Next.js SEO
- https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- https://nextjs.org/learn/dashboard-app/optimizing-search-and-sharing

### Schema.org
- https://schema.org/Movie
- https://schema.org/VideoObject

### Google Search Central
- https://developers.google.com/search/docs

### Open Graph Protocol
- https://ogp.me/

---

**Last Updated**: April 6, 2026
**Version**: 1.0
