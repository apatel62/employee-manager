import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

//created a class of SQL queries
class db_connection {
    //constructor function of SQL credentials
    constructor() {
        this.client = new Client({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_CONNECTION,
            port: 5432,
        });
    }

    //connect method will connect to SQL db
    async connect() {
        await this.client.connect();
    }

    //close method will end the SQL db session
    async close() {
        await this.client.end();
    }

    //executeSqlFile method will execute the schema and seeds sql files
    async executeSqlFile(filePath) {
        const sql = fs.readFileSync(filePath, 'utf8'); //reads the SQL file
        const cleanedSQL = sql.replace(/\r/g, '');    //cleans up the file content 
        const queries = cleanedSQL.split(';').filter(query => query.trim() !== '');  //splits each query and stores into an array
        for (const query of queries) {
            try {
                await this.client.query(query); //executes each query in order
            } catch (err) {
                console.error('Error executing query:', query, err);
            }
        }
    }
}

export default new db_connection();  //exports a new db_quries class