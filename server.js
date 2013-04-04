var application_root = __dirname,
    express = require("express"),
    http = require("http"),
    fs = require("fs"),
    _ = require("underscore"),
    path = require("path");


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

// TODO
var folderLocation = 'e:/Dropbox/Workspace/le markdown files/';

function createFileModel(filePath, readContent) {
  // filename
  // regex to find the path before filename
  var filename = filePath.replace(/^.*[\\\/]/, '');

  // file model
  var fileModel = {
    title: filename,
    path: filePath,
    id: filePath,
    modifiedDate: null,
    content: null
  };

  // get modified date
  var fileStat = fs.statSync(filePath);
  fileModel.modifiedDate = fileStat.mtime;

  if (readContent) {
    fileModel.content = fs.readFileSync(filePath, 'utf8');
  }
  return fileModel;
}

/** REST api
  * GET    /api/files - list all files
  * POST   /api/files - create new file
  * GET    /api/files/:id - get by file name/id?
  * PUT    /api/files/:id - update by file name/id?
  * DELETE /api/files:id - delete by file name/id?
  */

// TODO - folder support!

// List all files
app.get('/api/files', function(req, res) {
  fs.readdir(folderLocation, function (err, files) {
    if (!err) {
      var fileModels = [];

      _.each(files, function(file) {
        // open file
        var path = folderLocation + '/' + file;
        // replace backslash into slash and remove double slash
        path = path.replace(/\\/, '/').replace(/\/{2}/,'/');

        // dummy file (no need to read content)
        fileModels.push(createFileModel(path));
      });
      res.send(fileModels);
    } else {
      return console.log(err);
    }
  });
});


// read file content
app.get('/api/files/:id', function(req, res) {
  return res.send(createFileModel(req.params.id, true));
});

// update file content
app.put('/api/files/:id', function(req, res) {
  // TODO rename title/file id?
  // TODO check if local file is changed, if it is prompt user
  fs.writeFileSync(req.params.id, req.body.content, 'utf8');
});

app.delete('/api/files/:id', function(req, res) {
  fs.unlinkSync(req.params.id);
});

app.post('/api/files', function(req, res) {
  // TODO - this is rendundant with get/api/files
  var path = folderLocation + '/' + req.body.title;
  // replace backslash into slash and remove double slash
  path = path.replace(/\\/, '/').replace(/\/{2}/,'/');

  // TODO rename filename
  // TODO handle duplicate file name at the moment it simply replace the file
  fs.writeFileSync(path, req.body.content, 'utf8');
});
