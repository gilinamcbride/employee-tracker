// const inquirer = require("inquirer");
// const db = require("./db/connection");
// const {
//   viewAllDepartments,
//   viewAllRoles,
//   viewAllEmployees,
//   addEmployee,
//   addRole,
//   addDepartment,
//   updateEmployee,
//   selectByManager,
//   deleteEmployee,
//   deleteRole,
//   deleteDepartment,
//   selectByDepartment,
//   departmentSalaries,
// } = require("./index.js");

// const startInquirer = () => {
//   return inquirer
//     .prompt({
//       type: "list",
//       message: "What would you like to do?",
//       name: "firstQuestion",
//       choices: [
//         "View All Employees",
//         "View All Roles",
//         "View All Departments",
//         "Add Employee",
//         "Update Employee Role",
//         "Add Role",
//         "Add Department",
//         "View Employees By Manager",
//         "View Employees By Department",
//         "View Total Budget By Department",
//         "Delete Employee",
//         "Delete Role",
//         "Delete Department",
//         "Quit",
//       ],
//     })
//     .then((answers) => {
//       switch (answers.firstQuestion) {
//         case "View All Employees":
//           viewAllEmployees(startInquirer());
//           break;
//         case "View All Roles":
//           viewAllRoles();
//           break;
//         case "View All Departments":
//           viewAllDepartments();
//           break;
//         case "Add Employee":
//           addEmployee();
//           break;
//         case "Update Employee Role":
//           updateEmployee();
//           break;
//         case "Add Role":
//           addRole();
//           break;
//         case "Add Department":
//           addDepartment();
//           break;
//         case "View Employees By Manager":
//           selectByManager();
//           break;
//         case "View Employees By Department":
//           selectByDepartment();
//           break;
//         case "View Total Budget By Department":
//           departmentSalaries();
//           break;
//         case "Delete Employee":
//           deleteEmployee();
//           break;
//         case "Delete Role":
//           deleteRole();
//           break;
//         case "Delete Department":
//           deleteDepartment();
//           break;
//         case "Quit":
//           process.exit();
//         default:
//           console.log("Please choose an option.");
//       }
//     })
//     .catch((err) => console.log("Please choose an option."));
// };

// // database error connect
// db.connect((err) => {
//   if (err) throw err;
// });

// startInquirer();

// module.exports = {
//   viewAllDepartments,
//   viewAllEmployees,
//   viewAllRoles,
//   addEmployee,
//   addRole,
//   addDepartment,
//   updateEmployee,
//   selectByManager,
//   deleteEmployee,
//   deleteRole,
//   deleteDepartment,
//   selectByDepartment,
//   departmentSalaries,
// };
