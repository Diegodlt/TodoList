var bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
mongoose = require("mongoose"),
express = require("express"),
app = express();


console.log(process.env.DATABASEURL);
// APP CONFIG
 mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));


var todoSchema = new mongoose.Schema({
    
    description : String,
    created : {type: Date, default : Date.now}
});

var Todo = mongoose.model("Todo",todoSchema);

var categorySchema = new mongoose.Schema({
    title : String,
    todos : [todoSchema]
});

var Category = mongoose.model("Category",categorySchema);





//                                       **ROUTES**



//          ** CATEGORIES **


//  INDEX
app.get("/",function(req,res){
    
   res.redirect("categories");
});

app.get("/categories", function(req,res){
    Category.find({}, function(err, categories){
        if(err){
            console.log("ERROR!");
        }else {
            res.render("categories", {categories:categories});
        }
    });
   
});

//  NEW

app.get("/categories/new", function(req,res){
    res.render("new");
});

//  CREATE

app.post("/categories", function(req,res){
    Category.create(req.body.Category, function(err, newCategory){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/categories/"+newCategory._id);
        }
    });
    
});

//  SHOW

app.get("/categories/:id",function(req,res){
    Category.findById(req.params.id, function(err, foundCat){
        if(err){
            res.redirect("/categories");
        }else{
          res.render("show",{categories: foundCat});  
        }
    });
});


//DELETE
app.delete("/categories/:id", function(req, res){
    Category.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log("Error");
        }else{
            res.redirect("/categories");
        }
    });
});


//      ** TODO **

// CREATE A NEW TODO IN CATEGORIES

app.post("/categories/:id",function(req,res){
    console.log(req.body);
    console.log(req.params.id);
    Category.findOne( {_id : req.params.id}, function(err,category){
        if(err){
            console.log("Erorr");
        } else {
            console.log("Success");
            category.todos.push({
                description : req.body.description
            });
        }
        category.save(function(err,category){
            if(err){
                console.log(err);
            }else {
                console.log(category);
            }
        });
    }
       
        );
        res.redirect("/categories/"+ req.params.id);
});

// DELETE A TODO IN CATEGORIES
app.delete("/categories/deleteTodo/:id/:todoId", function(req,res){
     Category.findOne( {_id : req.params.id}, function(err,category){
        if(err){
            console.log("Erorr");
        } else {
            console.log("Success");
            category.todos.pull({_id:req.params.todoId});
        }
        category.save(function(err,category){
            if(err){
                console.log(err);
            }else {
                console.log(category);
            }
        });
    }
       
        );
        res.redirect("/categories/"+ req.params.id);
   
});


// CREATE A NEW TODO IN HOME PAGE

app.post("/todo",function(req,res){
    console.log(req.body);
    console.log(req.params.id);
    Category.findOne( { title : "MAIN"}, function(err,category){
        if(err){
            console.log("Erorr");
        } else {
            console.log("Success");
            category.todos.push({
                description : req.body.description
            });
        }
        category.save(function(err,category){
            if(err){
                console.log(err);
            }else {
                console.log(category);
            }
        });
    }
       
        );
        res.redirect("/categories");
});


app.delete("/deleteTodo/:todoId", function(req,res){
     Category.findOne( {title : "MAIN"}, function(err,category){
        if(err){
            console.log("Erorr");
        } else {
            console.log("Success");
            category.todos.pull({_id:req.params.todoId});
        }
        category.save(function(err,category){
            if(err){
                console.log(err);
            }else {
                console.log(category);
            }
        });
    }
       
        );
        res.redirect("/categories");
   
});





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started...");
});