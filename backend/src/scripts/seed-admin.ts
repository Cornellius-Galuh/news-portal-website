import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectDB from '../config/database';
import User from '../models/user.model';
import { UserRole } from '../types/enums';

async function seedAdmin() {
  try {
    await connectDB();

    const adminEmail = 'admin@example.com';
    const adminUsername = 'admin';
    const adminPassword = 'AdminPassword123!';

    let adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      if (adminUser.role !== UserRole.ADMIN) {
        adminUser.role = UserRole.ADMIN;
        await adminUser.save();
        console.log(`Updated existing user (${adminEmail}) role to ADMIN.`);
      } else {
        console.log(`Admin account already exists: ${adminEmail}`);
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      adminUser = await User.create({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      console.log('✅ Admin user created successfully!');
    }

    console.log('\n--- Admin Login Credentials ---');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     ADMIN`);
    console.log('-------------------------------\n');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
