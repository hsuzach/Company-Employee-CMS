// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const { quiet } = require('nodemon/lib/utils');

const PORT = process.env.PORT || 3000;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'hsuza123!',
    database: 'company_db'
  },
  console.log(`Connected to the company database.`)
);

// The command-line application should allow users to:
  // Add departments, roles, employees

  // View departments, roles, employees

  // Update employee roles

// The command-line application should allow users to:

  // Update employee managers

  // View employees by manager

  // Delete departments, roles, and employees

  //View the total utilized budget of a department -- ie the combined salaries of all employees in that department

function start(){
  inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'What action would you like to do?',
      choices: [
        {
          name: "View All Employee Data",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]).then(answer => {
    let action = answer.action;

    switch (action) {
      case "VIEW_EMPLOYEES":
        viewEmployees();
        break;
      default:
        quit();
    }
  })
}
start();

function viewEmployees(){
  console.log('Viewing All Employees')

  const sql = "SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employees manager on manager.id = employees.manager_id;"

  db.query(sql, (err, rows) => {
    if (err) { console.log(err) }

    console.table(rows)
    start();
  })
}

function quit(){
  console.log('Finished')
  process.exit();
}

app.listen(PORT , () => {
  console.log(`Server running on port ${PORT}`);
});