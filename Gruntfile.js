module.exports = function (grunt) {

    // Pull defaults (including username and password) from .screeps.json
    var config = require('./screeps.json')

    // Allow grunt options to override default configuration
    var branch = grunt.option('branch') || config.branch;
    var email = grunt.option('email') || config.email;
    var password = grunt.option('password') || config.password;
    var ptr = grunt.option('ptr') ? true : config.ptr

    // Load needed tasks
    grunt.loadNpmTasks('grunt-screeps')
    grunt.loadNpmTasks('grunt-contrib-copy')

    grunt.initConfig({

        // Push all files in the dist folder to screeps. What is in the dist folder
        // and gets sent will depend on the tasks used.
        screeps: {
            options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['dist/*.js']
            }
        },

        // Copy all source files into the dist folder, flattening the folder
        // structure by converting path delimiters to underscores
        copy: {
            // Pushes the game code to the dist folder so it can be modified before
            // being send to the screeps server.
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        if (src.endsWith('.map')) {
                            return dest + src + '.js'
                        } else {
                            return dest + src
                        }
                    }
                }],
            }
        },
    })

    // Combine the above into a default task
    grunt.registerTask('default', ['copy:screeps']);
}