define(function(require) {
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Notes = require('collections/notes');
  var NoteListView = require('views/notes');

  var AppView = Backbone.View.extend({
    initialize: function () {
      Notes.fetch({reset: true});
    }
  });

  return AppView;
});
