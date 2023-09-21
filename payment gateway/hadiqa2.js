const con = require('./one');
const express = require('express');
const app2nd = express();
const path = require('path');
const bodyParser = require('body-parser');
app2nd.use(bodyParser.json());
app2nd.use(bodyParser.urlencoded({ extended: true }));
app2nd.set('view engine', 'ejs');





app2nd.get('/transactions', function (req, res) {
    // Your route handling code here

    
    var sql = 'SELECT * FROM data ';
    con.query(sql,  function (error, result) {
        if (error) {
            res.status(505).render('505',{title:' 505 unsupported condition'})
            console.error(error);
            
        } else {
            res.render('students', { students: result });
        }
    });
});
app2nd.get("*", (req, res) => {
    res.render('404', { title: '404 Not Found' });
});
app2nd.listen(7007, function () {
    console.log('Server is running on port 7007');
});
