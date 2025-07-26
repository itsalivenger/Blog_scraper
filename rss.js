import fetch from 'node-fetch';
import { parseString } from 'xml2js';
import { promisify } from 'util';

// Promisify xml2js parseString
const parseStringAsync = promisify(parseString);

// Function to fetch RSS feed
export async function fetchRSSFeed(url) {
  try {
    console.log(`📡 Fetching RSS feed from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlData = await response.text();
    console.log('✅ RSS feed fetched successfully');
    return xmlData;
  } catch (error) {
    console.error('❌ Error fetching RSS feed:', error.message);
    throw error;
  }
}

// Function to parse RSS XML
export async function parseRSSFeed(xmlData) {
  try {
    console.log(xmlData);
    console.log('🔍 Parsing RSS feed...');
    const result = await parseStringAsync(xmlData, { explicitArray: false });
    // Extract items from RSS feed
    const items = result.rss?.channel?.item || [];
    
    if (!Array.isArray(items)) {
      // If there's only one item, convert to array
      return [items];
    }
    
    console.log(`✅ Parsed ${items.length} articles from RSS feed`);
    return items;
  } catch (error) {
    console.error('❌ Error parsing RSS feed:', error.message);
    throw error;
  }
}

// Function to extract article data from RSS item
export function extractArticleData(item) {
  const title = item.title || 'No Title';
  const url = item.link || item.guid || '';
  const pubDate = item.pubDate || new Date().toISOString();
  const content = item.content || item.description || item['content:encoded'] || 'No content available';
  
  return {
    title,
    url,
    pubDate,
    content
  };
} 