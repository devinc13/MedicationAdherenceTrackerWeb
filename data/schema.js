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
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  getUserById,
  getUserByEmail,
  getMedication,
  getMedications,
  addMedication,
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
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj.__type === 'user') {
      return userType;
    } else if (obj.__type === 'medication')  {
      return medicationType;
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
  }),
  interfaces: [nodeInterface],
});


var {connectionType: medicationConnection, edgeType: medicationEdge} =
  connectionDefinitions({name: 'Medication', nodeType: medicationType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    user: {
      type: userType,
      args: {
        email: {
          type: GraphQLString
        }
      },
      resolve: (root, {email}) => getUserByEmail(email),
    },
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

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addMedication: AddMedicationMutation,
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

