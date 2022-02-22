const Author = require("./models/author");
const Book = require("./models/book");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const { AuthenticationError, UserInputError, gql } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");

require("dotenv").config();

const pubsub = new PubSub();

const JWT_SECRET = process.env.SECRET;

const resolvers = {
  Query: {
    me: (_, __, { currentUser }) => {
      return currentUser;
    },
    bookCount: () => {
      return Book.collection.countDocuments();
    },
    authorCount: async () => {
      return Author.collection.countDocuments();
    },
    allBooks: async (_, { author, genre }) => {
      const authorId = await Author.findOne({
        name: author?.toLowerCase(),
      });

      if (author) {
        return await Book.find({ author: authorId.id });
      }
      if (genre) {
        return await Book.find({ genres: { $in: genre } });
      }
      return await Book.find({});
    },
    allAuthors: async () => {
      return await Author.find({});
    },
  },

  Author: {
    bookCount: async (author) => {
      const authorId = await Author.findOne({
        name: author.name,
      });
      const books = await Book.find({ author: authorId.id });
      return books.length;
    },
  },

  Book: {
    author: async (book) => {
      return await Author.findById(book.author);
    },
  },

  Mutation: {
    addBook: async (_, args, { currentUser }) => {
      const author = await Author.findOne({ name: args.author?.toLowerCase() });
      const book = new Book({ ...args, author: author?.id || null });

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      pubsub.publish("BOOK_ADDED", { bookAdded: book });
      return await book;
    },
    addAuthor: async (_, args) => {
      const author = new Author({ ...args });
      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return await author;
    },
    editAuthor: async (_, args, { currentUser }) => {
      let authorToUpdate = await Author.findById(args.id);
      authorToUpdate.born = args.setBornTo;
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }
      try {
        await authorToUpdate.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return authorToUpdate;
    },
    createUser: async (_, args) => {
      const user = await new User({ ...args });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
