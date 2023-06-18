using Microsoft.AspNetCore.Components;

namespace Wayfinder.Pages.Components;



public class BlankEventHandlerArgs : EventArgs { }



[EventHandler( "onmouseleave", typeof(BlankEventHandlerArgs), enableStopPropagation: true, enablePreventDefault: true )]
[EventHandler( "onmouseenter", typeof(BlankEventHandlerArgs), enableStopPropagation: true, enablePreventDefault: true )]
public static class EventHandlers { }
