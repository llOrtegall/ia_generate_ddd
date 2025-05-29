import { Database } from '../src/infrastructure/database/database';

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  
  try {
    const db = Database.getInstance();
    
    // Check if tables exist
    console.log('🔍 Checking if database tables exist...');
    const tablesExist = await db.checkTablesExist();
    
    if (tablesExist) {
      console.log('📋 Tables already exist in database');
      console.log('💡 To recreate tables, set DB_SYNC_MODE=force (WARNING: This will delete all data!)');
    } else {
      console.log('📄 No tables found, will create them...');
    }
    
    // Connect and sync
    await db.connect();
    
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('📝 Available sync modes:');
    console.log('  - safe: Create tables only if they don\'t exist');
    console.log('  - alter: Modify existing tables to match models');
    console.log('  - force: Drop and recreate all tables (DATA LOSS!)');
    console.log('  - none: Skip table synchronization');
    console.log('');
    console.log('💡 Set DB_SYNC_MODE in your .env file to control sync behavior');
    
    await db.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.log('');
        console.log('💡 Connection refused. Please check:');
        console.log('  - MySQL server is running');
        console.log('  - Connection details in .env file are correct');
        console.log('  - Database exists and user has permissions');
      } else if (error.message.includes('Access denied')) {
        console.log('');
        console.log('💡 Access denied. Please check:');
        console.log('  - Username and password in .env file');
        console.log('  - User has permissions for the database');
      } else if (error.message.includes('Unknown database')) {
        console.log('');
        console.log('💡 Database not found. Please:');
        console.log('  - Create the database manually');
        console.log('  - Or update DB_NAME in .env file');
      }
    }
    
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--force')) {
  process.env.DB_SYNC_MODE = 'force';
  console.log('⚠️  Force mode enabled - tables will be recreated!');
} else if (args.includes('--alter')) {
  process.env.DB_SYNC_MODE = 'alter';
  console.log('🔧 Alter mode enabled - tables will be modified to match models');
}

setupDatabase();
