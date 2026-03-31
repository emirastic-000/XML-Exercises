#!/usr/bin/env bash
set -euo pipefail

# XML Skills Training — Debian/Ubuntu Server Setup Script
# Installs Docker, Docker Compose, and starts the application.

echo "=== XML Skills Training — Server Setup ==="
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo:"
  echo "  sudo bash setup.sh"
  exit 1
fi

# Detect the actual user (not root) for adding to docker group
ACTUAL_USER="${SUDO_USER:-$USER}"

echo "[1/5] Updating package index..."
apt-get update -qq

echo "[2/5] Installing prerequisites..."
apt-get install -y -qq \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git

echo "[3/5] Installing Docker..."
if command -v docker &>/dev/null; then
  echo "  Docker is already installed: $(docker --version)"
else
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  # Detect distro (works for both Debian and Ubuntu)
  DISTRO=$(. /etc/os-release && echo "$ID")
  CODENAME=$(. /etc/os-release && echo "$VERSION_CODENAME")

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/${DISTRO} ${CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list

  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  systemctl enable docker
  systemctl start docker
  echo "  Docker installed: $(docker --version)"
fi

echo "[4/5] Adding user '${ACTUAL_USER}' to docker group..."
usermod -aG docker "$ACTUAL_USER" 2>/dev/null || true

echo "[5/5] Setting up the application..."

# Create .env from example if it doesn't exist
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "  Created .env from .env.example"
    echo "  *** IMPORTANT: Edit .env with your OAuth credentials before starting! ***"
    echo "    nano .env"
  fi
else
  echo "  .env already exists, skipping"
fi

echo ""
echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "  1. Edit your .env file with OAuth credentials:  nano .env"
echo "  2. Start the app:                               docker compose up --build -d"
echo "  3. Seed achievements:                           docker exec \$(docker ps -qf name=server) node src/seed.js"
echo "  4. Open in browser:                             http://<your-server-ip>:3000"
echo ""
echo "Note: You may need to log out and back in for Docker group permissions to take effect,"
echo "or run:  newgrp docker"
