import express from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import jwt from 'jsonwebtoken';
//import bodyParser from 'body-parser';
import path from 'path';

const __dirname = path.resolve();

//const {json} = bodyParser;

interface Context {
  token: { _id: string } | null;
}
const server = new ApolloServer<Context>({ typeDefs, resolvers });
const app = express();
await server.start();
const PORT = process.env.PORT || 3001;
const start = async () => {
await db;
}
start();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
//if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './client/dist')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, './client/dist/index.html'));
  });
//}

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1];

      if (!token) {
        return { token: null };
      }

      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY || '') as { _id: string };
        return { token: decodedToken };
      } catch (err) {
        console.error('Invalid token:', err);
        return { token: null };
      }
    },
  })
);

//app.use(routes);

console.log('Starting server setup...');

//db.on('error', (err) => {
 // console.error(`❌ Database connection error: ${err.message}`);
//});

console.log('✅ Database connected successfully');
  app.listen(PORT, (err?: Error) => {
    if (err) {
      console.error(`❌ Failed to start server: ${err.message}`);
    } else {
      console.log(`🌍 Now listening on http://localhost:${PORT}`);
    }
  });