define(function(require) {
  var _ = require('underscore');
  var Backbone = require('backbone');

  var NoteModel = Backbone.Model.extend({
    // default attribute for document
    defaults: {
      title: 'untitled',
      modifiedDate: new Date(),
      path: '',
      content: ''
    }
  });

  return NoteModel;
});