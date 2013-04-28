// Common utilities
define(function(require) {
  function Util() {
    // private method
    // add leading 0 if digit is a single number
    var formatNumber = function (number) {
      return ('0' + number).slice(-2);
    }

    this.formatDate = function (dateString) {
      // render modified date separately
      var date = new Date (Date.parse(dateString));
      var formatted = date.getFullYear() + '/' +
                      formatNumber(date.getMonth()) + '/' +
                      formatNumber(date.getDate()) + ' ' +
                      formatNumber(date.getHours()) + ':' +
                      formatNumber(date.getMinutes());
      return formatted;
    }
  }

  return new Util();
});
