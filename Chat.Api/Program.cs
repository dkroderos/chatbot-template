using Chat.Api.Hubs;
using Chat.Api.Options;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services.AddOptions<AppOptions>()
    .BindConfiguration(nameof(AppOptions))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddSignalR();
builder.Services.AddCors();
builder.Services.AddOpenAIChatCompletion(
    "gpt-4o-mini",
    builder.Configuration["AppOptions:OpenAIApiKey"]!
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.MapHub<ChatHub>("chat-hub");

app.Run();
