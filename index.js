const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Include custom helpers
const file = require("./helpers/file");
const directory = require("./helpers/directory");

/**
 * This function uploads a file or folder to a given alfresco instance. It will also recursively upload all files and sub-folders
 * of a specified folder.
 *
 *
 * @param object params
 * {
 *  instanceUrl: <String>,
 *  username: <String>,
 *  password: <String>,
 *  filePath: <String>,
 *  rootNodeId: <String>,
 *  relativePath: <String>,
 *  resursive: <Boolean>,
 * }
 */
exports.upload = async params => {
  // The instance url of the alfresco instance (Eg: https://www.example.com:8080)
  let instanceUrl = params.instanceUrl;

  // Username of the alfresco instance
  let username = params.username;

  // Password of the alfresco instance
  let password = params.password;

  // Upload the file/folder under the relative folder.
  // Specify empty string "" to upload on the root path of rootNodeId.
  let relativePath = params.relativePath || "";

  // File or folder path (Eg: /home/user/index.html or /var/www/html/images)
  let filePath = params.filePath;

  // Parent root node id where the file/folder to be uploaded to
  let rootNodeId = params.rootNodeId;

  // Whether to overwrite any existing file. (OPTIONAL)
  let overwrite = params.overwrite || "true";

  // Incase of folder, all contents inside the folder will be uploaded recursively. (OPTIONAL)
  let recursive = params.recursive || false;

  // Validate mandatory parameters
  if (!instanceUrl || !filePath || !rootNodeId || !username || !password) {
    throw new Error("instanceUrl, filePath, rootNodeId, username, password are mandatory params");
  }

  let isDirectory =
    fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
  let isFile = fs.existsSync(filePath) && fs.statSync(filePath).isFile();

  // Check if given path is a directory and whether the "recursive" flag is turned on.
  if (isDirectory && recursive) {
    let files = glob.sync(filePath + "/**/*");

    for (const item of files) {
      let rootPath = params.filePath
        .replace(/\/$/, "")
        .replace(/\/([^/]+)$/, "");

      relativePath = item.replace(rootPath + "/", "");

      // If its a directory, create one
      if (fs.statSync(item).isDirectory()) {
        try {
          await directory.create({
            instanceUrl: instanceUrl,
            username: username,
            password: password,
            rootNodeId: rootNodeId,
            directoryName: path.basename(item),
            relativePath: path.dirname(relativePath)
          });
        } catch (error) {
          throw error;
        }
      }

      // If its a file, upload it!
      if (fs.statSync(item).isFile()) {
        try {
          await file.create({
            instanceUrl: instanceUrl,
            username: username,
            password: password,
            relativePath: path.dirname(relativePath),
            rootNodeId: rootNodeId,
            filePath: item,
            overwrite: overwrite
          });
        } catch (error) {
          throw error;
        }
      }
    }

    return false;
  }

  // If its a single directory, send a request to create the directory.
  if (isDirectory) {
    try {
      return await directory.create({
        instanceUrl: instanceUrl,
        username: username,
        password: password,
        rootNodeId: rootNodeId,
        directoryName: path.basename(params.filePath),
        relativePath: relativePath
      });
    } catch (error) {
      throw error;
    }
  }

  // If its a single file, send a request to upload the file.
  if (isFile) {
    try {
      return await file.create({
        instanceUrl: instanceUrl,
        username: username,
        password: password,
        relativePath: relativePath,
        rootNodeId: rootNodeId,
        filePath: filePath,
        overwrite: overwrite
      });
    } catch (error) {
      throw error;
    }
  }

  return false;
};
