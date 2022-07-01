const inquirer = require("inquirer");
const db = require("./db/connection");
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addEmployee,
  addRole,
  addDepartment,
  updateEmployeeRole,
  selectByManager,
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
        "Select Employees By Manager",
        "Quit",
      ],
    })
    .then(async (answers) => {
      switch (answers.firstQuestion) {
        case "View All Employees":
          viewAllEmployees();
          await startInquirer();
          break;
        case "View All Roles":
          viewAllRoles();
          await startInquirer();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Select Employees By Manager":
          selectByManager();
          break;
        case "Quit":
          process.exit();
        default:
          console.log("Please choose an option.");
      }
    });
  // .catch((err) => console.log("Please choose an option."));
};

// database error connect
db.connect((err) => {
  if (err) throw err;
});

startInquirer();
