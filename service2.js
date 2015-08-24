/**
 * Created by davidlogan on 8/23/15.
 */
var express = require('express')
    , http = require('http')
    ,_     = require('underscore');
var app = express();

http.createServer(app).listen(8080, function(){
    console.log('Express server listening on port ' + 8080);
});

app.get('/service2/:text', function(req, rsp){
    "use strict";
    var r = {};
    r.words = req.params.text.split(' ');
    r.shortest = _.reduce(r.words, function(len,word){return word.length < len ? word.length : len},req.params.text.length);
    r.longest = _.reduce(r.words, function(len,word){return word.length > len ? word.length : len},0);
    r.first = r.words[0];
    r.last = _.last(r.words);
    rsp.json(r);
});
