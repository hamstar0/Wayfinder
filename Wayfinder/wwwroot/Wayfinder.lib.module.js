/*export function beforeStart(options, extensions) {
    var customScript = document.createElement( "script" );
    customScript.setAttribute( "src", "js/components/schedule-input.js" );
    document.head.appendChild( customScript );

    var customScript = document.createElement( "script" );
    customScript.setAttribute( "src", "js/components/schedule-input-segs.js" );
    document.head.appendChild( customScript );
}*/

export function afterStarted( blazor ) {
    blazor.registerCustomEventType( "onmouseenter", {
        createEventArgs: (e) => { return {}; }
    } );
    blazor.registerCustomEventType( "onmouseleave", {
        createEventArgs: (e) => { return {}; }
    });

    //

    /*let debugMouse = document.createElement( "div" );
    debugMouse.setAttribute( "style", "position: absolute; width: 16px; height: 16px; background-color: red; opacity: 50%;" );
    let debugPanel = document.createElement( "div" );
    debugPanel.setAttribute( "style", "position: absolute; width: 16px; height: 16px; background-color: blue; opacity: 50%;" );

    document.body.appendChild( debugMouse );
    document.body.appendChild( debugPanel );

    const myfunc = function() {
        if( window.CurrentMousePosition != null ) {
            debugMouse.style.left = (window.CurrentMousePosition.x + 4) + "px";
            debugMouse.style.top = (window.CurrentMousePosition.y + 4) + "px";
        }

        const schedComp = document.querySelector( ".schedule-component" );

        if( schedComp != null ) {
            const rect = schedComp.getBoundingClientRect();

            debugPanel.style.left = (rect.left + window.scrollX) + "px";
            debugPanel.style.top = (rect.top + window.scrollY) + "px";
            debugPanel.style.width = (rect.width) + "px";
            debugPanel.style.height = (rect.height) + "px";
        } else {
            console.log( "No schedule component?" );
        }

        window.setInterval(myfunc, 50);
    };
    myfunc();*/
}


window.addEventListener(
	"mousemove",
	(event) => window.CurrentMousePosition = Object.freeze( { x: event.pageX, y: event.pageY } )
);



////////////////

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
