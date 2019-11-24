export const usersTableSeed = `
INSERT INTO public.users(
    first_name, last_name, email, password, gender, job_role, 
    department, address)
VALUES ('John', 'Doe', 'johndoe@domain.com', '$2y$10$hfZSpHuNgtn7fx1vBhSYQu4BNG4z6SITRsDNfGTc3snE2i0zGoLWe', 
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
