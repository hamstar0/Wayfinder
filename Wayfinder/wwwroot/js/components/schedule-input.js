window.ScheduleInput = window.ScheduleInput ?? {};



////////////////

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 */
window.ScheduleInput.InitializeComponent = function( timelineElement ) {
    timeScale = 1 / 60;
    this.ZoomScheduleTimeScale( timelineElement, timeScale );
};


////////////////

/**
 * @param {string} componentElementId - Schedule component's id.
 * @returns {HTMLElement} - Timeline elment of component.
 */
window.ScheduleInput.GetTimelineElementOfComponentElement = function( componentElementId ) {
    return document.getElementById( componentElementId+"_timeline" );
};

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @returns {HTMLElement} - Currently drawn segment (`null` if none).
 */
window.ScheduleInput.GetCurrentTimelineDrawnSegment = function( timelineElement ) {
    return timelineElement.querySelector( ".current-timeline-draw-seg" );
};


////////////////

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @param {number} pixelsPerSecond - Scale of pixels per second of time.
 */
window.ScheduleInput.ZoomScheduleTimeScale = function( timelineElement, pixelsPerSecond ) {
    const startTimeMilli = this.GetCurrentTimestampData( timelineElement );

    this.SetCurrentTimeZoomData( timelineElement, pixelsPerSecond );
    
    this.ZoomScheduleTimeScaleWhenIf( timelineElement, startTimeMilli, pixelsPerSecond );
};

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @param {number} startDateMilliseconds - Start date.
 * @param {number} pixelsPerSecond - Scale of pixels per second of time.
 */
window.ScheduleInput.ZoomScheduleTimeScaleWhenIf = function(
            timelineElement,
            startDateMilliseconds,
            pixelsPerSecond ) {
    timelineElement.innerHTML = "";

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
 * @param {Element} componentElement - Schedule component's container element.
 * @param {Date} startDate - Start date.
 * @param {number} pixelsPerSecond - Scale of pixels per second of time.
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
 * @param {Element} componentElement - Schedule component's container element.
 * @param {Date} startDate - Start date.
 * @param {number} pixelsPerSecond - Scale of pixels per second of time.
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
 * @param {Element} componentElement - Schedule component's container element.
 * @param {Date} startDate - Start date.
 * @param {number} pixelsPerSecond - Scale of pixels per second of time.
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
 * @param {Element} componentElement - Schedule component's container element.
 * @param {Date} startDate - Start date.
 * @param {number} pixelsPerSecond - Scale of pixels per second of time.
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
 * @param {Element} componentElement - Schedule component's container element.
 * @param {Date} startDate - Start date.
 * @param {number} pixelsPerSecond - Scale of pixels per second of time.
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
 * @param {Date} date - Given date.
 * @returns {number} Count of days date's year currently has.
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
 * @param {Date} date - Given date.
 * @returns {number} Count of seconds of date's day currently has.
 */
window.ScheduleInput.CountSecondsElapsedInDay = function(date) {
    const hours = date.getHours();
    
    return this.CountSecondsElapsedInHour( date ) + (hours * 60 * 60);
};

/**
 * @param {Date} date - Given date.
 * @returns {number} Count of seconds of date's hour currently has.
 */
window.ScheduleInput.CountSecondsElapsedInHour = function(date) {
    const minutes = date.getMinutes();

    return date.getSeconds() + (minutes * 60);
};

/**
 * @param {Date} date - Given date.
 * @returns {number} Count of total days month can have.
 */
window.ScheduleInput.GetDaysInMonth = function(date) {
    const newDate = new Date( date.getFullYear(), date.getMonth() + 1, 0 );

    return newDate.getDate();
};

/**
 * @param {number} year - Given year.
 * @returns {number} Count of total days year can have.
 */
window.ScheduleInput.GetDaysInYear = function( year ) {
    return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
};


////////////////

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @returns {number} Current timestamp in milliseconds.
 */
window.ScheduleInput.GetCurrentTimestampData = function( timelineElement ) {
    const startTimeMilliRaw = timelineElement.hasAttribute("current-timestamp")
        ? timelineElement.getAttribute("current-timestamp")
        : null;
    if( startTimeMilliRaw !== null ) {
        return window.parseInt(startTimeMilliRaw);
    }
    
    //console.error( "No initial timestamp set for schedule timeline." );
    //return null;
    const datePosition = Date.now();
    timelineElement.setAttribute( "current-timestamp", datePosition );
    return datePosition;
};

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @returns {number} Pixels-per-second.
 */
window.ScheduleInput.GetCurrentTimeZoomData = function( timelineElement ) {
    const timeScaleRaw = timelineElement.getAttribute( "current-pixels-per-second" );
    if( timeScaleRaw == null ) {
        console.error( "No initial timestamp set for schedule timeline." );
        return null;
    }

    return window.parseFloat(timeScaleRaw);
};

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @param {number} pixelsPerSecond - Scale of pixels per second of time.
 */
window.ScheduleInput.SetCurrentTimeZoomData = function( timelineElement, pixelsPerSecond ) {
    timelineElement.setAttribute( "current-pixels-per-second", pixelsPerSecond );
};


////////////////

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @param {number} timestamp - Time (milliseconds since epoch).
 * @returns {number} - X (left) position of timestamp within current timeline.
 */
window.ScheduleInput.GetElementPositionOfTimestamp = function( timelineElement, timestamp ) {
    const startTimestamp = this.GetCurrentTimestampData( timelineElement );
    const timeZoom = this.GetCurrentTimeZoomData(timelineElement);

    const milliSinceStart = timestamp - startTimestamp;
    const secondsSinceStart = milliSinceStart / 1000;

    return Math.round( secondsSinceStart * timeZoom );
};

/**
 * @param {HTMLElement} timelineElement - Schedule component's timeline element.
 * @param {number} relativeX - X (left) position of timestamp within current timeline.
 * @returns {number} - Time (milliseconds since epoch).
 */
window.ScheduleInput.GetTimestampOfElementPosition = function(timelineElement, relativeX ) {
    const startTimestamp = this.GetCurrentTimestampData( timelineElement );
    const timeZoom = this.GetCurrentTimeZoomData( timelineElement);

    const secondsSinceStart = relativeX / timeZoom;
    const milliSinceStart = secondsSinceStart * 1000;

    return startTimestamp + Math.round( milliSinceStart );
};


////////////////

/**
 * @param {string} componentElementId - Schedule component's id.
 * @param {Array<Array<number>>} timelineEvents - Time segments.
 */
window.ScheduleInput.PopulateTimelineEvents = function( componentElementId, timelineEvents ) {
    const timelineElem = this.GetTimelineElementOfComponentElement( componentElementId );

    timelineElem.innerHTML = "";

    for( let i = 0; i < timelineEvents.length; i++ ) {
        this.AddSegment( timelineElem, timelineEvents[i][0], timelineEvents[i][1] );
    }
};
