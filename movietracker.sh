#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$ROOT_DIR/.env"
ACTION="${1:-}"
MODE="${2:-prod}"

usage() {
    echo "Verwendung: $0 <up|down> [dev|prod]" >&2
}

case "$ACTION" in
    up|down)
        ;;
    *)
        usage
        exit 1
        ;;
esac

case "$MODE" in
    dev)
        COMPOSE_OVERRIDE="docker-compose.dev.yml"
        ;;
    prod)
        COMPOSE_OVERRIDE="docker-compose.prod.yml"
        ;;
    *)
        usage
        exit 1
        ;;
esac

if [[ "$#" -gt 2 ]]; then
    usage
    exit 1
fi

cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
    echo "Fehler: Docker ist nicht installiert oder nicht im PATH verfügbar." >&2
    exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
    echo "Fehler: Docker Compose ist nicht verfügbar." >&2
    exit 1
fi

COMPOSE_COMMAND=(docker compose -f docker-compose.yml -f "$COMPOSE_OVERRIDE")

if [[ "$ACTION" == "down" ]]; then
    echo "MovieTracker-Stack wird gestoppt und entfernt ..."
    "${COMPOSE_COMMAND[@]}" down --remove-orphans
    echo "MovieTracker-Stack wurde gestoppt."
    exit 0
fi

umask 077
touch "$ENV_FILE"

env_value() {
    local key="$1"
    sed -n "s/^[[:space:]]*${key}[[:space:]]*=[[:space:]]*//p" "$ENV_FILE" | tail -n 1
}

append_env_value() {
    local key="$1"
    local value="$2"

    if [[ -s "$ENV_FILE" ]] && [[ "$(tail -c 1 "$ENV_FILE" | wc -l)" -eq 0 ]]; then
        printf '\n' >> "$ENV_FILE"
    fi
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
}

tmdb_api_key="$(env_value TMDB_APIKEY)"
if [[ -z "$tmdb_api_key" ]]; then
    if [[ ! -t 0 ]]; then
        echo "Fehler: TMDB_APIKEY fehlt in .env und kann nicht interaktiv abgefragt werden." >&2
        exit 1
    fi

    while [[ -z "$tmdb_api_key" ]]; do
        read -r -p "Bitte TMDB API Key eingeben: " tmdb_api_key
    done
    append_env_value "TMDB_APIKEY" "$tmdb_api_key"
    echo "TMDB_APIKEY wurde in .env gespeichert."
fi

if [[ -z "$(env_value JWT_SECRET)" ]]; then
    if command -v openssl >/dev/null 2>&1; then
        jwt_secret="$(openssl rand -hex 32)"
    else
        jwt_secret="$(od -An -N32 -tx1 /dev/urandom | tr -d ' \n')"
    fi
    append_env_value "JWT_SECRET" "$jwt_secret"
    echo "JWT_SECRET wurde automatisch erzeugt und in .env gespeichert."
fi

if [[ "$MODE" == "dev" ]]; then
    echo "Lokale Container-Images werden gebaut und die Anwendung wird gestartet ..."
    "${COMPOSE_COMMAND[@]}" up -d --build --remove-orphans
else
    echo "Aktuelle Container-Images werden geladen und die Anwendung wird gestartet ..."
    "${COMPOSE_COMMAND[@]}" up -d --pull always --remove-orphans
fi

echo "MovieTracker läuft im Modus '$MODE' unter https://localhost"
