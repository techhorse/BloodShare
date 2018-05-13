var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    flash = require("connect-flash"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
//mongoose.connect("mongodb://localhost/LifeShare");
// mongodb://Abhishek:abhi199718@ds163689.mlab.com:63689/blood
mongoose.connect("mongodb://Abhishek:abhi199718@ds163689.mlab.com:63689/blood");
var app = express();
app.set("view engine","ejs");
app.use(express.static('public'));


//SCHEMA SETUP
var Schema = new mongoose.Schema({
    username:String,
    City:String,
    Blood:String,
    Age: Number,
    Address: String,
    District: String,
    Mobile:Number,
    Email: String,
    optradio : String,
    Fresher: String,
    
}); 
 var Users  = mongoose.model("users",Schema); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(require("express-session")({
    secret: "abhishek and sangeeta",
    resave:false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
     res.locals.success = req.flash("success");
   next();
});

app.post("/Profile",function(req,res){
   
  Users.find({"City":req.body.city,"Blood":req.body.Blood},function(err,docs){
       if(err){
           console.log(err);
       }else{
           res.render("Profile",{users:docs})
       }
   }) ; 
});
app.get("/Portfolio",function(req,res){
  Users.find({},function(err,docs){
       if(err){
           console.log(err);
       }else{
           res.render("Portfolio",{users:docs});
           
       }
   }) ; 
});
app.get("/",function(req,res){
   res.render("home");
});
app.get("/home",function(req,res){
   res.render("home");
});
app.get("/About",function(req,res){
   res.render("About");
});
app.get("/Contact",function(req,res){
   res.render("Contact");
});
app.get("/donor",function(req,res){
   res.render("donor",{currentUser:req.user}); 
});

app.get("/donor",isLoggedIn,function(req,res){
   res.render("donor"); 
});




app.get("/Signup",function(req,res){
   res.render("Signup");
});

//handling user sign up
app.post("/Signup", function(req, res){
    User.register(new User({
    username: req.body.username,
    optradio:req.body.optradio, 
    Blood:req.body.Blood,
    Age:req.body.Age, 
    Mobile:req.body.Mobile,
    Email:req.body.Email,
    Address:req.body.Address,
    City:req.body.City,
    District:req.body.District,
    optradio1:req.body.optradio1,
    }), req.body.password,function(err, user){
        if(err){
            req.flash("error","Signup Failed...Please Try Again!!");
            return res.render('Signup');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","You have Sucessfully Signed Up!!!");
           res.redirect("/");
        });
    });
});


app.get("/Login",function(req,res){
   res.render("Login");
});
app.get("/Delete",function(req,res){
   res.render("Delete",{currentUser:req.user});
   });
//middleware
app.post("/Login",passport.authenticate("local",{
    successRedirect :"/donor",
    failureRedirect: "/Login"
    }),function(req,res){
      
});
app.post("/Delete",function(req,res){
    var user=req.user.username;
    if(user == req.body.username){
     Users.remove({"username":req.body.username},function(err,docs){
       if(err){
           console.log(err);
       }else{
           req.flash("success","Your Account is successfully Deleted!!");
           res.redirect("home");
       }
   }) ; 
    }
});

app.get("/Logout",function(req,res){
    req.logout();
    req.flash("success","Logged You out...!!!");
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.flash("eror","Please login First!!")
    res.redirect("/Login");
}

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("LifeShare Server Started...!!");
});

