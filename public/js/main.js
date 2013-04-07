// Require.js allows us to configure shortcut alias
require.config({
  baseUrl: 'js',

  // The shim config allows us to configure dependencies for
  // scripts that do not call define() to register a module
  shim: {
    underscore: {
      exports: '_'
    },

    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    markdown: {
      exports: 'Markdown'
    }
  },

  paths: {
    jquery: 'lib/jquery/jquery',
    underscore: 'lib/underscore/underscore',
    backbone: 'lib/backbone/backbone',
    text: 'lib/require/text',
    markdown: 'lib/markdown/Markdown.Converter'
  }
});

// require(function(require) {
require([
  'views/app'
], function(AppView) {
  // var AppView = require('views/app');
  // var Workspace = require('routers/router');

  // // Initialize routing and start Backbone.history()
  // new Workspace();
  // Backbone.history.start();

  // Initialize the application View
  new AppView();
});
