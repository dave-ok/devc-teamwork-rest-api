export const CREATE_TEST_1 = `
CREATE TABLE users(
    id INT NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL
);
`;

export const CREATE_TEST_2 = `
CREATE TABLE departments(
    id INT NOT NULL,
    departmentname character varying(50) NOT NULL
);
`;

export const CREATE_TEST_3 = `
CREATE TABLE user_departments(
    id INT NOT NULL,
    user_id INT NOT NULL,
    department_id INT NOT NULL
);
`;

export const DROP_TEST_1 =`DROP TABLE users`;
export const DROP_TEST_2 =`DROP TABLE departments`;
export const DROP_TEST_3 =`DROP TABLE user_departments`;