/**
 * Created by visarev on 20.02.16.
 */

var express = require('express');
var path = require('path');

var app = express();

var CLIENT_PATH = '/client_src';

app.use( '/', express.static( path.join( __dirname, CLIENT_PATH ) ) );

var server = app.listen( 3000, function () {
    var host = server.address().adress;
    var port = server.address().port;
    console.log( 'listening %s:%s', host, port );
} );