// MongoDB initialization script
// Data is now loaded from DummyJSON API using data-loader.js
// Run: npm run load-data

db = db.getSiblingDB('elara_db');
print('Database initialized. Run "npm run load-data" to populate with DummyJSON data.');