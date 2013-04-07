// Note View
define(function(require) {
  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Note = require('models/note');
  var Notes = require('collections/notes');
  var Util = require('util');
  var Markdown = require('markdown');
  var noteTemplate = require('text!templates/note.html');

  var MarkdownConverter = new Markdown.Converter();

  // DOM element for a document item
  var NoteView = Backbone.View.extend({
    el: '#document',
    // template: _.template($('#document-template').html()),
    template: _.template(noteTemplate),
    events: {
      'dblclick .clickable': 'toggleView',
      'click #back': 'showDocumentList',
      'click #cancel': 'revertDoc',
      'click #save': 'saveDoc'
    },

    initialize: function () {
      // re-fetch the model to grab the content
      this.model.fetch();
      // re-render on change
      this.model.on('change', this.render,this);
      this.render();
    },

    revertDoc: function () {
      // TODO revert the values
      this.toggleView();
    },

    toggleView: function () {
      this.edit.toggleClass('hidden');
      this.view.toggleClass('hidden');
    },

    saveDoc: function () {
      var value = this.titleInput.val().trim();
      if (value) {
        this.model.set({title: value});
      }
      var value = this.titleContent.val().trim();
      if (value) {
        this.model.set({content: value});
      }

      // by setting the modified date, even though the content of the
      // model is the same, the date modified is chagned, thus re-render
      // will occur
      this.model.set({modifiedDate: new Date()});
      this.model.save();
    },

    showDocumentList: function () {
      this.$el.addClass('hidden');

      // FIXME is this a correct approach? I would have thought that this
      // should be declared on the top level rather than here, but doing
      // that will cause it to be having a circular dependencies
      var NoteListView = require('views/notes');
      NoteListView.displayList(true);
    },

    render: function () {
      var modelJSON = this.model.toJSON();
      this.$el.html(this.template(modelJSON));
      this.$el.removeClass('hidden');

      // render markdown here
      this.$('#content').html(MarkdownConverter.makeHtml(modelJSON.content));

      // set the id class
      this.edit = $('#document-edit');
      this.view = $('#document-view');
      this.titleInput = this.$('#edit-title');
      this.titleContent = this.$('#edit-content');

      // render modified date separately
      this.$('#modified-date').html(Util.formatDate(modelJSON.modifiedDate));

      // hide edit
      this.edit.toggleClass('hidden');
    }
  });

  return NoteView;
});