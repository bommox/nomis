module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            libs: {
                files: [
                    {
                        expand: true, flatten: true, dest: 'app/lib/react/', filter: 'isFile',
                        src: ['node_modules/react/dist/react.js',
                            'node_modules/react/dist/react.min.js',
                            'node_modules/react-dom/dist/react-dom.js',
                            'node_modules/react-dom/dist/react-dom.min.js']
                    }
                ]
            }
        },
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    "app/app.js": "app/src/app.js"
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('default', ['babel']);

};