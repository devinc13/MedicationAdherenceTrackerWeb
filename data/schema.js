/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  offsetToCursor,
  cursorForObjectInConnection,
} from 'graphql-relay';

import {
  User,
  Medication,
  Dosage,
  Adherence,
  getUserById,
  getUserByEmail,
  getMedication,
  getMedications,
  addMedication,
  editMedication,
  deleteMedication,
  getUserByMedicationId,
  addDosage,
  getDosage,
  getDosages,
  editDosage,
  deleteDosage,
  getAdherence,
  getDosageAdherences,
  addUser,
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUserById(id);
    } else if (type === 'Medication') {
      return getMedication(id);
    } else if (type === 'Dosage') {
      return getDosage(id);
    } else if (type === 'Adherence') {
      return getAdherence(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Medication)  {
      return medicationType;
    } else if (obj instanceof Dosage)  {
      return dosageType;
    } else if (obj instanceof Adherence)  {
      return adherenceType;
    } else {
      return null;
    }
  }
);


var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A patient',
  fields: () => ({
    id: globalIdField('User'),
    first_name : {
      type: GraphQLString,
      description: 'User\'s first name',
    },
    last_name : {
      type: GraphQLString,
      description: 'User\'s last name',
    },
    medications: {
      type: medicationConnection,
      description: 'A person\'s collection of medications',
      args: connectionArgs,
      resolve: (user, args) => getMedications(user.id).then(arr => connectionFromArray(arr, args)),
    },
  }),
  interfaces: [nodeInterface],
});

var medicationType = new GraphQLObjectType({
  name: 'Medication',
  description: 'A patient\'s medication',
  fields: () => ({
    id: globalIdField('Medication'),
    name: {
      type: GraphQLString,
      description: 'The name of the medication',
    },
    start: {
      type: GraphQLString,
      description: 'Medication start date',
    },
    end: {
      type: GraphQLString,
      description: 'Medication end date',
    },
    repeating: {
      type: GraphQLString,
      description: 'If the medication is to be taken daily, weekly, etc.',
    },
    notes: {
      type: GraphQLString,
      description: 'Any notes about the medication',
    },
    dosages: {
      type: dosageConnection,
      description: 'The dosages for the medication',
      args: connectionArgs,
      resolve: (medication, args) => getDosages(medication.id).then(arr => connectionFromArray(arr, args)),
    },
  }),
  interfaces: [nodeInterface],
});

var dosageType = new GraphQLObjectType({
  name: 'Dosage',
  description: 'A dosage for a medication',
  fields: () => ({
    id: globalIdField('Dosage'),
    dosageAmount: {
      type: GraphQLString,
      description: 'The amount of the dosage',
    },
    windowStartTime: {
      type: GraphQLString,
      description: 'Dosage window start time',
    },
    windowEndTime: {
      type: GraphQLString,
      description: 'Dosage window end time',
    },
    notificationTime: {
      type: GraphQLString,
      description: 'Time for the notification to show up',
    },
    route: {
      type: GraphQLString,
      description: 'The doage route',
    },
    dosageAdherences: {
      type: adherenceConnection,
      description: 'The adherence information for the dosage',
      args: {
        ...connectionArgs,
        startTimestamp: {
          type: GraphQLString
        },
        endTimestamp: {
          type: GraphQLString
        },
      },
      resolve: (dosage, args) => getDosageAdherences(dosage.id, args).then(arr => connectionFromArray(arr, args)),
    },
  }),
  interfaces: [nodeInterface],
});

var adherenceType = new GraphQLObjectType({
  name: 'Adherence',
  description: 'An adherence entry for a dosage',
  fields: () => ({
    id: globalIdField('Adherence'),
    adhered: {
      type: GraphQLBoolean,
      description: 'If the dosage instance was adhered to',
    },
    timestamp: {
      type: GraphQLString,
      description: 'Dosage time OR end of adherence window if not adhered',
    },
    notes: {
      type: GraphQLString,
      description: 'Dosage notes',
    },
  }),
  interfaces: [nodeInterface],
});


var {connectionType: medicationConnection, edgeType: medicationEdge} =
  connectionDefinitions({name: 'Medication', nodeType: medicationType});

var {connectionType: dosageConnection, edgeType: dosageEdge} =
  connectionDefinitions({name: 'Dosage', nodeType: dosageType});

var {connectionType: adherenceConnection, edgeType: adherenceEdge} =
  connectionDefinitions({name: 'Adherence', nodeType: adherenceType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    user: {
      type: userType,
      args: {
        email: {
          type: GraphQLString
        }
      },
      resolve: (root, {email}) => getUserByEmail(email),
    },
    medication: {
      type: medicationType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: (root, {id}) => {
        const localMedicationId = fromGlobalId(id).id;
        return getMedication(localMedicationId);
      },
    }
  }),
});



var AddMedicationMutation = mutationWithClientMutationId({
  name: 'AddMedication',
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    start: { type: new GraphQLNonNull(GraphQLString) },
    end: { type: new GraphQLNonNull(GraphQLString) },
    repeating: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: medication => getUserById(medication.userid),
    },
    medicationEdge: {
      type: medicationEdge,
      resolve: medication => {
        return getMedications(medication.userId).then(medications => {
          const offset = medications.indexOf(medications.find(m => m.id === medication.id));
          return {
            cursor: offsetToCursor(offset),
            node: medication
          };
        });
      }
    }
  },
  mutateAndGetPayload: ({userId, name, start, end, repeating, notes}) => {
    const localUserId = fromGlobalId(userId).id;
    return addMedication(localUserId, name, start, end, repeating, notes);
  },
});

var EditMedicationMutation = mutationWithClientMutationId({
  name: 'EditMedication',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    start: { type: new GraphQLNonNull(GraphQLString) },
    end: { type: new GraphQLNonNull(GraphQLString) },
    repeating: { type: new GraphQLNonNull(GraphQLString) },
    notes: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: medication => getUserById(medication.userid),
    },
    medication: {
      type: medicationType,
      resolve: medication => getMedication(medication.id),
    }
  },
  mutateAndGetPayload: ({id, name, start, end, repeating, notes}) => {
    const localMedicationId = fromGlobalId(id).id;
    return editMedication(localMedicationId, name, start, end, repeating, notes);
  },
});

var DeleteMedicationMutation = mutationWithClientMutationId({
  name: 'DeleteMedication',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: medication => getUserById(medication.userid),
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ id }) => id,
    }
  },
  mutateAndGetPayload: ({id}) => {
    const localMedicationId = fromGlobalId(id).id;
    return deleteMedication(localMedicationId);
  },
});

var AddDosageMutation = mutationWithClientMutationId({
  name: 'AddDosage',
  inputFields: {
    medicationId: { type: new GraphQLNonNull(GraphQLID) },
    dosageAmount: { type: new GraphQLNonNull(GraphQLString) },
    windowStartTime: { type: new GraphQLNonNull(GraphQLString) },
    windowEndTime: { type: new GraphQLNonNull(GraphQLString) },
    notificationTime: { type: new GraphQLNonNull(GraphQLString) },
    route: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: dosage => getUserByMedicationId(dosage.medicationid),
    },
    medication: {
      type: medicationType,
      resolve: dosage => getMedication(dosage.medicationid),
    },
    dosageEdge: {
      type: dosageEdge,
      resolve: dosage => {
        return getDosages(dosage.medicationid).then(dosages => {
          const offset = dosages.indexOf(dosages.find(d => d.id === dosage.id));
          return {
            cursor: offsetToCursor(offset),
            node: dosage
          };
        });
      }
    }
  },
  mutateAndGetPayload: ({medicationId, dosageAmount, windowStartTime, windowEndTime, notificationTime, route}) => {
    const localMedicationId = fromGlobalId(medicationId).id;
    return addDosage(localMedicationId, dosageAmount, windowStartTime, windowEndTime, notificationTime, route);
  },
});

var EditDosageMutation = mutationWithClientMutationId({
  name: 'EditDosage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    dosageAmount: { type: new GraphQLNonNull(GraphQLString) },
    windowStartTime: { type: new GraphQLNonNull(GraphQLString) },
    windowEndTime: { type: new GraphQLNonNull(GraphQLString) },
    notificationTime: { type: new GraphQLNonNull(GraphQLString) },
    route: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: medication => getUserById(medication.userid),
    },
    medication: {
      type: medicationType,
      resolve: medication => getMedication(medication.id),
    },
    dosage: {
      type: dosageType,
      resolve: dosage => getDosage(dosage.id),
    }
  },
  mutateAndGetPayload: ({id, dosageAmount, windowStartTime, windowEndTime, notificationTime, route}) => {
    const localDosageId = fromGlobalId(id).id;
    return editDosage(localDosageId, dosageAmount, windowStartTime, windowEndTime, notificationTime, route);
  },
});

var DeleteDosageMutation = mutationWithClientMutationId({
  name: 'DeleteDosage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    medicationid: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    user: {
      type: userType,
      resolve: ({ localMedicationId }) => getUserByMedicationId(localMedicationId),
    },
    medication: {
      type: medicationType,
      resolve: ({ localMedicationId }) => getMedication(localMedicationId),
    },
    deletedId: {
      type: GraphQLID,
      resolve: ({ id }) => id,
    }
  },
  mutateAndGetPayload: ({id, medicationid}) => {
    const localDosageId = fromGlobalId(id).id;
    const localMedicationId = fromGlobalId(medicationid).id;
    deleteDosage(localDosageId);
    return { id, localMedicationId };
  },
});

var AddUserMutation = mutationWithClientMutationId({
  name: 'AddUser',
  inputFields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    userId: {
      type: GraphQLID,
      resolve: (user) => user.id,
    }
  },
  mutateAndGetPayload: ({firstName, lastName, email, password}) => {
    return addUser(firstName, lastName, email, password);
  },
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addMedication: AddMedicationMutation,
    editMedication: EditMedicationMutation,
    deleteMedication: DeleteMedicationMutation,
    addDosage: AddDosageMutation,
    editDosage: EditDosageMutation,
    deleteDosage: DeleteDosageMutation,
    addUser: AddUserMutation,
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

