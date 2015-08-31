/**
 * Created by davidlogan on 8/23/15.
 */
var express = require('express')
    , http = require('http')
    ,_     = require('underscore');
var app = express();

http.createServer(app).listen(5000, function(){
    console.log('Express server listening on port ' + 5000);
});

app.get('/', function (req, res) {
res.send('Hello WORD/n');
});


app.get('/service2/one/:text', function(req, rsp){
    "use strict";
    var r = {};
    //r.words = req.params.text.split(' ');
    var words = req.params.text.split(' ');
    r.shortest = _.reduce(words, function(len,word){return word.length < len ? word.length : len},req.params.text.length);
    r.longest = _.reduce(words, function(len,word){return word.length > len ? word.length : len},0);
    //r.first = r.words[0];
    //r.last = _.last(r.words);
    rsp.type('json');
    rsp.json(r);
});

app.get('/service2/all/:text', function(req, rsp){
    "use strict";
    var service1 = {
        host: "localhost",
        port: 8887,
        path: '/service1/one/' + encodeURIComponent(req.params.text),
        method: 'GET'
    };
    var service3 = {
        host: "localhost",
        port: 8889,
        path: '/service3/one/' + encodeURIComponent(req.params.text),
        method: 'GET'
    };

    var services = 0;
    var r = {};

    var words = req.params.text.split(' ');
    r.shortest = _.reduce(words, function(len,word){return word.length < len ? word.length : len},req.params.text.length);
    r.longest = _.reduce(words, function(len,word){return word.length > len ? word.length : len},0);

    rsp.type('json');

    var do_data = function(chunk) {
        _.extend(r, JSON.parse(chunk));
        if(++services == 2)
            rsp.json(r);
    };
    var do_error = function(serv) {
        if(!r.unavailable)
            r.unavailable = [serv];
        else
            r.unavailable.push(serv);
        if(++services == 2)
            rsp.json(r);
    };

    var req1 = http.request(service1, function(res) {
        res.setEncoding('utf8');
        res.on('data', do_data);
    });

    var req3 = http.request(service3, function(res) {
        res.setEncoding('utf8');
        res.on('data', do_data);
    });

    req1.on('error', function(e){do_error("service1")});
    req3.on('error', function(e){do_error("service3")});

    req1.end();
    req3.end();

});
