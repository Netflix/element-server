#! /usr/bin/env node

const server = require('../index.js');

const host = process.env.SERVER_HOST || '0.0.0.0';
const path = process.env.SERVER_PATH || process.argv[2] || '.';
const port = process.env.SERVER_PORT || process.argv[3] || 8080;
const name = process.env.npm_package_name;

server(name, path, port, host, info => {
  /* eslint-disable no-console */
  console.log(`http://${info.address}:${info.port}/node_modules/${name}/`);
  /* eslint-enable no-console */
});
