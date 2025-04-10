using System.ComponentModel.DataAnnotations;

namespace Chat.Api.Options;

public sealed class AppOptions
{
    [Required]
    public required int MaxPreviousConversations { get; init; }
}
