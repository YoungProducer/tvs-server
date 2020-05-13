const production = process.env.NODE_ENV === 'production';

const { app, server } = require(production ? '../dist/lib/index' : '../lib/index');

server.listen(app.get('PORT'), () => {
    console.log(`App listening to ${app.get('PORT')}...`, `mode: ${app.get('env')}`);
});
