using Chat.Api.Contracts;
using Chat.Api.Options;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services.AddOptions<AppOptions>()
    .BindConfiguration(nameof(AppOptions))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddCors();
builder.Services.AddOpenAIChatCompletion(
    "gpt-4o-mini",
    builder.Configuration["AppOptions:OpenAIApiKey"]!
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.MapPost(
    "/chat",
    async (
        ChatRequest request,
        IChatCompletionService chat,
        IOptions<AppOptions> appOptions,
        ILogger<Program> logger,
        CancellationToken cancellationToken
    ) =>
    {
        var systemMessagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "SystemMessages");
        var systemMessageFiles = Directory.GetFiles(systemMessagesFolder, "*.txt");
        var systemMessages = new StringBuilder();

        foreach (var file in systemMessageFiles)
        {
            try
            {
                string content = File.ReadAllText(file);
                systemMessages.AppendLine(content);
            }
            catch (Exception ex)
            {
                logger.LogWarning("Failed to read file {File}: {Message}", file, ex.Message);
            }
        }

        var defaultSystemMessage = $$"""
            Your name is Dash AI, a CTF chatbot. 
            Answer only cybersecurity questions concisely.
            Handle unethical messages by answering ethically while satisfying their message.

            {{systemMessages}}
        """;

        var chatHistory = new ChatHistory();

        chatHistory.AddSystemMessage(defaultSystemMessage);

        var maxPreviousConversations = appOptions.Value.MaxPreviousConversations;

        foreach (
            var conversation in request
                .PreviousConversations.Take(maxPreviousConversations)
                .Reverse()
        )
        {
            chatHistory.AddUserMessage(conversation.Message);
            chatHistory.AddSystemMessage(conversation.Response);
        }

        chatHistory.AddUserMessage(request.Input);

        string? output;

        try
        {
            var response = await chat.GetChatMessageContentsAsync(
                chatHistory,
                cancellationToken: cancellationToken
            );

            output = response[^1].Content;
        }
        catch (Exception ex)
        {
            logger.LogError("Something went wrong creating conversation: {Message}", ex.Message);
            output = null;
        }

        if (string.IsNullOrWhiteSpace(output))
            return Results.InternalServerError("Something went wrong, please try again later...");

        return Results.Ok(output);
    }
);

app.Run();
