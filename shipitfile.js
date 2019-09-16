function parseServerList(env) {
    var user = env === 'staging' ? process.env.STG_USER : process.env.PRD_USER;
    var server = env === 'staging' ? process.env.STG_SERVER : process.env.PRD_SERVER;
    try {
        var srvConfig = JSON.parse(server);
        srvConfig = srvConfig.map(function (item) {
            return user + '@' + item;
        });
        return srvConfig;
    } catch (e) {
        return user + '@' + server;
    }
}

function init(shipit) {
    require('@tryghost/deploy')(shipit);

    var srv = parseServerList(shipit.environment);
    var configFile = 'config.' + shipit.environment + '.json';

    shipit.initConfig({
        default: {
            yarn: true,
            workspace: './',
            deployTo: '/opt/gscan/',
            ignores: ['.git', '.gitkeep', '.gitignore', '.eslintrc.js', '.eslintcache', 'node_modules', '/test', '/app/public/.eslintrc.js'],
            sharedLinks: [{
                name: 'node_modules',
                type: 'directory'
            }, {
                name: 'uploads',
                type: 'directory'
            }, {
                name: configFile,
                type: 'file'
            }]
        },
        staging: {
            servers: srv
        },
        production: {
            servers: srv
        }
    });
}
module.exports = init;
