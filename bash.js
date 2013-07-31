;(function ( window, undefined ) {

	var storage = {

		// Class Program
		Program: (function () {

			function Program ( options ) {
				
				this.name		= options.name;
				this.help		= options.help;
				this.callback	= options.callback;
				this.context	= options.context || this;

			}

			Program.prototype.run = function ( args ) {
				
				return this.callback.apply( this.context, args || [] );

			};

			return Program;

		})(),

		// Class History
		History: (function () {

			var _list		= [],
				_counter	= 0;

			function History () {
				
				var self = this;

				self.add = function ( commandString ) {

					_list.push( commandString );

					_counter	= _list.length - 1;

					_lastPrev	= false;
					_lastNext	= true;

				};

				self.prev = function () {

					/*if ( _counter === _list.length - 1 ) { return _list[ _list.length - 1 ]; }

					var index = _counter = ( (_counter - 1) >= 0 ) ? _counter - 1 : 0;

					return _list[ index ];*/

					var command;

					if ( _lastPrev ) {

						command = _list[ _counter ];

						_counter = ( (_counter - 1) >= 0 ) ? _counter - 1 : 0;

					} else {

						_counter = ( (_counter - 1) >= 0 ) ? _counter - 1 : 0;

						command = _list[ _counter ];

						_counter = ( (_counter - 1) >= 0 ) ? _counter - 1 : 0;

					}

					return command;

				};

				self.next = function () {

					/*var index = _counter = ( (_counter + 1) >= _list.length ) ? _list.length - 1 : _counter + 1;

					return _list[ index ];*/

					var command;

					if ( _lastNext ) {

						command = _list[ _counter ];

						_counter = ( (_counter + 1) >= _list.length ) ? _list.length - 1 : _counter + 1;

					} else {

						_counter = ( (_counter + 1) >= _list.length ) ? _list.length - 1 : _counter + 1;

						command = _list[ _counter ];

						_counter = ( (_counter + 1) >= _list.length ) ? _list.length - 1 : _counter + 1;

					}

					return command;

				};

			}

			return History;

		})(),

		// Class Bash
		Bash: (function () {

			var _programs = {};

			function Bash () {

				var self = this;

				self.history = new storage.History();

				self.programs = {

					add: function ( options ) {

						_programs[ options.name ] = new storage.Program( options );

					},

					remove: function ( name ) {

						_programs[ name ] = undefined;

					}

				};

			}

			Bash.prototype.exec = function ( commandString ) {
				
				var args		= commandString.split( ' ' ),
					command		= args.shift();

				this.history.add( commandString );

				return _programs[ command ].run( args );

			};

			return Bash;

		})()

	};

	// Global
	window.Bash = storage.Bash;

})( window );