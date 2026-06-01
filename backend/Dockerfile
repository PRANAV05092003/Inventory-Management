# syntax=docker/dockerfile:1

FROM python:3.12-slim AS builder

WORKDIR /build

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


FROM python:3.12-slim AS runtime

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:$PATH" \
    WEB_CONCURRENCY=2

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --gid 1000 appuser \
    && useradd --uid 1000 --gid appuser --shell /bin/sh --create-home appuser

COPY --from=builder /install /home/appuser/.local

COPY --chown=appuser:appuser . .

# Entrypoint written at build time (avoids Windows CRLF / permission issues)
RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    '' \
    'echo "Running database migrations..."' \
    'alembic upgrade head' \
    '' \
    'echo "Starting application..."' \
    'exec "$@"' \
    > /app/docker-entrypoint.sh \
    && sed -i 's/\r$//' /app/docker-entrypoint.sh \
    && chmod 755 /app/docker-entrypoint.sh \
    && chown appuser:appuser /app/docker-entrypoint.sh \
    && test -x /app/docker-entrypoint.sh

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -fsS http://127.0.0.1:8000/health || exit 1

ENTRYPOINT ["/bin/sh", "/app/docker-entrypoint.sh"]
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers ${WEB_CONCURRENCY:-2}"]
