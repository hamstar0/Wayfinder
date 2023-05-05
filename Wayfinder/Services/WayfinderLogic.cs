using Wayfinder.Data;
using Wayfinder.Data.Models;

namespace Wayfinder.Services;


public class WayfinderLogic {
    public TermEntry AnythingTerm { get; private set; } = null!;


    public bool IsInitialized => this.AnythingTerm is not null;



    ////////////////

    internal void InitializeData( WayfinderDbContext ctx ) {
        TermEntry? anythingTerm = ctx.Terms.FirstOrDefault(
            t => t.Name == "Anything" && t.Context != null && t.Id == t.Context.Id
        );

        if( anythingTerm is null ) {
            anythingTerm = new TermEntry { Name = "Anything" };

            ctx.Terms.Add( anythingTerm );
            ctx.SaveChanges();

            anythingTerm.Context = anythingTerm;
            ctx.Terms.Update( anythingTerm );
            ctx.SaveChanges();
        }

        this.AnythingTerm = anythingTerm;
    }
}


