'use strict';

var server = require('./server'),
    nconf = require('nconf'),
    async = require('async'),
    logger = require('winston');

require('dotenv').load();

nconf.use('memory');
nconf.argv();
nconf.env();
require('./config/environments/' + nconf.get('NODE_ENV'));

logger.info('[APP] Starting server initialization');

async.series([
  function startServer(callback) {
    server(callback);
  }], function(err) {
    if(err) {
      logger.error('[APP] initialisation failed', err);
    } else {
      logger.info('[APP] initialized SUCCESSFULLY');
    }
  }
);
