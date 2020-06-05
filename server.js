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
        // email = "raykonji@gmail.com";
        // message = null;
        // const emailResult = await checkEmail(email);
        
        // res.status(201);
        // res.json({
        //     message : 'email not exist. you may register'
        // });
        var pass = [
            'Pint@r1', 
            'Pint@r2', 
            'Pint@r3', 
            'Pint@r4', 
            'Pint@r5', 
            'Pint@r6', 
            'R@ykonji1', 
            'M@gister1', 
            'Ju@an1', 
            'Y@sin1', 
        ]
        pass.forEach(async (el) => {
            const hashedPassword = await bcrypt.hash(el, 10);
            console.log( el + ' => ' + hashedPassword );
        })

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
            if(Array.isArray(result) && result.length > 0){
                reject('emailExist');
            }
            else{
                resolve('accept');
            }
        });
    });
}

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

function insertUser(params, hashedPassword){
    return new Promise((resolve, reject) => {

        sqlInsertUser = "INSERT INTO users (fullname, birthday, email, username, password) VALUES ?";
        var value = [
            [user_fullname, user_birthday, user_email, user_username, hashedPassword]
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

function checkUser(params){
    return new Promise((resolve, reject) => {
        sql = "SELECT * FROM users WHERE username = ? OR email = ?";
        db.query(sql, [params.input, params.input] , function (err ,result, fields) {
            if (err) throw err;
            console.log(params);
            if(Array.isArray(result) && result.length > 0){
                resolve(result);
            }
            else{
                reject('userNotExist');
            }
        });
    });
}

// ATTENTION : MODIFY REJECT ERROR HANDLER
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

function userSessionClear(user_id){
    return new Promise((resolve, reject) => {
        sql = "UPDATE users SET session_token = NULL WHERE user_id = ?";
        db.query(sql, [user_id] , function (err ,result, fields) {
            if (err) throw err;
            if(result.affectedRows){
                resolve(result.affectedRows);
            }
            else{
                reject(result.affectedRows);
            }
        });
    });
}

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

function insertDiary(params){
    return new Promise((resolve, reject) => {

        sql = "INSERT INTO diaries (date, title, content, user_id) VALUES ?";
        var value = [
            [params.date, params.title, params.content, params.user_id]
        ];
        db.query(sql, [value] , function (err ,result, fields) {
            if (err) throw err;
            if(result.affectedRows){
                resolve(result.affectedRows);
            }
            else{
                reject(result.affectedRows);
            }
        });
    });
}

function updateDiary(params){
    return new Promise((resolve, reject) => {
        sql = "UPDATE diaries SET title = ?, content = ? WHERE user_id = ? AND date = ?";
        db.query(sql, [params.title, params.content, params.user_id, params.date] , function (err ,result, fields) {
            if (err) throw err;
            if(result.affectedRows){
                resolve(result.affectedRows);
            }
            else{
                reject(result.affectedRows);
            }
        });
    });
}

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
        // console.log(params.quartal);
        if(query.limit && query.offset){
            var limit = query.limit;
            var offset = query.offse;
            sqlPagination += 'LIMIT '+ query.limit +' OFFSET '+query.offset;
        }
        
        sql = "SELECT * FROM diaries WHERE user_id = ? AND YEAR(date) = ? AND (MONTH(date) >= ? AND MONTH(date) <= ?) ORDER BY date ASC " + sqlPagination;
        console.log(sql);
        db.query(sql, [user_id, params.year, quartal[0], quartal[1]] , function (err ,result, fields) {
            if (err) throw err;
            console.log(result)
            resolve(result);
        });
    });
}

// API
app.get('/', (req, res) => {
    res.render('index.html');
    // res.status(200).send('Welcome to API');
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

        const emailResult = await checkEmail(user_email);
        const usernameResult = await checkUsername(user_username);
        const passwordResult = await checkPassword(user_password);
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user_password, salt);
        // INSERT NEW USER
        const user = await insertUser(req.body, hashedPassword);
        
        res.status(201);
        res.json({
            success: true,
            message: "Success register new user."
        });
    }
    catch (err){
        // console.log(err);
        if(err === 'emailExist'){
            res.status(200);
            res.json({
                success: false,
                message: "Registered email already exist. Please use other email."
            });
        }
        else if(err === 'usernameExist'){
            res.status(200);
            res.json({
                success: false,
                message: "Username already taken. Please try another username."
            });
        }
        else if(err === 'passwordLength'){
            res.status(200);
            res.json({
                success: false,
                message: "Password must have length between 6-32 characters."
            });
        }
        else if(err === 'passwordFailure'){
            res.status(200);
            res.json({
                success: false,
                message: "Password must have contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and one special character."
            });
        }
        else if(err === 'insertUserFailure'){
            res.status(200);
            res.json({
                success: false,
                message: "Failure occured when regiserting new user."
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

app.get('/session', async (req, res) => {
    try{
        console.log(req.session.id);
        const session_check = await checkSession(req.session.user_id, req.session.id);
        res.json({
            'id' : req.session.id,
            'user_id' : req.session.user_id,
            'username' : req.session.username
        });
    }
    catch(err){
        console.log(err);
        if(err ==='accessForbidden403'){
            res.status(401);
            res.json({
                success : false,
                message: 'You have no access in this page.'
            });
        }
        else if(err ==='noSession'){
            res.status(201);
            res.json({
                success : false,
                message: 'No session.'
            });
        }
        else if(err ==='sessionRemoved'){
            res.status(201);
            res.json({
                success : false,
                message: '1 device only. You have been login on another device'
            });
        }
        else{
            res.status(500);
            res.json({
                success : false,
                message: 'internal server error 500'
            });
        }
    }
});

app.get('/logout', async (req, res) => {
    try{
        const user = await userSessionClear(req.session.user_id);
        req.session.destroy((err) =>{
            if (err) throw err;
        });
        res.json({
            'message' : 'no session'
        });
    }
    catch(err){
        if(err === 0){
            res.status(500);
            res.json({
                success : false,
                message: 'You have not been login ',
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

app.post('/diary/login', async (req, res) => {
    try{
        const user = await checkUser(req.body);
        const comparePassowrd = await bcrypt.compare(req.body.password, user[0].password);
        if( comparePassowrd ){
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
            res.status(200)
            res.json({
                success : false,
                message : "Username or password is incorrect."
            });
        }
        
    }catch(err){
        // console.log(err);
        if(err === 'userNotExist'){
            res.status(200)
            res.json({
                success : false,
                message : "Username or password is incorrect."
            });
        }
        else if(err === 'userSessionFailure'){
            res.status(200)
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

app.post('/diary/save', async (req, res) => {
    try{
        message = "";

        const session_check =  await checkSession(req.session.user_id, req.session.id);

        const diary_status = await checkDiary(req.session.user_id, req.body.date); //user id check from session
        
        if(diary_status === 'update'){
            const diary = await updateDiary(req.body);
            message = 'Diary updated.';
        }
        else if(diary_status === 'insert'){
            const diary = await insertDiary(req.body);
            message = 'Diary created.';
        }

        res.status(200);
        res.json({
            success: true,
            message: message
        });

    }catch(err){
        // console.log(err);
        if (err === 'sessionRemoved'){
            res.status(401);
            res.json({
                success: false,
                message: "You have been login in other device. Only 1 device geting access."
            });
        }
        else if (err === 0){
            res.status(200);
            res.json({
                success: false,
                message: "No diary to be saved."
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
        console.log(err)
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


app.listen(3000)