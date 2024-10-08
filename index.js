//imports inquirer and db_queries from db.js file
import inquirer from 'inquirer';
import db from './db.js'; 
import db_connection from './connection.js';

//init function is performed when running node index.js
async function init() {

    //Connects to the database using the credentials in connection.js 
    await db_connection.connect();

    //Executes the connection.sql which creates the employee_db
    await db_connection.executeSqlFile('sql/connection.sql');

    //Closes the connection to db_connection 
    await db_connection.close();
    
    //Connects to the database using the credentials in db.js 
    await db.connect();

    //Executes the schema.sql which creates the tables
    await db.executeSqlFile('sql/schema.sql');

    //Executes the seeds.sql which inserts the values into the corresponding tables
    await db.executeSqlFile('sql/seeds.sql');

    //list of actions the user can select from initially when running the code
    const actions = [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
    ];

    //while true loop so inquirer prompt code is running unless the user selects Exit or stops the program by pressing Ctrl+C
    while (true) {
        //prompts the user to select an action from the actions list
        const {action} = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do',
                choices: actions,
            }
        ]);

        //Performs the corresponding SQL query depending on which action the user selected
        //if the user selected View all departments then the department table will get console logged via SQL query
        if (action === 'View all departments') {
            const departments = await db.getAllDepartments();
            //console.table(departments);
            //Formats the table
            const header = ' id |    name       ';
            const separator = '----|-------------';

            //Prepares the rows
            const rows = departments.map(department => {
                return ` ${department.id}    ${department.name}`; 
            });

            //Combines everything for tabular display
            console.log(header);
            console.log(separator);
            rows.forEach(row => console.log(row));
        } else if (action === 'View all roles') {            //if the user selected View all roles then the role table will get console logged via SQL query
            const roles = await db.getAllRoles();
            //Formats the table
            const header = ' id |        title       |  salary  | department_id ';
            const separator = '----|--------------------|----------|---------------';

            //Prepares the rows
            const rows = roles.map(role => {
                return ` ${role.id}    ${role.title.padEnd(18)}    ${role.salary.padEnd(8)}      ${role.department_id}`; //Adjusted padding for alignment
            });

            //Combines everything for tabular display
            console.log(header);
            console.log(separator);
            rows.forEach(row => console.log(row));
        } else if (action === 'View all employees') {        //if the user selected View all employees then the employee table will get console logged via SQL query
            const employees = await db.getAllEmployees();
            //Formats the table
            const header = ' id |      first_name       |  last_name  |     title        |    department    |   salary    |      manager';
            const separator = '----|-----------------------|-------------|------------------|------------------|-------------|--------------------';

            //Prepares the rows
            const rows = employees.map(employee => {
                let managerName = "";
                if(employee.manager === ' '){
                    managerName = 'None';
                } else {
                    managerName = employee.manager;
                }
                return ` ${employee.id}    ${employee.first_name.padEnd(20)}    ${employee.last_name.padEnd(11)}    ${employee.title.padEnd(16)}    ${employee.department.padStart(12)}   ${employee.salary.padStart(10)}   ${managerName.padStart(20)}`; //Adjusted padding for alignment
            });

            //Combines everything for tabular display
            console.log(header);
            console.log(separator);
            rows.forEach(row => console.log(row));
        } else if (action === 'Add a department') {         //if the user selected Add a department action
            //another inquirer prompt to ask the user to input the name of the department
            const {name} = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the department?',
                }
            ]);
            //Performs the addDepartment method from db.js with the user inputted name as the parameter
            await db.addDepartment(name);
            //Console logs that added the new department to the database
            console.log(`Added ${name} to the database`);
        } else if (action === 'Add a role') {               //if the user selects Add a role action
            //Retrieves the department table via SQL query
            const dpNames = await db.getAllDepartments();
            //Maps the SQL query department table to an array with name of the department name and its value be the id
            const dpChoices = dpNames.map(dp => ({
                name: dp.name,
                value: dp.id
            }));

            //Another inquirer prompt to ask the user to input the name of the role and its salary
            const {title, salary, department_id} = await inquirer.prompt([
                {type: 'input', name: 'title', message: 'What is the name of the role?'},
                {type: 'input', name: 'salary', message: 'What is the salary of the role?'},
                {type: 'list', name: 'department_id', message: 'Which department does the role belong to', choices: dpChoices},  //finally prompts the user to select which department the role belongs to where the user has to select one of the existing departments
            ]);
            //Performs the addRole method from db.js with the user inputted title, salary, and the selected department_id as parameters
            await db.addRole(title, salary, department_id);
            //Console logs that the role has been added to the database
            console.log(`Added ${title} to the database`);
        } else if (action === 'Add an employee') {          //if the user selects the Add an employee to the database
            //Retrieves the role table via SQL query
            const allRoles =await db.getAllRoles();
            //Maps the table to an array with name of the role and the value of the role_id
            const rolesList = allRoles.map(role => ({
                name: role.title,
                value: role.id
            }));
            //Retrieves the employee table via SQL query
            const allEmployees = await db.getAllEmployees();
            //Maps the table to an array with name of the employee's full name and its value of the employee_id
            const employeeList = allEmployees.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }));

            //Adds the "None" option to represent no manager to the beginning of the employeeList array
            employeeList.unshift({
            name: 'None',  
            value: null    
            });

            //Another inquirer prompt to ask for the user to input the new employee's first and last name
            const {fN, lN, role_id, manager_id} = await inquirer.prompt([
                {type: 'input', name: 'fN', message: `What is the employee's first name?`},
                {type: 'input', name: 'lN', message: `What is the employee's last name?`},
                {type: 'list', name: 'role_id', message: `What is the employee's role?`, choices: rolesList},  //Asks the user to select the roles of the company
                {type: 'list', name: 'manager_id', message: `Who is the employee's manager?`, choices: employeeList}, //Asks the user to assign a boss to the new employee
            ]);

            //Performs the addEmployee method from db.js with the user inputted first_name, last_name, selected role, and selected manager as parameters
            await db.addEmployee(fN, lN, role_id, manager_id);
            //Console logs that the new employee has been added
            console.log(`Added ${fN} ${lN} to the database`);
        } else if (action === 'Update an employee role') {     //if the user selects Update an employee role
            //Retrieves the employee table via SQL query
            const allEmployees = await db.getAllEmployees();
            //Maps the table to an array with name of the employee's full name and its value of the employee_id
            const employeeList = allEmployees.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }));
            //Retrieves the role table via SQL query
            const allRoles = await db.getAllRoles();
            //Maps the table to an array with name of the role and the value of the role_id
            const rolesList = allRoles.map(role => ({
                name: role.title,
                value: role.id
            }));

            //Another inquirer prompt that asks the user to select which employee to update and their new role
            const {employee_id, role_id} = await inquirer.prompt([
                {type: 'list', name: 'employee_id', message: `Which employee's role do you want to update?`, choices: employeeList},
                {type: 'list', name: 'role_id', message: `Which role do you want to assign the selected employee?`, choices: rolesList},
            ]);
            
            //Performs the updateEmployeeRole method from db.js with the user selections as parameters
            await db.updateEmployeeRole(employee_id, role_id);
            //Console logs that the selected user's role has been updated
            console.log(`Updated employee's role`);
        } else if (action === 'Exit') {    //if the user selects the Exit action
            //breaks out of while loop
            break;
        }
    }

    //Closes the connection to the database
    await db.close();
}

init().catch(console.error);  //Calls the init function with a catch to console log any errors when running this function