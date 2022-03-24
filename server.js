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

function start(){
  inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'What action would you like to do?',
      choices: ['View All Employees', 'View All Employees By Department', 'View All Departments', 'View All Roles', 'Add A Department', 'Add A Role', 'Add An Employee', new inquirer.Separator(), 'Quit'
        
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
      case "View All Departments":
        viewDepartments()
        break;
      case "View All Roles":
        viewRoles()
        break;
      case "Add A Department":
        addDepartment()
        break;
      case "Add A Role":
        addRole()
        break;
      case "Add An Employee":
        addEmployee()
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

function addRole(){
  const sql = "SELECT department.id, department.name FROM department;"

  db.query(sql, (err, rows) => {
    if (err) { console.log(err) }

    const departmentOptions = rows.map(({ id, name }) => ({
      name: name,
      value: id
    }))

    inquirer.prompt([
      {
      name: 'title',
      type: 'input',
      message: 'What is the name of the role you would like to add?'
      },
      {
      name: 'salary',
      type: 'input',
      message: 'What is the designated salary of this role?'
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Which department is this role assigned to?',
        choices: departmentOptions
      }
    ])
    .then(newRole => {
      const sql2 = "INSERT INTO roles SET ?"

      db.query(sql2, newRole, (err, res) =>{
        if (err) { console.log(err) }
        console.log('New Role Added')
        return start();
      })
    })

  })
  
}

function addEmployee(){
  const sql = "SELECT roles.id, roles.title, roles.salary, department.name FROM roles LEFT JOIN department ON department.id= roles.department_id;"

  db.query(sql, (err, rows) => {
    if (err) { console.log(err) }

    const rolesOptions = rows.map(({ title, id }) => ({
      value: id, 
      name: title
    }))
    
    inquirer.prompt([
      {
      name: 'first_name',
      type: 'input',
      message: 'What is the first name of this employee?'
      },
      {
      name: 'last_name',
      type: 'input',
      message: 'What is the last name of this employee?'
      },
      {
        name: 'role_id',
        type: 'list',
        message: 'Which role is this employee assigned?',
        choices: rolesOptions
      }
    ])
    .then(res => {
      let firstName = res.first_name;
      let lastName = res.last_name;
      let roleID = res.role_id;

      const sql2 = "SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS manager FROM employees"

      db.query(sql2, (err, rows) => {
        if (err) { console.log(err) }

        const managerOptions = rows.map(({ manager, id }) => ({
          value: id, 
          name: manager
        }));

        managerOptions.unshift({ name: "None", value: null });

        inquirer.prompt([
          {
            name: 'manager_id',
            type: 'list',
            message: 'Which manager is this employee assigned to',
            choices: managerOptions
          }
        ]).then( res => {
          
          const newEmployee = { 
            first_name: firstName,
            last_name: lastName,
            role_id: roleID,
            manager_id: res.manager_id
          }

          const sql3 = 'INSERT INTO employees SET ?'

          db.query(sql3, newEmployee, (err, res) => {
            if (err) { console.log(err) }
            console.log(`${firstName} ${lastName} added to the company database`)
            return start();

          })
        })
      })
    })
  })
}

// function assignManager() {
//   const sql = 'SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS manager FROM employees'

//   db.query(sql, (err, rows) => {
//     if (err) { console.log(err) }
//     console.table(rows)
//   })

// }

function quit(){
  console.log('Finished')
  process.exit();
}

app.listen(PORT);