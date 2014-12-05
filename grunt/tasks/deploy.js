// custom deploy task
// moved from main Gruntfile to seperate this complexity.
// relies on shell:deploy:[env] task

module.exports = function(grunt) {

  grunt.registerTask('deploy', 'Deploy to remote server.', function(environment_id) {

    var environments = grunt.config.get('environments');

    // ensure we have atleast one environment in package.json
    if ( typeof environments !== 'object' || Object.keys(environments).length < 1) {
      grunt.warn('No environments specified in package.json.');
    }

    // ensure we've been given an environment to deploy to
    if ( environment_id === undefined ) {
      grunt.warn('Environment must be specified, e.g. deploy:' + Object.keys(environments)[0] + '.');
    }

    // ensure the environment we've been given exists in package.json
    if ( ! ( environment_id in environments ) ) {
      grunt.warn('Unregonised environment \'' + environment_id + '\'. ' +
        'Available environments: [' + Object.keys(environments) + '].');
    }

    // ensure the we have a 'host' and 'directory' for the environment
    ['host', 'directory'].forEach(function (prop) {
       if ( ! ( prop in environments[environment_id] ) ) {
        grunt.warn('No \'' + prop + '\' specified in package.json for \'' + environment_id + '\' environment.');
      }
    });

    // green light - run the deploy shell comand
    grunt.task.run('shell:deploy:' + environment_id);

  });

};
