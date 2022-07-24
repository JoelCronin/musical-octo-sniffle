const { Book, User} = require('../models')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, {id}) => {
            return User.findOne({_id: id})
        },
    },

    Mutation: {
        login: async (parent, { email, password}) => {
            const user = await User.findOne({email});

            if (!user) {
                throw new AuthenticationError('No user with this email address')
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
              }
        
              const token = signToken(user);
        
              return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },


    }
};

module.exports = resolvers;