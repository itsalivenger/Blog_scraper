# RSS Feed Scraper

A Node.js script that fetches RSS feeds from fraudoftheday.com and stores articles in MongoDB.

## Features

- ✅ Fetches RSS feed from https://fraudoftheday.com/feed/
- ✅ Parses XML using xml2js
- ✅ Connects to MongoDB using native MongoDB driver
- ✅ Checks for duplicate articles (idempotent)
- ✅ Extracts title, link, pubDate, and content
- ✅ Stores articles with proper metadata
- ✅ Comprehensive error handling and logging

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env file and add your MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/your_database_name
   ```

3. **MongoDB Connection Options:**

## Usage

### Run the script:
```bash
npm start
```

### Development mode (with auto-restart):
```bash
npm run dev
```

## Database Structure

The script creates a `blogs` collection with the following document structure:

```javascript
{
  title: String,           // Article title
  url: String,            // Article URL (unique)
  content: String,        // Article content/description
  published_at: Date,     // Publication date
  source: String,         // Source website (default: 'fraudoftheday.com')
  created_at: Date        // When the record was created
}
```

## Features

- **Idempotent:** Safe to run multiple times without creating duplicates
- **Error Handling:** Comprehensive error handling with detailed logging
- **Progress Tracking:** Shows progress and summary of processed articles
- **Duplicate Prevention:** Checks existing articles by URL before inserting
- **Flexible Content Extraction:** Handles different RSS content formats

## Output Example

```
🚀 Starting RSS feed scraper...
✅ Connected to MongoDB successfully
📡 Fetching RSS feed from: https://fraudoftheday.com/feed/
✅ RSS feed fetched successfully
🔍 Parsing RSS feed...
✅ Parsed 10 articles from RSS feed
🔄 Processing articles...
✅ Saved new article: "New Fraud Alert: Phishing Scam Targets Bank Customers"
⏭️ Skipping existing article: "Previous Article Title"
✅ Saved new article: "Another Fraud Alert"

📊 Summary:
✅ New articles saved: 2
⏭️ Articles skipped (already exist): 8
📝 Total articles processed: 10

🎉 RSS feed processing completed successfully!
🔌 MongoDB connection closed
```

## Troubleshooting

1. **MongoDB Connection Error:**
   - Check your `MONGODB_URI` in the `.env` file
   - Ensure MongoDB is running
   - Verify network connectivity

2. **RSS Feed Fetch Error:**
   - Check internet connectivity
   - Verify the RSS feed URL is accessible
   - Some feeds may require authentication

3. **XML Parsing Error:**
   - The script handles malformed XML gracefully
   - Check if the RSS feed structure has changed

## Dependencies

- `mongodb`: Native MongoDB driver
- `node-fetch`: HTTP client for fetching RSS feeds
- `xml2js`: XML to JavaScript object parser
- `dotenv`: Environment variable management 