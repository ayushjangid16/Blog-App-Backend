const fs = require("fs").promises;

const deleteFile = async (file) => {
  if (file?.path) {
    try {
      await fs.unlink(file.path);
      console.log(`Deleted file: ${file.path}`);
    } catch (err) {
      console.error(`Failed to delete file: ${file.path}`, err);
    }
  }
};

module.exports = { deleteFile };
