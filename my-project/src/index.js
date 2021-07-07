import './style';
import App from './components/app';
import {ApolloProvider, ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { h, render } from 'preact';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000'
});

const wsLink = new WebSocketLink({
  uri: 'wss://localhost:4000/graphql',
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  
  wsLink,
  httpLink,
);

const client = new ApolloClient({
    uri: splitLink, //'http://localhost:4000/',
    cache: new InMemoryCache({
      // typePolicies: {
      //   Query: {
      //     fields: {
      //       todoEvery: {
      //         merge(existing, incoming) {
      //           return incoming;
      //         },
      //       },
      //     },
      //   },
      // }
    }),
  })
  
render(<ApolloProvider client={client}><App /> </ApolloProvider>, document.body);
