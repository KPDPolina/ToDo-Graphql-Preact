import './style';
import App from './components/app';
import {ApolloProvider, ApolloClient, InMemoryCache, useSubscription/*split, HttpLink*/ } from '@apollo/client';
import { h, render } from 'preact';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';
// import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws'

import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
 

// The http link is a terminating link that fetches GraphQL results from a GraphQL 
// endpoint over an http connection
const httpLink = new HttpLink({
    uri: 'http://localhost:4000/'
});


// Allow you to send/receive subscriptions over a web socket
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: {
        reconnect: true
    }
});

// Acts as "middleware" for directing our operations over http or via web sockets
const terminatingLink = split(
    ({ query: { definitions } }) =>
        definitions.some(node => {
            const { kind, operation } = node;
            return kind === 'OperationDefinition' && operation === 'subscription';
        }),
    wsLink,
    httpLink
);
// Create a new client to make requests with, use the appropriate link returned 
// by termintating link (either ws or http)
const client = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            todoEvery: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      }
    }),
    link: terminatingLink
});

// import { SUBSCRIPTION_TODO } from './components/mutation/todo.js';

// function LatestTodo() {
//     const { data, loading } = useSubscription(
//       SUBSCRIPTION_TODO,
//       {variables: {
//         task: "nee"
//       }}
//     );
//     return <div><h2>New comment: {!loading && data.listenTodo.task}</h2></div>;
//   } 

render(
<ApolloProvider client={client}>
  <App /> 
  {/* <LatestTodo /> */}
</ApolloProvider>, document.body);






// const httpLink = new HttpLink({
//   uri: 'http://localhost:4000'
// });

// const wsLink = new WebSocketLink({
//   uri: 'ws://localhost:4000/subscription',//'ws://localhost:4000',
//   options: {
//     reconnect: true
//   }
// });

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink,
// );

// const client = new ApolloClient({
//     uri: splitLink, //'http://localhost:4000/',
//     cache: new InMemoryCache({
//       typePolicies: {
//         Query: {
//           fields: {
//             todoEvery: {
//               merge(existing, incoming) {
//                 return incoming;
//               },
//             },
//           },
//         },
//       }
//     }),
//   })
  
// // const link = new WebSocketLink({
// //   uri: `ws://localhost:4000/`,
// //   options: {
// //     reconnect: true,
// //   },
// // });

// // const client = new ApolloClient({
// //   link,
// //   uri: "http://localhost:4000/",
// //   cache: new InMemoryCache(),
// // });


