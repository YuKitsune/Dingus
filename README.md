<h1 align="center">
  💀 Dingus
</h1>

<h3 align="center">
  A Discord bot that does a bunch of dumb stuff.
</h3>

# Running the bot

## Pre-requisites
- [Node](https://nodejs.dev)
- [Docker](https://www.docker.com/get-started)

## Environment Configuration
Before Dingus can be run, a `.env` file needs to be created. Copy the `.env.example` file to `.env` and add the bot
token to the `TOKEN` variable.

## Registering the bot
Bots need to be registered with Discord before they can connect.
Rather than re-explaining perfectly good docs, I'd recommend following the [guide provided by Discord.js](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) on creating bots and acquiring a token.

## Permissions
Dingus requires a few permissions. In the "OAuth2" tab, ensure the `bot` and `applications.commands` scopes are
selected, and the `View Channels`, `Send Messages`, `Public Threads`, `Private Threads`, `Embed Links`, `Attach Files`,
`Read Message History`, and `Use Slash Commands` bot permissions are selected.

## Docker Compose
There is a Makefile and docker-compose file here to make it pretty easy to run. Running `make compose-fresh` will spin
up Dingus with MongoDB and Prometheus/Grafana for monitoring. `docker-compose --env-file=./.env up` can also be run.

# Contributing
Contributions are what make the open source community such an amazing place to be, learn, inspire, and create.
Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`feature/AmazingFeature`)
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request
