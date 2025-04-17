#!/bin/bash

# setup.sh - ZYMHOP Project Setup Script
# This script sets up the ZYMHOP monorepo project with the enhanced folder structure.

set -e  # Exit immediately if a command exits with a non-zero status

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BOLD}${GREEN}🚀 Setting up ZYMHOP Monorepo Project...${NC}"

# Create root directory if specified
if [ "$1" ]; then
  mkdir -p "$1"
  cd "$1"
  PROJECT_ROOT=$(pwd)
else
  PROJECT_ROOT=$(pwd)
fi

echo -e "${BLUE}Creating project in:${NC} ${PROJECT_ROOT}"

# Create GitHub workflows directory
echo -e "${YELLOW}Setting up GitHub workflows...${NC}"
mkdir -p .github/workflows
touch .github/workflows/ci.yml
touch .github/workflows/deploy-api.yml
touch .github/workflows/deploy-admin.yml
touch .github/workflows/deploy-web.yml

# Create apps directory
echo -e "${YELLOW}Creating applications structure...${NC}"

# API application
mkdir -p apps/api/{config,controllers/{admin,auth,booking,gym,payment,subscription,trainer,user,vendor},middleware,models/schemas,routes,services/{domain,external,analytics},validation,sockets,utils,jobs,tests/{integration,unit,mocks}}
touch apps/api/app.js
touch apps/api/server.js
touch apps/api/package.json
touch apps/api/.env.example

# API config files
touch apps/api/config/{database.js,environment.js,logger.js,razorpay.js,redis.js,socket.js,storage.js,swagger.js}

# API model schemas
touch apps/api/models/schemas/{address.schema.js,location.schema.js,payment.schema.js}
touch apps/api/models/{Booking.js,Equipment.js,Gym.js,Payment.js,Subscription.js,Trainer.js,User.js,Vendor.js}

# API routes
touch apps/api/routes/{admin.routes.js,auth.routes.js,booking.routes.js,gym.routes.js,index.js,payment.routes.js,subscription.routes.js,trainer.routes.js,user.routes.js,vendor.routes.js}

# API services
touch apps/api/services/domain/{auth.service.js,booking.service.js,gym.service.js,subscription.service.js,trainer.service.js,user.service.js}
touch apps/api/services/external/{payment.service.js,storage.service.js,notification.service.js,location.service.js}
touch apps/api/services/analytics/{booking.analytics.js,gym.analytics.js,revenue.analytics.js}

# API validation schemas
touch apps/api/validation/{auth.schema.js,booking.schema.js,gym.schema.js,user.schema.js}

# API sockets
touch apps/api/sockets/{index.js,booking.socket.js,notification.socket.js}

# API utils
touch apps/api/utils/{constants.js,dateUtils.js,errorTypes.js,fileUpload.js,logger.js,validators.js}

# API jobs
touch apps/api/jobs/{cronManager.js,reminderJob.js,subscriptionRenewal.js}

# Admin Dashboard
mkdir -p apps/admin/{public/{images,icons},src/{components/{common,dashboard,gym,layout,subscription,user,vendor},pages/{auth,dashboard,gyms,subscriptions,users,vendors},store,utils}}
touch apps/admin/public/favicon.ico
touch apps/admin/src/{App.tsx,main.tsx,router.tsx}
touch apps/admin/src/store/{authStore.ts,gymStore.ts,uiStore.ts}
touch apps/admin/src/utils/{formatters.ts,validators.ts,helpers.ts}
touch apps/admin/{index.html,tailwind.config.js,tsconfig.json,vite.config.ts,package.json}

# Gym Owner Dashboard
mkdir -p apps/gym-owner/{public,src/{components/{common,dashboard,equipment,gym,layout,slots,trainer},pages,store,utils}}
touch apps/gym-owner/src/{App.tsx,main.tsx,router.tsx}
touch apps/gym-owner/{index.html,tailwind.config.js,tsconfig.json,vite.config.ts,package.json}

# Public Website
mkdir -p apps/web/{public,src/{app/{about,auth,gyms,profile,bookings},components,hooks,lib,store}}
touch apps/web/src/app/{layout.tsx,page.tsx}
touch apps/web/{next.config.js,package.json}

# Mobile App
mkdir -p apps/mobile/{android,ios,src/{components,navigation,screens,store,utils}}
touch apps/mobile/src/App.tsx
touch apps/mobile/{app.json,package.json}

# Create packages directory
echo -e "${YELLOW}Creating shared packages structure...${NC}"

# API Client package
mkdir -p packages/api-client/src/{core,clients,types,utils}
touch packages/api-client/src/core/{api-base.ts,error-handler.ts,auth-handler.ts}
touch packages/api-client/src/clients/{auth.client.ts,booking.client.ts,gym.client.ts,payment.client.ts,user.client.ts}
touch packages/api-client/src/index.ts
touch packages/api-client/{package.json,tsconfig.json}

# Types package
mkdir -p packages/types/src/{models,api,common}
touch packages/types/src/models/{booking.types.ts,gym.types.ts,payment.types.ts,subscription.types.ts,trainer.types.ts,user.types.ts}
touch packages/types/src/index.ts
touch packages/types/{package.json,tsconfig.json}

# UI package
mkdir -p packages/ui/src/{components/{buttons,forms,layout,feedback,data},hooks,theme}
touch packages/ui/src/index.ts
touch packages/ui/{package.json,tsconfig.json}

# Hooks package
mkdir -p packages/hooks/src
touch packages/hooks/src/{useApi.ts,useAuth.ts,useForm.ts,useMediaQuery.ts,index.ts}
touch packages/hooks/{package.json,tsconfig.json}

# Utils package
mkdir -p packages/utils/src/{date,format,validation}
touch packages/utils/src/index.ts
touch packages/utils/{package.json,tsconfig.json}

# Config package
mkdir -p packages/config/{eslint,typescript,environment}
touch packages/config/environment/{index.ts,schema.ts}
touch packages/config/tailwind.config.js
touch packages/config/package.json

# Assets package
mkdir -p packages/assets/src/{images,icons}
touch packages/assets/src/index.ts
touch packages/assets/{package.json,tsconfig.json}

# Mocks package
mkdir -p packages/mocks/src/{data,handlers,utils}
touch packages/mocks/src/data/{gyms.ts,trainers.ts,bookings.ts,users.ts}
touch packages/mocks/src/index.ts
touch packages/mocks/{package.json,tsconfig.json}

# Create docs directory
echo -e "${YELLOW}Creating documentation structure...${NC}"
mkdir -p docs/{architecture,api,development}

# Create scripts directory
echo -e "${YELLOW}Creating scripts...${NC}"
mkdir -p scripts
touch scripts/{seed-db.js,create-package.js}
cat > scripts/setup.sh << 'EOF'
#!/bin/bash
# Setup script placeholder - replace with actual setup logic
echo "Setting up ZYMHOP project..."
# Install dependencies
# npm install
EOF
chmod +x scripts/setup.sh

# Create root configuration files
echo -e "${YELLOW}Creating root configuration files...${NC}"
touch .eslintrc.js
touch .prettierrc
touch .gitignore
touch .nvmrc
touch docker-compose.yml
touch turbo.json
touch package.json
touch README.md

# Create basic README.md content
cat > README.md << 'EOF'
# ZYMHOP Project

A comprehensive gym slot booking platform with subscription management.

## Project Structure

This is a monorepo managed with Turborepo containing:

- **apps/api**: Backend API server (Node.js, Express, MongoDB)
- **apps/admin**: Admin dashboard (React, Vite, TypeScript, Tailwind CSS)
- **apps/gym-owner**: Gym owner dashboard (React, Vite, TypeScript, Tailwind CSS)
- **apps/web**: Public website (Next.js, TypeScript, Tailwind CSS)
- **apps/mobile**: Mobile app (React Native, TypeScript)

## Getting Started

```bash
# Install dependencies
npm install

# Start development servers
npm run dev