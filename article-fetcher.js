import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

// Function to fetch full article HTML
export async function fetchArticleHTML(url) {
  try {
    console.log(`📄 Fetching article HTML from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`✅ Article HTML fetched successfully (${html.length} characters)`);
    return html;
  } catch (error) {
    console.error(`❌ Error fetching article HTML from ${url}:`, error.message);
    throw error;
  }
}

// Function to extract clean article content using readability
export function extractArticleContent(html, url) {
  try {
    console.log('🔍 Parsing article content with readability...');
    
    // Create a DOM object from the HTML
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;
    
    // Use Mozilla's readability to extract clean content
    const reader = new Readability(document);
    const article = reader.parse();
    
    if (!article) {
      throw new Error('Readability failed to parse article content');
    }
    
    // Extract images from the original document
    const images = [];
    const imgElements = document.querySelectorAll('img');
    
    console.log(`🔍 Found ${imgElements.length} img elements in the document`);
    
    for (const img of imgElements) {
      const src = img.src;
      if (src && src.trim()) {
        // Convert relative URLs to absolute URLs
        const absoluteUrl = new URL(src, url).href;
        images.push(absoluteUrl);
        console.log(`📷 Extracted image: ${absoluteUrl}`);
      }
    }
    
    // Remove duplicates
    const uniqueImages = [...new Set(images)];
    console.log(`🔄 Removed duplicates: ${images.length} -> ${uniqueImages.length} unique images`);
    
    // Return both text and HTML content
    const result = {
      text: article.textContent || article.text || '',
      html: article.content || '',
      title: article.title || '',
      excerpt: article.excerpt || '',
      length: article.length || 0,
      images: uniqueImages
    };
    
    console.log(`✅ Article content extracted successfully (${result.text.length} characters, ${uniqueImages.length} images)`);
    return result;
  } catch (error) {
    console.error('❌ Error extracting article content:', error.message);
    throw error;
  }
}

// Function to fetch and extract full article content
export async function getFullArticleContent(url) {
  try {
    // Fetch the article HTML
    const html = await fetchArticleHTML(url);
    
    // Extract clean content using readability
    const content = extractArticleContent(html, url);
    
    return content;
  } catch (error) {
    console.error(`❌ Failed to get full article content for ${url}:`, error.message);
    throw error;
  }
} 