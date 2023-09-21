const con = require('./one');
const express = require('express');
const app = express();
// const app2nd = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
 process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
// const axios = require('axios');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


function generateRandom5DigitNumber() {
    const min = 10000; // Minimum 5-digit number (inclusive)
    const max = 99999; // Maximum 5-digit number (inclusive)

    // Generate a random number between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Establish the database connection (assuming you have the code for con.connect here)

app.get('/payment', function (req, res) {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Handle the form submission
app.post('/payment', function (req, res) {
    var random5DigitNumber = generateRandom5DigitNumber();
    var account_number = req.body.account_number;
    var bank_name = req.body.bank_name;
    var cnic = req.body.cnic;
    var currency = req.body.currency;
    var amount = req.body.amount;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var myHeaders = {
        "apikey": "8hb41iPvOxZOGRwjswhekoJbW9OvaI1O" // Replace with your actual API key
    };
    
    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };
    const apiUrl = `https://api.apilayer.com/exchangerates_data/convert?to=pkr&from=${currency}&amount=${amount}`;
    
    // Check  currency is USD or AED
    if (currency === 'USD' || currency === 'AED') {
        axios.get(apiUrl, requestOptions)
        .then(response => {
            currency='PKR'
            const pkrAmount = response.data.result; // PKR amount from the API response
                    
           
            var sql = 'INSERT INTO data (random5DigitNumber, account_number, bank_name, cnic, currency, amount, email, mobile) VALUES ?';
            var values = [
                [random5DigitNumber.toString(), account_number, bank_name, cnic, currency, pkrAmount, email, mobile]
            ];
        
            con.query(sql, [values], function (error, result) {
                if (error) {
                    res.status(505).render('505',{title:' 505 unsupported condition'})
                    // res.send("Error inserting data into the database.");
                } else {
                    console.log("Data inserted successfully");
                    res.status(200).render('200') 
                }
            });
        })
        .catch(error => {
            console.error('API Error:', error);
            res.status(500).render('')
            res.send("Error converting amount to PKR.");
        });
    } else {
        // Handle other currencies here (if needed)
        // Rest of your code for database insertion and response handling for other currencies
    }
});

// // app.post('/success',function(req,res){
//     // res.send("payment successful, thamkyou")
// })
app.get("*", (req, res) => {
    res.render('404', { title: '404 Not Found' });
});
app.listen(7002, function () {
    console.log('Server for root path is running on port 7002');
});

