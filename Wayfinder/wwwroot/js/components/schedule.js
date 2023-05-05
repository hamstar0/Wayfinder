/*{
    const now = new Date();
    const scheduleElems = document.getElementsByClassName("schedule-component");

    for(let i = 0; i < scheduleElems.length; i++) {
        ZoomScheduleTimeScaleWhen( scheduleElems[i], now, 1/60 );
    }
}*/


/**
 * @param {HTMLElement} componentElementId - Shedule container element
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
function ZoomScheduleTimeScale(componentElement, pixelsPerSecond) {
    let datePosition = componentElement.getAttribute( "date-position" );
    datePosition = datePosition !== null
        ? typeof datePosition === 'string' || datePosition instanceof String
            ? parseInt(datePosition)
            : datePosition
        : null;
    
    if( datePosition === null ) {
        datePosition = Date.now();
        componentElement.setAttribute( "zoom-level", datePosition );
    } else {
        datePosition = parseInt( datePosition );
    }
    
    ZoomScheduleTimeScaleWhen( componentElement, datePosition, pixelsPerSecond );
}

/**
 * @param {HTMLElement} componentElementId - Shedule container element
 * @param {numer} startDateMilliseconds - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
function ZoomScheduleTimeScaleWhen(componentElement, startDateMilliseconds, pixelsPerSecond) {
    componentElement.innerHTML = "";

    //

    const startDate = new Date( startDateMilliseconds );
    const pixelsPerMinute = pixelsPerSecond * 60;
    const pixelsPerHour = pixelsPerMinute * 60;
    const pixelsPerDay = pixelsPerHour * 24;
    const pixelsPerMonth = pixelsPerDay * 30;
    const pixelsPerYear = pixelsPerDay * 365;
    
    if( pixelsPerYear > 24 ) {
        PopulateScheduleYearsMarkers( componentElement, startDate, pixelsPerSecond );
    }
    if( pixelsPerMonth > 24 ) {
        PopulateScheduleMonthsMarkers( componentElement, startDate, pixelsPerSecond );
    }
    if( pixelsPerDay > 24 ) {
        PopulateScheduleDaysMarkers( componentElement, startDate, pixelsPerSecond );
    }
    if( pixelsPerHour > 24 ) {
        PopulateScheduleHoursMarkers( componentElement, startDate, pixelsPerSecond );
    }
    if( pixelsPerMinute > 24 ) {
        PopulateScheduleMinutesMarkers( componentElement, startDate, pixelsPerSecond );
    }
}


/**
 * @param {Element} componentElement - Shedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
function PopulateScheduleYearsMarkers( componentElement, startDate, pixelsPerSecond ) {
    const containerWidth = componentElement.clientWidth;
    const incDate = new Date( startDate );

    let year = incDate.getFullYear();
    let maxDaysOfYear = GetDaysInYear( year );
    const daysOfYear = CountDaysElapsedOfDateYear( incDate );
    let pixelsPerYear = pixelsPerSecond * 60 * 60 * 24 * maxDaysOfYear;

    let x = -((daysOfYear / maxDaysOfYear) * pixelsPerYear);

    do {
        year = incDate.getFullYear();
        maxDaysOfYear = GetDaysInYear( year );
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
}

/**
 * @param {Element} componentElement - Shedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
function PopulateScheduleMonthsMarkers( componentElement, startDate, pixelsPerSecond ) {
    const containerWidth = componentElement.clientWidth;
    const incDate = new Date( startDate );

    let daysOfMonth = incDate.getDate();
    let maxDaysOfMonth = GetDaysInMonth( incDate );
    let pixelsPerMonth = pixelsPerSecond * 60 * 60 * 24 * maxDaysOfMonth;

    let x = -((daysOfMonth / maxDaysOfMonth) * pixelsPerMonth);

    do {
        const month = incDate.getMonth();
        maxDaysOfMonth = GetDaysInMonth( incDate );
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
}

/**
 * @param {Element} componentElement - Shedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
function PopulateScheduleDaysMarkers( componentElement, startDate, pixelsPerSecond ) {
    const containerWidth = componentElement.clientWidth;
    const incDate = new Date( startDate );

    const secondsOfDay = CountSecondsElapsedInDay(incDate);
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
}

/**
 * @param {Element} componentElement - Shedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
function PopulateScheduleHoursMarkers( componentElement, startDate, pixelsPerSecond ) {
    const containerWidth = componentElement.clientWidth;
    const incDate = new Date( startDate );

    const secondsOfHour = CountSecondsElapsedInHour(incDate);
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
}

/**
 * @param {Element} componentElement - Shedule container element
 * @param {Date} startDate - Start date
 * @param {number} pixelsPerSecond - Scale of pixels per second of time
 */
function PopulateScheduleMinutesMarkers( componentElement, startDate, pixelsPerSecond ) {
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
}


////////////////

/**
 * @param {Date} date - Given date
 * @returns {number} Count of days date's year currently has
 */
function CountDaysElapsedOfDateYear( date ) {
    const incDate = new Date( date );
    const currMonth = date.getMonth();
    let totalDays = 0;

    for( let i = 0; i < currMonth; i++ ) {
        incDate.setMonth( i+1, 0 );
        totalDays += incDate.getDate();
    }

    return totalDays + date.getDate();
}

/**
 * @param {Date} date - Given date
 * @returns {number} Count of seconds of date's day currently has
 */
function CountSecondsElapsedInDay(date) {
    const hours = date.getHours();

    return CountSecondsElapsedInHour( date ) + (hours * 60 * 60);
}

/**
 * @param {Date} date - Given date
 * @returns {number} Count of seconds of date's hour currently has
 */
function CountSecondsElapsedInHour(date) {
    const minutes = date.getMinutes();

    return date.getSeconds() + (minutes * 60);
}

/**
 * @param {Date} date - Given date
 * @returns {number} Count of total days month can have
 */
function GetDaysInMonth(date) {
    const newDate = new Date( date.getFullYear(), date.getMonth() + 1, 0 );

    return newDate.getDate();
}

/**
 * @param {number} year - Given year
 * @returns {number} Count of total days year can have
 */
function GetDaysInYear( year ) {
    return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
}
