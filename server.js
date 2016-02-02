var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require("./db.js");

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
var todoNextId = 1;

app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Todo APi Root");
});
//GET /todos
app.get("/todos", function (req, res) {
    var queryParams = req.query;
    var where = {}  ;

    if (queryParams.hasOwnProperty("completed") && queryParams.completed === "true") {
        where.completed = true;
    } else if (queryParams.hasOwnProperty("completed") && queryParams.completed === "false") {
        where.completed = false;
    }

    if (queryParams.hasOwnProperty("q") && queryParams.q.length > 0) {
        where.description = {
            $like : "%"+queryParams.q+"%"
        }
    }
    db.todo.findAll( {where:where}).then(function (todos) {
        res.json(todos);
    } , function (e) {
        res.status(500).send() ;
    }) ;

});
//GET /todos/:id
app.get("/todos/:id", function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    db.todo.findById(todoId).then(function (todo) {
        if(todo) {
            res.json(todo);
        } else {
            res.status(404).send() ;
        }
    }, function (e) {
        res.status(500).send();
    });
});

// POST /todos
app.post("/todos", function (req, res) {
    var body = _.pick(req.body, "description", "completed");
    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});

//DELETE /todos/id 

app.delete("/todos/:id", function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    db.todo.destroy( {
        where : {
            id : todoId
        }
    }).then(function (rowDeleted) {
        if(rowDeleted ===0) {
            res.status(404).join( {error: "No todo with id"})
        } else {
            res.status(204).send() ;
        }
    } , function (e) {
        res.status(500).send();
    }) ;
});

// PUT /todos/id
app.put("/todos/:id", function (req, res) {

    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    if (!matchedTodo) {
        return res.status(404).send();
    }

    var body = _.pick(req.body, "description", "completed");
    var validAttributes = {};
    if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty("completed")) {
        return res.status(400).send();
    } else {
        // never provided attribute, no problem here
    }

    if (body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty("description")) {
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);

});

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log("Express listening on port: " + PORT);
    })
});

