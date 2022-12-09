# BlogAppNodeJS
Proof of concept Blog application build with React and Express.

# User stories
- authentication using JWT (registration and login)
- user can change their status
- user can manage their blog posts, create and edit posts
- user can see a feed of posts
- user can see live feed updates in realtime (websockets)

# Stack and tech:
UI: React,

API: \
NodeJS, \
Express, \
Mongo DB (Mongoose ORM), \
Graph QL, \
TypeScript, \
JWT authentication, \
WebSockets (Socket.IO)

Docker

# Architecture
Backend main modules:\
Core - implemented with several main services, eg. feed, auth, user, all services are hidden behind interfaces.\
Domain entities are represented by models, eg. user, post.\
Database module - mongo db with mongoose ORM \
Controllers - implemented with standard route logic in express.\
GraphQL and Controllers in the end use the same core logic.

