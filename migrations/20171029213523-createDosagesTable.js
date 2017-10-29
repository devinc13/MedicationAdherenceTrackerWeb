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

exports.up = function(db, callback) {
  db.createTable('dosages', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    dosageAmount: 'string',
    windowStartTime: 'timestamp',
    windowEndTime: 'timestamp',
    notificationTime: 'timestamp',
    route: 'string',
    medication: { type: 'int', 
    	foreignKey: {
          name: 'dosage_medication_id_fk',
          table: 'medications',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }  
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('dosages', callback);
};

exports._meta = {
  "version": 1
};
