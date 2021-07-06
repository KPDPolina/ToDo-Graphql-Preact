require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require("mongoose")
const Todo = require("./models/todos.js");

const typeDefs = gql`
  type Todo {
    task: String,
    complited: Boolean,
  }
  type Query {
    todoEvery: [Todo],
  }
  type Mutation {
    todoAdd(task: String, complited: Boolean,): Todo,
    todoDelete(task: String): Todo,
    }
`;

let todos = Todo.find({}).lean(); 

const resolvers = {
    Query: {
      todoEvery: () => todos,
    },
    Mutation: {
      todoAdd: (parent ,args) => {
        let todo = new Todo({
          task: args.task,
          complited: args.complited,
        });
        todo.save();
        return todo;
      },
      todoDelete: (parent ,args) => {

        let delTodo = Todo.findOneAndDelete({ task: args.task },)
        return delTodo;

      }
    },
  };

const server = new ApolloServer({ typeDefs, resolvers });

async function start() {
    try{
        await mongoose.connect(process.env.DB_CONN,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(console.log("Mongo connected!!!"))
        server.listen().then(({ url }) => {
            console.log(`🚀🚀🚀  Server ready at ${url}`);
          });
    }catch (e) {
        console.log(e)
    }
}

start()