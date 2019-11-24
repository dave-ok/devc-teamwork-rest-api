export const CREATE_TEST_1 = `
CREATE TABLE test.users(
    id INT NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL
);
`;

export const CREATE_TEST_2 = `
CREATE TABLE test.departments(
    id INT NOT NULL,
    departmentname character varying(50) NOT NULL
);
`;

export const CREATE_TEST_3 = `
CREATE TABLE test.user_departments(
    id INT NOT NULL,
    user_id INT NOT NULL,
    department_id INT NOT NULL
);
`;

export const DROP_TEST_1 = 'DROP TABLE test.users';
export const DROP_TEST_2 = 'DROP TABLE test.departments';
export const DROP_TEST_3 = 'DROP TABLE test.user_departments';

export const testTablesSeed = `
INSERT INTO public.users VALUES (2, 'Jane', 'Doe', 'jane@doe.com', 'dshlhksdhkhvhds;hhjsknvkj;s', 'F', 'team lead', 'HR', '212 here street');
SELECT pg_catalog.setval('public.users_user_id_seq', 2, true);

INSERT INTO public.roles VALUES (2, 'editor');
INSERT INTO public.roles VALUES (3, 'user');
SELECT pg_catalog.setval('public.roles_role_id_seq', 3, true);

INSERT INTO public.user_roles VALUES (2, 1, 2);
INSERT INTO public.user_roles VALUES (3, 2, 2);
INSERT INTO public.user_roles VALUES (4, 2, 3);

SELECT pg_catalog.setval('public.user_roles_user_role_id_seq', 4, true);
`;
