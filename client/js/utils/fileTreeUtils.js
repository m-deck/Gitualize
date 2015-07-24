var updateFiles = function(currentCommit, fileTree) {
  var filepath;
  currentCommit.files.forEach(function(file) {
    filepath = file.filename;
    file.status === 'removed' ? removeFile(fileTree, filepath) : addFile(fileTree, filepath);
  });
};
var addFile = function (tree, filePath) {
  var path = filePath.split('/');
  var currentFolder = tree;
  var folderMatch, folder;
  while (path.length > 1) {
    folderMatch = false;
    for (folder in currentFolder) {
      if (folder === path[0]) {
        currentFolder = currentFolder[folder];
        folderMatch = true;
      }
    }
    if (!folderMatch) {
      var index = filePath.lastIndexOf('/');
      var folderPath = filePath.slice(0, index > -1? index : filePath.length);
      currentFolder[path[0]] = {isFolder: true, path: folderPath};
      currentFolder = currentFolder[path[0]];
    }
    path.shift();
  }
  currentFolder[path[0]] = {isFolder: false, path: filePath};
};

var removeFile = function (tree, filePath) {
  var path = filePath.split('/');
  var currentFolder = tree;
  var folderMatch, folder;
  while (path.length > 1) {
    folderMatch = false;
    for (folder in currentFolder) {
      if (folder === path[0]) {
        currentFolder = currentFolder[folder];
        folderMatch = true;
      }
    }
    if (!folderMatch) {
      console.log('Folder not found');
      return;
    }
    path.shift();
  }
  delete currentFolder[path[0]];
  // if the currentFolder is empty, delete the folder
  if (Object.keys(currentFolder).length === 2) {
    //TODO: actually delete the folder instead of setting the property deleted
    currentFolder.deleted = true;
  }
};

module.exports = {addFile: addFile, removeFile: removeFile, updateFiles: updateFiles};
