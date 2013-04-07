// Note List View - this is only to display list of documents instead
// of rendering the note content
define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Note = require('models/note');
  var Notes = require('collections/notes');
  var NoteView = require('views/note');
  var Util = require('util');
  var notesViewTemplate = require('text!templates/notes.html');

  // subview - displays note title and modified date
  var NoteItemView = Backbone.View.extend({
    tagName: 'li',
    // template: _.template($('#document-item-template').html()),
    template: _.template(notesViewTemplate),

    // DOM events for an item
    events: {
      'click .clickable': 'view',
      'click .destroy': 'clear'
    },

    initialize: function () {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },

    render: function () {
      var modelJSON = this.model.toJSON();
      // console.log(modelJSON);
      this.$el.html(this.template(modelJSON));
      // render modified date separately
      this.$('#modified-date').html(Util.formatDate(modelJSON.modifiedDate));
      return this;
    },

    view: function (source) {
      // hide the main document list view
      noteListViewInstance.displayList(false);
      // display the document view
      var docview = new NoteView({model: this.model});
    },

    clear: function (source) {
      this.model.destroy();
    }
  });

  // Note List View
  // DOM element for document list
  var NoteListView = Backbone.View.extend({
    el: '#documents', // needed for new document button
    $listel: $('#document-list'),

    // DOM events
    events: {
      'click #new-document': 'newDocument',
    },

    initialize: function () {
      Notes.on('add', this.addOne, this);
      Notes.on('reset', this.addAll, this);
      this.render();
    },

    render: function () {
      Notes.each(function (note) {
        this.createSingleItem(note);
      }, this);

    },

    newDocument: function (e) {
      e.preventDefault(); // TODO do we need this?
      var doc = new Note();
      Notes.create(doc);
    },

    addOne: function (note) {
      console.log('add one');
      this.createSingleItem(note);
    },

    addAll: function () {
      console.log('add all');
      this.render();
    },

    createSingleItem: function(note) {
      var noteItemView = new NoteItemView({model: note});
      this.$listel.append(noteItemView.render().el);
    },


    displayList: function (isDisplay) {
      if (isDisplay) {
        this.$el.removeClass('hidden');
      } else {
        this.$el.addClass('hidden');
      }
    }
  });

  var noteListViewInstance = new NoteListView();
  return noteListViewInstance;
});
