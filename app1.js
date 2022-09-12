const express = require("express");
const bodyparser = require("body-parser");
const { render } = require("ejs");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
var _ = require('lodash');

const app = express();

app.set("view engine" , "ejs");

app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));



const connection = mysql.createConnection({
    host:"localhost",
    port:3308,
    user:"root",
    password:"",
    database: "bmsar_db"
});
connection.connect(function(error) {
    if(error) throw error;
    else console.log("Connected to DB successfully")
});


var transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'bmscearena@gmail.com',                                                                                  pass:'arenabmsce'
    }
});



app.get("/" , function(req,res){
    usn = "";
    password = "";
    res.render("login",{title:" Log-In",usnerror:"" , passworderror:"" , usnvalue:"" , passwordvalue:"", loginName:"ADMIN LOGIN" , loginAddress: "adminLogin"});
});


var usn;
var password;


// 1


//  app.post("/eventsList", function(req,res) {

//     usn = req.body.usn;   
//     password = req.body.password;

//     console.log(usn);
//     console.log(password);

//     if (usn==""&&password=="") {
//         res.render("login",{title:" Log-In", usnerror:"*****this is required*****" , passworderror:"*****This is required*****" , usnvalue:"" , passwordvalue:"",loginAddress:"eventsList",loginName:"ADMIN LOGIN"});
//         //res.redirect("/login",{title:" Log-In", usnerror:"*****this is required*****" , passworderror:"*****This is required*****" , usnvalue:"" , passwordvalue:""});
//     } 
//     else if(usn==""){
//         res.render("login",{title:" Log-In",usnerror:"*****this is required*****", passworderror:"" , usnvalue:"" , passwordvalue:password, loginAddress:"eventsList",loginName:"ADMIN LOGIN"});
//     }
//     else if(password==""){
//         res.render("login",{title:" Log-In",usnerror:"", passworderror:"*****this is required*****" , usnvalue:usn, passwordvalue:"", loginAddress:"eventsList",loginName:"ADMIN LOGIN"});
//     }
//     else{
//     res.render("eventsList", {title:"-events list", loginName:usn , loginAddress:"eventsList"});
//     }

// });



//2



 app.post("/eventsList", function(req,res) {

    

    usn = req.body.usn;   
    password = req.body.password;

    console.log(usn);
    console.log(password);

    if (usn==""&&password=="") {
        res.render("login",{title:" Log-In", usnerror:"*****this is required*****" , passworderror:"*****This is required*****" , usnvalue:"" , passwordvalue:"" , loginAddress:"eventsList",loginName:"ADMIN LOGIN"});
    } 
    else if(usn==""){
        res.render("login",{title:" Log-In",usnerror:"*****this is required*****", passworderror:"" , usnvalue:"" , passwordvalue:password , loginAddress:"eventsList",loginName:"ADMIN LOGIN" });
    }
    else if(password==""){
        res.render("login",{title:" Log-In",usnerror:"", passworderror:"*****this is required*****" , usnvalue:usn, passwordvalue:"" , loginAddress:"eventsList",loginName:"ADMIN LOGIN"});
    }
    else {

              connection.query("SELECT * FROM event_date, admin_events WHERE event_date.event_id=admin_events.event_id and (reg_start<curdate() and  reg_due>curdate())",function(error,results,fields){
    
               events_for_reg = JSON.parse(JSON.stringify(results));  //MAIN ARRAY
        });
       
        connection.query("select * from user_login where usn= ? and passw = ?",[usn,password],function(error,results,fields){
            if(results.length > 0)
            {
                res.render("eventsList", {title:"-events list",loginName:usn , loginAddress:usn  , Events_array :events_for_reg });
            }
                else
            {
                res.render("login",{title:" Log-In", usnerror:"*****Incorrect Username or Password*****" , passworderror:"" , usnvalue:"" , passwordvalue:"" , loginName:"ADMIN LOGIN" , loginAddress:"adminLogin"});
            }
                res.end();
        });
    }
});

let Events_array = [] ;
var events_for_reg;
// connection.query("SELECT * FROM event_date, admin_events WHERE event_date.event_id=admin_events.event_id and (reg_start<curdate() and  reg_due>curdate())",function(error,results,fields){
    
//      events_for_reg = JSON.parse(JSON.stringify(results));  //MAIN ARRAY
// });
     
    //  console.log("AVAREG ERROR : "+error);

    //  console.log(events_for_reg[0]);
    //  Dis_Date = events_for_reg[0].reg_due;
    //  Dis_ename = events_for_reg[0].event_name;
    //  Dis_edesc = events_for_reg[0].event_desc;
    //  Dis_eid = events_for_reg[0].event_id;
    //  console.log(Dis_Date);
    //  console.log(Dis_ename);
    //  console.log(Dis_edesc);




app.get("/eventsList" , function(req,res){
    res.render("eventsList",{title:"-eventslist", loginName:usn,loginAddress:"eventsList" , Events_array :events_for_reg });
});

app.get("/registration" , function(req,res){
    res.render("registration",{title:"-event_Registration",loginName:usn, pptext:"" , fnamevalue:"",lnamevalue :"",yearvalue : "" , mailvalue : "" , branchvalue:"" , usnvalue:"", loginName:usn ,loginAddress:"registration"});
});


app.get("/upcoming" , function(req,res) {
    res.render("upcoming", {title:"-upcoming",loginName:usn,loginAddress:"upcoming"});
});

app.get("/gallery" , function(req,res){
    res.render("gallery",{title:"-gallery",loginName:usn,loginAddress:"gallery"});
});

app.get("/achivements" , function(req,res){
    res.render("achivements",{title:"-achivements",loginName:usn,loginAddress:"achivements"});
});




//GET REGISTRATION


app.get("/registration/:Event_forms" , function(req,res){

    // 1 add query to get details and date then display it


    // let Event_Name  = _.lowerCase(req.params.Event_forms);

    let Event_Id = req.params.Event_forms;
    


    //with query get the evename and pass it
    let Event_Name = "";
    let Event_RegisStart = "";
    let Event_RegisDue = "";
    let Event_Date = "";






    console.log(Event_Name);

    res.render("registration",{title:"-event_Registration",loginName:usn, pptext:"" , fnamevalue:"",lnamevalue :"",yearvalue : "" , mailvalue : "" , branchvalue:"" , usnvalue:"", loginName:usn ,loginAddress:"registration"  , Regis_Ename : Event_Name , Regis_Eid : Event_Id});
});




app.get("/response" , function(req,res){
 F_name ="";
L_name ="";
Y_ear ="";
U_sn ="";
B_ranch ="";
M_ail ="";

    res.render("response" ,  {title:"-Regis_Responsel" , Fname:"" , Lname:"" , Year:Y_ear , Usn:U_sn , Branch : B_ranch , Mail:M_ail , loginAddress:"response",loginName:usn});
})





// POST REGISTRATION

app.post("/registration/response/:Event_response" , function(req,res){

// F_name ="";
// L_name ="";
// Y_ear ="";
// U_sn ="";
// B_ranch ="";
// M_ail ="";



//  query to add data using eventid and usn


   let Eventid_response = req.params.Event_response;

   console.log("response.........."+Eventid_response);


    F_name = req.body.fname;
    L_name = req.body.lname;
    Y_ear = req.body.year;
    U_sn = req.body.usn;
    B_ranch = req.body.branch;
    M_ail = req.body.mail;

    if(F_name==""||L_name==""||Y_ear==""||U_sn==""||B_ranch==""||M_ail==""){
        res.render("registration",{title:"-event_Registration",loginName:usn , pptext:"***Please fill all the user credentials***" , fnamevalue:F_name ,lnamevalue :L_name,yearvalue :Y_ear , mailvalue :M_ail , branchvalue:B_ranch , usnvalue:U_sn , loginName:usn,loginAddress:"response"});
    }
    else{
        if(U_sn.length==10){
            connection.query("select * from user_reg where usn=?",[U_sn],function(error,results,fields){
                console.log(results)
                if(results.length>0)
                res.render("registration",{title:"-event_Registration",loginName:usn , pptext:"***User has already registered***" , fnamevalue:F_name ,lnamevalue :L_name,yearvalue :Y_ear , mailvalue :M_ail , branchvalue:B_ranch , usnvalue:U_sn , loginName:usn   ,  loginAddress:"response" });
                else
                {
                connection.query("insert into user_reg values(?, ?, ?, ?, ?, ?)",[F_name,L_name,Y_ear,U_sn,B_ranch,M_ail],function(error,results,fields){
                res.render("response", {title:"-Regis_Responsel",loginName:usn , Fname:F_name , Lname:L_name , Year:Y_ear , Usn:U_sn , Branch : B_ranch , Mail:M_ail  , loginName:usn , loginAddress:"response"});
           });
        }
        });
            var mailOptions= {
                from : 'bmscearena@gmail.com',
                to: M_ail,
                subject:'Successfull Registration',
                text:'Congratulations on successfully registering in this event. \n All the best'
            };
            transporter.sendMail(mailOptions,function(error, info){
                if(error)
                console.log(error);
                else
                console.log('Email sent: '+info.response);
            });
        }
        else
        res.render("registration",{title:"-event_Registration",loginName:usn , pptext:"***Incorrec USN kidnly check***" , fnamevalue:F_name ,lnamevalue :L_name,yearvalue :Y_ear , mailvalue :M_ail , branchvalue:B_ranch , usnvalue:U_sn , loginName:usn , loginAddress:"response"});       
}
});







// // POST ===> RESPONSE

// app.post("/response" , function(req,res){

// //     F_name ="";
// // L_name ="";
// // Y_ear ="";
// // U_sn ="";
// // B_ranch ="";
// // M_ail ="";

//     F_name = req.body.fname;
//     L_name = req.body.lname;
//     Y_ear = req.body.year;
//     U_sn = req.body.usn;
//     B_ranch = req.body.branch;
//     M_ail = req.body.mail;

//     if(F_name==""||L_name==""||Y_ear==""||U_sn==""||B_ranch==""||M_ail==""){
//         res.render("registration",{title:"-event_Registration",loginName:usn , pptext:"***Please fill all the user credentials***" , fnamevalue:F_name ,lnamevalue :L_name,yearvalue :Y_ear , mailvalue :M_ail , branchvalue:B_ranch , usnvalue:U_sn,loginName:usn,loginAddress:"response"});
//     }
//     else{
//     res.render("response", {title:"-Regis_Responsel",loginName:usn , Fname:F_name , Lname:L_name , Year:Y_ear , Usn:U_sn , Branch : B_ranch , Mail:M_ail,loginAddress:"response"});
// }
    
// });





// *********************************************    ADMIN    **************************************************************





//  ADMIN Log-in
app.get("/adminLogin" ,function(req,res){
    res.render("AdminLogin", { title:" -ADMIN LOGIN", adminerror:"" , adminpassworderror:"" , adminvalue:"" , adminpasswordvalue:"", loginName:"STUDENT LOGIN" ,loginAddress:""});
});



app.get("/AdmineventsList", function(req,res){
    res.render("AdmineventsList",{title:" -ADMIN AddEvents", loginName:Aname , loginAddress:"AdmineventsList", EventIdvalue:E_ventId , EventNameValue:E_ventName , StartDateValue:S_tartDate , DueDateValue:D_ueDate , EventDetailsValue: E_ventDetails ,EveDateValue:E_ventDate ,EVEerror:""})
});
// the value assinged can be left blank as they dont depict any value! unless we have a post route hit atleast once!




var Aname;
var Apassword;


// ADMIN Home-page // adding events
app.post("/AdmineventsList" , function(req,res){
     Aname = req.body.adminname;
     Apassword = req.body.adminpassword;


    console.log("A:"+Aname);
    console.log("A:"+Apassword);

    if(Aname==""&&Apassword==""){
        res.render("AdminLogin",{title:" -ADMIN LOGIN", adminerror:"*****this is required*****" , adminpassworderror:"*****this is required*****" , adminvalue:"" , adminpasswordvalue:"", loginName:"STUDENT LOGIN" ,loginAddress:""});
    }else if(Aname==""){
        res.render("AdminLogin",{title:" -ADMIN LOGIN", adminerror:"*****this is required*****" , adminpassworderror:"" , adminvalue:"" , adminpasswordvalue:Apassword, loginName:"STUDENT LOGIN" ,loginAddress:""});
    }else if(Apassword==""){
        res.render("AdminLogin",{title:" -ADMIN LOGIN", adminerror:"" , adminpassworderror:"*****this is required*****" , adminvalue:Aname, adminpasswordvalue:"", loginName:"STUDENT LOGIN" ,loginAddress:""});
    }else{
        connection.query("select * from admin_login where user_name= ? and passw = ?",[Aname,Apassword],function(error,results,fields){
        if(results.length > 0)
            {
                res.render("AdmineventsList",{title:" -ADMIN AddEvents", loginName:Aname , loginAddress:"AdmineventsList", EventIdvalue:"" , EventNameValue:"" , StartDateValue:"" , DueDateValue:"" , EventDetailsValue:"",EVEerror:"",EveDateValue:"" });
            }
        else{
            res.render("AdminLogin",{title:" -ADMIN LOGIN", adminerror:"" , adminpassworderror:"Incorrect user name or Password" , adminvalue:Aname, adminpasswordvalue:"", loginName:"STUDENT LOGIN" ,loginAddress:""});
            // res.render("AdmineventsList",{title:" -ADMIN AddEvents", loginName:Aname , loginAddress:"AdmineventsList", EventIdvalue:"" , EventNameValue:"" , StartDateValue:"" , DueDateValue:"" , EventDetailsValue:"" , EVEerror:"" ,EveDateValue:""});
        }
    });
    }
});

app.get("/AdminAddedEvent",function(req,res){
    res.render("AdminAddedEvent",{title:" -Event_Added",  loginName:Aname , loginAddress:"AdminAddedEvent"});
});


var E_ventId;
var E_ventName;
var S_tartDate;
var D_ueDate;
var E_ventDate;
var E_ventDetails;



// ADMIN  // added event successfully //response
app.post("/AdminAddedEvent", function(req,res){


    E_ventId = req.body.EventId;
    E_ventName = req.body.EventName;
    S_tartDate = req.body.StartDate;
    // reg_start
    D_ueDate = req.body.DueDate; 
    // reg_due
    E_ventDate = req.body.EveDate;
    // event_start
    E_ventDetails = req.body.EventDetails;

    console.log(E_ventId);
    console.log(E_ventName);
    console.log(S_tartDate);
    console.log(E_ventDetails);


    if(E_ventId==""||E_ventName==""||S_tartDate==""||D_ueDate==""||E_ventDetails==""||E_ventDate==""){
        // res.render("AdmineventsList",{title:" -ADMIN AddEvents", loginName:Aname , loginAddress:"AdmineventsList", EventIdvalue:E_ventId , EventNameValue:E_ventName , StartDateValue:S_tartDate , DueDateValue:D_ueDate , EventDetailsValue: E_ventDetails ,EveDateValue:E_ventDate, EVEerror:"** Please fill all the details **"})
        res.render("AdmineventsList",{title:" -ADMIN AddEvents", loginName:Aname , loginAddress:"AdmineventsList", EventIdvalue:E_ventId , EventNameValue:E_ventName , StartDateValue:S_tartDate , DueDateValue:D_ueDate , EventDetailsValue: E_ventDetails ,EveDateValue:E_ventDate, EVEerror:"** Please fill all the details **"})
    }else{
        connection.query("select * from admin_events where event_id=?",[E_ventId],function(error,results,fields){
                // res.render("AdminAddedEvent",{title:" -Event_Added",  loginName:Aname , loginAddress:"AdminAddedEvent",EVENTname:E_ventName , EVENTid:E_ventId , STARTdate: S_tartDate , DUEdate: D_ueDate , EVENTdetails: E_ventDetails , EVEdate  :E_ventDate });
                if(results.length>0)
                res.render("AdmineventsList",{title:" -ADMIN AddEvents", loginName:Aname , loginAddress:"AdmineventsList", EventIdvalue:E_ventId , EventNameValue:E_ventName , StartDateValue:S_tartDate , DueDateValue:D_ueDate , EventDetailsValue: E_ventDetails ,EveDateValue:E_ventDate, EVEerror:"** Event already exists **"})
                else if(E_ventDate<S_tartDate || E_ventDate<D_ueDate || D_ueDate<S_tartDate)
                res.render("AdmineventsList",{title:" -ADMIN AddEvents", loginName:Aname , loginAddress:"AdmineventsList", EventIdvalue:E_ventId , EventNameValue:E_ventName , StartDateValue:S_tartDate , DueDateValue:D_ueDate , EventDetailsValue: E_ventDetails ,EveDateValue:E_ventDate, EVEerror:"** Recheck the entered dates **"})
                else{
                    connection.query("insert into admin_events values(?,?,?)",[E_ventName,E_ventDetails,E_ventId],function(error1,results1,fields1){
                    connection.query("insert into event_date values(?,?,?,?)",[S_tartDate,D_ueDate,E_ventDate,E_ventId],function(error2,results2,fields2){
                res.render("AdminAddedEvent",{title:" -Event_Added",  loginName:Aname , loginAddress:"AdminAddedEvent",EVENTname:E_ventName , EVENTid:E_ventId , STARTdate: S_tartDate , DUEdate: D_ueDate , EVENTdetails: E_ventDetails , EVEdate  :E_ventDate });
                console.log(error1);
                console.log(error2);
            });
        });
            }
                
                console.log(error);
        });
    }
});



var upcoming_events;
connection.query("SELECT * FROM event_date, admin_events WHERE event_date.event_id=admin_events.event_id and reg_start>curdate()",function(error,results,fields){
    upcoming_events  =  JSON.stringify(results);
    // console.log("UP ERROR : "+error);
    // results=JSON.parse(JSON.stringify(results))
    // doStuffwithTheResult(results); 
    // console.log(results);
    // console.log(upcoming_events[0]);
});
















app.listen("3000",function(){
    console.log("Successfully Running");
});