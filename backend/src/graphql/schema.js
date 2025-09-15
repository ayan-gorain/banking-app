import {gql} from "graphql-tag"
import { userTypeDefs } from "./userTypeDefs.js"
import { userResolvers } from "../../srcresolvers/userResolvers.js"
import { helloTypeDefs } from "./helloTypeDefs.js"
import { helloResolvers } from "../../srcresolvers/helloResolvers.js"
import { bankAccountTypeDefs } from "./bankAccountTypeDef.js"
import { bankAccountResolvers } from "../../srcresolvers/bankAccountResolvers.js"
import { adminTypeDefs } from "./adminTypeDefs.js"
import { adminResolvers } from "../../srcresolvers/adminResolvers.js"


const baseTypeDefs=gql`
 type Query{
    _empty:String
 
 }
 type Mutation{
    _empty:String
 }
`;

export const typeDefs=[baseTypeDefs,userTypeDefs,helloTypeDefs,bankAccountTypeDefs,adminTypeDefs];
export const resolvers=[userResolvers,helloResolvers,bankAccountResolvers,adminResolvers]

