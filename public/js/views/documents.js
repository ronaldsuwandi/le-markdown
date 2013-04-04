var app = app || {};

// Document Title View - this is only to display list of documents instead
// of rendering the document content
app.DocumentTitleView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#document-item-template').html()),

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
    this.$('#modified-date').html(app.formatDate(modelJSON.modifiedDate));
    return this;
  },

  view: function (source) {
    // hide the main document list view
    app.MainDocumentListView.displayList(false);
    // display the document view
    var docview = new app.DocumentView({
      model: this.model
    });
  },

  clear: function (source) {
    this.model.destroy();
  }
});

// Document List View
// DOM element for document list
app.DocumentListView = Backbone.View.extend({
  el: '#documents', // needed for new document button
  listel: $('#document-list'),

  // DOM events
  events: {
    'click #new-document': 'newDocument',
  },

  initialize: function () {
    app.Documents.on('add', this.addOne, this);
    app.Documents.on('reset', this.addAll, this);
    this.render();
  },

  render: function () {
    console.log('document list view render');
    // console.log(app.Documents.models);
    var that = this.listel;
    _.each(app.Documents.models, function (document) {
      var documentView = new app.DocumentTitleView({
        model: document
      });
      // that.$el.append(documentView.render().el);
      that.append(documentView.render().el);
    }, this);
  },

  newDocument: function (e) {
    e.preventDefault(); // TODO do we need this?
    var doc = new app.Document();
    app.Documents.create(doc);
  },

  addOne: function (document) {
    var view = new app.DocumentTitleView({
      model: document
    });
    this.listel.append(view.render().el);
  },

  addAll: function () {
    this.render();
  },

  displayList: function (isDisplay) {
    if (isDisplay) {
      this.$el.removeClass('hidden');
    } else {
      this.$el.addClass('hidden');
    }
  }
});

// global variable for document list view
app.MainDocumentListView =  new app.DocumentListView();
