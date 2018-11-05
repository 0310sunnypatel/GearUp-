//Variables
const express               =require('express');
const mongoose              =require('mongoose');
const ejs                   =require('ejs');
const bodyParser            =require('body-parser');
const flash                 =require('connect-flash');
const passport              =require('passport');
const LocalStrategy         =require('passport-local');
const passportLocalMongoose =require('passport-local-mongoose');
const cookieParser          =require('cookie-parser');


//Database
mongoose.connect('mongodb://localhost/gearUp',{ useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const app = express();


app.use(require("express-session")({
  secret: "Jai mata di",
  resave: false,
  saveUninitialized:false,
  
}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(flash());

//Models
const Customer = require('./models/customerModel');
const Product = require('./models/productModel');
const Orders = require('./models/ordersModel');

passport.use(new LocalStrategy(Customer.authenticate()));
passport.serializeUser(Customer.serializeUser());
passport.deserializeUser(Customer.deserializeUser());



app.set('view engine','ejs');          //Setting the engine view to ejs 
app.use(express.static(__dirname+'/public/'));     //Location of static files


//Controllers
const customerController = require('./controllers/customerController');
const productController = require('./controllers/productController');

//Routes
const customerRoutes = require('./routes/customerRoute');
const productRoutes = require('./routes/productRoute');
app.use(customerRoutes);
// app.use(productRoutes);

const port= process.env.PORT||4000; //Finding assigned port number using environment variable PORT
 app.listen(port, () => {
     console.log(`Listening on port ${port}...`);
 });

app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

//=========================================================================================================================== 
//Rendering home page... 
app.get('/',(req,res)=>{
  res.render('Home');
  console.log(res.locals.currentUser);
});

//Rendering categories page
app.get('/categories',isLoggedIn,(req,res)=>{
    res.render('Categories');
    console.log(res.locals.currentUser);
       
});


//=======================================================================================================================
//Rendering login page
app.get('/userLogin',(req,res)=>{
  res.render('Login');
 });

// Logging in with auth
app.post('/userLogin',passport.authenticate("local",{
    successRedirect: "/categories",
    failureRedirect: "/userLogin",
    failureFlash: "Invalid username/password. Try again!"
      }),(req,res)=>{}

);


//========================================================================================================================    
//Rendering signup page
app.get('/userSignup',(req,res)=>{
    res.render('Signup');
  });

//Registration with authentication
app.post("/userSignup", function(req, res)
    {
        let customer = new Customer({username: req.body.username});
        customer.f_name = req.body.f_name;
        customer.l_name = req.body.l_name;
        customer.mobile_no = req.body.mobile_no;
        customer.gender = req.body.gender;
        Customer.register(customer, req.body.password, 
        function(err, newCustomer)
        {
            if(err){
                    req.flash("error",err.message);
                    return res.redirect('userSignup');
                }
            else
            {
              passport.authenticate("local")(req, res, function()
                {
                    res.redirect("/categories");       
                });
            }
        });
    });



//=========================================================================================================================
//LOGOUT
app.get('/logout',function(req,res){
    req.logout();
    req.flash("success","Hope to see you soon!");
    res.redirect('userLogin');
});


//MIDDLEWARE ============================================================================================================
function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login first" );
    res.redirect('/userLogin');
}

//Products as categories ===========================================================================================================
app.get('/productsAsCategories/:category',(req,res)=>{
    console.log(res.locals.currentUser);
    Product.find({category:req.params.category}, function(err, products){
        if(err){
            console.log("OH NO, ERROR!");
            console.log(err);
        } else {
            console.log("Products retrieved!");
            console.log(res.locals.currentUser);
            res.render('ProductsAsCategories',{products:products});
        }
    });
    
});

//Rendering productDetails =============================================================================================
app.get('/productDetails/:id',function(req,res){
    Product.findById(req.params.id,function(err,product){
         if(err){
             console.log("Oh no, error!");
             console.log(err);
         }
         else{
             console.log(product);
             res.render('ProductDetails',{product: product});
         }
     });
});

// Adding to cart ===============================================================================================
 app.get('/productDetails/:uid/:id/add',function(req,res){
     Customer.findById(req.params.uid,function(err,customer){
         if(err){
             console.log("Error! Customer not found!");
             console.log(err)
         }
         else{
             Product.findById(req.params.id,(req,product)=>{
             customer.cart.push(product);
             customer.save(function(err, data){
                    if(err){
                     console.log(err);
                    }  
                    else 
                    {
                    console.log("Data entered");
                    }
                });
               
            });
         }
     });
     req.flash("success","Added to cart!");
     res.redirect(`/productDetails/${req.params.id}`);
 });

// Rendering cart page===============================================================================================
app.get('/userCart/:uid',function(req,res){
    Customer.findById(req.params.uid,function(err,customer){
         if(err){
            console.log("Oh no, error!");
             console.log(err);
         }
        else{
            res.render('cartDisplay',{carts:customer.cart});
         }
     })
     .populate("cart");
});

// Deleting product from cart=============================================================================================
app.get('/deleteProduct/:id/:uid',function(req,res){
    Customer.findById(req.params.uid,function(err,customer){
        if(err){
            console.log(err);
        }
        else{
            customer.cart.forEach(function(product){
                if(product==req.params.id){
                    index= customer.cart.indexOf(product);
                    console.log(index);
                    customer.cart.splice(index, 1);    
                   
                }    
            });
            customer.save(function(err, data){
                if(err){
                  console.log(err);
                 }  
                 else 
                 {
                 console.log("Data removed");
                 }
             });
             res.redirect(`/userCart/${req.params.uid}`)
            //  res.render('cartDisplay',{carts:customer.cart});
        }
    });
    
});



// ============================================= Placing order =============================================================
// ADDRESS
app.get('/deliveryDetails/:uid',function(req,res){
    Customer.findById(req.params.uid,function(err,customer){
        if(err)
        {
            console.log("Error: Customer not found!");
        }
        else{
            res.render('placeOrder',{cart:customer.cart});
        }
    })
    .populate("cart");
    
});
app.post('/deliveryDetails/:uid',function(req,res){
   
    Customer.findById(req.params.uid,function(err,customer){
        if(err){
            console.log(err);
        }
        else
        {   var total = 0;
            customer.cart.forEach(function(product){ 
                total = total + parseInt(product.price) })
            let order=new Orders({address: req.body.address,city: req.body.city,state: req.body.state, productsToBuy:customer.cart ,price: total,pincode:req.body.pincode});
           Orders.create(order,function(err, data)
            {
                if(err)
                {
                  console.log(err);
                }  
                else 
                {
                    console.log("Order placed");
                    
                }
            });
            customer.orders.push(order);
            customer.save(function(err, data){
                if(err){
                 console.log(err);
                }  
                else 
                {
                console.log("Customer orders updated");
                }
            });
            customer.cart.splice(0,customer.cart.length);
        }
    })
    .populate("cart");        
    res.redirect(`/yourOrders/${req.params.uid}`);
});


//Display orders =================================================================================
app.get('/yourOrders/:uid',function(req,res){
    Customer.findById(req.params.uid,function(err,customer){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(customer.orders)
            res.render('orders1',{orders:customer.orders});
        }
    })
    .populate("orders")
    .populate("productsToBuy");
});


//Search =======================================================================================================
app.post('/searchProducts',function(req,res){
    Product.find(
    {
        $text: {
            $search: req.body.search,
            $caseSensitive:false,
           }
        },
        function(err,data)
        {
        console.log(data);
        res.render('ProductsAsCategories',{products:data})
    });
});









