INSERT INTO departments (name)
VALUES
  ("Marketing"),
  ("Finance"),
  ("Web Development");

INSERT INTO roles (title, salary, department_id)
VALUES
  ("Social Media Manager", 50000, 1),
  ("Graphic Designer", 90000, 1),
  ("Director of Marketing", 120000, 1),
  ("Payroll Coodinator", 50000, 2),
  ("Accountant", 100000, 2),
  ("Director of Finances", 150000, 2),
  ("Junior Developer", 100000, 3),
  ("Senior Developer", 150000, 3),
  ("Director of Web Development", 200000, 3);

  INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ("Gilina", "McBride", 1, 3),
  ("Caroline", "Ellis", 2, 3),
  ("Cristina", "Broussard", 3, NULL),
  ("Kaitlyn", "Dixon", 4, 6),
  ("Laura", "Toms", 5, 6),
  ("Eleanor", "Thompson", 6, NULL),
  ("Kelsey", "Pittman", 7, 9),
  ("Marnie", "Blalock", 8, 9),
  ("Taylor", "Noel", 9, NULL);
