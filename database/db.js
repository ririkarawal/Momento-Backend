const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('momento_db', 'postgres', 'admin123', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: true, // Change to true to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB connection successful............................');
        
        // Test the User and Upload models association
        await sequelize.sync({ alter: false }); // Don't alter tables, just check them
        console.log('✅ Models synchronized successfully');
        
        // Log database status
        const [results] = await sequelize.query('SELECT current_database(), current_user');
        console.log('📊 Database Info:', results[0]);
        
    } catch (error) {
        console.error('❌ Database Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
    }
}

testConnection();

module.exports = sequelize;