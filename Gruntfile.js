const { task } = require("grunt");

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                files: {
                    './dev/styles/main.css': './src/styles/main.less' // destino e origem
                },
            },
            production: {
                options: {
                    compress: true,
                },
                files: {
                    './dist/styles/main.min.css': './src/styles/main.less' // destino e origem
                }
            }
        },

        watch: {
            less: {
                files: ['src/styles/**/*.less'], // qual arquivo vai ser assistido
                tasks: ['less:development'] // qual tarefa a ser executada
            },

            html: {
                files : ['src/index.html'], // qual arquivo vai ser assistido
                tasks:['replace:dev'] // qual tarefa a ser executada
            }
        },

        replace: { // para fazer automação e mudança de arquivos
            dev: { // pasta dev é aonde é a criado o projeto por automatização
                options: {
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS', // variavel para automatizar endereço do CSS
                            replacement: './styles/main.css'// irá mudar o endereço para o local do arquivo especificado
                        },
                        {
                            match: 'ENDERECO_DO_JS', 
                            replacement: '../src/scripts/main.js'
                        }
                    ]
                },
                files:[
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'], // apartir deste arquivo surgirá as mudanças 
                        dest:'dev/' // pasta destino aonde será criado o desenvolvimento
                    }
                ]
            },
            dist: { // pasta de onde sera feito o deploy
                options: { 
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS', // variavel para automatizar o endereço correto do css
                            replacement: './styles/main.min.css' // endereço do arquivo criado por automatização minificado
                        },
                        {
                            match: 'ENDERECO_DO_JS', 
                            replacement: './scripts/main.min.js'
                        }
                    ]
                },
                files:[
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'], // pasta destino criada temporariamente para fazer a pre build
                        dest:'dist/' // pasta destino aonde sera feito o deploy
                    }
                ]
            }
        },

        htmlmin: { // plugin para minificar o html
            dist: {
                options: {
                    removeComments: true, //remover comentarios
                    collapseWhitespace: true //remover espaços em branco
                },

                files: {
                   'prebuild/index.html': 'src/index.html' // destino e origem
                }
            }
        },

        uglify : {
            target: {
                files: {
                    'dist/scripts/main.min.js':'src/scripts/main.js'
                }
            }
        },
        
        clean: ['prebuild'] // plugin para excluir a pasta prebuild quando for inicializado o comando npm run build
    });

    //plugins
    grunt.loadNpmTasks('grunt-contrib-less'); // compila de less para css
    grunt.loadNpmTasks('grunt-contrib-watch'); // assiste as alterações e automatiza de acordo com as configurações
    grunt.loadNpmTasks('grunt-replace'); // mudar arquivos específicos
    grunt.loadNpmTasks('grunt-contrib-htmlmin'); // minifica o html
    grunt.loadNpmTasks('grunt-contrib-clean'); // exclui uma pasta específica
    grunt.loadNpmTasks('grunt-contrib-uglify') // minifica o js
    //carregar tarefas
    grunt.registerTask('default', ['watch']); // comando npm run grunt executa esta task contendo o valor watch que esta configurado para executar as tarefas criadas e assitir e fazer as mudanças automatizadas
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'uglify' , 'clean']); // comando npm run grunt para fazer toda a criação da build do projeto para fazer o deploy
}