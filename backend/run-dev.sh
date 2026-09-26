#!/bin/sh
set -eu

BACKEND_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_DIR=$(CDPATH= cd -- "$BACKEND_DIR/.." && pwd)
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export JAVA_HOME
PATH="$JAVA_HOME/bin:/opt/homebrew/bin:$PATH"
export PATH

if [ -f "$PROJECT_DIR/.env" ]; then
  set -a
  # .env is a shell-compatible local file; do not commit it.
  . "$PROJECT_DIR/.env"
  set +a
fi

exec mvn -f "$BACKEND_DIR/pom.xml" spring-boot:run "$@"
