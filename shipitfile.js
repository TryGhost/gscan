function init(shipit) {
    require('@tryghost/deploy')(shipit);

    shipit.initConfig({
        default: {
            yarn: true,
            workspace: './',
            deployTo: '/opt/gscan/',
            ignores: ['.git', '.gitkeep', '.gitignore', '.eslintrc.js', '.eslintcache', 'node_modules', '/test', '/app/public/.eslintrc.js']
        },
        staging: {
            servers: process.env.STG_USER + '@' + process.env.STG_SERVER,
            sharedLinks: [{
                name: 'node_modules',
                type: 'directory'
            }, {
                name: 'uploads',
                type: 'directory'
            }, {
                name: 'config.staging.json',
                type: 'file'
            }]
        },
        production: {
            servers: process.env.PRD_USER + '@' + process.env.PRD_SERVER,
            sharedLinks: [{
                name: 'node_modules',
                type: 'directory'
            }, {
                name: 'uploads',
                type: 'directory'
            }, {
                name: 'config.production.json',
                type: 'file'
            }]
        }
    });
}
module.exports = init;
