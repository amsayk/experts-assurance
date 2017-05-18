import { generateValidation } from 'validation';

import { client as apolloClient } from 'apollo';

import GET_MATCHING_USERS_QUERY from './getMatchingUsers.query.graphql';

const validations = {
  // isOpen: {
  //   required : true,
  // },

  dateMission: {
    required : true,
    date     : true,
  },

  date: {
    required : true,
    date     : true,
  },

  vehicleManufacturer : {
    required : true,
  },

  vehicleModel : {
    required : true,
  },

  vehiclePlateNumber : {
    required : true,
  },

  company : {
    required : true,
  },

  client : {
    promise : async (fielName, value, allValues) => {
      const {
        clientKey : key,
        clientDisplayName : displayName,
        clientEmail : email,
      } = allValues;

      if (!key && (displayName || email)) {
        // Are there matching clients
        const { data: { users } } = await apolloClient.query({
          query : GET_MATCHING_USERS_QUERY,
          variables : {
            type: 'CLIENT',
            displayName,
            email,
          },
        });

        if (users.length !== 0) {
          throw true;
        }
      }

      return false;
    },
  },
  clientDisplayName : {
    required : true,
  },
  clientEmail : {
    // required : true,
    email    : true,
  },

  agent : {
    promise : async (fielName, value, allValues) => {
      const {
        agentKey : key,
        agentDisplayName : displayName,
        agentEmail : email,
      } = allValues;

      if (!key && (displayName || email)) {
        // Are there matching agents
        const { data: { users } } = await apolloClient.query({
          query : GET_MATCHING_USERS_QUERY,
          variables : {
            type: 'AGENT',
            displayName,
            email,
          },
        });

        if (users.length !== 0) {
          throw true;
        }
      }

      return false;
    },
  },
  agentDisplayName : {
    required : true,
  },
  agentEmail : {
    // required : true,
    email    : true,
  },
};

export default generateValidation(validations);

