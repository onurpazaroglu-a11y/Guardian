.PHONY: dev build prod stop logs clean

# Development
dev:
	cd infra/docker && docker-compose up -d

dev-build:
	cd infra/docker && docker-compose up -d --build

dev-logs:
	cd infra/docker && docker-compose logs -f

# Production
prod:
	cd infra/docker && docker-compose -f docker-compose.prod.yml up -d

prod-build:
	cd infra/docker && docker-compose -f docker-compose.prod.yml up -d --build

# Utilities
stop:
	cd infra/docker && docker-compose down
	cd infra/docker && docker-compose -f docker-compose.prod.yml down

logs:
	cd infra/docker && docker-compose logs -f

clean:
	cd infra/docker && docker-compose down -v
	docker system prune -f

# Database
db-migrate:
	cd infra/supabase && supabase db push

db-reset:
	cd infra/supabase && supabase db reset

# Helpers
shell-web:
	docker exec -it guardian-web sh

shell-engine:
	docker exec -it guardian-engine bash

shell-redis:
	docker exec -it guardian-redis redis-cli