const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");

const viewAllEmployees = () => {
  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, rows) => {
    if (err) {
      return;
    }
    console.table(rows);
  });
};
const viewAllRoles = () => {
  const sql = `SELECT * FROM roles`;
  db.query(sql, (err, rows) => {
    if (err) {
      return;
    }
    console.table(rows);
  });
};

const viewAllDepartments = () => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) {
      return;
    }
    console.table(rows);
  });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      //   {
      //     type: "list",
      //     name: "role",
      //     message: "What is the employee's role?",
      //     choices: [],
      //   },
      //   {
      //     type: "list",
      //     name: "manager",
      //     message: "Who is the employee's manager?",
      //     choices: [],
      //   },
    ])
    .then(({ firstName, lastName }) => {
      const sql = `INSERT INTO employees (first_name, last_name)
      VALUES (?,?)`;
      const params = [firstName, lastName];
      db.query(sql, params, (err, rows) => {
        if (err) {
          return;
        }
        console.log(`Added ${firstName} ${lastName} to the database.`);
      });
    });
};

const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        choices: ["list of employees"],
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to assign the selected employee?",
        choices: ["list of roles"],
      },
    ])
    .then(({ employeeId, roleId }) => {
      const sql = `UPDATE employees SET role_id = ?
                    WHERE id = ?`;
      const params = [];
      db.query(sql, params, (err, result) => {
        if (err) {
          return;
        } else {
          console.log("Updated employee's role");
        }
      });
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
      },
      //   {
      //     type: "list",
      //     name: "department",
      //     message: "Which department does the role belong to?",
      //     choices: [],
      //   },
    ])
    .then(({ title, salary }) => {
      const sql = `INSERT INTO roles (title, salary)
      VALUES (?,?)`;
      const params = [title, salary];
      db.query(sql, params, (err, rows) => {
        if (err) {
          return;
        }
        console.log(`Added ${title} to the database.`);
      });
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?",
      },
    ])
    .then(({ name }) => {
      const sql = `INSERT INTO departments (name)
      VALUES (?)`;
      db.query(sql, name, (err, rows) => {
        if (err) {
          return;
        }
        console.log(`Added ${name} to the database.`);
      });
    });
};

module.exports = {
  viewAllDepartments,
  viewAllEmployees,
  viewAllRoles,
  addEmployee,
  addRole,
  addDepartment,
};
