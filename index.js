const st = require('node-static');
const http = require('http');

function createServer(name, path, port, host, callback) {
  const fileServer = new st.Server(path, {
    cache: 0,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    serverInfo: `element:${name}`,
  });

  const base = `/node_modules/${name}`;

  const handler = (request, response) => {
    const forward = request.url.startsWith('/node_modules') === false;
    const file = request.url.replace(base, '');
    if (forward) {
      response.writeHead(302, { Location: `/node_modules/${name}${file}` });
      response.end();
    } else {
      fileServer.serve(request, response, (err, result) => {
        // catch 404's and try to resolve them using this alias:
        // /node_modules/module-name/* --> ./*
        if (err && err.status === 404) {
          request.url = file;
          fileServer.serve(request, response);
        }
      });
    }
  };

  const server = http.createServer();

  server.on('request', (request, response) => {
    request.on('end', () => handler(request, response)).resume();
  });

  server.listen(port, host, () => {
    if (callback instanceof Function) {
      callback(server.address());
    }
  });
}

module.exports = createServer;
