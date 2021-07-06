import './style';
import App from './components/app';
import {ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { h, render } from 'preact';

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
  })
  
render(<ApolloProvider client={client}><App /> </ApolloProvider>, document.body);
