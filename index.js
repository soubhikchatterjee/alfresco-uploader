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
 *  path: <String>,
 *  parentNodeRef: <String>,
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

  // File or folder path (Eg: /home/user/index.html or /var/www/html/images)
  let localPath = params.path;

  // Parent root node id where the file/folder to be uploaded to
  let parentNodeRef = params.parentNodeRef;

  // Whether to overwrite any existing file. (OPTIONAL)
  let overwrite = params.overwrite || "true";

  // Incase of folder, all contents inside the folder will be uploaded recursively. (OPTIONAL)
  let recursive = params.recursive || false;

  // Validate mandatory parameters
  if (!instanceUrl || !localPath || !parentNodeRef || !username || !password) {
    throw new Error(
      "instanceUrl, path, parentNodeRef, username, password are mandatory params"
    );
  }

  let isDirectory =
    fs.existsSync(localPath) && fs.statSync(localPath).isDirectory();
  let isFile = fs.existsSync(localPath) && fs.statSync(localPath).isFile();

  // Check if given path is a directory and whether the "recursive" flag is turned on.
  if (isDirectory && recursive) {
    let files = glob.sync(localPath + "/**/*");

    for (const item of files) {
      let rootPath = params.path.replace(/\/$/, "").replace(/\/([^/]+)$/, "");

      let relativePath = item.replace(rootPath + "/", "");

      // If its a directory, create one
      if (fs.statSync(item).isDirectory()) {
        try {
          await directory.create({
            instanceUrl: instanceUrl,
            username: username,
            password: password,
            parentNodeRef: parentNodeRef,
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
            parentNodeRef: parentNodeRef,
            path: item,
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
        parentNodeRef: parentNodeRef,
        directoryName: path.basename(params.path),
        relativePath: ""
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
        relativePath: "",
        parentNodeRef: parentNodeRef,
        path: localPath,
        overwrite: overwrite
      });
    } catch (error) {
      throw error;
    }
  }

  return false;
};
