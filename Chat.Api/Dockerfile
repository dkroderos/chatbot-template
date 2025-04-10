FROM mcr.microsoft.com/dotnet/sdk:9.0 AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY "./Chat.Api/Chat.Api.csproj" "./Chat.Api/"
RUN dotnet restore "./Chat.Api/Chat.Api.csproj"

COPY "./Chat.Api" "./Chat.Api/"
RUN dotnet publish "./Chat.Api/Chat.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*
EXPOSE 8080

FROM base AS final
USER app
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Chat.Api.dll"]