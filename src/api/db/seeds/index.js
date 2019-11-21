export const usersTableSeed = `
INSERT INTO public.users(
    firstname, lastname, email, password, gender, jobrole, 
    department, address)
VALUES ('John', 'Doe', 'johndoe@domain.com', '$2y$10$hfZSpHuNgtn7fx1vBhSYQu4BNG4z6SITRsDNfGTc3snE2i0zGoLWe', 
    'M', 'system admin', 'IT', '4 Longway Street, New York');
`;

export const rolesTableSeed = `
INSERT INTO public.roles(role)
VALUES('admin');
`;

export const userRolesTableSeed = `
INSERT INTO public.userroles(userid, roleid)
VALUES(1, 1);
`;
