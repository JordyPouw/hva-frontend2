module.exports = function(grunt) {
  grunt.initConfig({
       
    // Named tasks will go here.
    less: {
      options: {
        compress: true,
        cleancss: true
     },
     files: {
       "/css/main.css": "/css/main.less"
     }
    },
    watch: {
      styles: {
        options: {
          spawn: false
        },
        files: [ "/css/*.css", "/css/*.less"],
        tasks: [ "less" ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default task can run by typing "grunt" in the CLI.
  grunt.registerTask('default', ['watch']);
};