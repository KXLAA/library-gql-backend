const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    addAuthor(name: String!, born: Int): Author
    editAuthor(id: ID!, setBornTo: Int): Author
    createUser(username: String!, favoriteGenre: String): User
    login(username: String!, password: String!): Token
  }

  type Book {
    id: ID!
    title: String!
    published: Int!
    author: Author
    genres: [String]!
  }

  type Author {
    id: ID!
    name: String!
    bookCount: Int!
    born: Int
  }

  type User {
    id: ID!
    username: String!
    favoriteGenre: String!
  }

  type Token {
    value: String!
  }
`;

module.exports = typeDefs;
