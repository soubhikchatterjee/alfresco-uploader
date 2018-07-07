const request = require("request-promise-native");
const fs = require("fs");
const path = require("path");
const btoa = require("btoa");

/**
 * This function uploads a file on the remote alfresco instance based on the parameters specified.
 *
 *
 * @param object params
 * {
 *  instanceUrl: <String>,
 *  username: <String>,
 *  password: <String>,
 *  relativePath: <String>,
 *  parentNodeRef: <String>,
 *  path: <String>,
 *  overwrite: <Boolean>,
 * }
 */
exports.create = async params => {  
  options = {
    resolveWithFullResponse: true,
    method: "POST",
    url: params.instanceUrl + "/alfresco/service/api/upload",
    headers: {
      Authorization: "Basic " + btoa(params.username + ":" + params.password)
    },
    formData: {
      filedata: {
        value: fs.createReadStream(params.path),
        options: {}
      },
      filename: path.basename(params.path),
      destination: "workspace://SpacesStore/" + params.parentNodeRef,
      uploadDirectory: params.relativePath,
      overwrite: params.overwrite
    }
  };

console.log( params.relativePath );


  try {
    let response = await request(options);
    response = JSON.parse(response.body);
    let refId = response.nodeRef.split("workspace://SpacesStore/");

    if (refId[1]) {
      return refId[1];
    }

    return false;
  } catch (error) {
    throw error;
  }
};
