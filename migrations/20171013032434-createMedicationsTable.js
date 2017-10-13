'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable('medications', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    start: 'timestamp',
    end: 'timestamp',
    repeating: 'string',
    notes: 'string',
    user: { type: 'int', 
    	foreignKey: {
          name: 'medication_user_id_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }  
    }
  }, callback);
}

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
