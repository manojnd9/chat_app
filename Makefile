# Directories
FRONTEND_DIR = chat_app/frontend
BACKEND_DIR = chat_app/backend

# Entire project set-up
setup-all:
	make db
	make backend

# Set-up database
db:
	cd $(BACKEND_DIR) && docker-compose up -d

# Migrate db
migrate:
	cd $(BACKEND_DIR) && npx migrate dev --name init

# Generate prisma client
prisma-generate:
	cd $(BACKEND_DIR) && npx prisma generate

# Backend dependencies
backend:
	cd $(BACKEND_DIR) && npm install

format-check:
	cd $(BACKEND_DIR) && npx prettier . --check

format-fix:
	cd $(BACKEND_DIR) && npx prettier . --write

lint:
	cd $(BACKEND_DIR) && npx eslint .
