- new API standard
- declarative data fetching
- single endpoint
- announced by facebook on 2015
-

- Features

  - optimized quering
  - schema defining based on data requirements
  - no over - under fetching.

    - Overfetching: downloading unnecessary data
    - Underfetching: not getting enough data as required. ( need to make n+1 request to get exact data)

  - insightful analytics
  - schema and types
    - schema : a contract to defined the format of data required

#### The Schema Definition Language (SDL)

- Simple types: -

```
 type Person {
    name:String!
    age:Int!
 }
// exclamation sign is used for spefifying mandatory fields.

 type Post {
    title:String!
 }
```

- Adding relations

```
type Person {
    name:String!
    age:Int!
    posts:[Post!]!
}

type Post {
    title:String!
    author:Person!
}
```

- Query

```
{
    allPerson {
        name
    }
}
```

- Exmaple response

```
{
    "allPersons":[
        {"name":"a"},
        {"name":"b"},
        {"name":"c"},
    ]
}
```

- Query

```
{
    allPerson {
        name
        age
    }
}
```

- Exmaple response

```
{
    "allPersons":[
        {"name":"a",age:20},
        {"name":"b",age:21},
        {"name":"c",age:24},
    ]
}
```

- Fetch nested data

```
{
    allPersons:{
        name
            posts {
                title
            }
    }
}

// this will return data which will have name and posts array
```

#### Writing Data with Mutations

- 3 kinds of mutations
  - creating a new data
  - updating existing data
  - deleting existing data

```
mutation {
    createPerson ( name: "Bob", age: 36){
        name
        age
    }
}

// response for above mutation
{
    "createPerson":{
        "name": "Bob",
        "age": 36
    }
}
```

```
mutation {
    createPerson( name: "Bob", age: 36){
        id
    }
}
```

#### Realtime updates with subscriptions

```
subscription {
    newPerson {
        name
        age
    }
}
```

### The GraphQL Schema

- defines capabilities of the API by specifying how a client fetch and update data
- represents contract b/w client and server
- collection of GraphQL types

- Root Types
  - type Query {...}
  - type Mutation {...}
  - type Subscription {...}

##### The query type

```
{
    allPersons {
        name
    }
}
```

```
type Query {
    allPersons(last:Int):[Person!]!
}
```

##### The mutation type

```
mutation {
    createPerson(name:"Bob",age:37) {
        id
    }
}
```

```
type Mutation {
    createPerson(name:String!, age:String!): Person!
}
```

##### The subscription type

```
subscription {
    newPerson{
        name
        age
    }
}
```

```
type Subscription {
    newPerson:Person!
}
```

### Full Schema

```
type Query {
    allPersons(last:Int):[Person!]!
    allPosts(last:Int):[Post!]!
}
type Mutation {
    createPerson(name:String!, age:String!):Person!
    updatePerson(id:ID!,name:String!,age:String!):Person!
    deletePerson(id:ID!):Person!
    createPost(title:String!):Post!
    updatePost(id:ID!,title:String!):Post!
    deletePost(id:ID!):Post!
}
type Subscription {
    newPerson:Person!
    updatePerson:Person!
    deletePerson:Person!
    newPost:Post!
    updatePost:Post!
    deletePost:Post!
}

type Person {
    id:ID!
    name:String!
    age:Int!
    posts:[Post!]!
}
type Post {
    title:String!
    author:Person!
}
```

### GraphQL server with a connected database

#### Use cases.

![Alt text](image.png)

![Alt text](image-1.png)

![Alt text](image-2.png)

- Resolver function
  - GraphQL queries/mutation consist of a set of fields
  -

### GraphQL clients

- from imperative to declarative data fetching

- imperative data fetching
  - construct and send HTTP request
  - recive and psrse server response
  - store data locally
  - display info on UI
- declarative data fetching
  - describe the data requirements
  - display the info on UI

```js
// Query for all users
 query {
    users {
        id
        name
    }
 }

// Query a single user by their id
query {
    user(id:"user-1") {
        id
        name
    }
}

// Create a new user
mutation {
    createUser(name:"Bob") {
        id
        name
    }
}
```

#### Setting up our project with Prisma and SQLite

```js
npm install prisma --save-dev
npm install @prisma/client
```

- use the prisma cli to initialize prisma in the project

```js
npx prisma init
```

```
Remember the GraphQL schema that you’ve been working with until now? Well, Prisma has a schema, too! Inside the prisma directory that was created in the last step, you’ll see a file called schema.prisma. You can think of the schema.prisma file as a database schema. It has three components:

Data source: Specifies your database connection.
Generator: Indicates that you want to generate Prisma Client.
Data model: Defines your application models. Each model will be mapped to a table in the underlying database.
```

```
Getting Started with SQLite
It’s finally time to actually create our SQLite database. In case you aren’t familiar with SQLite, it is an in-process library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine.

The great thing is that, unlike most other SQL databases, SQLite does not have a separate server process. SQLite reads and writes directly to ordinary disk files. A complete SQL database with multiple tables, indices, triggers, and views, is contained in a single disk file. This makes it a perfect choice for projects like this.

So how about the setup? Well, the great news is that Prisma can do that for us right out of the box with a simple command!

From the root directory of your project, create your first migration by running the following command in your terminal:


```

```js
.../hackernews-node/
npx prisma migrate dev
```

```
Take a look at the prisma directory in your project’s file system. You’ll see that there is now a /migrations directory that Prisma Migrate created for you when running the above command
```

```js
npx prisma generate
```

```
It’s as simple as that! You now have /node_modules/@prisma/client which can be imported and used in your code.
```

- mkdir src/script.js

```js
// 1
const { PrismaClient } = require("@prisma/client");

// 2
const prisma = new PrismaClient();

// 3
async function main() {
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

// 4
main()
  .catch((e) => {
    throw e;
  })
  // 5
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```js
node src/script.js  // => []
```

1. Import the PrismaClient constructor from the @prisma/client node module.
2. Instantiate PrismaClient.
3. Define an async function called main to send queries to the database. You will write all your queries inside this function.
4. Call the main function.
5. Close the database connections when the script terminates.

- Exploring your data in Prisma Studio

```
Prisma ships with a powerful database GUI where you can interact with your data: Prisma Studio.
```

```js
npx prisma studio
```

##### Authentication

- Adding a _User_ model

```
The first thing you need is a way to represent user data in the database. To do so, you can add a User type to your Prisma data model.

You’ll also want to add a relation between the User and the existing Link type to express that Links are posted by Users.
```

```js
model Link {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  description String
  url         String
  postedBy    User?    @relation(fields: [postedById], references: [id])
  postedById  Int?
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  links     Link[]
}
```

```js
// Now after addeing new stuff, we need to updated our migration as we have made changes in the data model.
npx prisma migrate dev --name "add-user-model"

```

```js
npx prisma generate

// if permission error occurs
// delete .prisma folder from node_modules and then run the above command.
```

#### Realtime GraphQL Subscriptions

- **send realtime updates to subscribed clients when a new link element is created.**
- **send realtime updaes to subscribed client when an existing link element is upvoted.**

- What are graphql subscriptions
  - subscriptions are a graphql feature that allows a server to send data to its clients when a specific event happens.
- subscription are usually implemented with WebSockets, in this step server maintains a i steady connection to its subscribed client. thie also breaks the request-response cycle, that were used for all previous interations with the api
- instead, the client initially opens up a long-lived connection to the server by sending a subscriptions query that specifies which event it is interested in. Every time this particular event happens, the server uses the connection to push the event data to the subscribed client(s)

- Implement GraphQL subscriptions
  - using **PubSub** from **Apollo-server** library that we have already been using for our GraphQL server to implement subscriptions
    - a new model is created.
    - an existing model updated.
    - an existing model is deleted.
- Setting up **PubSub**

```js
// index.js
// ... previous import statements
const { PubSub } = require('apollo-server')

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub, // using here, we can subscribe using context.pubsub
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
});
```
