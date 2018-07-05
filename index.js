const fs = require("fs");
const path = require("path");

// Include custom helpers
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

  let username = params.username;
  let password = params.password;

  // File or folder path (Eg: /home/user/index.html or /var/www/html/images)
  let filePath = params.filePath;

  // Parent root node id where the file/folder to be uploaded to
  let rootNodeId = params.rootNodeId;

  // Upload the file/folder under the relative folder. Specify empty string "" to upload on the root path of rootNodeId.
  let relativePath = params.relativePath || "";

  // Incase of folder, all contents inside the folder will be uploaded recursively
  let recursive = params.recursive || false;

  if (!instanceUrl || !filePath || !rootNodeId) {
    throw new Error("instanceUrl, filePath, rootNodeId are mandatory params");
  }

  // If its a directory, send a request to create the directory.
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    let directoryName = path.basename(params.filePath);

    try {
      return await directory.create({
        instanceUrl: instanceUrl,
        username: username,
        password: password,
        rootNodeId: rootNodeId,
        directoryName: directoryName,
        relativePath: relativePath
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // If its a file, send a request to upload the file.
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    console.log( 'file here...' );
    
  }

  return false;
};
