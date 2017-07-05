
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  })
});

var query = '{ hello}';

graphql(schema, query).then(result => {
  // Prints
  // {
  //   data: { hello: "world" }
  // }
  console.log(result);
});

let schema1 = buildSchema(`
    type Query {
        hello:String
    }
`);

let root  = {
    hello:()=>{
        return "hello world";
    }
}

let app =  express();
app.use('/graphql',graphqlHTTP(
    {
        schema:schema1,
        rootValue:root,
        graphiql:true
    }
));
app.listen(4000);
console.log('graphql listen 4000');

