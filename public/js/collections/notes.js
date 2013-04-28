// Notes collection
define(function(require) {
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Note = require('models/note');

  var NotesCollection = Backbone.Collection.extend({
    model: Note,

    // Save all document under lemarkdown-documents namespace
    // localStorage: new Backbone.LocalStorage('lemarkdown-documents')
    url: function() {
      return '/api/folder/' + this.relativeUrl;
    },

    // subfolder url will be stored here
    relativeUrl: ''
  });

  return new NotesCollection();
});


