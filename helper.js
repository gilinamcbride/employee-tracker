const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");

const viewAllEmployees = () => {
  const sql = `SELECT employees.first_name, employees.last_name,
  roles.title AS role,
  CONCAT(e2.first_name, ' ', e2.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN employees e2 ON employees.manager_id = e2.id;
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      return;
    }
    console.table(rows);
  });
};
const viewAllRoles = () => {
  const sql = `SELECT roles.title, roles.salary, departments.name
  AS department FROM roles
  LEFT JOIN departments
  ON roles.department_id = departments.id;`;
  db.query(sql, (err, rows) => {
    if (err) {
      return;
    }
    console.table(rows);
  });
};

const viewAllDepartments = () => {
  const sql = `SELECT departments.name FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) {
      return;
    }
    console.table(rows);
  });
};

const addEmployeeQuestions = (roleChoices, managerList) => {
  return [
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
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: roleChoices,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: managerList,
    },
  ];
};

const addEmployee = () => {
  db.query(`SELECT id, title FROM roles`, (err, rows) => {
    const roleChoices = rows.map((row) => {
      return { value: row.id, name: row.title };
    });
    db.query(
      `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees WHERE employees.manager_id IS NULL;`,
      (err, rows) => {
        const managerList = rows.map((row) => {
          return { value: row.id, name: row.name };
        });

        const choices = addEmployeeQuestions(roleChoices, managerList);
        inquirer
          .prompt(choices)
          .then(({ firstName, lastName, role, manager }) => {
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES (?,?,?,?)`;
            const params = [firstName, lastName, role, manager];
            db.query(sql, params, (err, rows) => {
              if (err) {
                return;
              }
              console.log(`Added ${firstName} ${lastName} to the database.`);
            });
          });
      }
    );
  });
};

const updateRoleQuestions = (employeeList, roleList, managerList) => {
  return [
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to update?",
      choices: employeeList,
    },
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleList,
    },
    {
      type: "list",
      name: "managerId",
      message: "Which manager do you want to assign the selected employee?",
      choices: managerList,
    },
  ];
};

const updateEmployeeRole = () => {
  db.query(
    `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees WHERE employees.manager_id IS NOT NULL;`,
    (err, rows) => {
      const employeeList = rows.map((row) => {
        return { value: row.id, name: row.name };
      });
      db.query(`SELECT id, title FROM roles`, (err, rows) => {
        const roleList = rows.map((row) => {
          return { value: row.id, name: row.title };
        });
        db.query(
          `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees WHERE employees.manager_id IS NULL;`,
          (err, rows) => {
            const managerList = rows.map((row) => {
              return { value: row.id, name: row.name };
            });

            const choices = updateRoleQuestions(
              employeeList,
              roleList,
              managerList
            );
            inquirer
              .prompt(choices)
              .then(({ roleId, managerId, employeeId }) => {
                const sql = `UPDATE employees SET role_id = ?, manager_id = ?
                    WHERE id = ?`;
                const params = [roleId, managerId, employeeId];
                db.query(sql, params, (err, result) => {
                  if (err) {
                    return;
                  } else {
                    console.log("Updated employee's role");
                  }
                });
              });
          }
        );
      });
    }
  );
};

const addRoleQuestions = (deptChoices) => {
  return [
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
    {
      type: "list",
      name: "department",
      message: "Which department does the role belong to?",
      choices: deptChoices,
    },
  ];
};

const addRole = () => {
  db.query("SELECT id, name FROM departments", (err, rows) => {
    const deptChoices = rows.map((row) => {
      return { value: row.id, name: row.name };
    });
    const choices = addRoleQuestions(deptChoices);
    inquirer.prompt(choices).then(({ title, salary, department }) => {
      const sql = `INSERT INTO roles (title, salary, department_id)
            VALUES (?,?,?)`;
      const params = [title, salary, department];
      db.query(sql, params, (err, rows) => {
        if (err) {
          return;
        }
        console.log(`Added ${title} to the database.`);
      });
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

const selectByManagerQuestions = (managerList) => {
  return {
    type: "list",
    name: "managerList",
    message: "Which manager's employees would you like to see?",
    choices: managerList,
  };
};

const selectByManager = () => {
  db.query(
    `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees WHERE employees.manager_id IS NULL;`,
    (err, rows) => {
      const managerList = rows.map((row) => {
        return { value: row.id, name: row.name };
      });
      const choices = selectByManagerQuestions(managerList);
      inquirer.prompt(choices).then(({ managerList }) => {
        const sql = `SELECT CONCAT(first_name, ' ', last_name) as name from employees where manager_id = ?;`;
        const params = [managerList];
        db.query(sql, params, (err, rows) => {
          if (err) {
            return;
          }
          console.table(rows);
        });
      });
    }
  );
};

module.exports = {
  viewAllDepartments,
  viewAllEmployees,
  viewAllRoles,
  addEmployee,
  addRole,
  addDepartment,
  updateEmployeeRole,
  selectByManager,
};
