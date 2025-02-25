# Directories
FRONTEND_DIR = chat_app/frontend
BACKEND_DIR = chat_app/backend

# Set-up backend
backend-setup-firsttime:
	make backend
	make db
	make db-migrate
	make prisma-generate
	make backend-start-dev

# Backend dependencies
backend:
	cd $(BACKEND_DIR) && npm install

# Set-up database
db:
	cd $(BACKEND_DIR) && docker-compose up -d

# Migrate prisma schema
db-migrate:
	cd $(BACKEND_DIR) && npx prisma migrate dev --name init

# Generate prisma client
prisma-generate:
	cd $(BACKEND_DIR) && npx prisma generate

# Start backend dev server
backend-start-dev:
	cd ${BACKEND_DIR} && npm run dev

# Build and start backend prod server
backend-start-prod:
	cd ${BACKEND_DIR} && npm run build && npm run start

## Other helper makes for backend

shutdown-db:
	cd $(BACKEND_DIR) && docker-compose down

shutdown-db-hard-reset: # Removes all data from volume
	cd $(BACKEND_DIR) && docker-compose down -v

backend-format-check:
	cd $(BACKEND_DIR) && npx prettier . --check

backend-format-fix:
	cd $(BACKEND_DIR) && npx prettier . --write

backend-lint-check:
	cd $(BACKEND_DIR) && npx eslint .

backend-lint-fix:
	cd $(BACKEND_DIR) && npx eslint . --fix

########################################################################

# FRONT END COMMANDS
frontend-setup-firsttime:
	make frontend
	make frontend-start-dev

frontend:
	cd ${FRONTEND_DIR} && npm install --legacy-peer-deps

frontend-start-dev:
	cd ${FRONTEND_DIR} && PORT=3001 npm run start

frontend-start-prod:
	cd ${FRONTEND_DIR} && npm run build && npm run serve