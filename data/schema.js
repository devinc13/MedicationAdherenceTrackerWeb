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
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  getUser,
  getMedication,
  getMedications,
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
      return getUser(id);
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
      resolve: (_, args) => connectionFromArray(getMedications(), args),
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


var {connectionType: medicationConnection} =
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
      resolve: () => getUser(),
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
