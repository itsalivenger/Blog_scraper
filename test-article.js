import { connectToMongoDB } from './db.js';
import { getFullArticleContent } from './article-fetcher.js';
import { fetchRSSFeed, parseRSSFeed } from './rss.js';

// Test function to demonstrate full article content extraction
async function testArticleExtraction() {
  let client;
  
  try {
    console.log('🧪 Testing full article content extraction...');
    
    // Connect to MongoDB
    client = await connectToMongoDB();
    const db = client.db();
    
    // First, get a working URL from the RSS feed
    console.log('📡 Fetching RSS feed to get a working article URL...');
    const rssUrl = 'https://fraudoftheday.com/feed/';
    const xmlData = await fetchRSSFeed(rssUrl);
    const items = await parseRSSFeed(xmlData);
    
    if (items.length === 0) {
      console.log('❌ No articles found in RSS feed');
      return;
    }
    
    // Use the first article URL
    const testUrl = items[0].link || items[0].guid;
    
    if (!testUrl) {
      console.log('❌ No valid URL found in RSS feed');
      return;
    }
    
    console.log(`\n📖 Testing with article: ${testUrl}`);
    console.log(`Title: ${items[0].title || 'Unknown'}`);
    
    // Fetch and extract full article content
    const articleContent = await getFullArticleContent(testUrl);
    
    console.log('\n📊 Extraction Results:');
    console.log(`Title: ${articleContent.title}`);
    console.log(`Text Length: ${articleContent.text.length} characters`);
    console.log(`HTML Length: ${articleContent.html.length} characters`);
    console.log(`Excerpt: ${articleContent.excerpt.substring(0, 100)}...`);
    console.log(`Article Length: ${articleContent.length} words`);
    
    // Show first 200 characters of extracted text
    console.log('\n📝 Sample Content (first 200 chars):');
    console.log(articleContent.text.substring(0, 200) + '...');
    
    console.log('\n✅ Article content extraction test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in test:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
    process.exit(0);
  }
}

// Run the test
testArticleExtraction(); 