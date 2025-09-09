import {gql} from "graphql-tag"
import { userTypeDefs } from "./userTypeDefs.js"
import { userResolvers } from "../../srcresolvers/userResolvers.js"
import { helloTypeDefs } from "./helloTypeDefs.js"
import { helloResolvers } from "../../srcresolvers/helloResolvers.js"


const baseTypeDefs=gql`
 type Query{
    _empty:String

 }
 type Mutation{
    _empty:String
 }
`;

export const typeDefs=[baseTypeDefs,userTypeDefs,helloTypeDefs];
export const resolvers=[userResolvers,helloResolvers]

