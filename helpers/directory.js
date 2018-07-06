const request = require("request-promise-native");
const btoa = require("btoa");

/**
 * This function creates a new folder on the remote alfresco instance based on the parameters specified.
 *
 *
 * @param object params
 * {
 *  instanceUrl: <String>,
 *  rootNodeId: <String>,
 *  username: <String>,
 *  password: <String>,
 *  directoryName: <String>,
 *  relativePath: <String>,
 * }
 */
exports.create = async params => {
  options = {
    resolveWithFullResponse: true,
    method: "POST",
    url:
      params.instanceUrl +
      "/alfresco/api/-default-/public/alfresco/versions/1/nodes/" +
      params.rootNodeId +
      "/children",
    headers: {
      "content-type": "application/json",
      Authorization: "Basic " + btoa(params.username + ":" + params.password)
    },
    body: JSON.stringify({
      name: params.directoryName,
      nodeType: "cm:folder",
      relativePath: params.relativePath
    })
  };

  try {
    let response = await request(options);
    response = JSON.parse(response.body);

    if (response.entry.id) {
      return response.entry.id;
    }

    return false;
  } catch (error) {
    // Ignore "duplicate" status codes
    if (error.statusCode != 409) {
      throw error;
    }

    return false;
  }
};
