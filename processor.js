import { checkArticleExists, saveArticle } from './db.js';
import { extractArticleData } from './rss.js';
import { getFullArticleContent } from './article-fetcher.js';

// Function to process RSS items with full article content
export async function processRSSItems(items, db) {
  let newArticles = 0;
  let skippedArticles = 0;
  let failedArticles = 0;
  
  console.log('🔄 Processing articles with full content extraction...');
  
  for (const item of items) {
    try {
      // Extract basic article data from RSS
      const { title, url, pubDate, content: rssContent } = extractArticleData(item);
      
      // Skip if no URL
      if (!url) {
        console.log(`⚠️ Skipping article "${title}" - no URL found`);
        skippedArticles++;
        continue;
      }
      
      // Check if article already exists
      const exists = await checkArticleExists(db, url, title);
      
      if (exists) {
        console.log(`⏭️ Skipping existing article: "${title}"`);
        skippedArticles++;
        continue;
      }
      
      console.log(`📖 Processing article: "${title}"`);
      
      // Always try to fetch full article content first
      let blogData;
      try {
        const articleContent = await getFullArticleContent(url);
        const fullContent = articleContent.text || articleContent.html || '';
        const finalTitle = articleContent.title || title;
        
        // Log the images found
        const images = articleContent.images || [];
        console.log(`🖼️ Found ${images.length} images for article: "${finalTitle}"`);
        if (images.length > 0) {
          console.log(`📸 Image URLs:`, images.slice(0, 3)); // Show first 3 images
          if (images.length > 3) {
            console.log(`   ... and ${images.length - 3} more images`);
          }
        }
        
        blogData = {
          title: finalTitle,
          url: url,
          content: fullContent, // Always use full scraped content
          published_at: new Date(pubDate),
          source: 'fraudoftheday.com',
          created_at: new Date(),
          content_length: fullContent.length,
          excerpt: articleContent.excerpt || '',
          original_rss_content: rssContent,
          images: images
        };
        
        if (!fullContent || fullContent.length < 100) {
          throw new Error('Extracted content too short, falling back to RSS snippet');
        }
        
        // Save to database
        const saved = await saveArticle(db, blogData);
        if (saved) {
          const imageCount = blogData.images.length;
          console.log(`✅ Saved new article: "${finalTitle}" (${fullContent.length} characters, ${imageCount} images)`);
          newArticles++;
        } else {
          console.log(`❌ Failed to save article: "${finalTitle}"`);
          failedArticles++;
        }
      } catch (contentError) {
        console.error(`❌ Failed to fetch full content for "${title}":`, contentError.message);
        // Fallback: save with RSS content only
        blogData = {
          title: title,
          url: url,
          content: rssContent,
          published_at: new Date(pubDate),
          source: 'fraudoftheday.com',
          created_at: new Date(),
          content_length: rssContent.length,
          excerpt: '',
          original_rss_content: rssContent,
          full_content_failed: true,
          images: []
        };
        const saved = await saveArticle(db, blogData);
        if (saved) {
          console.log(`⚠️ Saved article with RSS content only: "${title}"`);
          newArticles++;
        } else {
          console.log(`❌ Failed to save article: "${title}"`);
          failedArticles++;
        }
      }
    } catch (error) {
      console.error(`❌ Error processing article "${item.title || 'Unknown'}":`, error.message);
      failedArticles++;
    }
  }
  
  return { newArticles, skippedArticles, failedArticles };
} 