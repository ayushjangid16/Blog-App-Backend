const Permission = require("../../models/permissionModel");
const Role = require("../../models/roleModel");
const RoleWithPermission = require("../../models/rolePermissionModel");
const User = require("../../models/userModel");
const { faker } = require("@faker-js/faker");

const createPermissions = async () => {
  const allValidPermissions = [
    { name: "Full Access", username: "full_access", module: "Admin" },
    { name: "Edit Profile", username: "edit_profile", module: "User" },
    { name: "Delete Profile", username: "delete_profile", module: "User" },
  ];

  return Permission.insertMany(allValidPermissions);
};

const createRoles = async (count = 3) => {
  let roles = [];
  for (let i = 0; i < count; i++) {
    let name;
    if (i == 0) {
      name = "Admin";
    } else if (i == 1) {
      name = "Writter";
    } else {
      name = "User";
    }
    let obj = { name };
    roles.push(obj);
  }

  return Role.insertMany(roles);
};

const createUsers = (allRoles) => {
  const adminUser = allRoles.find((role) => role.name == "Admin");
  const userRole = allRoles.find((role) => role.name == "User");
  const writterRole = allRoles.find((role) => role.name == "Writter");
  let users = [
    {
      first_name: "Admin",
      last_name: "User",
      password: "Temp",
      phone_number: faker.phone.number().toString(),
      role_id: adminUser._id,
    },
    {
      first_name: faker.person.firstName().toString(),
      last_name: faker.person.lastName().toString(),
      password: faker.person.fullName().toString(),
      phone_number: faker.phone.number().toString(),
      role_id: userRole._id,
    },
    {
      first_name: faker.person.firstName().toString(),
      last_name: faker.person.lastName().toString(),
      password: faker.person.fullName().toString(),
      phone_number: faker.phone.number().toString(),
      role_id: writterRole._id,
    },
  ];

  return User.insertMany(users);
};

const assignPermission = (roleName, perm, roles, permissions) => {
  const currRole = roles.find((r) => r.name == roleName);
  const currPerm = permissions.find((p) => p.username == perm);

  return {
    role: currRole._id,
    permission: currPerm._id,
  };
};

const createRoleWithPermission = async (allRoles, allPermissions) => {
  // assign admin permission
  let roleWithPermission = [];
  for (const perm of allPermissions) {
    if (perm.username == "full_access") {
      roleWithPermission.push(
        assignPermission("Admin", perm.username, allRoles, allPermissions)
      );
    }
  }

  return RoleWithPermission.insertMany(roleWithPermission);
};

module.exports = {
  createUsers,
  createPermissions,
  createRoles,
  createRoleWithPermission,
};
