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
  db.createTable('dosage_recordings', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    timestamp: 'timestamp',
    notes: 'string',
    dosageid: { type: 'int',
    	foreignKey: {
          name: 'dosage_recording_dosage_id_fk',
          table: 'dosages',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }  
    }
  }, callback);

  db.createTable('dosage_adherences', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    adhered: 'boolean',
    timestamp: 'timestamp',
    notes: 'string',
    dosageid: { type: 'int',
    	foreignKey: {
          name: 'dosage_recording_dosage_id_fk',
          table: 'dosages',
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
  db.dropTable('dosage_recordings', callback);
  db.dropTable('dosage_adherences', callback);
};

exports._meta = {
  "version": 1
};

