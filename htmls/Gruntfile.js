module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        watch: {
            client: {
                files: [  
                    'index.html',
                    'statics/css/*.css', 
                    'statics/css/*.scss', 
                ],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('live', ["watch"]);

};