using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Wayfinder.Areas.Identity;
using Wayfinder.Data;
using Wayfinder.Services;


var builder = WebApplication.CreateBuilder( args );

var connectionString = builder.Configuration.GetConnectionString( "DefaultConnection" );

// Add services to the container.
builder.Services.AddSingleton<WayfinderLogic>();
builder.Services.AddDbContext<WayfinderDbContext>( options => options.UseSqlServer(connectionString) );

builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddDefaultIdentity<IdentityUser>( options => options.SignIn.RequireConfirmedAccount = true )
    .AddEntityFrameworkStores<WayfinderDbContext>();
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddScoped<AuthenticationStateProvider, RevalidatingIdentityAuthenticationStateProvider<IdentityUser>>();
//builder.Services.AddControllers();

var app = builder.Build();

{
    using var scope = app.Services.CreateScope();
    var logic = scope.ServiceProvider.GetRequiredService<WayfinderLogic>();

    if( !logic.IsInitialized ) {
        var ctx = scope.ServiceProvider.GetRequiredService<WayfinderDbContext>();

        await logic.InitializeData_Async( ctx );
    }
}

// Configure the HTTP request pipeline.
if( app.Environment.IsDevelopment() ) {
    app.UseMigrationsEndPoint();
} else {
    app.UseExceptionHandler( "/Error" );
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

//app.MapControllers();
app.MapBlazorHub();
app.MapFallbackToPage( "/_Host" );

app.Run();
