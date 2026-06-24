/**
 * seed.js — Database Seeder
 * Run this file once to populate the database with sample posts.
 * Usage: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Post = require('./models/Post');

// Sample posts content
const samplePosts = [
  "Just joined Connectify! Really loving the clean UI 🚀",
  "What a great day to learn Node.js and Express! Building projects from scratch is so satisfying 💻",
  "Fun fact: bcrypt's salt rounds control how slow the hash function is. Slower = more secure against brute-force attacks 🔐",
  "MongoDB is schemaless by nature, but Mongoose adds structure and validation on top. Best of both worlds! 🗄️",
  "Express sessions are server-side — the client only holds a cookie ID, the real data stays safely on the server 🍪",
  "Remember: always hash passwords before saving to the database. Never store plain text credentials! 🛡️",
  "The MVC pattern (Model-View-Controller) keeps code organized and makes it super easy to explain in interviews ✅",
];

const seedDB = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if demo user already exists
    let demoUser = await User.findOne({ username: 'demo_user' });

    if (!demoUser) {
      // Hash password and create demo user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('demo1234', salt);

      demoUser = await User.create({
        username: 'demo_user',
        email: 'demo@connectify.com',
        password: hashedPassword,
      });
      console.log('✅ Demo user created: demo_user / demo1234');
    } else {
      console.log('ℹ️  Demo user already exists, skipping user creation.');
    }

    // Check if posts already exist for this user
    const existingPostCount = await Post.countDocuments({ author: demoUser._id });

    if (existingPostCount === 0) {
      // Create all sample posts
      const postDocs = samplePosts.map((content, i) => ({
        content,
        author: demoUser._id,
        // Spread posts across different times so they sort nicely
        createdAt: new Date(Date.now() - (samplePosts.length - i) * 60 * 60 * 1000),
      }));

      await Post.insertMany(postDocs);
      console.log(`✅ Created ${samplePosts.length} sample posts in the feed`);
    } else {
      console.log(`ℹ️  Posts already exist (${existingPostCount} found), skipping post creation.`);
    }

    console.log('\n🎉 Seeding complete! Open http://localhost:3000 to see the feed.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
