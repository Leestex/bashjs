define(function ( require ) {

    var History = (function () {

        function History () {

            this.list       = [];
            this.position   = 0;
            this.temp       = '';

            this.add = function ( commandString ) {

                this.list.push( commandString );

                this.position = this.list.length - 1;

            };

            this.prev = function () {

                this.setCounters();

                if ( !this.list.length ) { return false; }

                this.position--;
                if ( this.position < 0 ) { this.position = 0; }

                this.value = this.list[ this.position ] ? this.list[ this.position ] : this.temp;

            };

            this.next = function () {

                this.setCounters();

                if ( !this.list.length ) { return false; }

                this.position++;
                if ( this.position > this.list.length) { this.position = this.list.length; }

            };

        }

        History.prototype.setCounters = function () {

            if ( this.list[ this.position ] ) {
                this.list[ this.position ] = this.value;
            } else {
                this.temp = this.value;
            }

        }

        return History;

    })();

    return History;

});