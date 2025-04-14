using Chat.Api.Hubs;
using Chat.Api.Options;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services.AddOptions<AppOptions>()
    .BindConfiguration(nameof(AppOptions))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddSignalR(x => x.MaximumReceiveMessageSize = 1024 * 1024 * 10);

builder.Services.AddCors();
builder.Services.AddOpenAIChatCompletion(
    "gpt-4o-mini",
    builder.Configuration["AppOptions:OpenAIApiKey"]!
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

var appOptions = app.Services.GetRequiredService<IOptions<AppOptions>>().Value;

if (appOptions.UseMockChatHub)
    app.MapHub<MockChatHub>("/hubs/chat-hub");
else
    app.MapHub<ChatHub>("/hubs/chat-hub");

app.Run();
