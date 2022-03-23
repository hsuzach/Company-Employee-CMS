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
      choices: ['View All Employees', 'View All Employees By Department', 'View All Departments', 'Add A Department','View All Roles', new inquirer.Separator(), 'Quit'
        
      ]
    }
  ]).then(answer => {
    let action = answer.action;

    switch (action) {
      case "View All Employees":
        viewEmployees();
        break;
      case "View All Employees By Department":
        chooseDepartment()
        break;
      case "Add An Employee":
        addEmployee()
        break;
      case "View All Departments":
        viewDepartments()
        break;
      case "Add A Department":
        addDepartment()
        break;
      case "View All Roles":
        viewRoles()
        break;
      default:
        quit();
    }
  })
}
start();

function viewEmployees(){

  const sql = "SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employees manager on manager.id = employees.manager_id;"

  db.query(sql, (err, rows) => {
    if (err) { console.log(err) }

    console.table(rows)
    return start();
  })
}

function viewDepartments(){
  const sql = "SELECT * FROM department"

  db.query(sql, (err, rows) => {
    if (err) { console.log(err) }

    console.table(rows)
    return start();
  })
}

function viewRoles(){
  const sql = "SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles JOIN department on roles.department_id = department.id;"
  // "SELECT roles.id, roles.title, roles.salary FROM roles JOIN department ON roles.department_id = department.name"

  db.query(sql, (err, rows) => {
    if (err) { console.log(err) }

    console.table(rows)
    return start();
  })
}

function chooseDepartment(){
  const sql = "SELECT department.id, department.name FROM department;"

  db.query(sql, (err, rows) => {
    if (err) { console.log(err) }

    const departmentOptions = rows.map(({ id, name }) => ({
      name: name,
      value: id
    }))

    inquirer.prompt([{
      name: 'departmentID',
      type: 'list',
      message: "Which department's employees would you like to view",
      choices: departmentOptions
    }])
    .then(departmentID => viewEmployeesByDepartment(departmentID))
    
  })
}

function viewEmployeesByDepartment (x) {
  const sql = "SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees JOIN roles on employees.role_id = roles.id JOIN department on roles.department_id = department.id WHERE department.id = ?;"
  
  const departmentID = x.departmentID;
  
  db.query(sql, departmentID, (err, rows) => {
    if (err) { console.log(err) }

    console.table(rows)
    return start();
  })
  
}

function addEmployee(){

}

function addDepartment(){
  inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'What is the name of the department you would like to add?',
    }

  ]).then(name => {
    const sql = "INSERT INTO department SET ?"

    db.query(sql, name, (err, res) =>{
      if (err) { console.log(err) }
      console.log('New Department Added')
      return start();
    })

  })
}


function quit(){
  console.log('Finished')
  process.exit();
}

app.listen(PORT);