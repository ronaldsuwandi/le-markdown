var app = app || {};

app.AppView = Backbone.View.extend({
  initialize: function () {
    // fetch all documents from local storage
    app.Documents.fetch();
    // new app.DocumentListView();
  }
});

// create global instance of markdown converter
app.Markdown = new Markdown.Converter();

// format given date (json) 
app.formatDate = function (dateString) {
  // render modified date separately
  var date = new Date (Date.parse(dateString));
  var formatted = date.getFullYear() + '/' + 
                  this.numberFormat(date.getMonth()) + '/' +
                  this.numberFormat(date.getDay()) + ' ' + 
                  this.numberFormat(date.getHours()) + ':' + 
                  this.numberFormat(date.getMinutes());
  return formatted;
}

// add leading 0 if digit is a single number
app.numberFormat = function (number) {
  return ('0' + number).slice(-2);
}