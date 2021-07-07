require('dotenv').config()
const { ApolloServer, gql, PubSub } = require('apollo-server');
const mongoose = require("mongoose")
const Todo = require("./models/todos.js");

const pubsub = new PubSub();

const typeDefs = gql`
  type Todo {
    _id: ID!,
    task: String,
    complited: Boolean,
  }
  type Query {
    todoEvery: [Todo],
  }
  type Mutation {
    todoAdd(task: String, complited: Boolean,): Todo,
    todoDelete(_id: ID!): Todo,
    }
  type Subscription {
    listenTodo : [Todo]
  }
`;

const todos = Todo.find({}).lean(); 

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
        pubsub.publish('NEW_TODOS', {listenTodo: todos})
        return todo;
      },
      todoDelete: (parent ,args) => {
        let deleteTodo = Todo.findByIdAndDelete({ _id: args._id },)
        pubsub.publish('NEW_TODOS', {listenTodo: todos})
        return deleteTodo;
      }
    },
    Subscription: {
      listenTodo: {
        subscribe: () => pubsub.asyncIterator(['NEW_TODOS']),
      }
    },
    
  };
  
const apollo = new ApolloServer({ typeDefs, resolvers });

// ????????????????????????
// const server = createServer()
// apollo.installSubscriptionHandlers(server)


async function start() {
    try{
        await mongoose.connect(process.env.DB_CONN,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(console.log("Mongo connected!!!"))
        apollo.listen().then(({ url }) => {
            console.log(`🚀🚀🚀  Server ready at ${url}`);
          });
    }catch (e) {
        console.log(e)
    }
}

start()