const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");

const viewAllEmployees = () => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name,
  roles.title AS role, roles.salary AS salary, departments.name AS department,
  CONCAT(e2.first_name, ' ', e2.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees e2 ON employees.manager_id = e2.id;
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      return;
    }
    console.table(rows);
    startInquirer();
  });
};
const viewAllRoles = () => {
  const sql = `SELECT roles.id, roles.title, roles.salary, departments.name
  AS department FROM roles
  LEFT JOIN departments
  ON roles.department_id = departments.id;`;
  db.query(sql, (err, rows) => {
    if (err) {
      return;
    }
    console.table(rows);
    startInquirer();
  });
};

const viewAllDepartments = () => {
  const sql = `SELECT departments.id, departments.name FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) {
      return;
    }
    console.table(rows);
    startInquirer();
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
              startInquirer();
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

const updateEmployee = () => {
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
                    startInquirer();
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
        startInquirer();
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
        startInquirer();
      });
    });
};

const selectByManagerQuestions = (managerList) => {
  return {
    type: "list",
    name: "managerList",
    message: "Which manager's employees would you like to view?",
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
        db.query(sql, managerList, (err, rows) => {
          if (err) {
            return;
          }
          console.table(rows);
          startInquirer();
        });
      });
    }
  );
};

const selectByDepartmentQuestions = (departmentList) => {
  return {
    type: "list",
    name: "departmentList",
    message: "Which department's employees would you like to view?",
    choices: departmentList,
  };
};

const selectByDepartment = () => {
  db.query(`SELECT id, name FROM departments`, (err, rows) => {
    const departmentList = rows.map((row) => {
      return { value: row.id, name: row.name };
    });
    const choices = selectByDepartmentQuestions(departmentList);
    inquirer.prompt(choices).then(({ departmentList }) => {
      const sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees left join roles ON employees.role_id = roles.id WHERE roles.department_id = ?;`;
      db.query(sql, departmentList, (err, rows) => {
        if (err) {
          return;
        }
        console.table(rows);
        startInquirer();
      });
    });
  });
};

const deleteEmployeeQuestions = (employeeList) => {
  return {
    type: "list",
    name: "employeeList",
    message: "Which employee would you like to delete?",
    choices: employeeList,
  };
};

const deleteEmployee = () => {
  db.query(
    `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees;`,
    (err, rows) => {
      const employeeList = rows.map((row) => {
        return { value: row.id, name: row.name };
      });
      const choices = deleteEmployeeQuestions(employeeList);
      inquirer.prompt(choices).then(({ employeeList }) => {
        const sql = `DELETE FROM employees WHERE id = ?;`;
        db.query(sql, employeeList, (err, rows) => {
          if (err) {
            return;
          }
          console.log("Employee has been deleted.");
          startInquirer();
        });
      });
    }
  );
};

const deleteRoleQuestions = (roleList) => {
  return {
    type: "list",
    name: "roleList",
    message: "Which role would you like to delete?",
    choices: roleList,
  };
};

const deleteRole = () => {
  db.query(`SELECT id, title FROM roles;`, (err, rows) => {
    const roleList = rows.map((row) => {
      return { value: row.id, name: row.title };
    });
    const choices = deleteRoleQuestions(roleList);
    inquirer.prompt(choices).then(({ roleList }) => {
      const sql = `DELETE FROM roles WHERE id = ?;`;
      db.query(sql, roleList, (err, rows) => {
        if (err) {
          return;
        }
        console.log("Role has been deleted.");
        startInquirer();
      });
    });
  });
};

const deleteDepartmentQuestions = (departmentList) => {
  return {
    type: "list",
    name: "departmentList",
    message: "Which department would you like to delete?",
    choices: departmentList,
  };
};

const deleteDepartment = () => {
  db.query(`SELECT id, name FROM departments;`, (err, rows) => {
    const departmentList = rows.map((row) => {
      return { value: row.id, name: row.name };
    });
    const choices = deleteDepartmentQuestions(departmentList);
    inquirer.prompt(choices).then(({ departmentList }) => {
      const sql = `DELETE FROM departments WHERE id = ?;`;
      db.query(sql, departmentList, (err, rows) => {
        if (err) {
          return;
        }
        console.log("Department has been deleted.");
        startInquirer();
      });
    });
  });
};

const departmentSalaryQuestions = (departmentList) => {
  return {
    type: "list",
    name: "departmentList",
    message: "Which department would you like to view the total budget?",
    choices: departmentList,
  };
};

const departmentSalaries = () => {
  db.query(`SELECT id, name FROM departments;`, (err, rows) => {
    const departmentList = rows.map((row) => {
      return { value: row.id, name: row.name };
    });
    const choices = departmentSalaryQuestions(departmentList);
    inquirer.prompt(choices).then(({ departmentList }) => {
      const sql = `SELECT sum(roles.salary) as total FROM roles WHERE roles.department_id = ?;`;
      db.query(sql, departmentList, (err, rows) => {
        if (err) {
          return;
        }
        console.table(rows);
        startInquirer();
      });
    });
  });
};

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
        "Update Employee",
        "Add Role",
        "Add Department",
        "View Employees By Manager",
        "View Employees By Department",
        "View Total Budget By Department",
        "Delete Employee",
        "Delete Role",
        "Delete Department",
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
        case "Update Employee":
          updateEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "View Employees By Manager":
          selectByManager();
          break;
        case "View Employees By Department":
          selectByDepartment();
          break;
        case "View Total Budget By Department":
          departmentSalaries();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
        case "Quit":
          process.exit();
        default:
          console.log("Please choose an option.");
      }
    })
    .catch((err) => console.log("Please choose an option."));
};

// database error connect
db.connect((err) => {
  if (err) throw err;
});

startInquirer();
