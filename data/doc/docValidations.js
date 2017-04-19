import { generateValidation } from 'validation';

export default (context) => {
  const validations = {
    date: {
      required : true,
      date     : true,
    },

    vehicleModel : {
      required : true,
    },

    vehiclePlateNumber : {
      required : true,
    },

    client : {
      promise : async (fielName, value, allValues) => {
        const {
          clientId : id,
          clientKey : key,
          clientDisplayName : displayName,
          clientEmail : email,
        } = allValues;

        if (key === 'id') {
          if (!id) {
            throw true;
          }

          // Is there a matching client
          try {
            await context.Users.get(id);
          } catch (e) {
            throw true;
          }

        } else if (displayName || email) {
          // Are there matching clients
          const users = await context.Users.getUsersByDisplayName({
            type : 'CLIENT',
            displayName,
            email,
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
      required : true,
      email    : true,
    },

    agent : {
      promise : async (fielName, value, allValues) => {
        const {
          agentId : id,
          agentKey : key,
          agentDisplayName : displayName,
          agentEmail : email,
        } = allValues;

        if (key === 'id') {
          if (!id) {
            throw true;
          }

          // Is there a matching client
          try {
            await context.Users.get(id);
          } catch (e) {
            throw true;
          }

        } else if (displayName || email) {
          // Are there matching clients
          const users = await context.Users.getUsersByDisplayName({
            type: 'AGENT',
            displayName,
            email,
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
      required : true,
      email    : true,
    },
  };

  return generateValidation(validations);
};

