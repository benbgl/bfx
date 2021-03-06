var express = require('express'),
    path = require('path'),
    config = require('nconf')
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    logger = require('winston'),
    mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    app = null,
    dbOptions = {
      host: 'localhost',
      user: 'support',
      password: 'orbit618nation',
      port: 3306,
      database: 'z_bidform'
    },
    start = function(cb) {
      'use strict';

      app = express();

      app.use(morgan('common'));
      app.use(bodyParser.urlencoded({extended:true}));
      app.use(bodyParser.json({type: '*/*'}));

      logger.info('[SERVER] Initializing routes');
      require('./app/routes/index')(app);

      app.use(express.static(path.join(__dirname, 'public')));

      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        req.json({
          message: err.message,
          error: err
        });
        next(err);
      });

      app.use(myConnection(mysql, dbOptions, 'pool'));

      app.listen(config.get('NODE_PORT'));
      logger.info('[SERVER] Listening on port ' + config.get('NODE_PORT'));

      if(cb) {
        return cb();
      }
    };

module.exports = start;
