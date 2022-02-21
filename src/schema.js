import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book
    editAuthor(name: String!, setBornTo: Int): Author
  }

  type Book {
    id: ID!
    title: String!
    published: Int!
    author: String!
    genres: [String]!
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
  }
`;

export default typeDefs;
