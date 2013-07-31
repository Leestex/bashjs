define(function ( require ) {

	var Program = (function () {

		function Program ( options ) {
			
			_.extend( this, options );

		}

		Program.prototype.run = function ( args ) {

			var resultArgs = [],
				temp;

			if ( args && args.length && this.argTypes && this.argTypes.length ) {

				for ( var i = 0; i < this.argTypes.length; i++ ) {
					if ( args[ i ] !== undefined ) {
						switch ( this.argTypes[ i ] ) {
							case 'num':
							case 'number':
								temp = args[ i ] * 1;
								break;
							case 'str':
							case 'string':
								temp = String( args[ i ] );
								break;
							case 'bool':
							case 'boolean':
								temp = !!args[ i ];
								break;
							default:
								temp = String( args[ i ] );
						}
						resultArgs[ i ] = temp;
					}
				}

			} else if ( args && args.length ) {

				resultArgs = args;

			}
			
			return this.action.apply( this.context || this, resultArgs );

		};

		return Program;

	})();

	return Program;

});