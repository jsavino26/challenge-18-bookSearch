import User from '../models/User.js';
import { signToken } from '../services/auth.js';

interface Context {
  token: {
    _id: string;
  };
}

interface LoginArgs {
  email: string;
  password: string;
}

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface SaveBookArgs {
  book: {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
  };
}

interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.token) throw new Error('Not authenticated');
      const user = await User.findById(context.token._id);
      return user;
    },
  },
  Mutation: {
    login: async (_parent: unknown, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent: unknown, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: unknown, { book }: SaveBookArgs, context: Context) => {
      if (!context.token) throw new Error('Not authenticated');
      const updatedUser = await User.findByIdAndUpdate(
        context.token._id,
        { $addToSet: { savedBooks: book } },
        { new: true }
      );
      return updatedUser;
    },
    removeBook: async (_parent: unknown, { bookId }: RemoveBookArgs, context: Context) => {
      if (!context.token) throw new Error('Not authenticated');
      const updatedUser = await User.findByIdAndUpdate(
        context.token._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

export default resolvers;