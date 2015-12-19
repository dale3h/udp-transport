udp-transport
=========

Small Node.js library to simplify sending UDP packets from multiple network interfaces (ie a raspberry pi with eth0/wlan0)

## Installation

	npm install udp-transport --save

## Usage

	var transport = require( 'udp-transport' );
	
	var udp = new transport( {
		host: '192.168.1.113',
		port: 48899,
		method: 'socat',
		device: 'wlan0',
		tries: 3,
		debug: true,
	} );

	udp.send( 'FFAA MODE START BB' );

## Release History

* 0.1.2 updated package.json and README
* 0.1.1 we shall get there eventually
* 0.1.0 initial release