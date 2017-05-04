var express = require('express')
var path = require('path')
var app = express()
var distPath = path.resolve(__dirname + '/../dist')

app
    .use('/dist', express.static(distPath))
    .get('/api/test', function (req, res) {
        res.send({
            response: 'endpoint tested'
        })
    })
    .get('/api/test', function (req, res) {
        res.send({
            response: 'endpoint tested'
        })
    })
    .get('*', function (req, res) {
        res.sendFile(path.join(distPath, 'index.html'))
    });

app.listen(3000, function () {
    console.log('app listening on port 3000')
});