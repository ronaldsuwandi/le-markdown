// instance
var app = app || {};

app.Document = Backbone.Model.extend({
  // default attribute for document
  defaults: {
    title: 'untitled',
    modifiedDate: new Date(),
    path: '',
    content: ''
  }
});