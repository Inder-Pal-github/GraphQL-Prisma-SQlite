const { ApolloServer, PubSub } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");

const pubsub = new PubSub();

// let links = [
//   {
//     id: "link-0",
//     url: "www.howtographql.com",
//     description: "Fullstack tutorial for GraphQL",
//   },
// ];

const prisma = new PrismaClient();

// 2
// const resolvers = {
//   Query: {
//     // 1.
//     info: () => `This is the API  of a Hackernews Clone`,
//     feed: async (parent, args, context) => {
//       return context.prisma.link.findMany();
//     },
//     link: async (parent, args, context) => {
//       // let linkId = `link-${args.id}`;
//       // console.log("Parent", parent);
//       // console.log(linkId);
//       // let link = links.find((ele) => ele.id === linkId);
//       // return link;
//       let linkId = args.id;
//       console.log(args.id);
//       const user = await context.prisma.link.findUnique({
//         where: {
//           id: linkId,
//         },
//       });
//       return user;
//     },
//   },
//   Mutation: {
//     // 2.
//     post: (parent, args, context, info) => {
//       // let idCount = links.length;
//       // const link = {
//       //   id: `link-${idCount}`,
//       //   description: args.description,
//       //   url: args.url,
//       // };
//       // links.push(link);
//       // return link;
//       const newLink = context.prisma.link.create({
//         data: {
//           url: args.url,
//           description: args.description,
//         },
//       });
//       return newLink;
//     },
//     updateLink: (parent, args) => {
//       let id = args.id;
//       let updatedLink;
//       let linkId = `link-${id}`;
//       let newlinks = links.map((link) => {
//         if (link.id === linkId) {
//           updatedLink = {
//             ...link,
//             url: args?.url,
//             description: args?.description,
//           };
//           return updatedLink;
//         }
//       });
//       links = newlinks;
//       return updatedLink;
//     },
//     deleteLink: (parent, args) => {
//       let id = args.id;
//       let linkId = `link-${id}`;
//       let removedLink;
//       links = links.filter((link) => {
//         if (link.id === linkId) {
//           removedLink = link;
//         }
//         return link.id !== linkId;
//       });
//       return removedLink;
//     },
//   },
// };

// getting resolvers from particular resolver files
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub, // for pubsub operations
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
