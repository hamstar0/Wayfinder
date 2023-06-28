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
    const minX = this.GetElementPositionOfTimestamp( timelineElement, timestampStart );
    const maxX = this.GetElementPositionOfTimestamp( timelineElement, timestampEnd );
console.log( "  AddSegment", minX, maxX );

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
    const newMinX = this.GetElementPositionOfTimestamp( timeSegmentElement.parentElement, newTimestampStart );
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
window.ScheduleInput.EditSegmentEnd = function( timeSegmentElement, newTimestampEnd ) {
    const newMaxX = this.GetElementPositionOfTimestamp( timeSegmentElement.parentElement, newTimestampEnd );
    const oldMaxX = timeSegmentElement.offsetLeft + timeSegmentElement.offsetWidth;

    const diff = oldMaxX - newMaxX;
    const newWid = timeSegmentElement.offsetWidth - diff;
    timeSegmentElement.style.width = newWid + "px";
};


////////////////

/**
 * @param {string} componentElementId - Timeline component element id.
 */
window.ScheduleInput.BeginDrawingSegment = function( componentElementId ) {
    let intervalId = this.MouseOverIntervalIds.hasOwnProperty( componentElementId )
        ? this.MouseOverIntervalIds[ componentElementId ]
        : "";

    window.clearInterval( intervalId );

    intervalId = window.setInterval( () => {
        this.DrawSegmentIf( componentElementId );
    }, 50 );

    this.MouseOverIntervalIds[ componentElementId ] = intervalId;
};

/**
 * @param {string} componentElementId - Schedule component's id.
 * @returns {object} - Object (SegTimeBeg, SegTimeEnd) representing a timeline segment via min and max timestamps
 * (as strings).
 */
window.ScheduleInput.EndDrawingSegmentIf = function( componentElementId ) {
    let intervalId = this.MouseOverIntervalIds.hasOwnProperty( componentElementId )
        ? this.MouseOverIntervalIds[ componentElementId ]
        : "";

    window.clearInterval( intervalId );

    if( intervalId === "" ) {
//console.log("EndDrawingSegmentIf A", componentElementId);
        return null;
    }

    delete this.MouseOverIntervalIds[ componentElementId ];

    //

    const timelineElem = this.GetTimelineElementOfComponentElement( componentElementId );
    const currSegElem = this.GetCurrentTimelineDrawnSegment( timelineElem );
    if( currSegElem == null ) {
//console.log("EndDrawingSegmentIf B", componentElementId);
        return null;
    }

    const ret = this.GetLatestTimeSegment( timelineElem );

    this.ResetLatestTimeSegment( timelineElem );
    
//console.log("EndDrawingSegmentIf C", componentElementId, ret);
    return ret;
};


////

/**
 * @param {string} componentElementId - Timeline component element id.
 */
window.ScheduleInput.DrawSegmentIf = function( componentElementId ) {
    if( window.CurrentMousePosition === null ) {
        console.error( "No mouse cursor found" );
        return;
    }

    const switchElem = document.getElementById( componentElementId+"_draw_mode_toggle" );
    if( switchElem === null ) {
        console.error( "No schedule mode switch element found ("+componentElementId+"_draw_mode_toggle)" );
        return;
    }

    const timelineElement = this.GetTimelineElementOfComponentElement( componentElementId );
    if( timelineElement === null ) {
        console.error( "No schedule timeline element found ("+componentElementId+"_timeline)" );
        return;
    }
    
    if( timelineElement.hasAttribute("disabled") && timelineElement.getAttribute("disabled") == "true" ) {
        console.log( "Disabled timeline cannot be drawn to." );
        return;
    }

    if( !switchElem.checked ) {
        console.log( "Timeline for "+componentElementId+" is not in draw mode." );
//console.log("DrawSegmentIf A", componentElementId);
        return;
    }
    
    if( timelineElement.hasAttribute("disabled") && timelineElement.getAttribute("disabled") == "true" ) {
        console.log( "Timeline for "+componentElementId+" disabled." );
        return;
    }

    //

    var rect = timelineElement.getBoundingClientRect();
    var x = window.CurrentMousePosition.x - (rect.left + window.scrollX); //x position within the element.
    var y = window.CurrentMousePosition.y - (rect.top + window.scrollY);  //y position within the element.
    
    if( y >= 0 && y < timelineElement.clientHeight ) {
//console.log("DrawSegmentIf C", componentElementId);
        this.DrawSegment( timelineElement, x );
    }
//else { console.log("DrawSegmentIf D", componentElementId, y, timelineElement.clientHeight,
//window.CurrentMousePosition, rect); }
};


/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @param {Number} relativeX - Draw position relative to timeline element.
 */
window.ScheduleInput.DrawSegment = function( timelineElement, relativeX ) {
    let currentDrawSegElem = this.GetCurrentTimelineDrawnSegment( timelineElement );

    const newStartTimestamp = this.GetTimestampOfElementPosition( timelineElement, relativeX - 2 );
    const newEndTimestamp = this.GetTimestampOfElementPosition( timelineElement, relativeX + 2 );

    if( currentDrawSegElem === null ) {
        currentDrawSegElem = this.AddSegment( timelineElement, newStartTimestamp, newEndTimestamp );
        currentDrawSegElem.classList.add( "current-timeline-draw-seg" );

console.log( "DrawSegment A", relativeX, newStartTimestamp, newEndTimestamp, currentDrawSegElem );
        return;
    }

    const minX = currentDrawSegElem.offsetLeft;
    if( relativeX < minX ) {
        this.EditSegmentStart( currentDrawSegElem, newStartTimestamp );
    }

    const maxX = currentDrawSegElem.offsetWidth + minX;
    if( relativeX >= maxX ) {
        this.EditSegmentEnd( currentDrawSegElem, newEndTimestamp );
    }
console.log( "DrawSegment B", relativeX, newStartTimestamp, newEndTimestamp, currentDrawSegElem );
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

    const startTimeMilliRaw = timelineElement.hasAttribute("current-timestamp")
        ? timelineElement.getAttribute("current-timestamp")
        : null;
    if( startTimeMilliRaw === null ) {
        console.error( "No initial timestamp set for schedule input." );
        return null;
    }
    const timeScaleRaw = timelineElement.hasAttribute("current-pixels-per-second")
        ? timelineElement.getAttribute("current-pixels-per-second")
        : null;
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
        SegTimeBeg: Math.round( startTimeMilli + (secondsStart * 1000) ),  //.toString(),
        SegTimeEnd: Math.round( startTimeMilli + (secondsEnd * 1000) )     //.toString()
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
