
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

// const subscribers = [];
// const onTodosUpdates = (fn) => subscribers.push(fn);

const todos = Todo.find({}).lean(); 
// let todos = []

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
        // subscribers.forEach((fn) => fn());
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
        subscribe: (parent, args, { pubsub }) => {
          // const channel = Math.random().toString(36).slice(2, 15);
          // onTodosUpdates(() => pubsub.publish(channel, { todos }));
          // setTimeout(() => pubsub.publish(channel, { todos }), 0);
          return pubsub.asyncIterator('NEW_TODOS')
        },
      }
    },
  };
  
const apollo = new ApolloServer({ typeDefs, resolvers, context: { pubsub, todos }  });

// const apollo = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => {
//     return {
//       ...req,
//       pubsub,
//     };
//   }
// });


// ????????????????????????
// const httpServer = http.createServer()
// apollo.installSubscriptionHandlers(httpServer)

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



// // import { GraphQLServer, PubSub } from "graphql-yoga"
// const { GraphQLServer, PubSub } = require('graphql-yoga');
// const mongoose = require("mongoose")

// const pubsub = new PubSub();
// const TODOS_CHANGED = "TODOS_CHANGED"

// // const Todo = require("./models/todos.js");
// // const todos = Todo.find({}).lean(); 

// // const todos = {
// //   Todo: [

// //   ]
// // }


// const typeDefs = `
//   type Todo {
//     _id: ID!,
//     task: String,
//     complited: Boolean,
//   }
//   type Query {
//     todoEvery: [Todo],
//   }
//   type Mutation {
//     todoAdd(task: String, complited: Boolean,): Todo,
//     todoDelete(_id: ID!): Todo,
//     }
//   type Subscription {
//     listenTodo : [Todo]
//   }
// `;

// const resolvers = {
//   Query: {
//     todoEvery: () => todos,
//   },
//   Mutation: {
//     todoAdd: (parent ,args) => {
//       let todo = new Todo({
//         task: args.task,
//         complited: args.complited,
//       });
//       todo.save();
//       pubsub.publish(TODOS_CHANGED, {listenTodo: todos})
//       return todo;
//     },
//     todoDelete: (parent ,args) => {
//       let deleteTodo = Todo.findByIdAndDelete({ _id: args._id },)
//       pubsub.publish(TODOS_CHANGED, {listenTodo: todos})
//       return deleteTodo;
//     }
//   },
//   Subscription: {
//     listenTodo: {
//       subscribe: (parent, args, { pubsub }) => {
//         return pubsub.asyncIterator(TODOS_CHANGED)
//       },
//     }
//   },
// };

// const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub, todos } })

// async function start() {
//     try{
//         await mongoose.connect("mongodb+srv://Polina:19101979@cluster0.sooe6.mongodb.net/todoList?retryWrites=true&w=majority",{
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useFindAndModify: false
//         }).then(console.log("Mongo connected!!!"))
//         server.start(console.log("gql node server running on local host 4000"))
//     }catch (e) {
//         console.log(e)
//     }
// }

// start()
