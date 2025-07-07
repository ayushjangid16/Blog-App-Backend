require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../../db/db");
const User = require("../../models/userModel");
const {
  createUsers,
  createPermissions,
  createRoles,
  createRoleWithPermission,
} = require("../factories/dataFactory");
const Permission = require("../../models/permissionModel");
const Role = require("../../models/roleModel");
const RoleWithPermission = require("../../models/rolePermissionModel");
fg
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    

    await Permission.deleteMany({});
    let perm = await createPermissions();

    await Role.deleteMany({});
    let roles = await createRoles();

    await RoleWithPermission.deleteMany({});
    await createRoleWithPermission(roles, perm);

    await User.deleteMany();
    await createUsers(roles);

    console.log("Data added to DB Successfully");
    process.exit(1);
  } catch (error) {
    console.log("Error connecting to DB", error);
    process.exit(1);
  } finally {
    mongoose.disconnect();
    process.exit(1);
  }
};

start();
