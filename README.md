<h1 align="center">
  💀 NecroBot
</h1>

<h3 align="center">
  A Discord bot that can ping channels and threads after a certain amount of inactivity.
</h3>

# Commands
#### `/necro [idle-time] [unit]`
Using the `necro` command tells NecroBot to ping the current channel after N period of inactivity.
`idle-time` is the amount of time that the channel should be inactive for before NecroBot sends a message.
`unit` is the unit described in `idle-time`, accepted values are `Seconds`, `Minutes`, `Hours`, and `Days`.

#### `/orcen`
The `orcen` command tells NecroBot to cancel any reminders for the current channel.

# Running the bot

## Pre-requisites
- [Node](https://nodejs.dev)
- [Docker](https://www.docker.com/get-started)

## Environment Configuration
Before NecroBot can be run, a `.env` file needs to be created. Copy the `.env.example` file to `.env` and add the bot
token to the `TOKEN` variable.

## Registering the bot
Bots need to be registered with Discord before they can connect.
Rather than re-explaining perfectly good docs, I'd recommend following the [guide provided by Discord.js](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) on creating bots and acquiring a token.

## Permissions
NecroBot requires a few permissions. In the "OAuth2" tab, ensure the `bot` and `applications.commands` scopes are
selected, and the `View Channels`, `Send Messages`, `Public Threads`, `Private Threads`, `Embed Links`, `Attach Files`,
`Read Message History`, and `Use Slash Commands` bot permissions are selected.

## Docker Compose
There is a Makefile and docker-compose file here to make it pretty easy to run. Running `make compose-fresh` will spin
up NecroBot with MongoDB and Prometheus/Grafana for monitoring. `docker-compose --env-file=./.env up` can also be run.

# The tech
NecroBot is a bare-bones Node.js app using [Discord.js](https://github.com/discordjs/discord.js/) and [MongoDB](https://www.mongodb.com).
[Prometheus](https://prometheus.io) and [Grafana](https://grafana.com) can be used for monitoring.

# Contributing
Contributions are what make the open source community such an amazing place to be, learn, inspire, and create.
Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`feature/AmazingFeature`)
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request
