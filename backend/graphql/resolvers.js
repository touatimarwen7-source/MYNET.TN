
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const { TenderService } = require('../services/TenderService');
const { OfferService } = require('../services/OfferService');
const { UserService } = require('../services/UserService');

const resolvers = {
  Query: {
    // Tender queries
    tender: async (_, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Must be logged in');
      }
      return await TenderService.getTenderById(id);
    },

    tenders: async (_, { page = 1, limit = 20, status }, context) => {
      const result = await TenderService.getTenders({ page, limit, status });
      return {
        items: result.tenders,
        pagination: result.pagination,
      };
    },

    myTenders: async (_, { page = 1, limit = 20 }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Must be logged in');
      }
      const result = await TenderService.getMyTenders(context.user.id, { page, limit });
      return {
        items: result.tenders,
        pagination: result.pagination,
      };
    },

    // User queries
    me: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError('Must be logged in');
      }
      return context.user;
    },

    user: async (_, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Must be logged in');
      }
      return await UserService.getUserById(id);
    },

    // Offer queries
    offer: async (_, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Must be logged in');
      }
      return await OfferService.getOfferById(id);
    },

    offersByTender: async (_, { tenderId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Must be logged in');
      }
      return await OfferService.getOffersByTender(tenderId);
    },

    myOffers: async (_, { page = 1, limit = 20 }, context) => {
      if (!context.user || context.user.role !== 'supplier') {
        throw new AuthenticationError('Must be logged in as supplier');
      }
      return await OfferService.getMyOffers(context.user.id, { page, limit });
    },
  },

  Mutation: {
    // Tender mutations
    createTender: async (_, { input }, context) => {
      if (!context.user || context.user.role !== 'buyer') {
        throw new AuthenticationError('Must be logged in as buyer');
      }
      return await TenderService.createTender({ ...input, buyer_id: context.user.id });
    },

    updateTender: async (_, { id, input }, context) => {
      if (!context.user || context.user.role !== 'buyer') {
        throw new AuthenticationError('Must be logged in as buyer');
      }
      return await TenderService.updateTender(id, input, context.user.id);
    },

    deleteTender: async (_, { id }, context) => {
      if (!context.user || context.user.role !== 'buyer') {
        throw new AuthenticationError('Must be logged in as buyer');
      }
      await TenderService.deleteTender(id, context.user.id);
      return true;
    },

    // Offer mutations
    submitOffer: async (_, { input }, context) => {
      if (!context.user || context.user.role !== 'supplier') {
        throw new AuthenticationError('Must be logged in as supplier');
      }
      return await OfferService.submitOffer({ ...input, supplier_id: context.user.id });
    },
  },

  // Field resolvers
  Tender: {
    buyer: async (tender) => {
      return await UserService.getUserById(tender.buyer_id);
    },
    offers: async (tender) => {
      return await OfferService.getOffersByTender(tender.id);
    },
  },

  Offer: {
    supplier: async (offer) => {
      return await UserService.getUserById(offer.supplier_id);
    },
  },
};

module.exports = resolvers;
