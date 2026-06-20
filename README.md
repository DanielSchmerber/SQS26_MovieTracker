# MovieTracker

MovieTracker ist eine Webanwendung zum Suchen und Bewerten von Filmen sowie
zum Verwalten einer persönlichen Watchlist. Die Filmdaten werden über die
[TMDB API](https://www.themoviedb.org/) bezogen.

Das Projekt besteht aus:

- einem React-Frontend mit TanStack Start, TypeScript und Tailwind CSS,
- einem FastAPI-Backend mit SQLAlchemy und SQLite,
- Traefik als Reverse Proxy sowie
- Docker Compose für den Entwicklungs- und Produktivbetrieb.

## Schnellstart

### Voraussetzungen

- Docker
- Docker Compose
- ein TMDB API Key

Die Anwendung kann mit einem Befehl gestartet werden:

```bash
./movietracker.sh up
```

Beim ersten Start fragt das Skript nach dem TMDB API Key und speichert ihn in
der lokalen `.env`-Datei. Falls noch kein `JWT_SECRET` vorhanden ist, wird
dieses automatisch erzeugt.

Anschließend ist MovieTracker unter <https://localhost> erreichbar. Traefik
verwendet für die lokale Umgebung ein selbstsigniertes Zertifikat, weshalb der
Browser beim ersten Aufruf eine Zertifikatswarnung anzeigen kann.

Der Stack wird mit folgendem Befehl wieder gestoppt und entfernt:

```bash
./movietracker.sh down
```

Lokale Images und Datenbankdateien werden dabei nicht gelöscht.

## Docker-Betriebsarten

Das Verwaltungsskript unterstützt einen Produktiv- und einen
Entwicklungsmodus. Wird kein Modus angegeben, verwendet es `prod`.

| Befehl | Beschreibung |
| --- | --- |
| `./movietracker.sh up` | Startet den Produktivmodus mit den aktuellen GHCR-Images |
| `./movietracker.sh up dev` | Baut Frontend und Backend aus dem lokalen Quellcode und startet sie |
| `./movietracker.sh down` | Stoppt und entfernt den Stack |

## Konfiguration

Die Laufzeitkonfiguration wird aus einer `.env`-Datei im Projektverzeichnis
gelesen. Als Vorlage dient `.env.example`.

| Variable | Erforderlich | Beschreibung |
| --- | --- | --- |
| `TMDB_APIKEY` | Ja | API Key beziehungsweise Read Access Token für die TMDB API |
| `JWT_SECRET` | Ja | Geheimer Schlüssel zum Signieren der JWTs; wird vom Skript automatisch erzeugt |
| `DATABASE_URL` | Nein | SQLAlchemy-Datenbank-URL, standardmäßig `sqlite:///./test.db` |
| `JWT_ALGORITHM` | Nein | JWT-Algorithmus, standardmäßig `HS256` |
| `JWT_EXPIRY_MINUTES` | Nein | Gültigkeitsdauer eines Tokens, standardmäßig 60 Minuten |

## Lokale Entwicklung

Der Docker-Dev-Modus baut beide Anwendungen aus dem aktuellen Quellcode:

```bash
./movietracker.sh up dev
```

Für die getrennte Ausführung von Backend und Frontend können die folgenden
Schritte verwendet werden.

### Backend

```bash
cd backend/sqs-movietracker

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

alembic upgrade head
uvicorn main:app --reload --port 8000 --log-level debug
```

Das Backend benötigt die Variablen aus der `.env`-Datei. Da es aus seinem
Unterverzeichnis gestartet wird, müssen diese entweder in der Shell gesetzt
oder in einer `.env`-Datei innerhalb des Backend-Verzeichnisses bereitgestellt
werden.

Backend-Tests werden aus demselben Verzeichnis ausgeführt:

```bash
pytest
```

### End-to-End-Tests

Die Playwright-Tests in `tests_e2e` laufen gegen den Docker-Stack unter
<https://localhost>. Dafür müssen die Python-Testabhängigkeiten und der
Chromium-Browser installiert sein:

```bash
pip install pytest pytest-playwright
python -m playwright install chromium
./movietracker.sh up dev
pytest tests_e2e --browser chromium
```

Falls die Anwendung unter einer anderen Adresse läuft, kann das Ziel mit
`E2E_BASE_URL` überschrieben werden:

```bash
E2E_BASE_URL=https://localhost pytest tests_e2e --browser chromium
```

In GitHub Actions werden die Tests im Job `Playwright e2e tests` gegen den per
Docker Compose gebauten Stack ausgeführt. Dafür muss im Repository Secret
`TMDB_APIKEY` ein gültiger TMDB API Key hinterlegt sein.

### Frontend

In einem zweiten Terminal:

```bash
cd frontend/sqs-movietracker
npm install
npm run dev
```

Der lokale Frontend-Server ist unter <http://localhost:3000> erreichbar und
leitet API-Anfragen an das Backend auf Port 8000 weiter.

Weitere Frontend-Befehle:

| Befehl | Beschreibung |
| --- | --- |
| `npm run build` | Erstellt den Produktions-Build |
| `npm run test` | Führt die Vitest-Tests aus |
| `npm run lint` | Prüft den Quellcode mit ESLint |
| `npm run format` | Formatiert den Quellcode und führt automatische ESLint-Korrekturen aus |
| `npm run check` | Prüft die Formatierung mit Prettier |

Neue shadcn/ui-Komponenten können beispielsweise so hinzugefügt werden:

```bash
npx shadcn@latest add button
```

## Projektstruktur

```text
.
├── backend/sqs-movietracker/   FastAPI-Backend
├── frontend/sqs-movietracker/  React-Frontend
├── docs/                       Architekturdokumentation
├── docker-compose.yml          Gemeinsame Compose-Konfiguration
├── docker-compose.dev.yml      Compose Ergänzung für Dev Modus
├── docker-compose.prod.yml     Compose Ergänzung für Prod Modus
└── movietracker.sh              Verwaltungs-Skript des Docker-Stacks
```

Die ausführliche Architektur- und Qualitätsdokumentation befindet sich im
Verzeichnis `docs/`.
