var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore") ;

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [
    {
        id: 1,
        description: "Go to restaurant for lunch",
        completed: false
    },
    {
        id: 2,
        description: "Go to market",
        completed: true

    },
    {
        id: 3,
        description: "Feed the cat",
        completed: false

    }
];
var todoNextId = 1  ;

app.use(bodyParser.json()) ;

app.get("/", function (req, res) {
    res.send("Todo APi Root");
});
//GET /todos
app.get("/todos", function (req, res) {
    var queryParams = req.query ;
    var filteredTodos = todos ;

    if(queryParams.hasOwnProperty("completed") && queryParams.completed==="true") {
        filteredTodos = _.where(filteredTodos , {completed:true}) ;
    } else if (queryParams.hasOwnProperty("completed") && queryParams.completed==="false") {
        filteredTodos = _.where(filteredTodos, {completed:false}) ;
    }

    if(queryParams.hasOwnProperty("q") && queryParams.q.length > 0) {
        filteredTodos = _.filter( filteredTodos , function (todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1 ;
        }) ;
    }

    res.json(filteredTodos) ;
  //  res.json(todos) ;

}) ;
//GET /todos/:id
app.get("/todos/:id" , function (req, res) {
    var todoId = parseInt(req.params.id, 10) ;
    var matchedTodo = _.findWhere(todos , {id:todoId}) ;
    //var todoId = req.params.id ;
    //var matchedTodo    ;
    //todos.forEach(function (todo) {
    //    if(todoId == todo.id)  {
    //        matchedTodo = todo  ;
    //    }
    //}) ;
    if(matchedTodo) {
        res.json(matchedTodo) ;
    } else {
        res.status(404).send() ;
    }

}) ;

// POST /todos
app.post("/todos" , function (req , res) {
    //var body  = req.body ;
    var body = _.pick(req.body , "description" , "completed") ;
    if( !_.isBoolean(body.completed) || !_.isString(body.description) ||  body.description.trim().length==0) {
        return res.status(400).send() ;
    }
    //set body.description is to be trimmed value
    body.description = body.description.trim()  ;
    // add id field
    body.id = todoNextId++ ;
    // push body into array
    todos.push(body) ;
    //console.log('description ' + body.description) ;
    res.json(body) ;
} ) ;

//DELETE /todos/id 

app.delete("/todos/:id" , function ( req , res) {
    var todoId = parseInt(req.params.id, 10) ;
    var matchedTodo = _.findWhere(todos , {id:todoId}) ;
    if(!matchedTodo) {
        res.status(404).json( {"errror" : "No object with this id"} ) ;
    } else {
        todos = _.without(todos , matchedTodo) ;
        res.json(matchedTodo) ;
    }

}) ;

// PUT /todos/id
app.put("/todos/:id" , function (req, res) {

    var todoId = parseInt(req.params.id, 10) ;
    var matchedTodo = _.findWhere(todos , {id:todoId}) ;
    if(!matchedTodo) {
         return res.status(404).send() ;
    }

    var body = _.pick(req.body , "description" , "completed") ;
    var validAttributes = {} ;
    if(body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
       validAttributes.completed = body.completed ;
    } else if(body.hasOwnProperty("completed")) {
        return res.status(400).send() ;
    } else {
        // never provided attribute, no problem here
    }

    if(body.hasOwnProperty("description" ) && _.isString(body.description) && body.description.trim().length > 0 ) {
        validAttributes.description = body.description ;
    } else if(body.hasOwnProperty("description")) {
        return res.status(400).send() ;
    }

     _.extend(matchedTodo , validAttributes) ;
    res.json(matchedTodo) ;

}) ;

app.listen(PORT, function () {
    console.log("Express listening on port: " + PORT);
});