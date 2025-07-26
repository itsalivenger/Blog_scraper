import { connectToMongoDB } from './db.js';
import { fetchRSSFeed, parseRSSFeed } from './rss.js';
import { processRSSItems } from './processor.js';
import { rssUrls } from './variables.js';

// Main function
async function main() {
  let client;

  try {
    console.log('🚀 Starting enhanced RSS feed scraper with full content extraction...');

    // Connect to MongoDB
    client = await connectToMongoDB();
    const db = client.db();

    // RSS feed URL

    for (const rssUrl of rssUrls) {
      console.log(`\n🔗 Fetching RSS feed from: ${rssUrl}`);

      // Fetch RSS feed
      const xmlData = await fetchRSSFeed(rssUrl);

      // Parse RSS feed
      const items = await parseRSSFeed(xmlData);

      // Process RSS items with full content extraction
      const { newArticles, skippedArticles, failedArticles } = await processRSSItems(items, db);

      // Summary
      console.log('\n📊 Summary:');
      console.log(`✅ New articles saved: ${newArticles}`);
      console.log(`⏭️ Articles skipped (already exist): ${skippedArticles}`);
      console.log(`❌ Articles failed to process: ${failedArticles}`);
      console.log(`📝 Total articles processed: ${newArticles + skippedArticles + failedArticles}`);

      if (newArticles > 0) {
        console.log('\n🎉 Enhanced scraper completed successfully!');
        console.log('📖 Articles now contain full content extracted with Mozilla Readability');
      } else {
        console.log('\nℹ️ No new articles found - all articles already exist in database');
      }
    }

  } catch (error) {
    console.error('❌ Error in main process:', error.message);
  } finally {
    // Close MongoDB connection
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
    process.exit(0);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the script
main();