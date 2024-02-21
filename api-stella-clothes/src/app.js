const app = require('express')();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});


module.exports = app;