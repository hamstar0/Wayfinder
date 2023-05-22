window.addEventListener(
	"mousemove",
	(event) => window.CurrentMousePosition = Object.freeze( { x: event.pageX, y: event.pageY } )
);



/**
 * @param {string} url - Relative url
 * @param {object} dataObject - Data to transmit
 * @param {function} onReceive - Completion callback
 */
window.CallAJAX = function( url, dataObject, onReceive ) {
    var xhttp = new XMLHttpRequest();
    xhttp.setRequestHeader( "Content-Type", "application/json; charset=UTF-8" );
    xhttp.onreadystatechange = function() {
        if( this.readyState === 4 && this.status === 200 ) {
            onReceive();
        }
    };

    xhttp.open( "POST", url, true );
    xhttp.send( JSON.stringify(dataObject) );
};
