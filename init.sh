#!/bin/sh

# Create required directories
mkdir -p /data /app/public/uploads

# Generate .env template if it doesn't exist
if [ ! -f /data/.env ]; then
  cat > /data/.env << 'EOF'
BASE_URL=https://secretsanta.daespasa.com
SESSION_SECRET=change-me-with-a-long-random-string-min-32-chars
NODE_ENV=production
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://secretsanta.daespasa.com/auth/google/callback
DB_PATH=/data/app.db
DATABASE_URL=file:/data/app.db
EMAIL_MODE=dev
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=Secret Santa <noreply@secretsanta.daespasa.com>
CLOUDFLARE_TUNNEL_TOKEN=
EOF
  echo "✓ .env template generated at /data/.env"
else
  echo "✓ Using existing .env"
fi

# Run migrations and start app
npx prisma migrate deploy && npm start
