const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_password>')) {
    console.error('❌ MONGODB_URI is missing or still contains <db_password>. Please update .env with your actual password.');
    process.exit(1);
  }

  console.log('🍃 Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✓ Connected successfully to MongoDB Atlas!');

    const db = client.db('vkstudio');

    // 1. Users
    const usersCol = db.collection('users');
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const customerPasswordHash = await bcrypt.hash('customer123', 10);

    await usersCol.deleteMany({});
    await usersCol.insertMany([
      {
        name: 'Vamsi Krishna (VK Studio Director)',
        email: 'vamsireddy.kata@gmail.com',
        password: adminPasswordHash,
        role: 'ADMIN',
        phone: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+91 91004 84870',
        createdAt: new Date(),
      },
      {
        name: 'Aarav Sharma',
        email: 'customer@vkstudio.com',
        password: customerPasswordHash,
        role: 'CUSTOMER',
        phone: '+91 98112 34567',
        address: 'Indiranagar, Bengaluru, Karnataka',
        createdAt: new Date(),
      },
    ]);
    console.log('✓ Seeded Users (Admin & Customer)');

    // 2. Settings
    const settingsCol = db.collection('settings');
    await settingsCol.deleteMany({});
    await settingsCol.insertOne({
      key: 'general_settings',
      brandName: 'VK STUDIO',
      tagline: 'Premium 3D Printing & Bespoke Customization Studio by Vamsi Krishna',
      heroHeadline: 'Your Imagination. Our Creation.',
      heroSubheadline: 'Discover thoughtfully engineered 3D-printed masterpieces or bring your bespoke ideas to life with state-of-the-art precision customization from VK STUDIO by Vamsi Krishna.',
      heroBadge: 'Precision FDM & SLA Resin Fabrication',
      whatsappNumber: process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '+91 98765 43210',
      instagramUrl: 'https://instagram.com/vk_studi_o',
      instagramHandle: 'vk_studi_o',
      contactEmail: 'contact@vkstudio.design',
      studioAddress: 'VK Studio, Bengaluru, Karnataka, India',
      workingHours: 'Monday – Saturday: 10:00 AM – 8:00 PM IST',
      announcementText: '✨ Accepting Custom Commissions & Bulk Orders — Follow @vk_studi_o on Instagram!',
      showAnnouncement: true,
      updatedAt: new Date(),
    });
    console.log('✓ Seeded Studio Settings with @vk_studi_o');

    console.log('🎉 MongoDB Atlas initialized and seeded successfully for VK STUDIO!');
  } catch (err) {
    console.error('MongoDB Error:', err);
  } finally {
    await client.close();
  }
}

seedMongo();
