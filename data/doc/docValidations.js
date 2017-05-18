import { generateValidation } from 'validation';

export default (context) => {
  const validations = {
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

    // vehicleModel : {
    //   required : true,
    // },

    vehiclePlateNumber : {
      required : true,
    },

    // company : {
    //   required : true,
    // },

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
            throw 'Key is `id` but `id` is not provided';
          }

          // Is there a matching client
          try {
            await context.Users.get(id);
          } catch (e) {
            throw `Client not found: ${id}`;
          }

        } else if (displayName || email) {
          // Are there matching clients
          const users = await context.Users.getUsersByDisplayNameAndEmail({
            type : 'CLIENT',
            displayName,
            email,
          });

          if (users.length !== 0) {
            throw `There are matching users for this displayName: ${displayName}`;
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
          agentId : id,
          agentKey : key,
          agentDisplayName : displayName,
          agentEmail : email,
        } = allValues;

        if (key === 'id') {
          if (!id) {
            throw 'Key is `id` but `id` is not provided';
          }

          // Is there a matching client
          try {
            await context.Users.get(id);
          } catch (e) {
            throw `Agent not found: ${id}`;
          }

        } else if (displayName || email) {
          // Are there matching clients
          const users = await context.Users.getUsersByDisplayNameAndEmail({
            type: 'AGENT',
            displayName,
            email,
          });

          if (users.length !== 0) {
            throw `There are matching users for this displayName: ${displayName}`;
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

  return generateValidation(validations);
};

