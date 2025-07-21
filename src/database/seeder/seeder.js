require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

const connectDB = require("../../config/db/db");

const Permission = require("../../models/permissionModel");
const Role = require("../../models/roleModel");
const RoleWithPermission = require("../../models/rolePermissionModel");
const User = require("../../models/userModel");

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
  { name: "View All Blogs", username: "view_all_blogs", module: "Blog" },
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

const createUsers = async (roles) => {
  await User.deleteMany();

  const adminRole = roles.find((r) => r.name === "Admin");

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const adminUser = {
    first_name: "Admin",
    last_name: "User",
    email: "ayush.jangid@helpfulinsightsolution.com",
    password: hashedPassword,
    refresh_token: "",
    isVerified: true,
    phone_number: faker.phone.number().toString(),
    role_id: adminRole._id,
    user_type: "system_user",
  };

  return User.create(adminUser);
};

const createRoleWithPermission = async (roles, permissions) => {
  await RoleWithPermission.deleteMany({});

  const adminRole = roles.find((r) => r.name === "Admin");
  const userRole = roles.find((r) => r.name === "User");
  const writerRole = roles.find((r) => r.username === "writter");

  // Admin: Assign all permissions
  const adminPermissions = permissions.map((perm) => ({
    role: adminRole._id,
    permission: perm._id,
  }));

  // User: Limited permissions
  const requestWriterPermission = permissions.find(
    (p) => p.username === "request_writer_role"
  );
  const viewAllBlogsPermission = permissions.find(
    (p) => p.username === "view_all_blogs"
  );
  const viewBlogPermission = permissions.find(
    (p) => p.username === "view_blog"
  );

  const userPermissions = [
    { role: userRole._id, permission: requestWriterPermission._id },
    { role: userRole._id, permission: viewAllBlogsPermission._id },
    { role: userRole._id, permission: viewBlogPermission._id },
  ];

  // Writer: Blog permissions only
  const blogPermissions = permissions
    .filter((p) => p.module === "Blog")
    .map((perm) => ({
      role: writerRole._id,
      permission: perm._id,
    }));

  const allPermissionsToInsert = [
    ...adminPermissions,
    ...userPermissions,
    ...blogPermissions,
  ];

  return RoleWithPermission.insertMany(allPermissionsToInsert);
};

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const permissions = await createPermissions();
    const roles = await createRoles();
    await createRoleWithPermission(roles, permissions);
    await createUsers(roles);

    console.log("Data added successfully.");
  } catch (error) {
    console.log("Error connecting to DB", error);
    process.exit(1);
  } finally {
    mongoose.disconnect();
    process.exit(1);
  }
};

start();
