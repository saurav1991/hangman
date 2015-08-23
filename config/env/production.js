/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
     connection: 'prodMongodbServer',
     migrate: 'safe'
  },
  session: {
    adapter: 'redis',
    host: 'cod.redistogo.com',
    port: 9875,
    // ttl: <redis session TTL in seconds>,
    db: 'redistogo',
    pass: '386280d6ef596e12e8d9a1736b1ff0f6'
  },
  sockets: {
    adapter: 'socket.io-redis',
    host: 'cod.redistogo.com',
    port: 9875,
    db: 'redistogo',
    pass: '386280d6ef596e12e8d9a1736b1ff0f6',
  },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
