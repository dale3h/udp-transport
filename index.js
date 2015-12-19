'use strict';

var util  = require( 'util' );
var exec  = require( 'child_process' ).exec;
var dgram = require( 'dgram' );

function getDateTime() {
	var date = new Date();

	var hour = date.getHours();
	hour = ( hour < 10 ? "0" : "" ) + hour;

	var min = date.getMinutes();
	min = ( min < 10 ? "0" : "" ) + min;

	var sec = date.getSeconds();
	sec = ( sec < 10 ? "0" : "" ) + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = ( month < 10 ? "0" : "" ) + month;

	var day = date.getDate();
	day = ( day < 10 ? "0" : "" ) + day;

	return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

function Transport( args ) {
	// Make sure we have a valid object
	if ( args === undefined ) {
		args = {};
	}

	this.config = function( args ) {
		this.host   = args.host || false;
		this.port   = args.port || false;
		this.method = args.method || 'native';
		this.tries  = args.tries || 3;
		this.debug  = args.debug ? true : false;

		if ( this.method == 'socat' ) {
			this.device = args.device || false;
		}
	};

	this.log = function( message ) {
		if ( ! this.debug ) {
			return;
		}

		console.log( '[%s] [%s%s] [%s:%d] %s', getDateTime(), this.method, ( this.device ? ':' + this.device : '' ), this.host, this.port, message );
	};

	this.send = function( data, tries ) {
		var parent = this;

		if ( tries === undefined ) {
			tries = this.tries;
		}

		switch ( this.method ) {
			case 'socat':
				var command = 'echo \"' + data + '\" | sudo socat - UDP-DATAGRAM:' + this.host + ':' + this.port + ( this.device ? ',so-bindtodevice=' + this.device : '' );

				var child = exec( command, function( error, stdout, stderr ) {
					parent.log( data );

					if ( error !== null ) {
						parent.log( 'ERROR: ' + error );
						return;
					}
				} );

				break;

			case 'native':
			default:
				var client = dgram.createSocket( 'udp4' );
				var buffer = new Buffer( data );

				client.send( buffer, 0, buffer.length, this.port, this.host, function( error, bytes ) {
					parent.log( data );

					if ( error !== 0 ) {
						parent.log( 'ERROR: ' + error );
						return;
					}

					client.close();
				} );

				break;
		}

		if ( --tries > 0 ) {
			this.send( data, tries );
		}
	};

	this.config( args );
}

module.exports = Transport;