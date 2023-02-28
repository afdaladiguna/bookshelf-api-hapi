const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const port = 9000;

const init = async () => {

    const server = Hapi.server({
        port: port,
        host: 'localhost'
    });

    server.route(routes);

    await server.start();
    console.log(`Server running on port ${port}`);
};

init();