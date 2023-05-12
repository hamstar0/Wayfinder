window.addEventListener(
	"mousemove",
	(event) => window.CurrentMousePosition = Object.freeze( { x: event.pageX, y: event.pageY } )
);
