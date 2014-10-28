module.exports = function(grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    // load in the package.json data
    pkg: grunt.file.readJSON('package.json'),

    // fetch the config from pkg
    buildDir:     grunt.file.readJSON('package.json').config.buildDir,
    localDevPort: grunt.file.readJSON('package.json').config.localDevPort,

    // declare banner to prepend to files
    banner: [
      '/*!',
      ' * Project Name: <%= pkg.name %>',
      ' * Author: <%= pkg.author %>',
      ' * Date: <%= grunt.template.today() %>',
      ' */\n'
    ].join('\n'),

    // watch for changes and trigger sass and livereload
    watch: {
      options: { livereload: true },
      css: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass', 'autoprefixer']
      },
      js: {
        files: 'src/js/**/*.js',
        tasks: ['uglify']
      },
      html: {
        files: ['src/html/**/*.html'],
        tasks: ['bake']
      },
      assets: {
        files: ['src/images/**/*', 'src/fonts/**/*', 'src/downloads/**/*'],
        tasks: ['rsync:images', 'rsync:fonts', 'rsync:downloads']
      }
    },

    // sass
    sass: {
      dist: {
        options: {
          bundleExec: true,
          sourcemap: 'file'
        },
        files: {
          '<%= buildDir %>/css/microsite.css': 'src/scss/styles.scss',
        }
      }
    },

    // autoprefixer
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 9', 'ios 6', 'android 4']
      },
      files: {
        expand: true,
        flatten: true,
        src: '<%= buildDir %>/css/microsite.css',
        dest: '<%= buildDir %>/css'
      },
    },

    // css minification
    cssmin: {
      options: {
        banner: '<%= banner %>'
      },
      minify: {
        expand: true,
        cwd: '<%= buildDir %>/css/',
        src: ['microsite.css'],
        dest: '<%= buildDir %>/css',
        ext: '.css'
      }
    },

    // uglify to minify javascripts
    uglify: {
      // our scripts
      custom: {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: '*.js',
          dest: '<%= buildDir %>/js'
        }],
        options: {
          banner: '<%= banner %>'
        }
      },
      // 3rd party scripts
      vendor: {
        files: [{
          expand: true,
          cwd: 'src/js/vendor',
          src: '**/*.js',
          dest: '<%= buildDir %>/js'
        }]
      }
    },

    // compile html from includes
    bake: {
      build: {
        files: [{
          expand: true,
          cwd: 'src/html',
          src: '*.html',
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
      dist: {
        options: {
          optimizationLevel: 7,
          progressive: true,
          interlaced: true
        },
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['**/*.{png,jpg,gif}'],
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
    }

  });

  // standard build task, should be run before commiting
  grunt.registerTask('build', ['sass', 'autoprefixer', 'cssmin', 'uglify',
    'bake', 'rsync:images', 'rsync:fonts', 'rsync:downloads']);
  
  // recompile the microsite from scratch
  grunt.registerTask('rebuild', ['clean', 'rsync:framework', 'build']);
  
  // run the web server
  grunt.registerTask('server', 'connect:server');

  // register watch and the web server as the default task
  grunt.registerTask('default', ['concurrent:dev']);
};
