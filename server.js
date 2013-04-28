var application_root = __dirname,
    express = require("express"),
    http = require("http"),
    fs = require("fs"),
    path = require("path"),
    async = require("async"),
    settings = require("./settings");


// express app
var app = express();
var server = http.createServer(app);

// configure server
app.configure(function() {
  // parses request body and populates req body
  app.use(express.bodyParser());
  // checks req.body for HTTP method overrides
  app.use(express.methodOverride());
  app.use(app.router); // perform route lookup based on url and HTTP method
  // serve static
  app.use(express.static(path.join(application_root, "public")));
  // show all error
  app.use(express.errorHandler({ dumpException: true, showStack: true}));
});

// Routes
app.get('/api', function(req, res) {
  res.send('Library API');
});

// Start server
server.listen(3000, function() {
  console.log('Express server listening on port %d in %s mode',
    server.address().port, app.settings.env);
});

function replaceSlashes(path) {
  // replace backslash into slash and remove double slash
  return path.replace(/\\/, '/').replace(/\/{2,}/g,'/');
}

function createFileModel(filePath, fileName, callback, readContent) {
  var fullPath = replaceSlashes(settings.folderLocation + '/' +
                                filePath + fileName);
  filePath = replaceSlashes(filePath);
  // file model
  var fileModel = {
    id: fileName, // id is used to check whether record is new or not
    filename: fileName,
    path: filePath,
    modifiedDate: null,
    content: null
  };

  async.waterfall([
    function stats(callback) {
      fs.stat(fullPath, function(err, stats) {
        if (err) return callback(err);
        callback(null, stats);
      });
    },

    function read(stats, callback) {
      if (readContent) {
        fs.readFile(fullPath, settings.encoding, function(err, content) {
          if (err) return callback(err);
          callback(null, stats, content);
        });
      } else if (!stats.isDirectory()) { // ignore if directory
        // read the first 20 characters on the first line to display the title
        var stream = fs.createReadStream(fullPath, {encoding: settings.encoding,
                                                    start: 0,
                                                    end: 20});
        var content = '';
        stream.on('data', function(fileContent) {
          // update content variable
          content = fileContent;
        });
        stream.on('close', function() {
          callback(null, stats, content);
        });
      } else {
        callback(null, stats, fileName);
      }
    }
  ], function(err, stats, content) {
    fileModel.isDir = stats.isDirectory();
    fileModel.modifiedDate = stats.mtime;
    fileModel.content = content;

    callback.call(null, err, fileModel);
  });
}

function readFolder(path, callback) {
  // always add extra slash on both paths
  var absolutePath = replaceSlashes(settings.folderLocation + '/' + path + '/');
  path = replaceSlashes(path + '/');
  console.log('relative path='+path);
  console.log('absolute path='+absolutePath);

  async.series([
    function readDir(callback) {
      // use absolute path only for listing directory
      fs.readdir(absolutePath, function(err, files) {
        if (err) return callback(err);

        var fileModels = [];

        async.each(files, function(file, callback) {
          createFileModel(path, file, function(err, fileModel) {
            if (err) return callback(err);
            fileModels.push(fileModel);
            callback();
          })
        }, function(err) {
          if (err) return callback(err);
          callback(null, fileModels);
        });
      });
    }
  ], function(err, results) {
    callback.call(null, err, results[0]);
  });
}

function sort(fileModels, callback) {
  // first separate folders and files
  async.waterfall([
    function splitArrays(callback) {
      var folders = [];
      var files = [];
      async.each(fileModels, function(file, eachCallback) {
        if (file.isDir) {
          folders.push(file);
        } else {
          files.push(file);
        }
        eachCallback(null);
      }, function (err) {
        callback(err, folders, files);
      });
    },
    function sort(folders, files, callback) {
      // sort parallel
      async.parallel({
        sortFiles: function(callback) {
          // sort by modified date
          async.sortBy(files, function(file, callback) {
              callback(null, file.modifiedDate);
          }, function doneSort(err, results) {
            callback(null, results);
          });
        },
        sortFolders: function(callback) {
          // sort by name
          async.sortBy(folders, function(file, callback) {
              callback(null, file.filename);
          }, function doneSort(err, results) {
            callback(null, results);
          });
        }
      }, function doneSortBoth(err, results) {
        // combine folder and files (files sort descendingly)
        callback(null, [].concat(results['sortFolders'],
                                 results['sortFiles'].reverse()));
      });
    }
  ], function done(err, result) {
    callback(err, result);
  });
}

/** REST api
  * GET    /api/folder/* - list all files (subfolder is also included)
  * GET    /api/file/:path - get by file path
  * POST   /api/file/* - create new file
  * PUT    /api/file/* - update file
  * DELETE /api/file/* - delete by file name
  */

// List all files
app.get('/api/folder/*', function(req, res) {
  console.log('API FOLDER');
  readFolder(req.params[0], function(err, result) {
    if (err) return res.send(err);
    // sort by date descendingly for file, by name ascendingly for folder
    sort(result, function(err, sorted) {
      if (err) return res.send(err);
      res.send(sorted);
    });
  });
});


// Listing all files - DONE

// read file content
// TODO fix regex
app.get(/\/api\/file\/(.*\/)?(.+)/, function(req, res) {
  console.log('GET FILE SPECIFIC');
  console.log(req.params);
  // FIXME fix this later
  if (req.params[0] === undefined || req.params[0] === null) {
    req.params[0] = '/';
  }
  req.params[0] = replaceSlashes(req.params[0]);
  req.params[1] = replaceSlashes(req.params[1]);
  console.log('after');
  console.log(req.params);
  createFileModel(req.params[0], req.params[1], function(err, result) {
    if (err) return res.send(err);
    res.send(result);
  }, true);
});


// update file content
app.put('/api/file/*', function(req, res) {
  var fullPath = replaceSlashes(settings.folderLocation + '/' + req.params[0]);
  console.log('Updating ['+fullPath+']');
  // console.log(req.body.content);
  fs.writeFile(fullPath,
               req.body.content,
               'utf8',
               function (err) {
     if (err) return res.send(err);
     console.log('File updated [' + fullPath + ']');
     res.send(req.body);
  });
  // TODO rename title/file id?
  // TODO check if local file is changed, if it is prompt user
});

app.delete('/api/file/*', function(req, res) {
  var fullPath = settings.folderLocation + '/' + req.params[0];
  fs.unlink(fullPath, function(err) {
    if (err) return res.send(err);
    console.log('File deleted ['+fullPath+']');
  });
});

app.post('/api/file/*', function(req, res) {
  var fileName = settings.newFileName;
  var absolutePath = replaceSlashes(settings.folderLocation + '/' +
                                    req.params[0] + '/');
  // TODO check new filename + extension for regex issues
  // e.g. invalid filename, slash included, etc
  var extensionRegex = settings.newFileNameExtension.replace('.','\\.');
  var regexString = [];
  regexString.push(fileName);
  regexString.push(extensionRegex);
  regexString.push('|(');
  regexString.push(fileName);
  regexString.push('-)([\\d]+)(');
  regexString.push(extensionRegex);
  regexString.push(')');
  console.log(regexString.join(''));

  // final regex form: dummy\.txt|(dummy-)([\d]+)(\.txt)
  var regex = new RegExp(regexString.join(''));

  // regex for original file form: dummy\.txt
  // this is to check if the original file exists in the first place
  var originalName = new RegExp(fileName + extensionRegex);

  async.waterfall([
    function readDir(callback) {
      fs.readdir(absolutePath, function(err, files) {
        if (err) return callback(err);
        callback(null, files);
      });
    },
    function createFileName(files, callback) {
      var originalFileExists = false;
      async.filter(files, function(file, iteratorCallback) {
        if (originalName.exec(file) !== null) {
          originalFileExists = true;
        }
        iteratorCallback(regex.exec(file) !== null);
      }, function(results) {
        // we have results of files and the numbers, only add the counter
        // if original file name is not exists (no point creating dummy-4.txt
        // if dummy.txt itself does not exists)
        if (originalFileExists) {
          var largest = 1;
          // find largest index (eg. dummy-10.txt will return 10)
          var regexIndex = /(?:.*-)([\d]+)/;
          async.each(results, function(file, callback) {
            var regexResult = regexIndex.exec(file);
            if (regexResult && regexResult[1] !== null) {
              var index = parseInt(regexResult[1]);
              if (largest < index) {
                largest = index;
              }
            }
            callback(null);
          }, function(err) {
            largest++;
            callback(err, fileName + '-' + largest +
                     settings.newFileNameExtension);
          });
        } else {
          callback(null, fileName + settings.newFileNameExtension);
        }
      });
    },
    function createFile(finalName, callback) {
      fs.writeFile(absolutePath + finalName,
                   req.body.content,
                   'utf8',
                   function(err) {
        // if (err) return res.send(err);
        if (err) return callback(err);
        callback(null, finalName);
      });
    }
  ], function(err, finalName) {
    req.body.filename = finalName;
    console.log('File created ['+absolutePath + finalName +']');
    console.log(req.body);
    res.send(req.body);
  });
});
