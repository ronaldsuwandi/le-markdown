var app = app || {};

// Documents collection

var DocumentList = Backbone.Collection.extend({
  model: app.Document,

  // Save all document under lemarkdown-documents namespace
  localStorage: new Backbone.LocalStorage('lemarkdown-documents')
});


// create global collection of documents
app.Documents = new DocumentList();
