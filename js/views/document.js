var app = app || {};
// Document View

// DOM element for a document item
app.DocumentView = Backbone.View.extend({
  el: '#document',
  template: _.template($('#document-template').html()),

  events: {
    'dblclick .clickable': 'toggleView',
    'click #back': 'showDocumentList',
    'click #cancel': 'revertDoc',
    'click #save': 'saveDoc'
  },

  initialize: function () {
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
    this.model.set({dateModified: new Date()});
    this.model.save();
  },

  showDocumentList: function () {
    this.$el.addClass('hidden');
    app.MainDocumentListView.displayList(true);
  },

  render: function () {
    var modelJSON = this.model.toJSON();
    this.$el.html(this.template(modelJSON));
    this.$el.removeClass('hidden');

    // render markdown here
    this.$('#content').html(app.Markdown.makeHtml(modelJSON.content));

    // set the id class
    this.edit = $('#document-edit');
    this.view = $('#document-view');
    this.titleInput = this.$('#edit-title');
    this.titleContent = this.$('#edit-content');

    // render modified date separately
    this.$('#modified-date').html(app.formatDate(modelJSON.modifiedDate));

    // hide edit
    this.edit.toggleClass('hidden');
  }

});