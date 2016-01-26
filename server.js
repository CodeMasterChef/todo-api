var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore") ;

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [
    //{
    //    id: 1,
    //    description: 'Meet mom for lunch',
    //    completed: false
    //},
    //{
    //    id: 2,
    //    description: 'Go to market',
    //    completed: false
    //
    //},
    //{
    //    id: 3,
    //    description: 'Feed the cat',
    //    completed: true
    //
    //}
];
var todoNextId = 1  ;

app.use(bodyParser.json()) ;

app.get("/", function (req, res) {
    res.send("Todo APi Root");
});
//GET /todos
app.get("/todos", function (req, res) {
    res.json(todos) ;

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

app.listen(PORT, function () {
    console.log("Express listening on port: " + PORT);
});