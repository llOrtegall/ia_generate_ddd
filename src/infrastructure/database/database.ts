import { Sequelize } from 'sequelize';
import { initUserModel } from './models/user-model';

export class Database {
    private static instance: Database;
    public sequelize: Sequelize;
    public User: any;

    private constructor() {
        this.sequelize = new Sequelize({
            dialect: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '9010'),
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || 'rootpassword',
            database: process.env.DB_NAME || 'data_test',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
        });

        this.User = initUserModel(this.sequelize);
    }

    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    async connect(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            console.log('✅ Database connection established successfully.');

            // Sync tables based on environment and configuration
            await this.syncTables();

            console.log('🚀 Database connected and ready!');
        } catch (error) {
            console.error('❌ Unable to connect to database:', error);
            throw error;
        }
    }

    private async syncTables(): Promise<void> {
        const syncMode = process.env.DB_SYNC_MODE || 'safe';
        
        try {
            switch (syncMode) {
                case 'force':
                    // ⚠️  WARNING: This will DROP and RECREATE all tables!
                    console.log('⚠️  WARNING: Force syncing - this will drop existing tables!');
                    await this.sequelize.sync({ force: true });
                    console.log('🔄 Tables recreated with force sync');
                    break;
                    
                case 'alter':
                    // Modify existing tables to match models
                    console.log('🔧 Altering existing tables to match models...');
                    await this.sequelize.sync({ alter: true });
                    console.log('✅ Tables altered successfully');
                    break;
                    
                case 'safe':
                default:
                    // Only create tables if they don't exist (SAFE)
                    console.log('🛡️  Safe sync - creating tables only if they don\'t exist...');
                    await this.sequelize.sync();
                    console.log('✅ Tables synchronized safely');
                    break;
                    
                case 'none':
                    console.log('⏭️  Skipping table synchronization');
                    break;
            }
        } catch (error) {
            console.error('❌ Error during table synchronization:', error);
            throw error;
        }
    }

    // Method to manually sync specific models
    async syncModel(modelName: string, options: { force?: boolean; alter?: boolean } = {}): Promise<void> {
        try {
            const model = this.sequelize.models[modelName];
            if (!model) {
                throw new Error(`Model ${modelName} not found`);
            }
            
            await model.sync(options);
            console.log(`✅ Model ${modelName} synchronized`);
        } catch (error) {
            console.error(`❌ Error syncing model ${modelName}:`, error);
            throw error;
        }
    }

    // Method to check if tables exist
    async checkTablesExist(): Promise<boolean> {
        try {
            const [results] = await this.sequelize.query(
                "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE()"
            );
            const count = (results as any)[0].count;
            return count > 0;
        } catch (error) {
            console.error('Error checking tables:', error);
            return false;
        }
    }

    async disconnect(): Promise<void> {
        await this.sequelize.close();
    }
}
