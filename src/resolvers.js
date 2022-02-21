import { v4 as uuidv4 } from "uuid";

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

const resolvers = {
  Query: {
    bookCount: () => {
      return books.length;
    },
    authorCount: () => {
      return authors.length;
    },
    allBooks: (_, { author, genre }) => {
      if (author) {
        return books.filter((a) => a.author === author);
      }
      if (genre) {
        return books.filter((b) => b.genres.find((g) => g === genre));
      }
      return books;
    },
    allAuthors: () => {
      return authors;
    },
  },
  Author: {
    bookCount: (root) => {
      return books.filter((a) => a.author === root.name).length;
    },
  },
  Mutation: {
    addBook: (_, args) => {
      let book = { ...args, id: uuidv4() };
      books = books.concat(book);
      return book;
    },
    editAuthor: (_, { name, setBornTo }) => {
      let authorToUpdate = authors.find((author) => author.name === name);
      if (!authorToUpdate) {
        return null;
      }
      const updatedAuthor = { ...authorToUpdate, born: setBornTo };
      authors = authors.map((a) => (a.name === name ? updatedAuthor : a));
      return updatedAuthor;
    },
  },
};

export default resolvers;
