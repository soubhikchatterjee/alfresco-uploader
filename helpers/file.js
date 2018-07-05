const request = require("request-promise-native");
const btoa = require("btoa");

exports.create = async params => {
  let uploadDirectory = path.dirname(filePath);
  uploadDirectory = uploadDirectory.replace(account.sync_path, "").substring(1);

  options = {
    resolveWithFullResponse: true,
    method: "POST",
    url: account.instance_url + "/alfresco/service/api/upload",
    headers: {
      Authorization: "Basic " + btoa(params.username + ":" + params.password)
    },
    formData: {
      filedata: {
        value: fs.createReadStream(filePath),
        options: {}
      },
      filename: path.basename(filePath),
      destination: "workspace://SpacesStore/" + rootNodeId,
      uploadDirectory: uploadDirectory,
      overwrite: "true"
    }
  };

  try {
    let response = await request(options);
    response = JSON.parse(response.body);
    let refId = response.nodeRef.split("workspace://SpacesStore/");

    if (refId[1]) {
      console.log("Uploaded File", filePath);

      // Broadcast a notification so that other clients get notified and can download the stuff on their local
      if (broadcast === true) {
        socket.emit("sync-notification", {
          machine_id: machineID.machineIdSync(),
          instance_url: account.instance_url,
          username: account.username,
          node_id: refId[1],
          action: "CREATE",
          is_file: "true",
          is_folder: "false",
          path: uploadDirectory
            ? `documentLibrary/${uploadDirectory}/${path.basename(filePath)}`
            : `documentLibrary/${path.basename(filePath)}`
        });
      }

      return refId[1];
    }

    return false;
  } catch (error) {
    await errorLogModel.add(account.id, error);
  }
};
