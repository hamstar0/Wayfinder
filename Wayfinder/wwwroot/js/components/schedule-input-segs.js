window.ScheduleInput = window.ScheduleInput ?? {};



////////////////

window.ScheduleInput.MouseOverIntervalIds = {};



////////////////

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @param {number} timestampStart - Begin time (milliseconds since epoch).
 * @param {number} timestampEnd - End time (milliseconds since epoch).
 * @returns {HTMLElement} - Timeline segment element, or null if overlap detected.
 */
window.ScheduleInput.AddSegment = function( timelineElement, timestampStart, timestampEnd ) {
    const minX = this.GetElementPositionOfTimestamp( timestampStart );
    const maxX = this.GetElementPositionOfTimestamp( timestampEnd );

    const elem = document.createElement( "div" );
    elem.classList.add( "schedule-timeline-seg" );
    elem.style.width = (maxX - minX) + "px";
    elem.style.left = minX + "px";
    timelineElement.appendChild( elem );

    return elem;
};

/**
 * @param {HTMLElement} timeSegmentElement - Timeline segment element.
 * @param {number} newTimestampStart - Begin time (milliseconds since epoch).
 */
window.ScheduleInput.EditSegmentStart = function( timeSegmentElement, newTimestampStart ) {
    const newMinX = this.GetElementPositionOfTimestamp( newTimestampStart );
    const oldMinX = timeSegmentElement.offsetLeft;

    const diff = oldMinX - newMinX;
    const newWid = timeSegmentElement.offsetWidth + diff;
    timeSegmentElement.style.width = newWid + "px";

    timeSegmentElement.style.left = newMinX +"px";
};

/**
 * @param {HTMLElement} timeSegmentElement - Timeline segment element.
 * @param {number} newTimestampEnd - End time (milliseconds since epoch).
 */
window.ScheduleInput.EditSegmentEnd = function( timelineElement, newTimestampEnd ) {
    const newMaxX = this.GetElementPositionOfTimestamp( newTimestampEnd );
    const oldMaxX = timeSegmentElement.offsetLeft + timeSegmentElement.offsetWidth;

    const diff = oldMaxX - newMaxX;
    const newWid = timeSegmentElement.offsetWidth - diff;
    timeSegmentElement.style.width = newWid + "px";
};


////////////////

/**
 * @param {string} timelineElementId - Timeline component element id.
 */
window.ScheduleInput.BeginDrawingSegment = function( timelineElementId ) {
    let intervalId = timelineElementId in this.MouseOverIntervalIds
        ? this.MouseOverIntervalIds[ timelineElementId ]
        : "";

    window.clearInterval( intervalId );

    this.MouseOverIntervalIds[ timelineElementId ] = window.setInterval( () => {
        this.DrawSegmentIf( componentElementId );
    }, 50);
};

/**
 * @param {string} componentElementId - Schedule component's id.
 * @returns {object} - Object (SegTimeBeg, SegTimeEnd) representing a timeline segment via min and max timestamps
 * (as strings).
 */
window.ScheduleInput.EndDrawingSegment = function( componentElementId ) {
    const intervalId = this.MouseOverIntervalIds[ componentElementId ];

    window.clearInterval( intervalId ?? "" );

    if( intervalId != null ) {
        delete this.MouseOverIntervalIds[ componentElementId ];
    }

    //

    const timelineElem = this.GetTimelineElementOfComponentElement( componentElementId );
    const currSegElem = this.GetCurrentTimelineDrawnSegment( timelineElem );
    if( currSegElem == null ) {
        return null;
    }

    const ret = this.GetLatestTimeSegment( timelineElem );

    this.ResetLatestTimeSegment();

    return ret;
};


////

/**
 * @param {string} timelineElementId - Timeline component element id.
 */
window.ScheduleInput.DrawSegmentIf = function( timelineElementId ) {
    const switchElem = document.getElementById( timelineElementId+"_draw_mode_toggle" );
    if( switchElem === null ) {
        console.error( "No schedule mode switch element found ("+timelineElementId+"_draw_mode_toggle)" );
        return;
    }

    const timelineElement = this.GetTimelineElementOfComponentElement( timelineElementId );
    if( timelineElement === null ) {
        console.error( "No schedule timeline element found ("+timelineElementId+"_timeline)" );
        return;
    }

    if( window.CurrentMousePosition === null ) {
        console.error( "No mouse cursor found" );
        return;
    }

    if( !switchElem.checked ) {
        return;
    }

    if( timelineElement.getAttribute("disabled") == "true" ) {
        return;
    }

    var rect = timelineElement.getBoundingClientRect();
    var x = window.CurrentMousePosition.x - rect.left; //x position within the element.
    var y = window.CurrentMousePosition.y - rect.top;  //y position within the element.

    if( y >= 0 && y < timelineElement.clientHeight ) {
        this.DrawSegment( timelineElement, x );
    }
};


/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @param {Number} relativeX - Draw position relative to timeline element.
 */
window.ScheduleInput.DrawSegment = function( timelineElement, relativeX ) {
    if( timelineElement.getAttribute("disabled") == "true" ) {
        return;
    }

    //

    let currentDrawSegElem = this.GetCurrentTimelineDrawnSegment( timelineElement );
    const newTimeStart = this.GetTimestampAt( relativeX - 2 );
    const newTimeEnd = this.GetTimestampAt( relativeX + 2 );

    if( currentDrawSegElem === null ) {
        currentDrawSegElem = this.AddSegment( timelineElement, newTimeStart, newTimeEnd );
        currentDrawSegElem.classList.add( "schedule-timeline-seg-current" );

        return;
    }

    let minX = currentDrawSegElem.offsetLeft;
    if( relativeX < minX ) {
        this.EditSegmentStart( currentDrawSegElem, newTimeStart );
    }

    let maxX = currentDrawSegElem.offsetWidth + minX;
    if( relativeX >= maxX ) {
        this.EditSegmentEnd( currentDrawSegElem, newTimeEnd );
    }
};


////////////////

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @returns {object} - Object (string SegTimeBeg, string SegTimeEnd) representing a timeline segment via
 * min and max timestamps (as millisecond times since the epoch).
 */
window.ScheduleInput.GetLatestTimeSegment = function( timelineElement ) {
    const segmentElement = this.GetCurrentTimelineDrawnSegment( timelineElement );
    if( segmentElement == null ) {
        console.error( "No 'current' drawn timeline element found." );
        return null;
    }

    const startTimeMilliRaw = timelineElement.getAttribute( "current-timestamp" );
    if( startTimeMilliRaw === null ) {
        console.error( "No initial timestamp set for schedule input." );
        return null;
    }
    const timeScaleRaw = timelineElement.getAttribute( "current-pixels-per-second" );
    if( timeScaleRaw === null ) {
        console.error( "No time scale set for schedule input." );
        return null;
    }

    const startTimeMilli = window.parseInt( startTimeMilliRaw );
    const timeScale = window.parseFloat( timeScaleRaw );
    const minX = segmentElement.offsetLeft;
    const wid = segmentElement.offsetWidth;

    const secondsStart = minX * timeScale;
    const secondsEnd = (minX + wid) * timeScale;

    return {
        SegTimeBeg = Math.round( startTimeMilli + (secondsStart * 1000) ).toString(),
        SegTimeEnd = Math.round( startTimeMilli + (secondsEnd * 1000) ).toString()
    };
};


/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 */
window.ScheduleInput.ResetLatestTimeSegment = function( timelineElement ) {
    const currentDrawSegElem = this.GetCurrentTimelineDrawnSegment( timelineElement );
    if( currentDrawSegElem === null ) {
        return;
    }

    currentDrawSegElem.classList.remove( "schedule-timeline-seg-current" );
};


////

/*window.ScheduleInput.SubmitCurrentTimeSegment = function() {
    const timelineElement = document.getElementById(componentElementId + "_timeline");

    if(timelineElement.getAttribute("disabled") == "true") {
        return;
    }

    const data = this.GetLatestTimeSegment();
    if(data === null) {
        return;
    }

    window.CallAJAX("api/ScheduleInput/AddTimeSeg", data, () => {});
};*/
