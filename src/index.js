import '@babel/polyfill/noConflict'; // noConflict for if already uploaded then use that old othere wise import 
// for dev server node-babel included that default we added above import only for production
import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db';
import { resolvers, fragmentReplacements } from './resolvers/index';
// import './prisma';
import prisma from './prisma'

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql', // relative to the root application folder(where the pacakge.json there) 
    resolvers,
    context(request) {
        return {
            db, pubsub, prisma, request
        }
    },
    fragmentReplacements
})

server.start({ port: process.env.PORT || 4000 }, () => {
    console.log('server is up and running')
})