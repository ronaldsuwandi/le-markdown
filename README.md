# le markdown

It is now server-based (using NodeJS). At present it is still just a mockup server -
it supports create/edit/delete node (folder location is hardcoded in server.js for now
and there is no checking if whether file is already exists; it simply overwrites it.
Also no folder support yet)

Subfolder is now supported (create/edit/delete folder will be added on later)

Online live demo (0.1 - client-only using LocalStorage) can be accessed at
[http://bit.ly/16G2lUa](http://bit.ly/16G2lUa)

## Download

The source is available for download at [GitHub](https://github.com/ronaldsuwandi/le-markdown)

## Dependencies

Currently the server uses

* [Async](https://github.com/caolan/async)
* [Express](https://github.com/visionmedia/express)

Ensure that these two packages are installed before running the application

    npm install async
    npm install express

## Usage

Simply update `settings.js` as required and run the application by executing

    node server.js

## Changelog

##### 0.1.2 - 2013/03/18
* Modularised client using RequireJS
* Added settings.js file to handle basic server settings

##### 0.1.1 - 2013/04/04
* Removed LocalStorage implementation
* Created basic mockup server to handle create/edit/delete
* Server settings are hardcoded for now

##### 0.1.0 - 2013/03/18
* Initial public release
* Only uses HTML5 LocalStorage at the moment
