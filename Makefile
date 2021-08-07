
DOCKER_COMPOSE_CMD := docker-compose --env-file=./.env up

.DEFAULT_GOAL := help

.PHONY: help
help: ## Shows this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: build-container
build-container: ## Builds the docker container for the bot
	docker build \
		-t necrobot \
		-f Dockerfile \
		.

.PHONY: compose
compose: ## Runs docker compose
	$(DOCKER_COMPOSE_CMD)

.PHONY: compose-detach
compose-detach: ## Runs docker compose in detached mode
	$(DOCKER_COMPOSE_CMD) --detach

.PHONY: compose-fresh
compose-fresh: ## Rebuilds the containers and forces a recreation
	$(DOCKER_COMPOSE_CMD) --build --force-recreate

.PHONY: compose-fresh-detach
compose-fresh-detach: ## Rebuilds the containers and forces a recreation in detached mode
	$(DOCKER_COMPOSE_CMD) --build --force-recreate --detach

.PHONY: compose-down
compose-down: ## Tears down the docker instances created by compose-up
	docker-compose down
