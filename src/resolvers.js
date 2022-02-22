const Author = require("./models/author");
const Book = require("./models/book");

const resolvers = {
  Query: {
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
        return await Book.find({ genre: { $in: genre } });
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
    addBook: async (_, args) => {
      const author = await Author.findOne({ name: args.author?.toLowerCase() });
      const book = new Book({ ...args, author: author.id || null });
      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
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

    editAuthor: async (_, args) => {
      let authorToUpdate = await Author.findOne({ name: args.name });
      authorToUpdate.born = args.setBornTo;
      try {
        await authorToUpdate.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return authorToUpdate;
    },
  },
};

module.exports = resolvers;
