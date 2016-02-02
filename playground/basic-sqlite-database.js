var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': 'basic-sqlite-database.sqlite'

});
var Todo = sequelize.define("todo", {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            isBoolean: true
        }
    }
});
sequelize.sync({
        //force: true
    })
    .then(function () {
        console.log("Everything is synced");

        Todo.findById(2).then(function (todo) {
            if (todo) {
                console.log(todo.toJSON());
            } else {
                console.log("Can not found");
            }
        });


        //Todo.create({
        //    description: "Take out trash",
        //    completed: false
        //}).then (function (todo) {
        //    return Todo.create({
        //        description: " clean office"
        //    })
        //}).then(function () {
        //  //  return Todo.findById(1);
        //    return Todo.findAll( {
        //        where : {
        //            completed : false ,
        //            description : {
        //                $like: "%trash"
        //            }
        //        }
        //    })
        //}).then (function (todos) {
        //    if (todos) {
        //        todos.forEach( function(todo) {
        //            console.log(todo.toJSON());
        //        })
        //    } else {
        //        console.log("can not be found");
        //    }
        //}).catch(function (e) {
        //    console.log(e);
        //});
    });