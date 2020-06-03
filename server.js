const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const app = express();

// accept response
app.use(express.json());

// Database Connection
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "diary_daily_db"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// INSERT MULTIPLE VALUES
app.post('/migrate/users', async (req, res) => {
    
    let sql = "INSERT INTO users (fullname, birthday, email, username, password) VALUES ?";

    // let pass1 = await bcrypt.hash('password1', 10);
    // let pass2 = await bcrypt.hash('password2', 10);
    // let pass3 = await bcrypt.hash('password3', 10);
    // let pass4 = await bcrypt.hash('password4', 10);
    // let pass5 = await bcrypt.hash('password5', 10);
    // let pass6 = await bcrypt.hash('password6', 10);

    var values = [
        ['aba ba', '1994-03-12', 'nama1@gmail.com', 'pintar1', pass1],
        ['abi bu', '1993-12-26', 'nama2@gmail.com', 'pintar2', pass2],
        ['abi bi', '2000-08-07', 'nama3@gmail.com', 'pintar3', pass3],
        ['caka ca', '1997-01-09', 'nama4@gmail.com', 'pintar4', pass4],
        ['caka ci', '1995-03-13', 'nama5@gmail.com', 'pintar5', pass5],
        ['caka cu', '2005-06-19', 'nama6@gmail.com', 'pintar6', pass6]
    ];
    db.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    }); 
});

// MIGRATE DIARY
app.get('/migrate/diaries', async (req, res) => {
    try{
        let sql = "INSERT INTO diaries (date, title, content, user_id) VALUES ?";
    
        var values = [
            ['2020-02-03', 'test diary yang pertama', 'test isi content yang pertama', 7],
            ['2020-02-03', 'berawal dari sebuah pertemuan', 'test bertemu teman sepermainan', 8],
            ['2020-02-04', 'hari terakhir sekolah', 'test isi content yang kedua ', 8],
            ['2020-03-07', 'senantiasa menaklukan kejahatan', 'test isi content yang ketiga', 8],
            ['2020-03-09', 'In food we trust', 'test isi content yang keempat', 9],
            ['2020-03-13', 'Tenaga kesehatan di bantu warga', 'test isi content yang kelima', 12],
            ['2020-04-19', 'Olahraga hari minggu', 'test isi content yang keenam', 12]
        ];
        db.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            res.status(201).send("Number of records inserted: " + result.affectedRows);
        }); 
    }
    catch{
        res.status(500).send("Failed");
    }
});

// PLAYGROUND
app.get('/test', async (req, res) => {
    try{
        email = "raykonji@gmail.com";
        message = null;
        const emailResult = await checkEmail(email);
        
        res.status(201);
        res.json({
            message : 'email not exist. you may register'
        });
    }catch (err){
        console.log(err);
        if(err === 'emailExist'){
            res.status(201);
            res.json({
                message : 'email exist. you cannot register'
            });
        }
        else{
            res.status(500).send('Internal server error 500')
        }
    }
});

// FUNCTION

function checkEmail(email){
    return new Promise((resolve, reject) => {
        sqlGetUserEmail = "SELECT * FROM users WHERE email = ?";
        db.query(sqlGetUserEmail, [email] , function (err ,result, fields) {
            if (err) throw err;
            // console.log('================ result ================')
            console.log(result)
            if(Array.isArray(result) && result.length > 0){
                reject('emailExist');
            }
            else{
                resolve('emailNotExist');
            }
        });
    });
}

function checkUsername(username){
    return new Promise((resolve, reject) => {
        sqlGetUserEmail = "SELECT * FROM users WHERE username = ?";
        db.query(sqlGetUserEmail, [username] , function (err ,result, fields) {
            if (err) throw err;
            // console.log('================ result ================')
            console.log(result)
            if(Array.isArray(result) && result.length > 0){
                reject('usernameExist');
            }
            else{
                resolve('usernameNotExist');
            }
        });
    });
}

// API
app.get('/', (req, res) => {
    res.status(200).send('Welcome to API');
});

app.get('/diary/users', (req, res) => {
    try{
        let sql = "SELECT * FROM users";
    
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.status(201);
            res.json(result);
        });
    }
    catch{
        res.status(500).send("Failed");
    }
});

app.get('/diary/diaries', (req, res) => {
    try{
        let sql = "SELECT * FROM diaries";
    
        db.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.status(200);
            res.json(result);
        });
    }
    catch{
        res.status(500).send("Failed");
    }
});

app.post('/diary/register', async (req, res) => {
    try{
        user_fullname = req.body.fullname; 
        user_birthday = req.body.birthday; 
        user_email = req.body.email; 
        user_username = req.body.username; 
        user_password = req.body.password; 

        // Query
        sqlGetUserEmail = "SELECT * FROM users WHERE email = \""+ user_email+"\"";
        sqlGetUserUsername = "SELECT * FROM users WHERE username = \""+user_username+"\"";
        sqlInsertUser = "INSERT INTO users (fullname, birthday, email, username, password) VALUES ?";

        isFailed = false;
        message = "";
        
        const emailResult = await checkEmail(user_email);
        // const emailResult = await db.query(sqlGetUserEmail);
        // console.log('==================== emailResult ========================');
        // console.log(emailResult);
        // if(emailResult){
        //     isFailed = true;
        //     message += "Registered email already exist. Please use other email."
        // }

        const usernameResult = await checkUsername(user_username);

        // const usernameResult = await db.query(sqlGetUserUsername);
        // console.log('==================== usernameResult ========================');
        // console.log(usernameResult);
        // if(usernameResult){
        //     isFailed = true;
        //     message += "\nUsername already taken. Please try another username."
        // }

        if(user_password.length > 6 && user_password.length < 32){
            const passwordFilter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}])[A-Za-z\d !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}]{6,32}$/g;
            const isPasswordFiltered = passwordFilter.exec(user_password);
            if(!isPasswordFiltered){
                isFailed = true;
                message += "\nPassword must have contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and one special character."
            }
        }
        else{
            isFailed = true
            message += "\nPassword must have length between 6-32 characters." 
        }

        if(isFailed){
            res.status(201);
            res.json({
                success: false,
                message: message,
            });
        }
        else{
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(user_password, salt)

            // INSERT SQL
            var value = [
                [user_fullname, user_birthday, user_email, user_username, hashedPassword]
            ];
            db.query(sqlInsertUser, [value] ,function (err, result, fields) {
                if (err) throw err;
                res.status(201);
                res.json({
                    success: true,
                    message: "Success register new user."
                });
            });
        }
    }
    catch (err){
        res.status(500);
        res.json({
            success: false,
            message: "Internal Error 500"
        });
    }
});


app.listen(3000)