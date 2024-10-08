import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

//created a class of SQL queries
class db_queries {
    //constructor function of SQL credentials
    constructor() {
        this.client = new Client({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_RUN,
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
        const cleanedSQL = sql.replace(/\r/g, '');  //cleans up the file content 
        const queries = cleanedSQL.split(';').filter(query => query.trim() !== '');   //splits each query and stores into an array
        for (const query of queries) {
            try {
                await this.client.query(query); //executes each query in order
            } catch (err) {
                console.error('Error executing query:', query, err);
            }
        }
    }

    //getAllDepartments method will return the department names and department ids
    async getAllDepartments() {
        const query = 'SELECT * FROM department;';
        const res = await this.client.query(query);
        return res.rows;
    }

    //getAllRoles method will return the job title, role id, the department that role belongs to, and the salary for that role
    async getAllRoles() {
        const query = 'SELECT * FROM role;';
        const res = await this.client.query(query);
        return res.rows;
    }

    //getAllEmployees method will return the employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    async getAllEmployees() {
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`;
        const res = await this.client.query(query);
        return res.rows;
    }

    //addDepartment method adds a department into the department table
    async addDepartment(name) {
        const query = `INSERT INTO department (name) VALUES ($1);`; 
        await this.client.query(query, [name]);
    }

    //addRole method adds a role into the role table
    async addRole(title, salary, department_id) {
        const query = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);`; 
        await this.client.query(query, [title, salary, department_id]);
    }

    //addEmployee method adds a employee into the employee table
    async addEmployee(first_name, last_name, role_id, manager_id) {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`; 
        await this.client.query(query, [first_name, last_name, role_id, manager_id]);
    }

    //updateEmployeeRole method updates the role of the employee
    async updateEmployeeRole(employee_id, role_id) {
        const query = `UPDATE employee SET role_id = $1 where id = $2;`
        await this.client.query(query, [role_id, employee_id]);
    }

}

export default new db_queries();  //exports a new db_quries class