const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');
const app = express();

// accept response
app.use(express.json());
app.use(session({secret : 'Di@ryDaily1', saveUninitialized: false, resave: false}));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

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

// FUNCTION

// Check exist email
function checkEmail(email){
    return new Promise((resolve, reject) => {
        sqlGetUserEmail = "SELECT * FROM users WHERE email = ?";
        db.query(sqlGetUserEmail, [email] , function (err ,result, fields) {
            if (err) throw err;
            if(Array.isArray(result) && result.length > 0){
                reject('emailExist');
            }
            else{
                resolve('accept');
            }
        });
    });
}

// check exist username
function checkUsername(username){
    return new Promise((resolve, reject) => {
        sqlGetUserEmail = "SELECT * FROM users WHERE username = ?";
        db.query(sqlGetUserEmail, [username] , function (err ,result, fields) {
            if (err) throw err;
            if(Array.isArray(result) && result.length > 0){
                reject('usernameExist');
            }
            else{
                resolve('accept');
            }
        });
    });
}

// check valid password
function checkPassword(password){
    return new Promise((resolve, reject) => {
        if(password.length >= 6 && password.length <= 32){
            const passwordFilter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}])[A-Za-z\d !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}]{6,32}$/g;
            const isPasswordFiltered = passwordFilter.exec(password);
            if(!isPasswordFiltered){
                reject("passwordFailure")
            }
        }
        else{
            reject("passwordLength")
        }
        resolve("accept")
    });
}

// insert user to databse
function insertUser(params, hashedPassword){
    return new Promise((resolve, reject) => {

        sqlInsertUser = "INSERT INTO users (fullname, birthday, email, username, password) VALUES ?";
        var value = [
            [params.fullname, params.birthday, params.email, params.username, hashedPassword]
        ];
        db.query(sqlInsertUser, [value] ,function (err, result, fields) {
            if (err) throw err;
            if(result.affectedRows){
                resolve('Inserted '+result.affectedRows+' user.');
            }
            else{
                reject('UserInsertFailure');
            }
        });
    });
}

// check exist user
function checkUser(params){
    return new Promise((resolve, reject) => {
        sql = "SELECT * FROM users WHERE username = ? OR email = ?";
        db.query(sql, [params.input, params.input] , function (err ,result, fields) {
            if (err) throw err;
            if(Array.isArray(result) && result.length > 0){
                resolve(result);
            }
            else{
                reject('userNotExist');
            }
        });
    });
}

// set user session
function userSession(user_id, session_token){
    return new Promise((resolve, reject) => {
        sql = "UPDATE users SET session_token = ? WHERE user_id = ?";
        db.query(sql, [session_token, user_id] , function (err ,result, fields) {
            if (err) throw err;
            if(result.affectedRows){
                resolve(result.affectedRows);
            }
            else{
                reject('userSessionFailure');
            }
        });
    });
}

// check valid session of user
function checkSession(user_id, session_token){
    return new Promise((resolve, reject) => {
        sql = "SELECT session_token FROM users WHERE user_id = ?";
        db.query(sql, [user_id] , function (err ,result, fields) {
            if (err) {
                throw err;
            }
            if(result.length === 0){
                reject('accessForbidden403');
            }
            else if(result[0].session_token === null){
                reject('noSession');
            }
            else if(result[0].session_token !== session_token){
                reject('sessionRemoved');
            }
            else{
                resolve('sessionConfirmed');
            }
        });
    });
}

// clear session of user
function userSessionClear(user_id){
    return new Promise((resolve, reject) => {
        sql = "UPDATE users SET session_token = NULL WHERE user_id = ?";
        db.query(sql, [user_id] , function (err ,result, fields) {
            if (err) throw err;
            if(result.affectedRows){
                resolve(result.affectedRows);
            }
            else{
                reject('userNotLogin');
            }
        });
    });
}

// check exist diary
function checkDiary(user_id, date){
    return new Promise((resolve, reject) => {
        sql = "SELECT * FROM diaries WHERE user_id = ? AND date = ?";
        db.query(sql, [user_id, date] , function (err ,result, fields) {
            if (err) throw err;
            if(Array.isArray(result) && result.length > 0){
                resolve('update');
            }
            else{
                resolve('insert');
            }
        });
    });
}

// insert new diary to database
function insertDiary(user_id, params){
    return new Promise((resolve, reject) => {

        sql = "INSERT INTO diaries (date, title, content, user_id) VALUES ?";
        var value = [
            [params.date, params.title, params.content, user_id]
        ];
        db.query(sql, [value] , function (err ,result, fields) {
            if (err) throw err;
            if(result.affectedRows){
                resolve(result.affectedRows);
            }
            else{
                reject('insertDiaryFailure');
            }
        });
    });
}

// update exist diary in database
function updateDiary(user_id, params){
    return new Promise((resolve, reject) => {
        sql = "UPDATE diaries SET title = ?, content = ? WHERE user_id = ? AND date = ?";
        db.query(sql, [params.title, params.content, user_id, params.date] , function (err ,result, fields) {
            if (err) throw err;
            if(result.affectedRows){
                resolve(result.affectedRows);
            }
            else{
                reject('updateDiaryFailure');
            }
        });
    });
}

// get diary entries by date and quartal
function getDiaryEntries(user_id, params, query){
    return new Promise((resolve, reject) => {
        var quartal = [];
        var sqlPagination = '';
        switch (params.quartal) {
            case '1':
                quartal.push(1, 3);
                break;
            case '2':
                quartal.push(4, 6);
                break;
            case '3':
                quartal.push(7, 9);
                break;
            case '4':
                quartal.push(10, 12);
                break;
        }
        if(query.limit && query.offset){
            var limit = query.limit;
            var offset = query.offse;
            sqlPagination += 'LIMIT '+ query.limit +' OFFSET '+query.offset;
        }
        
        sql = "SELECT * FROM diaries WHERE user_id = ? AND YEAR(date) = ? AND (MONTH(date) >= ? AND MONTH(date) <= ?) ORDER BY date ASC " + sqlPagination;
        db.query(sql, [user_id, params.year, quartal[0], quartal[1]] , function (err ,result, fields) {
            if (err) throw err;
            resolve(result);
        });
    });
}

// VIEWS

// Generate Login Page
app.get('/', (req, res) => {
    res.render('index.html');
    // res.status(200).send('Welcome to API');
});

// Generate Register Page
app.get('/register', (req, res) => {
    res.render('register.html');
    // res.status(200).send('Welcome to API');
});

// Generate Save Diary Page
app.get('/diary',async (req, res) => {
    try{
        const session_check = await checkSession(req.session.user_id, req.session.id)
        res.render('diary.html');
    }
    catch(err){
        if (err === 'sessionRemoved'){
            res.status(401);
            res.json({
                success: false,
                message: "You have been login in other device. Only 1 device geting access."
            });
        }
        else if(err === 'accessForbidden403'){
            res.status(403);
            res.json({
                success: false,
                message: 'You have no access in this page.'
            });    
        }
        else{
            res.status(500);
            res.json({
                success: false,
                message: "Internal Error 500",
                error: err
            });
        }
    }
});


// USER ENDPOINTS

// Register user
app.post('/user/register', async (req, res) => {
    try{
        user_fullname = req.body.fullname; 
        user_birthday = req.body.birthday; 
        user_email = req.body.email; 
        user_username = req.body.username; 
        user_password = req.body.password; 

        const emailResult = await checkEmail(user_email);
        const usernameResult = await checkUsername(user_username);
        const passwordResult = await checkPassword(user_password);
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user_password, salt);
        // INSERT NEW USER
        const user = await insertUser(req.body, hashedPassword);
        
        res.status(200);
        res.json({
            success: true,
            message: "Success register new user."
        });
    }
    catch (err){
        if(err === 'emailExist'){
            res.status(400);
            res.json({
                success: false,
                message: "Registered email already exist. Please use other email."
            });
        }
        else if(err === 'usernameExist'){
            res.status(400);
            res.json({
                success: false,
                message: "Username already taken. Please try another username."
            });
        }
        else if(err === 'passwordLength'){
            res.status(400);
            res.json({
                success: false,
                message: "Password must have length between 6-32 characters."
            });
        }
        else if(err === 'passwordFailure'){
            res.status(400);
            res.json({
                success: false,
                message: "Password must have contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and one special character."
            });
        }
        else if(err === 'insertUserFailure'){
            res.status(400);
            res.json({
                success: false,
                message: "Failure occured when registering new user."
            });
        }
        else{
            res.status(500);
            res.json({
                success: false,
                message: "Internal Error 500",
                error: err,
            });
        }
    }
});

// Logout From System
app.put('/user/logout', async (req, res) => {
    try{
        const user = await userSessionClear(req.session.user_id);
        req.session.destroy((err) =>{
            if (err) throw err;
        });
        res.json({
            'success' : true,
            'message' : 'Log out success'
        });
    }
    catch(err){
        if(err === 'userNotLogin'){
            res.status(400);
            res.json({
                success : false,
                message: 'You have not been login.',
            })
        }
        else{
            res.status(500);
            res.json({
                success : false,
                message: 'Internal Server error',
                error: err
            })
        }
    }
});

// Login Into System
app.put('/user/login', async (req, res) => {
    try{
        const user = await checkUser(req.body);
        const comparePassword = await bcrypt.compare(req.body.password, user[0].password);
        if( comparePassword ){
            // create session
            req.session.id = await bcrypt.hash(user[0].username, 10);
            req.session.user_id = user[0].user_id;
            req.session.username = user[0].username;
            
            const grantedSession = await userSession(req.session.user_id, req.session.id);

            res.status(200)
            res.json({
                success : true,
                message : "Access Granted."
            });
        }else{
            throw 'userNotExist';
        }
        
    }catch(err){
        if(err === 'userNotExist'){
            res.status(400)
            res.json({
                success : false,
                message : "Username or password is incorrect."
            });
        }
        else if(err === 'userSessionFailure'){
            res.status(400)
            res.json({
                success : false,
                message : "Failure occured when login."
            });
        }
        else{
            res.status(500)
            res.json({
                success : false,
                message : "internal sever error 500",
                error : err
            });
        }
    }
});


// DIARY ENDPOINTS

// Save diary into database
app.put('/diary/save', async (req, res) => {
    try{
        message = "";

        const session_check =  await checkSession(req.session.user_id, req.session.id);

        const diary_status = await checkDiary(req.session.user_id, req.body.date); //user id check from session
        
        if(diary_status === 'update'){
            const diary = await updateDiary(req.session.user_id, req.body);
            message = 'Diary updated.';
        }
        else if(diary_status === 'insert'){
            const diary = await insertDiary(req.session.user_id, req.body);
            message = 'Diary created.';
        }

        res.status(200);
        res.json({
            success: true,
            message: message
        });

    }catch(err){
        if (err === 'sessionRemoved'){
            res.status(401);
            res.json({
                success: false,
                message: "You have been login in other device. Only 1 device geting access."
            });
        }
        else if (err === 'insertDiaryFailure'){
            res.status(400);
            res.json({
                success: false,
                message: "Failure occured when save a new diary."
            });
        }
        else if (err === 'updateDiaryFailure'){
            res.status(400);
            res.json({
                success: false,
                message: "Failure occured when save a diary saved."
            });
        }
        else if(err === 'accessForbidden403'){
            res.status(403);
            res.json({
                success: false,
                message: 'You have no access in this page.'
            });    
        }
        else{
            res.status(500);
            res.json({
                success: false,
                message: "Internal Error 500",
                error: err
            });
        }
    }
});

// Show diary based on year and quartal
app.get('/diary/:year/:quartal', async (req, res) => {
    try{
        const session_check = await checkSession(req.session.user_id, req.session.id);
        const diaries = await getDiaryEntries(req.session.user_id, req.params, req.query);
        res.status(200);
        res.json({
            total: diaries.length,
            data: diaries
        });
        
    }catch(err){
        if(err === 'noData'){
            res.status(200);
            res.json({
                success: true,
                message: "No Data",
            });    
        }
        else if (err === 'sessionRemoved'){
            res.status(401);
            res.json({
                success: false,
                message: "You have been login in other device. Only 1 device geting access."
            });
        }
        else if(err === 'accessForbidden403'){
            res.status(403);
            res.json({
                success: false,
                message: 'You have no access in this page.'
            });    
        }
        else{
            res.status(500);
            res.json({
                success: false,
                message: "Internal Error 500"
            });
        }
    }
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })

var server = app.listen(3000, () => {
    var host = server.address().address;
    console.log(host);
    var port = server.address().port;
    console.log('Listening on::::::::::%s:%s', host, port);
});

