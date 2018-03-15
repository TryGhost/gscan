module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        shipit: {
            options: {
                workspace: '.',
                deployTo: '/opt/gscan',
                ignores: ['.git', '.gitkeep', '.gitignore', '.jshintrc', 'node_modules'],
                keepReleases: 5
            },
            prd: {
                servers: ['app@gscan.ghost.org']
            }
        }
    });

    grunt.loadNpmTasks('grunt-shipit');
    grunt.loadNpmTasks('shipit-deploy');

    grunt.shipit.on('published', function () {
        grunt.task.run(['link-node-modules', 'link-uploads', 'create-tmp', 'npm-install', 'start']);
    });

    grunt.registerTask('link-node-modules', function () {
        var done = this.async(),
            deployDir = grunt.config('shipit.options.deployTo'),
            current = deployDir + '/current';

        grunt.shipit.remote('mkdir -p ' + deployDir + '/shared/node_modules', function () {
            grunt.shipit.remote('ln -nfs ' + deployDir + '/shared/node_modules ' + current + '/node_modules', done);
        });
    });

    grunt.registerTask('link-uploads', function () {
        var done = this.async(),
            deployDir = grunt.config('shipit.options.deployTo'),
            current = deployDir + '/current';

        grunt.shipit.remote('mkdir -p ' + deployDir + '/shared/uploads', function () {
            grunt.shipit.remote('ln -nfs ' + deployDir + '/shared/uploads ' + current + '/uploads', done);
        });
    });

    grunt.registerTask('create-tmp', function () {
        var done = this.async(),
            current = grunt.config('shipit.options.deployTo') + '/current';

        grunt.shipit.remote('mkdir -p ' + current + '/tmp', done);
    });

    grunt.registerTask('npm-install', function () {
        var done = this.async(),
            current = grunt.config('shipit.options.deployTo') + '/current';

        grunt.shipit.remote('cd ' + current + ' && npm install', done);
    });

    grunt.registerTask('start', function () {
        var done = this.async(),
            deployDir = grunt.config('shipit.options.deployTo'),
            current = deployDir + '/current';

        grunt.shipit.remote('cd ' + current + ' && touch tmp/restart.txt', done);
    });

    grunt.registerTask('deploy', [
        'deploy:init',
        'deploy:update',
        'deploy:publish',
        'deploy:clean'
    ]);
};
