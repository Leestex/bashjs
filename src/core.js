define(function ( require ) {

    var Program     = require( 'modules/Program' ),
        Observer    = require( 'modules/Observer' ),
        History     = require( 'modules/History' );

    var Bash = (function () {

        var _programs = {};

        function Bash ( settings ) {

            var self = this;

            // TODO: remove this
            Observer.on({
                'core:init'             : function () {
                    console.log( '[OBSERVER] core:init' );
                },
                'core:addProgram'       : function ( data ) {
                    console.log( '[OBSERVER] core:addProgram', data.name );
                },
                'core:removeProgram'    : function ( data ) {
                    console.log( '[OBSERVER] core:removeProgram', data.name );
                },
                'core:beforeExecute'    : function ( data ) {
                    //console.log( '[OBSERVER] core:beforeExecute', data.command, data.arguments );
                },
                'core:afterExecute'     : function ( data ) {
                    //console.log( '[OBSERVER] core:afterExecute', data.command, data.arguments );
                },
                'core:echo'             : function ( data ) {
                    //console.log( '[OBSERVER] core:echo', data.data );
                    console.log( data.data );
                },
                'core:error'            : function ( data ) {
                    console.error( data.text );
                }
            });

            //self.history = new History();

            self.programs = {

                add: function ( options ) {

                    if ( !this.validate( 'add', options ) ) { return false; }

                    _programs[ options.name ] = new Program( options );

                    Observer.trigger( 'core:addProgram', { name: options.name } );

                },

                remove: function ( name ) {

                    if ( !this.validate( 'remove', options ) ) { return false; }

                    _programs[ name ] = undefined;

                    Observer.trigger( 'core:removeProgram', { name: name } );

                },

                get: function () {

                    return _.keys( _programs );

                },

                help: function ( name ) {

                    if ( !this.validate( 'help', name ) ) { return false; }

                    return _programs[ name ].help || 'The program ' + name + ' does not have help info';

                },

                validate: function ( method, data ) {

                    var error = false;

                    switch ( method ) {
                        case 'add':
                            error = ( data.name && data.name.length ) ? false : 'name is required';
                            break;
                        case 'remove':
                            error = ( data && _programs[ data ] ) ? false : data + ' not found';
                            break;
                        case 'help':
                            error = ( _programs[ data ] && _programs[ data ].help ) ? false : 'The program ' + data + ' does not exist or does not have help info';
                            break;
                    }

                    if ( error ) {
                        Observer.trigger( 'core:error', { text: 'Programs ' + method + ': ' + error } );
                        return false;
                    } else {
                        return true;
                    }

                }

            };

            Observer.trigger( 'core:init' );

        }

        Bash.prototype.exec = function ( commandString ) {
            
            var args        = commandString.split( ' ' ),
                command     = args.shift(),
                output;

            //this.history.add( commandString );

            Observer.trigger( 'core:beforeExecute', { command: command, arguments: args } );

            if ( _programs[ command ] ) {
                output = _programs[ command ].run( args );
            } else {
                Observer.trigger( 'core:error', { text: command + ': command not found' } );
            }

            Observer.trigger( 'core:afterExecute', { command: command, arguments: args, output: output } );

            return output;

        };

        Bash.prototype.echo = function ( str ) {

            Observer.trigger( 'core:echo', { data: str } );

            return this;

        };

        return Bash;

    })();

    return Bash;

});