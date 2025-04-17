# Chatbot Template

A simple chatbot template built with TypeScript, C#, React, ASP.NET Core, and SignalR.

<div align="center">
<img src="https://github.com/dkroderos/chatbot-template/blob/main/sample/sample.png" width = 70% height = 70%>
</div>

### ✨ Features

- **Customizable AI Behavior**
- **Remembers previous conversations**
- **Responsive UI.**
- **Light theme and Dark Theme.**
- **Copying messages and responses.**
- **Keyboard shortcuts support**
- **Editable messages.**

### 📋 Requirements

- [Git](https://git-scm.com)
- [Docker Compose](https://www.docker.com)
- [.NET 9](https://dotnet.microsoft.com/download) (development)
- [Node](https://nodejs.org/en/download) (development)

### 🚀 Getting Started

Clone the repository.

- Clone the repository.

```sh
git clone https://github.com/dkroderos/chatbot-template.git
cd chatbot-template
```

- Generate `.env` file the using `.env.example` file.

```sh
cp .env.example .env # On Linux
```

```sh
Copy-Item .env.example .env # On Windows
```

- Build and run the container

```sh
docker compose up -d --build
```

- The website is available at http://localhost:37006

### 📦 Environment Variables

- `OPEN_AI_API_KEY`: Your OpenAI API Key. If you don't have one yet, you can put a random string and set `USE_MOCK_CHAT_HUB` to `true`.
- `MAX_PREVIOUS_CONVERSATIONS`: This sets the maximum number of previous conversations that is sent to the AI.
- `USE_MOCK_CHAT_HUB`: Setting this to `true` makes the API echo what you've sent. This is useful when tesing the UI.
- `RESPONSE_DELAY`: This sets the delay (in milliseconds) per token to simulate streaming.

```
OPEN_AI_API_KEY='YourOpenAIApiKey'
MAX_PREVIOUS_CONVERSATIONS=10
USE_MOCK_CHAT_HUB=true
RESPONSE_DELAY=10
```


- Don't forget to restart the container when you changing the environment variables.

```sh
docker compose down
docker compose up -d --build
```

### Customizing AI Behavior

- The API reads all `.txt` files from the SystemMessages directory, treating each one as a single system message. Simply create a `.txt` file and define how you want the AI to behave.

### 📄 License

This project is under [The Unlicense](https://github.com/dkroderos/chatbot-template/blob/main/LICENSE).
