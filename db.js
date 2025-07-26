import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in environment variables');
  process.exit(1);
}

// Function to connect to MongoDB
export async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully');
    return client;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

// Function to check if article exists
export async function checkArticleExists(db, url, title) {
  try {
    const existingArticle = await db.collection('blogs').findOne({ $or: [{ url: url }, { title: title }] });
    return existingArticle !== null;
  } catch (error) {
    console.error('❌ Error checking article existence:', error.message);
    return false;
  }
}

// Function to save article to database
export async function saveArticle(db, articleData) {
  try {
    await db.collection('blogs').insertOne(articleData);
    return true;
  } catch (error) {
    console.error('❌ Error saving article:', error.message);
    return false;
  }
} 