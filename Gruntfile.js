module.exports = function (grunt) {

    var cvPath = "cordovaApp/";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            libs: {
                files: [
                    {
                        expand: true, flatten: true, dest: 'app/lib/', filter: 'isFile',
                        src: ['node_modules/react/dist/react.js',
                            'node_modules/react/dist/react.min.js',
                            'node_modules/react-dom/dist/react-dom.js',
                            'node_modules/react-dom/dist/react-dom.min.js',
                            'node_modules/normalize.css/normalize.css',
                            'node_modules/jquery/dist/jquery.js',
                            'node_modules/howler/dist/howler.js']
                    }
                ]
            },
            cvApp : {
                expand: true,
                cwd: 'app',
                src: '**',
                dest: cvPath + 'www/'
            },
            cvConfig : {
                cwd: 'cordova',
                expand: true,
                src: '**',
                dest: cvPath
            }
        },
        less: {
            prod : {
                options : {
                    sourceMap : true,
                    outputSourceFiles: true,
                    sourceMapFileInline: true
                },
               files : {
                   'app/css/main.css' : 'app/less/main.less'
               }
            }
        },
        exec: {
            initCordova : {
                cmd : 'cordova create ' + cvPath + ' && cd ' + cvPath + ' && cordova platform add android'
            },
            buildAndroid : {
                cwd : cvPath,
                cmd : 'cordova build android --release --buildConfig=../cordova/build.json',
            },
            runAndroid : {
                cwd : cvPath,
                cmd : 'cordova run android',
            },
            compileTsx : {
                cmd : 'browserify --debug app/src/app.tsx -p [ tsify ] -o  app/app-bundle-ts.js'
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['less:prod', 'exec:compileTsx']);

    grunt.registerTask('postInstall', ['copy:libs', 'exec:initCordova', 'default']);
    grunt.registerTask('cordova', ['less:prod', 'copy:cvApp', 'copy:cvConfig' ]);
    grunt.registerTask('android', ['cordova', 'exec:runAndroid' ]);
    grunt.registerTask('buildAndroid', ['cordova', 'exec:buildAndroid' ]);

};