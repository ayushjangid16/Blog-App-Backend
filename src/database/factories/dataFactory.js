const Permission = require("../../models/permissionModel");
const Role = require("../../models/roleModel");
const RoleWithPermission = require("../../models/rolePermissionModel");
const User = require("../../models/userModel");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const allValidPermissions = [
  // Dashboard
  {
    name: "Access Dashboard",
    username: "access_dashboard",
    module: "Dashboard",
  },

  // Profile
  { name: "Access Profile", username: "access_profile", module: "Profile" },
  { name: "Edit Profile", username: "edit_profile", module: "Profile" },
  { name: "Delete Profile", username: "delete_profile", module: "Profile" },

  // Platform User Management (Admin only)
  {
    name: "Access Platform User",
    username: "access_platform_user",
    module: "Platform User",
  },
  {
    name: "Create Platform User",
    username: "create_platform_user",
    module: "Platform User",
  },
  {
    name: "Edit Platform User",
    username: "edit_platform_user",
    module: "Platform User",
  },
  {
    name: "View Platform User",
    username: "view_platform_user",
    module: "Platform User",
  },
  {
    name: "Delete Platform User",
    username: "delete_platform_user",
    module: "Platform User",
  },

  // Writer Role Management
  {
    name: "Request Writer Role",
    username: "request_writer_role",
    module: "Writer Role",
  },
  {
    name: "Approve Writer Request",
    username: "approve_writer_request",
    module: "Writer Role",
  },
  {
    name: "Reject Writer Request",
    username: "reject_writer_request",
    module: "Writer Role",
  },
  {
    name: "Revoke Writer Role",
    username: "revoke_writer_role",
    module: "Writer Role",
  },

  // Blog Posts (Writer)
  { name: "Create Blog", username: "create_blog", module: "Blog" },
  { name: "Edit Blog", username: "edit_blog", module: "Blog" },
  { name: "Delete Blog", username: "delete_blog", module: "Blog" },
  { name: "View Blog", username: "view_blog", module: "Blog" },
];

const createPermissions = async () => {
  await Permission.deleteMany({});
  return Permission.insertMany(allValidPermissions);
};

const createRoles = async () => {
  await Role.deleteMany({});
  const roles = [
    { name: "Admin", username: "admin" },
    { name: "Writter", username: "writter" },
    { name: "User", username: "user" },
  ];
  return Role.insertMany(roles);
};

const createUsers = async (allRoles) => {
  await User.deleteMany({});
  const adminRole = allRoles.find((r) => r.name === "Admin");

  let hashPass = await bcrypt.hash("Admin@123", 10);

  const adminUser = {
    first_name: "Admin",
    last_name: "User",
    email: "ayush.jangid@helpfulinsightsolution.com",
    refresh_token: "",
    password: hashPass,
    isVerified: true,
    phone_number: faker.phone.number().toString(),
    role_id: adminRole._id,
  };

  return User.create(adminUser);
};

const assignPermission = (roleName, perm, roles, permissions) => {
  const currRole = roles.find((r) => r.name === roleName);
  const currPerm = permissions.find((p) => p.username === perm);
  return {
    role: currRole._id,
    permission: currPerm._id,
  };
};

const createRoleWithPermission = async (allRoles, allPermissions) => {
  await RoleWithPermission.deleteMany({});

  const adminRole = allRoles.find((r) => r.name === "Admin");

  // this is assigning all the permissions to admin role
  const roleWithPermission = allPermissions.map((perm) => ({
    role: adminRole._id,
    permission: perm._id,
  }));

  // User
  const userRole = allRoles.find((r) => r.name === "User");
  const writterPermission = allPermissions.find(
    (per) => per.username == "request_writer_role"
  );
  const userRoleWithPermission = [
    {
      role: userRole._id,
      permission: writterPermission._id,
    },
  ];

  return RoleWithPermission.insertMany([
    ...roleWithPermission,
    ...userRoleWithPermission,
  ]);
};

module.exports = {
  createUsers,
  createPermissions,
  createRoles,
  createRoleWithPermission,
};
