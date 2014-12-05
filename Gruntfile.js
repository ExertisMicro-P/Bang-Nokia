module.exports = function(grunt) {

  // load all grunt tasks matching the `grunt-*` pattern (and assemble)
  require('load-grunt-tasks')(grunt, { pattern: ['grunt-*', 'assemble'] });

  // load in local custom grunt tasks
  grunt.loadTasks('grunt/tasks');

  grunt.initConfig({

    // load in the package.json data
    pkg: grunt.file.readJSON('package.json'),

    // fetch the config from pkg
    buildDir:     '<%= pkg.config.buildDir %>',
    localDevPort: '<%= pkg.config.localDevPort %>',
    environments: '<%= pkg.config.environments %>',

    // declare banner to prepend to files
    banner: [
      '/*!',
      ' * Project Name: <%= pkg.name %>',
      ' * Author: <%= pkg.author %>',
      ' */\n'
    ].join('\n'),

    // watch for changes and trigger relevant tasks with livereload
    watch: {
      options: { livereload: true },
      css: {
        files: 'src/scss/**',
        tasks: ['sass', 'autoprefixer']
      },
      js: {
        files: 'src/js/**',
        tasks: 'uglify'
      },
      html: {
        files: 'src/content/**',
        tasks: 'assemble'
      },
      images: {
        files: 'src/images/**',
        tasks: ['newer:imagemin:src', 'rsync:images']
      },
      fonts: {
        files: 'src/fonts/**',
        tasks: 'rsync:fonts'
      },
      downloads: {
        files: 'src/downloads/**',
        tasks: 'rsync:downloads'
      }
    },

    // sass
    sass: {
      build: {
        options: {
          bundleExec: true,
          sourcemap: 'inline',
          banner: '<%= banner %>'
        },
        files: {
          '<%= buildDir %>/css/microsite.css': 'src/scss/styles.scss'
        }
      }
    },

    // autoprefixer
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 9', 'ios 6', 'android 4'],
        map: true
      },
      files: {
        expand: true,
        flatten: true,
        src: '<%= buildDir %>/css/microsite.css',
        dest: '<%= buildDir %>/css'
      },
    },

    // script minification
    uglify: {
      custom: { // our scripts
        files: [{
          expand: true,
          cwd: 'src/js',
          src: '*.js',
          dest: '<%= buildDir %>/js'
        }],
        options: {
          banner: '<%= banner %>',
          // minimal minification to allow exertis to tweak scripts if neccessary
          mangle: false,
          compress: false,
          beautify: true
        }
      },
      vendor: { // 3rd party scripts
        files: [{
          expand: true,
          cwd: 'src/js/vendor',
          src: '**/*.js',
          dest: '<%= buildDir %>/js'
        }]
      }
    },

    // compile html
    assemble: {
      options: {
        layoutdir: 'src/content/layouts',
        partials: 'src/content/partials/**/*.{hbs,html}',
        data: 'src/content/data/**/*.json',
        helpers: ['handlebars-helper-partial', 'src/content/helpers/**/*.js']
      },
      build: {
        options: {
          layout: 'default.hbs'
        },
        files: [{
          expand: true,
          cwd: 'src/content/pages',
          src: '**/*.{hbs,html}',
          dest: '<%= buildDir %>'
        }]
      }
    },

    // copy other assets (images, fonts, downloadable files, etc) to build directory
    rsync: {
      options: {
        args: ['--delete'],
        exclude: ['.git*'],
        recursive: true
      },
      framework: {
        options: {
          src: ['multi-page/js', 'multi-page/css'],
          dest: '<%= buildDir %>'
        }
      },
      images: {
        options: {
          src: 'src/images',
          dest: '<%= buildDir %>'
        }
      },
      fonts: {
        options: {
          src: 'src/fonts',
          dest: '<%= buildDir %>'
        }
      },
      downloads: {
        options: {
          src: 'src/downloads',
          dest: '<%= buildDir %>'
        }
      }
    },

    // losslessly compress all images in /src/images
    imagemin: {
      src: {
        options: {
          optimizationLevel: 7,
          progressive: true,
          interlaced: true
        },
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: '**/*.{png,jpg,gif}',
          dest: 'src/images/'
        }]
      }
    },

    // development web server
    connect: {
      server: {
        options: {
          port: '<%= localDevPort %>',
          keepalive: true,
          open: {
            target: 'http://localhost:<%= localDevPort %>?project=<%= buildDir %>'
          }
        }
      }
    },

    // for wiping and starting the build from fresh
    clean: {
      build: '<%= buildDir %>'
    },

    // single task for starting server and watching files for changes
    concurrent: {
      dev: ['server', 'watch'],
      options: { logConcurrentOutput: true }
    },

    // for running deploy shell command (see grunt/tasks/deploy.js)
    shell: {
      options: {
        stdinRawMode: true // this is required for sudo password prompt
      },
      deploy: {
        command: function (environment_id) {
          var environment = grunt.config.get('environments')[environment_id],
              cmd = 'ssh -tt ' + environment.host + ' \'cd ' + environment.directory + ' && sudo deploy || ./deploy.sh\'';
          grunt.log.subhead('Deploying site ' + environment.directory.replace(/^\/data\//, '') + ' on ' + environment.host);
          grunt.log.debug('Command: ' + cmd);
          return cmd;
        }
      }
    }
  });

  // standard build task, should be run before commiting
  grunt.registerTask('build', ['sass', 'autoprefixer', 'uglify', 'assemble',
                     'newer:imagemin', 'rsync:images', 'rsync:fonts',
                     'rsync:downloads']);

  // recompile the microsite from scratch
  grunt.registerTask('rebuild', ['clean', 'rsync:framework', 'build']);

  // run the web server
  grunt.registerTask('server', 'connect:server');

  // register watch and the web server as the default task
  grunt.registerTask('default', ['concurrent:dev']);
};
