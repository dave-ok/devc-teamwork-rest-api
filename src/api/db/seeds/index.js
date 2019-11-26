export const usersTableSeed = `
INSERT INTO public.users(
    first_name, last_name, email, password, gender, job_role, 
    department, address)
VALUES ('John', 'Doe', 'johndoe@domain.com', '$2b$10$oRXtVlcQDivW7VLB9BOExOuUC9x4bvMYoV5vhzECBCoZbdG1bWM/W', 
    'M', 'system admin', 'IT', '4 Longway Street, New York');
`;

export const rolesTableSeed = `
INSERT INTO public.roles(role)
VALUES('admin');
`;

export const userRolesTableSeed = `
INSERT INTO public.user_roles(user_id, role_id)
VALUES(1, 1);
`;
