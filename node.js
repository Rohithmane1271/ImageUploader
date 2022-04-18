//npm init --- package.json
// npmjs.com-
//npm i express
//npm i ejs (template engine => html+css+js + embedded in js)
// npm i body-parser
//npm i mysql
//npm i validator
//https://www.apachefriends.org/download.html  ---xampp download

/*
    drop table userinfo;
    truncate table userinfo;

    create table userinfo(
        id int auto_increment primary key,
        username varchar(100),
        usermobile BIGINT,
        useremail varchar(100),
        userpass varchar(100)
    );
*/
var validator = require('validator');
var mysql      = require('mysql');

var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    port:3306,
    password:"root123",
    database:"metiitmumbaiedac2021"
});

// console.log(connection);


const bodyParser = require('body-parser')
const express = require('express');

const app = express();
// console.log(app);
//register static files (css,js,images,videos,fonts)
app.use('/styles', express.static('css'));
app.use('/scripts', express.static('js'));

app.use(bodyParser.urlencoded({ extended: true }))

//register ejs template engine in ur express
app.set('view engine','ejs'); //views folder all files must be in ...

//http://localhost:4500/home
//http://localhost:4500/register
//http://localhost:4500/login
//http://localhost:4500/file

app.get("/home" , (req,res)=>{
    res.render("homePage");
});
app.get("/register" , (req,res)=>{
    res.render("registerPage");
});
app.get("/registerA" , (req,res)=>{
    res.render("registerPageAjax");
});

//access all data from register page
//<form action="/register-action" method="post">
app.post("/register-action",(req,res)=>{
    // console.log("exist");
    console.log(req.body); //undefined
    
    //{uname:'jjj',....}
    
    //validation process

    //name="uname"
    if(!validator.matches(req.body.uname, /^[a-zA-Z]([a-zA-Z ]+)?[a-zA-Z]$/ )){
        res.send({msg:"Name is Invalid"});
    }
    else if(validator.isEmpty(req.body.umobile) || !validator.isMobilePhone(req.body.umobile,'en-IN')){
        res.send({msg:"Mobile is Invalid"});
    }
    else if(validator.isEmpty(req.body.uemail) || !validator.isEmail(req.body.uemail)){
        res.send({msg:"Email is Invalid"});
    }
    else if( validator.isEmpty(req.body.upass) || !validator.isAlphanumeric(req.body.upass,'en-IN') || !validator.isLength(req.body.upass,{min:4,max:8}) ){
        res.send({msg:"Password is Invalid"});
    }
    else{
        //prepare insert query
        //127.0.0.1/phpmyadmin
        //yourip/phpmyadmin

        var sqlInsert = `
            insert into userinfo (
                username,usermobile,useremail,userpass
            ) values (
                '${req.body.uname}',
                '${req.body.umobile}',
                '${req.body.uemail}',
                '${req.body.upass}'
            )
        `;
        console.log(sqlInsert);

        //query execution
        connection.query(sqlInsert , function(err,results){
            if(!err){
                console.log(results);
                res.send({msg:"Record Added"})
            }
            else{
                console.log(err);
            }
        });       
    }

    //data insertion process in mongodb
    //https://localhost/phpmyadmin/
    
    // res.send({msg:"Route Exist"});


})


app.get("/showData" , (req,res)=>{
    // res.send({msg:"route exist"});
    var selectQ = `select * from userinfo `;
    connection.query(selectQ , function(err,results){
        if(!err){
            console.log(results);
            /*
                [
                    {
                        id:1,username:'x',usermobile:'90
                    },
                    {
                        id:2,username:'x',usermobile:'90
                    }
                ]
            */
           //lets transfer data from express to ejs
           if(results.length > 0){
                res.render('viewRecord' , {
                    x1:100,
                    x2:'test',
                    dataFromdb:results
                });
            }
        }
    });
});
app.get("/file" , (req,res)=>{

});

app.listen(4600,"localhost",()=>{
    console.log("running");
})