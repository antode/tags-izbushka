
WORKING_DIR = $(shell pwd)
BIN_DIR = ${WORKING_DIR}/bin
DOCKER_COMPOSE_DIR = ${WORKING_DIR}/docker-compose

compose = docker compose
setup_envs = ${BIN_DIR}/setup_envs.bash

help: ## Показать справку
	@sed -ne '/@sed/!s/## //p' $(MAKEFILE_LIST)

install: ## Установка проекта: сборка сервисов и установка зависимостей
	${setup_envs} ${WORKING_DIR} ${DOCKER_COMPOSE_DIR}
	
	${compose} pull
	
	${compose} build

	${compose} run --rm node npm install --no-scripts --no-audit
	${compose} run --rm node npm run build-only

up: ## Запуск сервисов
    ##     (перед первым запуском следует запустить установку make install)
	${compose} up --detach --remove-orphans

restart: ## Перезапуск сервисов с повторным созданием
	${compose} up --detach --force-recreate --remove-orphans

down: ## Остановка и удаление сервисов
	${compose} down

clean: ## Удаление контейнеров, образов и разделов
	${compose} down --remove-orphans --rmi local --volumes

run: ## Запуск команды Node
     ##     Пример запуска npm install:
     ##     make run c='npm install'
	${compose} run --rm node ${c}

check: up ## Проверка типов typescript, стилей и e2e тестирование
	${compose} exec node npx playwright install

	${compose} exec node npm run type-check
	${compose} exec node npm run lint:check
	${compose} exec node npx playwright test
