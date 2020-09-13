// gruntfile for js13k projects
module.exports = function(grunt) {

    grunt.initConfig({

        package: grunt.file.readJSON('package.json'),
        concat: {

            options: {

                separator: ';'
            },
            dist: {

                src: ['src/**/*.js'],
                dest: 'dist/main.js'
            }
        },
        uglify: {

            dist: {

                files: {

                    'dist/main.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        // this put all the js inline in the html
        smoosher: {

            options: {

                jsTags: {

                    start: '<script type="text/javascript">',
                    end: '</script>'
                },
            },

            all: {

                files: {

                    'dist/index.html': 'src/index_template.html',
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html-smoosher');

    grunt.registerTask('default', ['concat', 'uglify', 'smoosher']);
};