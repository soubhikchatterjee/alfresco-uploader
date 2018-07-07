# Alfresco Uploader

Alfresco uploader is designed specifically for alfresco ([www.alfresco.com](https://www.alfresco.com)) that uses the alfresco 5.2 api to upload files and folders to a specified remote alfresco instance. It can also upload and its subfolder/files recursively.

# Installation

> npm install alfresco-uploader 

## Usage

#### Case 1:
Lets say we want to upload the *"images"* folder that sits under *"/home/user"* on our local to the *"documentLibrary"* on alfresco, we will use the following code:
```javascript
const af = require("alfresco-uploader");

af.upload({
	instanceUrl:  "https://www.example.com",
	username:  "admin",
	password:  "admin",
	path:  "/home/user/images",
	parentNodeRef:  "620672dd-cfa9-46b7-bf08-8189cafba142",
	recursive:  false
})
.then(result => console.log(result))
.catch(error => console.log(error));
```

#### Case 2:
To upload the *"images"* folder and all content inside it (subfolders and files) recursively we will use the following code:
```javascript
const af = require("alfresco-uploader");

af.upload({
	instanceUrl:  "https://www.example.com",
	username:  "admin",
	password:  "admin",
	path:  "/home/user/images",
	parentNodeRef:  "620672dd-cfa9-46b7-bf08-8189cafba142",
	recursive:  true
})
.then(result => console.log(result))
.catch(error => console.log(error));
```


#### Case 3:
To upload the "logo.png" file that sits under *"/home/user/images"* folder we will use the following code:
```javascript
const af = require("alfresco-uploader");

af.upload({
	instanceUrl:  "https://www.example.com",
	username:  "admin",
	password:  "admin",
	path:  "/home/user/images/logo.png",
	parentNodeRef:  "620672dd-cfa9-46b7-bf08-8189cafba142",
	recursive:  false
})
.then(result => console.log(result))
.catch(error => console.log(error));
```

## Parameters

 - **instanceUrl** : The url of alfresco server. [STRING]
 
 - **username** : Username of the alfresco instance. [STRING]
 - **password** : Password of the alfresco instance. [STRING]
 - **path** : The file or image path that has to be uploaded. [STRING]
 - **parentNodeRef** : The parent nodeRef where the item will be uploaded. [STRING]
 - **recursive** : Whether to upload all items inside the *"path"* recursively. [BOOLEAN] *(Optional)*

## Contributing

We're always open to your help and feedback. Please email with your pull request at soubhik@chatterjee.pw