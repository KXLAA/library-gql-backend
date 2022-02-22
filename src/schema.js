const { ApolloServer, UserInputError, gql } = require("apollo-server");

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
      genres: [String]
    ): Book
    addAuthor(name: String!, born: Int): Author
    editAuthor(name: String!, setBornTo: Int): Author
  }

  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author!
    genres: [String]!
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
  }
`;

module.exports = typeDefs;
