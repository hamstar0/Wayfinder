window.ScheduleInput = window.ScheduleInput ?? {};



/**
 * @param {string} componentElementId - Schedule container element id
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
window.ScheduleInput.InitializeTimelineElement = function( componentElementId, pixelsPerSecond ) {
    const timelineElement = document.getElementById( componentElementId+"_timeline" );
    
    this.ZoomScheduleTimeScale( timelineElement, pixelsPerSecond );

    //

    let mouseOverIntervalId = 0;

    timelineElement.addEventListener(
        "mousedown",
        () => {
            window.clearInterval( mouseOverIntervalId );
            mouseOverIntervalId = window.setInterval( () => {
                this.DrawSegmentIf( componentElementId );
            }, 50);
        }
    );

    timelineElement.addEventListener(
        "mouseleave",
        () => {
            window.clearInterval( mouseOverIntervalId );
            this.SubmitCurrentTimeSegment();
        }
    );
    timelineElement.addEventListener(
        "mouseup",
        () => {
            window.clearInterval( mouseOverIntervalId );
            this.SubmitCurrentTimeSegment();
        }
    );
};


window.ScheduleInput.SubmitCurrentTimeSegment = function() {
    const data = this.GetLatestTimeSegment();
    if( data === null ) {
        return;
    }

    window.CallAJAX( "api/ScheduleInput/AddTimeSeg", data, () => {} );
};

////////////////

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
window.ScheduleInput.ZoomScheduleTimeScale = function( timelineElement, pixelsPerSecond ) {
    let datePosition = timelineElement.getAttribute( "current-timestamp" );
    datePosition = datePosition !== null
        ? typeof datePosition === 'string' || datePosition instanceof String
            ? window.parseInt(datePosition)
            : datePosition
        : null;
    
    if( datePosition === null ) {
        datePosition = Date.now();

        timelineElement.setAttribute( "current-timestamp", datePosition );
    } else {
        datePosition = window.parseInt( datePosition );
    }

    timelineElement.setAttribute( "current-pixels-per-second", pixelsPerSecond );
    
    this.ZoomScheduleTimeScaleWhen( timelineElement, datePosition, pixelsPerSecond );
 };

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element
 * @param {number} startDateMilliseconds - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
window.ScheduleInput.ZoomScheduleTimeScaleWhen = function(
            timelineElement,
            startDateMilliseconds,
            pixelsPerSecond ) {
    timelineElement.innerHTML = "";

    //

    const startDate = new Date( startDateMilliseconds );
    const pixelsPerMinute = pixelsPerSecond * 60;
    const pixelsPerHour = pixelsPerMinute * 60;
    const pixelsPerDay = pixelsPerHour * 24;
    const pixelsPerMonth = pixelsPerDay * 30;
    const pixelsPerYear = pixelsPerDay * 365;
    
    if( pixelsPerYear > 24 ) {
        this.PopulateScheduleYearsMarkers( timelineElement, startDate, pixelsPerSecond );
    }
    if( pixelsPerMonth > 24 ) {
        this.PopulateScheduleMonthsMarkers( timelineElement, startDate, pixelsPerSecond );
    }
    if( pixelsPerDay > 24 ) {
        this.PopulateScheduleDaysMarkers( timelineElement, startDate, pixelsPerSecond );
    }
    if( pixelsPerHour > 24 ) {
        this.PopulateScheduleHoursMarkers( timelineElement, startDate, pixelsPerSecond );
    }
    if( pixelsPerMinute > 24 ) {
        this.PopulateScheduleMinutesMarkers( timelineElement, startDate, pixelsPerSecond );
    }
};


/**
 * @param {Element} componentElement - Schedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
window.ScheduleInput.PopulateScheduleYearsMarkers = function( componentElement, startDate, pixelsPerSecond ) {
    const containerWidth = componentElement.clientWidth;
    const incDate = new Date( startDate );

    let year = incDate.getFullYear();
    let maxDaysOfYear = this.GetDaysInYear( year );
    const daysOfYear = this.CountDaysElapsedOfDateYear( incDate );
    let pixelsPerYear = pixelsPerSecond * 60 * 60 * 24 * maxDaysOfYear;

    let x = -((daysOfYear / maxDaysOfYear) * pixelsPerYear);

    do {
        year = incDate.getFullYear();
        maxDaysOfYear = this.GetDaysInYear( year );
        pixelsPerYear = pixelsPerSecond * 60 * 60 * 24 * maxDaysOfYear;

        const elem = document.createElement( "div" );
        elem.classList.add( "schedule-component-unit", "schedule-component-unit-year" );
        elem.style.width = pixelsPerYear+"px";
        elem.style.left = x+"px";
        elem.textContent = incDate.toLocaleString( "default", { year: "2-digit" } );
//console.log( "year offset: "+x+", pixelsPerYear:"+pixelsPerYear );

        componentElement.appendChild( elem );
        //let elemHtml = `<div class="schedule-component-unit schedule-component-unit-year"`
        //    +` style="width: ${pixelsPerYear}px; left: ${x}px;">`
        //    +year
        //    +`</div>`;
        //componentElement.insertAdjacentHTML( "beforeend", elemHtml );

        x += pixelsPerYear;
        incDate.setFullYear( year + 1, 1, 1 );
    } while( x < containerWidth );
};

/**
 * @param {Element} componentElement - Shedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
window.ScheduleInput.PopulateScheduleMonthsMarkers = function( componentElement, startDate, pixelsPerSecond ) {
    const containerWidth = componentElement.clientWidth;
    const incDate = new Date( startDate );

    let daysOfMonth = incDate.getDate();
    let maxDaysOfMonth = this.GetDaysInMonth( incDate );
    let pixelsPerMonth = pixelsPerSecond * 60 * 60 * 24 * maxDaysOfMonth;

    let x = -((daysOfMonth / maxDaysOfMonth) * pixelsPerMonth);

    do {
        const month = incDate.getMonth();
        maxDaysOfMonth = this.GetDaysInMonth( incDate );
        pixelsPerMonth = pixelsPerSecond * 60 * 60 * 24 * maxDaysOfMonth;

        const elem = document.createElement( "div" );
        elem.classList.add( "schedule-component-unit", "schedule-component-unit-month" );
        elem.style.width = pixelsPerMonth+"px";
        elem.style.left = x+"px";
        elem.textContent = incDate.toLocaleString( "default", { month: "short" } );

        componentElement.appendChild( elem );

        x += pixelsPerMonth;
        incDate.setMonth( month + 1, 1 );
    } while( x < containerWidth );
};

/**
 * @param {Element} componentElement - Shedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
window.ScheduleInput.PopulateScheduleDaysMarkers = function( componentElement, startDate, pixelsPerSecond ) {
    const containerWidth = componentElement.clientWidth;
    const incDate = new Date( startDate );

    const secondsOfDay = this.CountSecondsElapsedInDay(incDate);
    const maxSecondsOfDay = 60 * 60 * 24;
    const pixelsPerDay = pixelsPerSecond * maxSecondsOfDay;

    let x = -(secondsOfDay / maxSecondsOfDay) * pixelsPerDay;

    do {
        const elem = document.createElement( "div" );
        elem.classList.add( "schedule-component-unit", "schedule-component-unit-day" );
        elem.style.width = pixelsPerDay+"px";
        elem.style.left = x+"px";
        elem.textContent = incDate.toLocaleString( "default", { weekday: "short", day: "2-digit" } );

        componentElement.appendChild( elem );

        x += pixelsPerDay;
        incDate.setDate( incDate.getDate() + 1 );
        incDate.setHours( 0, 0, 0 );
    } while( x < containerWidth );
};

/**
 * @param {Element} componentElement - Shedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
window.ScheduleInput.PopulateScheduleHoursMarkers = function( componentElement, startDate, pixelsPerSecond ) {
    const containerWidth = componentElement.clientWidth;
    const incDate = new Date( startDate );

    const secondsOfHour = this.CountSecondsElapsedInHour(incDate);
    const maxSecondsOfHour = 60 * 60;
    const pixelsPerHour = pixelsPerSecond * maxSecondsOfHour;

    let x = -(secondsOfHour / maxSecondsOfHour) * pixelsPerHour;

    do {
        const elem = document.createElement( "div" );
        elem.classList.add( "schedule-component-unit", "schedule-component-unit-hour" );
        elem.style.width = pixelsPerHour+"px";
        elem.style.left = x+"px";
        elem.textContent = incDate.toLocaleString( "default", { hour: "2-digit", hour12: false } );

        componentElement.appendChild(elem);

        x += pixelsPerHour;
        incDate.setHours( incDate.getHours() + 1, 0, 0 );
    } while( x < containerWidth );
};

/**
 * @param {Element} componentElement - Shedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
window.ScheduleInput.PopulateScheduleMinutesMarkers = function( componentElement, startDate, pixelsPerSecond ) {
    const containerWidth = componentElement.clientWidth;
    const incDate = new Date( startDate );

    const pixelsPerMinute = pixelsPerSecond * 60;
    const secondsOfMinute = incDate.getSeconds();

    let x = -(secondsOfMinute / 60) * pixelsPerMinute;

    do {
        const elem = document.createElement( "div" );
        elem.classList.add("schedule-component-unit", "schedule-component-unit-minute");
        elem.style.width = pixelsPerMinute+"px";
        elem.style.left = x+"px";
        elem.textContent = incDate.toLocaleString( "default", { minute: "2-digit" } );

        componentElement.appendChild( elem );

        x += pixelsPerMinute;
        incDate.setMinutes( incDate.getMinutes() + 1, 0 );
    } while( x < containerWidth );
};


////////////////

/**
 * @param {Date} date - Given date
 * @returns {number} Count of days date's year currently has
 */
window.ScheduleInput.CountDaysElapsedOfDateYear = function( date ) {
    const incDate = new Date( date );
    const currMonth = date.getMonth();
    let totalDays = 0;

    for( let i = 0; i < currMonth; i++ ) {
        incDate.setMonth( i+1, 0 );
        totalDays += incDate.getDate();
    }

    return totalDays + date.getDate();
};

/**
 * @param {Date} date - Given date
 * @returns {number} Count of seconds of date's day currently has
 */
window.ScheduleInput.CountSecondsElapsedInDay = function(date) {
    const hours = date.getHours();
    
    return this.CountSecondsElapsedInHour( date ) + (hours * 60 * 60);
};

/**
 * @param {Date} date - Given date
 * @returns {number} Count of seconds of date's hour currently has
 */
window.ScheduleInput.CountSecondsElapsedInHour = function(date) {
    const minutes = date.getMinutes();

    return date.getSeconds() + (minutes * 60);
}

/**
 * @param {Date} date - Given date
 * @returns {number} Count of total days month can have
 */
window.ScheduleInput.GetDaysInMonth = function(date) {
    const newDate = new Date( date.getFullYear(), date.getMonth() + 1, 0 );

    return newDate.getDate();
};

/**
 * @param {number} year - Given year
 * @returns {number} Count of total days year can have
 */
window.ScheduleInput.GetDaysInYear = function( year ) {
    return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
};


////////////////

/**
 * @param {string} timelineElementId - Timeline element id
 */
window.ScheduleInput.DrawSegmentIf = function( timelineElementId ) {
    const switchElem = document.getElementById( timelineElementId+"_draw_mode_toggle" );
    if( switchElem === null ) {
        console.error( "No schedule mode switch element found ("+timelineElementId+"_draw_mode_toggle)" );
        return;
    }

    if( !switchElem.checked ) {
        return;
    }
    
    const timelineElem = document.getElementById( timelineElementId+"_timeline" );
    if( timelineElem === null ) {
        console.error( "No schedule timeline element found ("+timelineElementId+"_timeline)" );
        return;
    }

    if( window.CurrentMousePosition === null ) {
        console.error( "No mouse cursor found" );
        return;
    }

    var rect = timelineElem.getBoundingClientRect();
    var x = window.CurrentMousePosition.x - rect.left; //x position within the element.
    var y = window.CurrentMousePosition.y - rect.top;  //y position within the element.

    if( y >= 0 && y < timelineElem.clientHeight ) {
        this.DrawSegment( timelineElem, x );;
    }
};


/**
 * @param {HTMLElement} timelineElement - Timeline element
 * @param {Number} relativeX - Draw position
 */
window.ScheduleInput.DrawSegment = function( timelineElement, relativeX ) {
    let currentDrawSegElem = document.getElementById("current_timeline_draw_seg");

    if( currentDrawSegElem === null ) {
        currentDrawSegElem = document.createElement("div");
        currentDrawSegElem.id = "current_timeline_draw_seg";
        currentDrawSegElem.style.width = "4px";
        currentDrawSegElem.style.left = (relativeX-2)+"px";
        timelineElement.appendChild( currentDrawSegElem );

        return;
    }

    let minX = currentDrawSegElem.offsetLeft;
    if( relativeX < minX ) {
        const leftDiff = minX - relativeX + 2;
        currentDrawSegElem.style.width = (currentDrawSegElem.offsetWidth + leftDiff)+"px";
        minX = relativeX - 2;
        currentDrawSegElem.style.left = minX+"px";
    }

    let maxX = currentDrawSegElem.offsetWidth + minX;
    if( relativeX >= maxX ) {
        maxX = relativeX + 2;
        currentDrawSegElem.style.width = (maxX - minX)+"px";
    }
};


////////////////

/**
 * @returns {object} Object (SegTimeMin, SegTimeMax) representing a timeline segment via min and max timestamps.
 */
window.ScheduleInput.GetLatestTimeSegment = function() {
    const currentDrawSegElem = document.getElementById( "current_timeline_draw_seg" );
    if( currentDrawSegElem === null ) {
        console.error( "No current time segment." );
        return null;
    }

    const timelineElement = currentDrawSegElem.parentElement;

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
    const minX = currentDrawSegElem.offsetLeft;
    const wid = currentDrawSegElem.offsetWidth;

    const secondsStart = minX * timeScale;
    const secondsEnd = (minX + wid) * timeScale;

    return {
        SegTimeMin = startTimeMilli + (secondsStart * 1000),
        SegTimeMax = startTimeMilli + (secondsEnd * 1000)
    };
};
