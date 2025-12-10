
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    role: String!
    company_id: Int
    company_name: String
    created_at: String!
  }

  type Tender {
    id: ID!
    title: String!
    description: String
    status: String!
    deadline: String!
    budget: Float
    buyer: User!
    offers: [Offer!]
    created_at: String!
    updated_at: String!
  }

  type Offer {
    id: ID!
    tender_id: Int!
    supplier_id: Int!
    total_amount: Float!
    status: String!
    supplier: User!
    submitted_at: String!
  }

  type PaginationInfo {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
  }

  type TenderConnection {
    items: [Tender!]!
    pagination: PaginationInfo!
  }

  type Query {
    # Tender queries
    tender(id: ID!): Tender
    tenders(page: Int, limit: Int, status: String): TenderConnection!
    myTenders(page: Int, limit: Int): TenderConnection!
    
    # User queries
    me: User
    user(id: ID!): User
    
    # Offer queries
    offer(id: ID!): Offer
    offersByTender(tenderId: ID!): [Offer!]!
    myOffers(page: Int, limit: Int): [Offer!]!
  }

  type Mutation {
    # Tender mutations
    createTender(input: CreateTenderInput!): Tender!
    updateTender(id: ID!, input: UpdateTenderInput!): Tender!
    deleteTender(id: ID!): Boolean!
    
    # Offer mutations
    submitOffer(input: SubmitOfferInput!): Offer!
    updateOffer(id: ID!, input: UpdateOfferInput!): Offer!
    
    # Auth mutations
    login(email: String!, password: String!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!
  }

  input CreateTenderInput {
    title: String!
    description: String
    deadline: String!
    budget: Float
  }

  input UpdateTenderInput {
    title: String
    description: String
    deadline: String
    status: String
  }

  input SubmitOfferInput {
    tender_id: Int!
    total_amount: Float!
    line_items: String
  }

  input UpdateOfferInput {
    total_amount: Float
    status: String
  }

  input RegisterInput {
    email: String!
    password: String!
    role: String!
    company_name: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

module.exports = typeDefs;
