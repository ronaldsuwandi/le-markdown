define(function(require) {
  var _ = require('underscore');
  var Backbone = require('backbone');

  var NoteModel = Backbone.Model.extend({
    // default attribute for document
    defaults: {
      modifiedDate: new Date(),
      content: '',
      isDir: false
    },

    initialize: function() {
      // add title attribute
      this.set({
        title: function() {
          // title shows the first 20 characters from first line
          var regex = /.{0,20}/;
          var result = regex.exec(this.content);
          return (result && result[0].trim() !== '')  ? result : '';
        }
      });
    },

    urlRoot: '/api/file',

    url: function() {
      // path will always have slash at the end of the string
      return this.urlRoot + '/' + this.get('path') + this.get('filename');
    }
  });

  return NoteModel;
});