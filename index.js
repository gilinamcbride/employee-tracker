const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addEmployee,
  addRole,
  addDepartment,
} = require("./helper.js");

const startInquirer = () => {
  return inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "firstQuestion",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Update Employee Role",
        "Add Role",
        "Add Department",
        "Quit",
      ],
    })
    .then((answers) => {
      switch (answers.firstQuestion) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          break;
        default:
          console.log("Please choose an option.");
      }
    })
    .catch((err) => console.log("Please choose an option."));
};

startInquirer();

// database error connect
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
});
