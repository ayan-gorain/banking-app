import gql from "graphql-tag";

export const adminTypeDefs = gql`
  type Admin {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type AdminAuthPayload {
    token: String!
    admin: Admin!
  }

  extend type Mutation {
    adminLogin(email: String!, password: String!): AdminAuthPayload
  }
`;
