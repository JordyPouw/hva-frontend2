module.exports = function(grunt) {
  grunt.initConfig({
       
    // Named tasks will go here.
    less: {
      options: {
        compress: true,
        cleancss: true,
        paths: ["css"]
      },
      src: {
          expand: true,
          cwd: "css",
          src: "*.less",
          dest: "css",
          ext: ".css"
        }
    },

    watch: {
      css: {
        files: "css/*.less",
        tasks: ["less"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default task can run by typing "grunt" in the CLI.
  grunt.registerTask('default', ['watch']);
};