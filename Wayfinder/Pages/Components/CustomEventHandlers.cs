using Microsoft.AspNetCore.Components;

namespace Wayfinder.Pages.Components;



public class EventHandlerArgs : EventArgs {
}



[EventHandler( "onmouseleave", typeof(EventHandlerArgs), enableStopPropagation: true, enablePreventDefault: true )]
[EventHandler( "onmouseenter", typeof(EventHandlerArgs), enableStopPropagation: true, enablePreventDefault: true )]
public static class EventHandlers {
}
