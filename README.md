# Project_Name — Developer Guide

> **Project_Name** — Full-stack application with NestJS backend, Next.js frontend, and Flutter mobile app.
>
> This guide is step by step guideline to start new fullstack project and for new developers joining the project. It covers architecture, conventions, and step-by-step instructions for adding new modules.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Tech Stack](#2-tech-stack)
- [3. Getting Started](#3-getting-started)
- [4. Backend Architecture (NestJS)](#4-backend-architecture-nestjs)
  - [4.1 Directory Structure](#41-directory-structure)
  - [4.2 Clean Architecture Layers](#42-clean-architecture-layers)
  - [4.3 Request Lifecycle](#43-request-lifecycle)
  - [4.4 Database & Prisma](#44-database--prisma)
  - [4.5 Authentication & Authorization](#45-authentication--authorization)
  - [4.6 Shared Utilities](#46-shared-utilities)
  - [4.7 API Response Format](#47-api-response-format)
  - [4.8 Step-by-Step: Adding a New Backend Module](#48-step-by-step-adding-a-new-backend-module)
- [5. Frontend Architecture (Next.js)](#5-frontend-architecture-nextjs)
  - [5.1 Directory Structure](#51-directory-structure)
  - [5.2 Clean Architecture Layers](#52-clean-architecture-layers)
  - [5.3 BFF Proxy Pattern](#53-bff-proxy-pattern)
  - [5.4 Authentication & RBAC](#54-authentication--rbac)
  - [5.5 Key Patterns & Components](#55-key-patterns--components)
  - [5.6 State Management](#56-state-management)
  - [5.7 Step-by-Step: Adding a New Frontend Module](#57-step-by-step-adding-a-new-frontend-module)
- [6. Adding a Complete Feature End-to-End](#6-adding-a-complete-feature-end-to-end)
- [7. Environment Variables](#7-environment-variables)
- [8. Database Migrations](#8-database-migrations)
- [9. Coding Conventions](#9-coding-conventions)
- [10. Common Patterns Reference](#10-common-patterns-reference)

---

## 1. Project Overview

Define in short about the project

| Domain          | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| **RBAC**        | Users, Roles, Permissions, Audit Logs                                |
| **Geography**   | Region → Zone → Woreda → Kebele (Ethiopian administrative hierarchy) |
| **Master Data** | Will list Later                                                      |
| **Admin**       | Demand Windows, System Configuration                                 |
| **Dashboard**   | Analytics and reporting endpoints                                    |

---

## 2. Tech Stack

### Backend (`backend/`)

| Technology         | Version | Purpose                         |
| ------------------ | ------- | ------------------------------- |
| NestJS             | 11.x    | Application framework           |
| TypeScript         | 5.7     | Language                        |
| Prisma             | 7.6.x   | ORM + migrations                |
| PostgreSQL         | 16.x    | Database                        |
| Zod                | 4.3.x   | Runtime DTO validation          |
| Passport + JWT     | —       | Authentication                  |
| Swagger            | —       | API documentation (`/api/docs`) |
| Helmet + Throttler | —       | Security + rate limiting        |

### Frontend (`frontend/`)

| Technology     | Version  | Purpose                       |
| -------------- | -------- | ----------------------------- |
| Next.js        | 16.x     | React framework (App Router)  |
| React          | 19.x     | UI library                    |
| TypeScript     | 5.9.x    | Language                      |
| NextAuth v5    | 5.0-beta | Authentication (JWT strategy) |
| TanStack Query | 5.x      | Server-state management       |
| Zustand        | 5.x      | Client-state management       |
| shadcn/ui      | 4.x      | Component library             |
| Tailwind CSS   | 4.x      | Styling                       |
| Axios          | 1.x      | HTTP client                   |
| Formik + Zod   | —        | Form handling + validation    |
| Recharts       | 3.x      | Dashboard charts              |

---

## 3. Complete Full-Stack Development Roadmap

                    FMS SYSTEM
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
      Web Browser    Mobile App    PostgreSQL
          │             │
          ▼             ▼
      Next.js        Flutter
       Frontend
          │
          │ HTTPS/HTTP
          ▼
      BFF / API
          │
          ▼
      NestJS Backend
          │
          ▼
        Prisma
          │
          ▼
      PostgreSQL

### PART 0: Understand the System Before Coding

- Understand the business of the system

### PART 1: Define Requirements

- Before database design, define what the system must actually do.

### 1.1 Identify users/|Roles

- Admin, Woreda user and other

- Then define what can this user can did

### 1.2 Define organizational hierarchy

    Region
       ↓
    Zone
       ↓
    Woreda
       ↓
    Kebele
    ***********

- Below can help as for RBAC and database queries

  Federal user
  ↓
  Can see all regions

  Regional user
  ↓
  Can see only their region

  Zone user
  ↓
  Can see only their zone

  Woreda user
  ↓
  Can see only their woreda

  Kebele user
  ↓
  Can see only their kebele

## 4. Design the System

### 4.1 High-level architecture

                    INTERNET / LAN
                          │
                          ▼
                    Next.js 16
                     Frontend
                          │
                     /api/*
                          │
                          ▼
                    BFF Proxy
                          │
                          ▼
                    NestJS 11
                     Backend
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ▼             ▼             ▼
          Auth          RBAC        Business Modules
            │             │             │
            └─────────────┼─────────────┘
                          │
                          ▼
                       Prisma
                          │
                          ▼
                    PostgreSQL

## 5. Decide the Project Structure

    n3project/
    │
    ├── backend/
    ├── frontend/
    ├── node_modules/
    ├── docker-compose.yml
    └── ...

### 5.1. Project structure 1 - Two independent npm projects:

    n3project/
    ├── backend/
    │   └── package.json
    └── frontend/
    	└── package.json

### 5.2. Project structure 2 - monorepo/workspace.

## 6. Getting Started

### 6.1 Install/check

- Node.js | node --version
- npm | npm --version
- PostgreSQL | psql --version (PostgreSQL is installed locally)
- Git | git --version
- VS Code
- Docker | docker --version

### 6.2. Create Project Directory

    mkdir n3project
    cd n3project

### 6.3. Setup PostgreSQL with Docker

- before prisma understand PostgreSQL architecture

```
  PostgreSQL Server
  │
  ▼
  N3 Database
  │
  ▼
  Prisma
  │
  ▼
  NestJS
```

- Lets use docker for postgresql, by creating docker-compose.yml under root folder.

```
  Docker
  │
  └── PostgreSQL container
  │
  ├── Database: db_name
  ├── Port: 5432
  └── Persistent volume

  n3project/
  frontend/
  backend/
  docker-compose.yml
```

#### and put for docker-compose.yml

    services:
      postgres:
    	image: postgres:16
    	container_name: n3-postgres
    	restart: unless-stopped
    	environment:
    	  POSTGRES_USER: postgres
    	  POSTGRES_PASSWORD: postgres
    	  POSTGRES_DB: n3_db
    	ports:
    	  - "5432:5432"
    	volumes:
    	  - postgres_data:/var/lib/postgresql/data

    volumes:
      postgres_data:

#### Start PostgreSQL

    docker compose up -d

#### Check

    docker ps

## 7. Git Setup

- Initialize Git on root folder

  git init

- Create .gitignore and add minimum of

---

```bash
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

/src/generated/prisma
```

- after the basic project structure works , create the first commit
  git add .
  git commit -m "chore: initialize project"

---

## Backend Initialization

### Select Backend Architecture(NestJS)

- Modular Monolith
- Clean Architecture
- 3-Tier
- select architecture, for now Clean Architecture.

### Directory Structure plan for it

    src/
    │
    ├── domain/
    ├── application/
    ├── infrastructure/
    ├── presentation/
    └── shared/

### Each folder does

```
    src/
    │
    ├── domain/
    │   └── Business rules and core entities
    │      └── <Module>
    │         └── entities
    │         └── repositories
    │         └── services
    │
    ├── application/
    │   └── Use cases / application logic
    │      └── <Module>
    │         └── dto
    │         └── use-cases
    │
    ├── infrastructure/
    │   └── Database, Prisma, JWT, external APIs, etc.
    │      └── <Module>
    │         └── database
    │            └── entities
    │            └── repositories
    │
    ├── presentation/
    │   └── Controllers, API DTOs, guards, pipes
    │      └── <Module>
    │         └── controller
    │          └── provider
    │         └── decorators (for RBAC)
    │          └── guards (for RBAC)
    │         └── strategies (for RBAC)
    │
    └── shared/
        └── Common utilities used by multiple layers
```

### 10.1.1 Detail Directory Structure

```
backend/src/
├── main.ts # Bootstrap, global pipes/filters/interceptors
├── app.module.ts # Root module — imports all feature modules
│
├── domain/ # LAYER 1: Domain (innermost)
│ └── <module>/
│ ├── entities/ # Entity interfaces (pure TypeScript)
│ │ └── <entity>.entity.ts
│ ├── repositories/ # Repository interfaces (contracts)
│ │ └── <entity>.repository.ts
│ └── services/ # Domain services (pure business logic, optional)
│ └── <module>.service.ts
│
├── application/ # LAYER 2: Application
│ └── <module>/
│ ├── dto/ # Zod validation schemas + TypeScript types
│ │ └── <module>.dto.ts
│ └── use-cases/ # Injectable use case classes
│ └── <entity>.usecases.ts
│
├── infrastructure/ # LAYER 3: Infrastructure
│ └── <module>/
│ └── database/
│ ├── entities/ # ORM mappers (Prisma → domain entity)
│ │ └── <entity>.orm-entity.ts
│ └── repositories/ # Prisma repository implementations
│ └── <entity>.repository.impl.ts
│
├── presentation/ # LAYER 4: Presentation (outermost)
│ └── <module>/
│ ├── <module>.module.ts # NestJS module definition
│ ├── controllers/ # HTTP controllers
│ │ └── <entity>.controller.ts
│ └── providers/ # DI provider bindings
│ └── <module>.providers.ts
│
└── shared/ # Cross-cutting concerns
├── constants/ # DI tokens, audit action names
├── dto/ # PaginationQuery, ApiResponse
├── enums/ # Permission enums
├── filters/ # GlobalExceptionFilter
├── interceptors/ # LoggingInterceptor, TransformInterceptor
├── interfaces/ # ICurrentUser, IJwtPayload, IPaginationMeta
├── pipes/ # ZodValidationPipe
└── utils/ # PasswordUtil, PaginationUtil, StringUtil
```

### build NestJS

    backend/

    npm install -g @nestjs/cli
    nest new backend

    √ Which package manager would you ❤️  to use? ### npm
    √ Would you like to enable auto-instrumented observability (@nestjs/observe)? ### N
    √ Which module system would you like to use? ### ESM (ES Modules)         [ with vitest ]

### 8.2 install libraries inside of backend folder

✅ Remove-Item -Recurse -Force node_modules
✅ Remove-Item -Force package-lock.json
✅ npm install

#### ConfigService

    npm install @nestjs/config

#### Prisma

    npm install prisma@7.6.0 @prisma/client@7.6.0

#### PostgreSQL driver

    npm install pg
    npm install -D @types/pg

#### Zod

    npm install zod

#### JWT

    npm install @nestjs/jwt

    npm ls @nestjs/config
    npm install @nestjs/config

#### Passport

    npm install @nestjs/passport passport

##### To implement JWT authentication with Passport:

    npm install passport-jwt
    npm install -D @types/passport-jwt

#### Swagger

    npm install @nestjs/swagger

#### Helmet

    npm install helmet

#### Throttler

    npm install @nestjs/throttler

#### bcrypt

    npm install bcrypt
    npm install -D @types/bcrypt

    npm install -D tsx

#### To Install everything at once

    npm install List-All-Libraries

#### Initialize Prisma

    npx prisma init

#### To verify prisma

    npx prisma validate

## Remove the default demo code

### Delete:

```
src/app.controller.ts
src/app.controller.spec.ts
src/app.service.ts
```

### Then change app.module.ts

```bash
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}

```

### create .env on backend and put below

```
  PORT=4000
  NODE_ENV=development
  API_PREFIX=api/v1
```

- The install

```
npm install @nestjs/config
```

### Load environment variables

- Load .env environments by updating app.module.ts into

```bash 
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,       // it is mandatory
    }),
  ],
})
export class AppModule {}
```

- Now other modules can inject ConfigService without importing ConfigModule repeatedly. use is on main.ts

### Use ConfigService in main.ts

```bash
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 4000);

  await app.listen(port);
}

bootstrap();
```

## Add an API prefix

- It must be versioned API endpoints such as Like-/api/v1/regions

- Add to main.ts:

```bash
app.setGlobalPrefix(
  configService.get<string>('API_PREFIX', 'api/v1'),
);
```

- Now our route(@Get()) becomes : GET /api/v1/... instead of GET /

## Add global validation

- Use class-validator, class-transformer and ValidationPipe for global validation. must be compatible version with nestjs and others....

```
npm install class-validator class-transformer
```

### Update src/main.ts by adding ValidationPipe

```bash
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // unexpected properties can be stripped from the validated object.
    transform: true, //It allows Nest/class-transformer to transform incoming values according to DTO metadata.
  }),
);
```

## Test the backend run's

npm run start

- Must get: 404, because haven't controller

### Part 2

### Let's create a tiny health endpoint

- create src/health.controller.ts, and add :

```bash
  import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
    };
  }
}
```

- Then register it on app.module.ts:

```bash
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}

```

### Rerun and test

- Test URL : GET http://localhost:4000/api/v1/health

- if it was not working , update tsconfig.json

```bash
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "isolatedModules": false,
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": false,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

### Add Swagger

- install it

```
npm install @nestjs/swagger
```

- Then add it on main.ts:

```
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

```

- also add below before app.listen():

```bash
const swaggerConfig = new DocumentBuilder()
  .setTitle('N3 Learning API')
  .setDescription('Learning project API')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(
  app,
  swaggerConfig,
);

SwaggerModule.setup('api/docs', app, document);
```

## Part 3 - Database foundation: PostgreSQL + Docker + Prisma.

### Check docker existed

```
docker --version
docker compose version
```

### Create docker-compose.yml

- Create it on root folder, and add :

```bash
services:
  postgres:
    image: postgres:16
    container_name: easycode
    restart: unless-stopped

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: easy_db

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

```

- Start PostgreSQL on the folder that docker-compose.yml exists

```
docker compose up -d

```

- Then the container immediately created on the docker, check it by:

```
 docker ps

```

- Verify PostgreSQL and can inspect the logs:

```
docker logs easycode
```

### Introduce & Prisma Setup

- Prisma is an ORM/toolkit for working with databases from application code.

- Instead of manually writing SQL(SELECT \* FROM users WHERE id = 1;) everywhere, we can eventually write TypeScript like:

```bash
prisma.user.findUnique({
  where: {
    id: 1,
  },
});
```

### Install Prisma

```
npm install @prisma/client@7.6.0 @prisma/adapter-pg@7.5.0 pg
npm install -D prisma@7.6.0

```

### Initialize prisma

```
npx prisma init


or

Remove-Item -Recurse -Force prisma\migrations

```

### Then The structure should be setted up

    backend/
    │
    ├── prisma/
    │   └── schema.prisma  - which is not is not the database itself.
    │
    ├── prisma.config.ts - if prisma7.config.ts created renamed it.
    │
    ├── .env
    └── package.json

- .env should contain:
  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/n2p_db?schema=public"

- on prisma.config.ts

```bash
  import "dotenv/config";
  import { defineConfig } from "prisma/config";

  export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
      path: "prisma/migrations",
    },
    datasource: {
      url: process.env.DATABASE_URL!,
    },
  });
```

- Now Prisma can connect to PostgreSQL.

### Manage Prisma schema

- open backend/prisma/schema.prisma, and add:

```
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

  model User {
    id        Int      @id @default(autoincrement())
    name      String
    email     String   @unique
    createdAt DateTime @default(now())
  }

```

- Move to migration

```
npx prisma migrate dev --name init
```

- Then the same SQL table must be created prisma/migrations.sql

- Generate Prisma Client

```
npx prisma generate
```

- Verify the database visually by running

```
npx prisma studio

```

- Verify from PostgreSQL itself

```
docker exec -it easycode psql -U postgres -d easy_db

docker compose down

\dt or SELECT * FROM "User";

\q

```

## 4. Clean Architecture Foundation

-This clean architecture used to - Business rules should not depend on external technologies. it makes below

```
                    External World
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      HTTP            Prisma          PostgreSQL
        │                │                │
        ▼                ▼                ▼
┌──────────────────────────────────────────────┐
│              Application                     │
│                                              │
│              Domain                          │
│                                              │
└──────────────────────────────────────────────┘

```

- The inner logic should be protected from the outside world.

### There fore Our four main layers becomes

```
src/
├── domain/
├── application/
├── infrastructure/
└── presentation/
```

### Clean Architecture Layers

The backend follows **strict Clean Architecture** with dependency inversion. Dependencies only flow inward.

```
┌──────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER("What came from the outside?") │
│ Controllers, Modules, Guards, Decorators │
│ (NestJS-specific — HTTP request/response handling) │
│ • Receives HTTP requests │
│ • Validates input via ZodValidationPipe │
│ • Calls use cases │
│ • Returns response (auto-wrapped by TransformInterceptor)│
├──────────────────────────────────────────────────────────┤
│ APPLICATION LAYER ("What does the system need to do?")│
│ Use Cases (Injectable classes) + DTOs (Zod schemas) │
│ • Each use case = one business operation │
│ • Orchestrates: repo calls, audit logging, error throws │
│ • Depends on domain interfaces, NOT implementations │
├──────────────────────────────────────────────────────────┤
│ DOMAIN LAYER (innermost — zero framework dependencies)-"What are the business rules?" │
│ Entity interfaces, Repository interfaces, Domain Services│
│   • Pure TypeScript — no NestJS, no Prisma imports │
│   • Defines WHAT operations exist, not HOW they work │
│   • Domain services represents the business concepts and rules │
│   • Don't care about whether we use PostgreSQL, Prisma, MongoDB or MySQL│
├──────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE LAYER ("How do we technically implement it?")│
│ Prisma repository implementations + ORM mappers │
│ • Implements repository interfaces from domain layer │
│ • Talks to PostgreSQL via PrismaService │
│ • Handles soft-delete filtering, audit fields │
├──────────────────────────────────────────────────────────┤
│ SHARED LAYER (cross-cutting) │
│ Constants, DTOs, Filters, Interceptors, Pipes, Utils │
│ • Used by any layer │
│ • Contains framework-specific utilities │
└──────────────────────────────────────────────────────────┘
```

### Lets start innermost layer - Domain

- Create - Create: backend/src/domain/

- Thing belong to domain (Entities, Value Objects, Repository interfaces, Domain rules, Domain services)

- Domain didn't know about Prisma

- Instead of Domain -> Prisma, the dependency point is:

```
Domain -> Application -> Infrastructure
```

### Second: Application

- Now create:

```
backend/src/application/
```

- contains use cases, for doing (Create Region , Get Region, Get All Regions, Update Region, Delete Region)

### Third: Infrastructure

- Create:

```
backend/src/infrastructure/

```

- This is where technology-specific implementations live.
- This Layer Knows(Prisma, PostgreSQL, Redis, External APIs, File storage , Email providers)

### Fourth: Presentation

- Create :

```
    backend/src/presentation/`
```

- This is the interface through which external clients interact with the application.

### Shared

- contains things that genuinely belong across multiple areas.

### Our final Architecture becomes

```
                   CLIENT
                     │
                     │ HTTP
                     ▼
             ┌───────────────┐
             │ Presentation  │
             │  Controller   │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │ Application   │
             │   Use Case    │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │    Domain     │
             │ Business Rule │
             └───────▲───────┘
                     │
                     │ implements
                     │
             ┌───────┴───────┐
             │Infrastructure │
             │    Prisma     │
             └───────┬───────┘
                     │
                     ▼
                PostgreSQL

```

## Build the Region Backend

### Procedure of building backend of regions


```
Prisma
 ├── region 

        ↓

Domain
 ├── regionEntity 

        ↓

Repository contracts
 ├── IRegionRepository 

        ↓

DTOs
 ├── region DTO 

        ↓

Use cases
 ├── region 

        ↓

Infrastructure
 ├── region repository 

        ↓

Presentation
 ├── region controller 
 
```

- complete flow becomes

```
HTTP Request
     ↓
Controller
     ↓
Use Case
     ↓
Domain
     ↓
Repository Interface
     ↓
Prisma Repository
     ↓
Prisma
     ↓
PostgreSQL

```

- Lets start with:

```
POST /api/v1/regions
```

### First create the Region database model

- Open: backend/prisma/schema.prisma, and add:

```bash
model Region {
  id        String    @id @default(uuid())
  name      String
  code      String    @unique
  isActive  Boolean   @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  createdBy String?
  updatedBy String?
}

```

Use UUID instead of integer making harder to guess and work well in distributed systems.

#### Create the migration

```
npx prisma migrate dev --name add_region
```

Then verify it in both ways.

### Now the interesting part: Domain

- Create:

```
backend/src/domain/geography/entities/region.entity.ts    , Then add:

```

```typescript
export interface RegionEntity {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface RegionResponseModel {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

Prisma model and Domain entities looks similar, but they serve different purposes.

Prisma model - describes persistence.
Domain entities - represents the business concept.

Instead of Domain-> Prima, we will continue Domain<- Infrastructure - prisma.
Infrastructure translates between the database representation and the domain representation.

### Domain repository interface

domain needs a way to store Regions. for that create the repository

- Create:

```
src/domain/geography/repositories/region.repository.ts    and add:

```

```typescript
import { RegionEntity } from "../entities/region.entity";

export interface IRegionRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    search?: string;
    isActive?: boolean;
  }): Promise<{
    items: RegionEntity[];
    total: number;
  }>;

  findById(id: string): Promise<RegionEntity | null>;

  findByCode(code: string): Promise<RegionEntity | null>;

  create(data: Partial<RegionEntity>, userId?: string): Promise<RegionEntity>;

  update(
    id: string,
    data: Partial<RegionEntity>,
    userId?: string,
  ): Promise<RegionEntity>;

  softDelete(id: string, userId?: string): Promise<void>;

  lookup(): Promise<Pick<RegionEntity, "id" | "name" | "code">[]>;
}
```

There is no Prisma(either PrismaClient or PrismaService) existed till now. It is Just only pure business-facing contract.

It does not say how, instead All needs somebody.

### PrismaService

Before creating the repository, let's create a central Prisma service

- Create:

```

src/infrastructure/database/prisma/prisma.service.ts  The add:

```

```typescript
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: pg.Pool;

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.get<string>("DATABASE_URL");

    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured");
    }

    const pool = new pg.Pool({
      connectionString,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });

    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log("Database connection established");
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log("Database connection closed");
  }

  softDeleteFilter() {
    return {
      deletedAt: null,
    };
  }

  auditCreate(userId?: string) {
    return {
      createdBy: userId ?? null,
      updatedBy: userId ?? null,
    };
  }

  auditUpdate(userId?: string) {
    return {
      updatedBy: userId ?? null,
    };
  }

  softDelete() {
    return {
      deletedAt: new Date(),
    };
  }
}
```


### Add some utils for pagination on shared folder

```
src/shared/utils/index.ts
```

```bash


import * as bcrypt from 'bcrypt';
import { RBAC_CONSTANTS } from '../constants';

export class PasswordUtil {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, RBAC_CONSTANTS.PASSWORD.SALT_ROUNDS);
  }

  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  } 
}

export class PaginationUtil {
  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static buildMeta(page: number, limit: number, total: number) {
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }
}

export class StringUtil {
  static generatePermissionName(module: string, action: string): string {
    return `${module}:${action}`;
  }
}


```
- Who will provide the implementation?

  ### It is infrastructure,

  it will implement RegionRepository

  ```
  src/infrastructure/geography/database/repositories/region.repository.impl.ts

  ```

```typescript

import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IRegionRepository } from '../../../../domain/geography/repositories/region.repository';
import { RegionEntity } from '../../../../domain/geography/entities/region.entity';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaRegionRepository implements IRegionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
  }): Promise<{
    items: RegionEntity[];
    total: number;
  }> {
    const where: Prisma.RegionWhereInput = {
      ...this.prisma.softDeleteFilter(),
    };

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          code: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const skip = PaginationUtil.calculateSkip(
      query.page,
      query.limit,
    );

    const [items, total] = await Promise.all([
      this.prisma.region.findMany({
        where,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        skip,
        take: query.limit,
      }),

      this.prisma.region.count({
        where,
      }),
    ]);

    return {
      items: items as RegionEntity[],
      total,
    };
  }

  async findById(id: string): Promise<RegionEntity | null> {
    const region = await this.prisma.region.findFirst({
      where: {
        id,
        ...this.prisma.softDeleteFilter(),
      },
    });

    return region as RegionEntity | null;
  }

  async findByCode(code: string): Promise<RegionEntity | null> {
    const region = await this.prisma.region.findFirst({
      where: {
        code,
        ...this.prisma.softDeleteFilter(),
      },
    });

    return region as RegionEntity | null;
  }

  async create(
    data: Partial<RegionEntity>,
    userId?: string,
  ): Promise<RegionEntity> {
    const region = await this.prisma.region.create({
      data: {
        name: data.name!,
        code: data.code!,
        isActive: data.isActive ?? true,
        ...this.prisma.auditCreate(userId),
      },
    });

    return region as RegionEntity;
  }

  async update(
    id: string,
    data: Partial<RegionEntity>,
    userId?: string,
  ): Promise<RegionEntity> {
    const region = await this.prisma.region.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...this.prisma.auditUpdate(userId),
      },
    });

    return region as RegionEntity;
  }

  async softDelete(
    id: string,
    userId?: string,
  ): Promise<void> {
    await this.prisma.region.update({
      where: {
        id,
      },
      data: {
        ...this.prisma.softDelete(),
        ...this.prisma.auditUpdate(userId),
      },
    });
  }

  async lookup(): Promise<
    Pick<RegionEntity, 'id' | 'name' | 'code'>[]
  > {
    return this.prisma.region.findMany({
      where: {
        isActive: true,
        ...this.prisma.softDeleteFilter(),
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
```

### Create a provider

```
src/presentation/geography/providers/geography.providers.ts
```

```bash

import { Provider } from '@nestjs/common';
import { GEOGRAPHY_TOKENS, REPOSITORY_TOKENS } from '../../../shared/constants';

// Infrastructure repository implementations
import {
  PrismaRegionRepository, 
} from '../../../infrastructure/geography/database/repositories'; 

// Region use cases
import {
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
} from '../../../application/geography/use-cases';
 
 
/**
 * Repository providers — binds domain interfaces to infrastructure implementations.
 * This is the key DI configuration that enables Clean Architecture's dependency inversion.
 */
export const repositoryProviders: Provider[] = [
  {
    provide: GEOGRAPHY_TOKENS.REGION_REPOSITORY,
    useClass: PrismaRegionRepository,
  },
    
];

/**
 * All use case providers for the Geography module.
 */
export const useCaseProviders: Provider[] = [
  // Regions
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
  
];


```

- decorators are created on rbac folder, even if it will created on rbac section

- interface folder is also created on shared  folder

### Controller

```
backend/src/presentation/geography/controllers/region.controller.ts

```
- Temporary until rbac created

```bash 

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';

import {
  GeographyQuerySchema,
  CreateRegionSchema,
  UpdateRegionSchema,
} from '../../../application/geography/dto';

import type {
  GeographyQueryDto,
  CreateRegionDto,
  UpdateRegionDto,
} from '../../../application/geography/dto';

import {
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
} from '../../../application/geography/use-cases';

import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('regions')
export class RegionController {
  constructor(
    private readonly getRegions: GetRegionsUseCase,
    private readonly getRegion: GetRegionUseCase,
    private readonly createRegion: CreateRegionUseCase,
    private readonly updateRegion: UpdateRegionUseCase,
    private readonly deleteRegion: DeleteRegionUseCase,
    private readonly lookupRegions: LookupRegionsUseCase,
  ) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(GeographyQuerySchema))
    query: GeographyQueryDto,
  ) {
    return this.getRegions.execute(query);
  }

  @Get('lookup')
  lookup() {
    return this.lookupRegions.execute();
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Amhara',
        },
        code: {
          type: 'string',
          example: 'AM',
        },
        isActive: {
          type: 'boolean',
          example: true,
        },
      },
      required: ['name', 'code'],
    },
  })
  create(
    @Body(new ZodValidationPipe(CreateRegionSchema))
    dto: CreateRegionDto,
  ) {
    return this.createRegion.execute(dto);
  }

  @Put(':id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Amhara Region',
        },
        code: {
          type: 'string',
          example: 'AM',
        },
        isActive: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateRegionSchema))
    dto: UpdateRegionDto,
  ) {
    return this.updateRegion.execute(id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getRegion.execute(id);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '221a2244-1d7c-484d-b0c3-67fe7160d19d',
    description: 'Region UUID',
  })
  remove(@Param('id') id: string) {
    return this.deleteRegion.execute(id);
  }
}

```

### Create the Geography module

- Create:

```
backend/src/presentation/geography/geography.module.ts
```
- Temporary until rbac

```typescript
import { Module } from '@nestjs/common';

import {
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
} from '../../application/geography/use-cases';

import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

import { PrismaRegionRepository } from '../../infrastructure/geography/database/repositories/region.repository.impl';

import { RegionController } from './controllers/region.controller';

import { GEOGRAPHY_TOKENS } from '../../shared/constants';

@Module({
  controllers: [RegionController],

  providers: [
    PrismaService,

    {
      provide: GEOGRAPHY_TOKENS.REGION_REPOSITORY,
      useClass: PrismaRegionRepository,
    },

    GetRegionsUseCase,
    GetRegionUseCase,
    CreateRegionUseCase,
    UpdateRegionUseCase,
    DeleteRegionUseCase,
    LookupRegionsUseCase,
  ],

  exports: [
    GetRegionsUseCase,
    GetRegionUseCase,
    CreateRegionUseCase,
    UpdateRegionUseCase,
    DeleteRegionUseCase,
    LookupRegionsUseCase,
  ],
})
export class GeographyModule {}

```

### Register GeographyModule to app.module.ts

- Open:

```
backend/src/app.module.ts  Then Add:
```

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GeographyModule } from "./presentation/geography/geography.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GeographyModule,
  ],
})
export class AppModule {}
```

### Verify compilation

npm run build
npm run start:dev

If it runs successfully continue to next......

### Create Region DTO

#### Install zod

```
npm install zod
```

```
backend/src/shared/dto/index.ts

```

```typescript
export * from "./pagination.dto";
export * from "./api-response.dto";
```

```
backend/src/shared/dto/api-response.dto.ts
```

```typescript
export class ApiResponseDto<T = any> {
  success!: boolean;
  message!: string;
  data?: T;
  errors?: any;
  timestamp!: string;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = "Success"): ApiResponseDto<T> {
    return new ApiResponseDto({
      success: true,
      message,
      data,
    });
  }

  static error(message: string, errors?: any): ApiResponseDto {
    return new ApiResponseDto({
      success: false,
      message,
      errors,
    });
  }

  static paginated<T>(
    data: T[],
    meta: {
      page: number;
      limit: number;
      total: number;
    },
    message = "Success",
  ) {
    const totalPages = Math.ceil(meta.total / meta.limit);

    return new ApiResponseDto({
      success: true,
      message,
      data: {
        items: data,
        meta: {
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          totalPages,
          hasNext: meta.page < totalPages,
          hasPrevious: meta.page > 1,
        },
      } as any,
    });
  }
}
```

```
backend/src/shared/dto/pagination.dto.ts
```

```typescript
import { z } from "zod";

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
});

export type PaginationQueryDto = z.infer<typeof PaginationQuerySchema>;
```

- Create

```

backend/src/application/geography/dto/geography.dto.ts

```

```typescript
import { z } from "zod";
import { PaginationQuerySchema } from "../../../shared/dto";

// ── Geography DTOs ───────────────────────────────────────────────────────────

export const CreateRegionSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z.string().min(1, "Code is required").max(20),
  isActive: z.boolean().optional().default(true),
});

export const UpdateRegionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().min(1).max(20).optional(),
  isActive: z.boolean().optional(),
});

export const GeographyQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
  regionId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  woredaId: z.string().uuid().optional(),
});

export type CreateRegionDto = z.infer<typeof CreateRegionSchema>;

export type UpdateRegionDto = z.infer<typeof UpdateRegionSchema>;

export type GeographyQueryDto = z.infer<typeof GeographyQuerySchema>;
```

### Build Check

npm run build

### Create Shared zod-validation.pipe

- Create:

```
backend/src/shared/pipes/zod-validation.pipe.ts  Then add:
```

```typescript
import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

import { ZodSchema, ZodError } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private schema: ZodSchema;

  constructor(schema: ZodSchema) {
    this.schema = schema;
  }

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        throw new BadRequestException({
          message: "Validation failed",
          errors: formattedErrors,
        });
      }

      throw new BadRequestException("Validation failed");
    }
  }
}
```

### Create Region DTO + Zod Validation

- Create

```
src/presentation/geography/controllers/region.controller.ts
```

```typescript
import { Body, Controller, Post } from "@nestjs/common";

import { CreateRegionSchema } from "../../../application/geography/dto/geography.dto";

import type { CreateRegionDto } from "../../../application/geography/dto/geography.dto";

import { RegionUseCases } from "../../../application/geography/use-cases/region.usecases";

import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";

@Controller("regions")
export class RegionController {
  constructor(private readonly regionUseCases: RegionUseCases) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateRegionSchema))
    dto: CreateRegionDto,
  ) {
    return this.regionUseCases.create({
      name: dto.name,
      code: dto.code,
      isActive: dto.isActive,
    });
  }
}
```

### Geography module now

```typescript

import { Module } from "@nestjs/common";

import { RegionUseCases } from "../../application/geography/use-cases/region.usecases";

import { IRegionRepository } from "../../domain/geography/repositories/region.repository";

import { PrismaRegionRepository } from "../../infrastructure/geography/database/repositories/region.repository.impl";

import { PrismaService } from "../../infrastructure/database/prisma/prisma.service";

import { RegionController } from "./controllers/region.controller";

export const REGION_REPOSITORY = Symbol("REGION_REPOSITORY");

@Module({
  controllers: [RegionController],

  providers: [
    PrismaService,

    {
      provide: REGION_REPOSITORY,
      useClass: PrismaRegionRepository,
    },

    {
      provide: RegionUseCases,
      useFactory: (regionRepository: IRegionRepository) => {
        return new RegionUseCases(regionRepository);
      },
      inject: [REGION_REPOSITORY],
    },
  ],

  exports: [RegionUseCases],
})
export class GeographyModule {}
```

### Test it

npm run build
npm run start

### Update region.usecases.ts on application controller

```typescript

import { Injectable, Inject, NotFoundException } from "@nestjs/common";

import { IRegionRepository } from "../../../domain/geography/repositories/region.repository";

import { RegionMapper } from "../../../infrastructure/geography/database/entities";

import { PaginationUtil } from "../../../shared/utils";

import { CreateRegionDto, UpdateRegionDto, GeographyQueryDto } from "../dto";

export const REGION_REPOSITORY = Symbol("REGION_REPOSITORY");

@Injectable()
export class GetRegionsUseCase {
  constructor(
    @Inject(REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(query: GeographyQueryDto) {
    const { items, total } = await this.regionRepo.findAll(query);

    return {
      items: RegionMapper.toResponseDtoList(items),
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}

@Injectable()
export class GetRegionUseCase {
  constructor(
    @Inject(REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(id: string) {
    const region = await this.regionRepo.findById(id);

    if (!region) {
      throw new NotFoundException("Region not found");
    }

    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class CreateRegionUseCase {
  constructor(
    @Inject(REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(dto: CreateRegionDto, userId?: string) {
    const existing = await this.regionRepo.findByCode(dto.code);

    if (existing) {
      throw new Error("Region code already exists");
    }

    const region = await this.regionRepo.create(dto, userId);

    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class UpdateRegionUseCase {
  constructor(
    @Inject(REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(id: string, dto: UpdateRegionDto, userId?: string) {
    const existing = await this.regionRepo.findById(id);

    if (!existing) {
      throw new NotFoundException("Region not found");
    }

    if (dto.code) {
      const duplicate = await this.regionRepo.findByCode(dto.code);

      if (duplicate && duplicate.id !== id) {
        throw new Error("Region code already exists");
      }
    }

    const region = await this.regionRepo.update(id, dto, userId);

    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class DeleteRegionUseCase {
  constructor(
    @Inject(REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(id: string, userId?: string) {
    const existing = await this.regionRepo.findById(id);

    if (!existing) {
      throw new NotFoundException("Region not found");
    }

    await this.regionRepo.softDelete(id, userId);
  }
}

@Injectable()
export class LookupRegionsUseCase {
  constructor(
    @Inject(REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute() {
    return this.regionRepo.lookup();
  }
}
```

### Create Region Wrapper

- Create:

```
backend/src/infrastructure/geography/database/entities/region.orm-entity.ts  And Add


```

```typescript
export class RegionMapper {
  static toResponseDto(region: any) {
    return {
      id: region.id,
      name: region.name,
      code: region.code,
      isActive: region.isActive,
      createdAt: region.createdAt,
      updatedAt: region.updatedAt,
    };
  }

  static toResponseDtoList(regions: any[]) {
    return regions.map((r) => RegionMapper.toResponseDto(r));
  }
}
```

```
entities/index.ts

```

```typescript
export { RegionMapper } from "./region.orm-entity";
```

```
database/repositories/index.ts

```

```typescript
export { PrismaRegionRepository } from "./region.repository.impl";
```

```
database/index.ts
```

```typescript
export * from "./entities";
export * from "./repositories";
```

### move to Region Use Cases and update it:

```

backend/src/application/geography/use-cases/region.usecases.ts

```

```typescript

import { Injectable, Inject, NotFoundException } from "@nestjs/common";

import { GEOGRAPHY_TOKENS } from "../../../shared/constants";

import { IRegionRepository } from "../../../domain/geography/repositories/region.repository";

import { RegionMapper } from "../../../infrastructure/geography/database/entities";

import { PaginationUtil } from "../../../shared/utils";

import { CreateRegionDto, UpdateRegionDto, GeographyQueryDto } from "../dto";

@Injectable()
export class GetRegionsUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(query: GeographyQueryDto) {
    const { items, total } = await this.regionRepo.findAll(query);

    return {
      items: RegionMapper.toResponseDtoList(items),
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}

@Injectable()
export class GetRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(id: string) {
    const region = await this.regionRepo.findById(id);

    if (!region) {
      throw new NotFoundException("Region not found");
    }

    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class CreateRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(dto: CreateRegionDto) {
    const existing = await this.regionRepo.findByCode(dto.code);

    if (existing) {
      throw new Error("Region code already exists");
    }

    const region = await this.regionRepo.create(dto);

    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class UpdateRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(id: string, dto: UpdateRegionDto) {
    const existing = await this.regionRepo.findById(id);

    if (!existing) {
      throw new NotFoundException("Region not found");
    }

    if (dto.code && dto.code !== existing.code) {
      const codeExists = await this.regionRepo.findByCode(dto.code);

      if (codeExists) {
        throw new Error("Region code already exists");
      }
    }

    const region = await this.regionRepo.update(id, dto);

    return RegionMapper.toResponseDto(region);
  }
}

@Injectable()
export class DeleteRegionUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute(id: string) {
    const existing = await this.regionRepo.findById(id);

    if (!existing) {
      throw new NotFoundException("Region not found");
    }

    await this.regionRepo.softDelete(id);
  }
}

@Injectable()
export class LookupRegionsUseCase {
  constructor(
    @Inject(GEOGRAPHY_TOKENS.REGION_REPOSITORY)
    private readonly regionRepo: IRegionRepository,
  ) {}

  async execute() {
    return this.regionRepo.lookup();
  }
}
```

- Create index.ts on

```
application/geography/dto/index.ts and add:
```

```typescript
export * from "./geography.dto";
```

### Create index.ts on

```
backend/src/application/geography/use-cases/index.ts   Then add:

```

```typescript
export * from "./region.usecases";
```

### Update Region Module

We will create src/presentation/geography/providers/geography.providers.ts later we will update this region module during creating zone , kebele and woreda.

```
backend/src/presentation/geography/geography.module.ts

```

```typescript

import { Module } from "@nestjs/common";

import {
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
} from "../../application/geography/use-cases";

import { PrismaService } from "../../infrastructure/database/prisma/prisma.service";

import { PrismaRegionRepository } from "../../infrastructure/geography/database/repositories/region.repository.impl";

import { RegionController } from "./controllers/region.controller";

import { GEOGRAPHY_TOKENS } from "../../shared/constants";

@Module({
  controllers: [RegionController],

  providers: [
    PrismaService,

    {
      provide: GEOGRAPHY_TOKENS.REGION_REPOSITORY,
      useClass: PrismaRegionRepository,
    },

    GetRegionsUseCase,
    GetRegionUseCase,
    CreateRegionUseCase,
    UpdateRegionUseCase,
    DeleteRegionUseCase,
    LookupRegionsUseCase,
  ],

  exports: [
    GetRegionsUseCase,
    GetRegionUseCase,
    CreateRegionUseCase,
    UpdateRegionUseCase,
    DeleteRegionUseCase,
    LookupRegionsUseCase,
  ],
})
export class GeographyModule {}
```

### update region controller also

```
backend/src/presentation/geography/controllers/region.controller.ts
```

```typescript

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from "@nestjs/common";

import {
  GeographyQuerySchema,
  CreateRegionSchema,
  UpdateRegionSchema,
} from "../../../application/geography/dto";

import type {
  GeographyQueryDto,
  CreateRegionDto,
  UpdateRegionDto,
} from "../../../application/geography/dto";

import {
  GetRegionsUseCase,
  GetRegionUseCase,
  CreateRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  LookupRegionsUseCase,
} from "../../../application/geography/use-cases";

import { ZodValidationPipe } from "../../../shared/pipes/zod-validation.pipe";

@Controller("regions")
export class RegionController {
  constructor(
    private readonly getRegions: GetRegionsUseCase,
    private readonly getRegion: GetRegionUseCase,
    private readonly createRegion: CreateRegionUseCase,
    private readonly updateRegion: UpdateRegionUseCase,
    private readonly deleteRegion: DeleteRegionUseCase,
    private readonly lookupRegions: LookupRegionsUseCase,
  ) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(GeographyQuerySchema))
    query: GeographyQueryDto,
  ) {
    return this.getRegions.execute(query);
  }

  @Get("lookup")
  lookup() {
    return this.lookupRegions.execute();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.getRegion.execute(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateRegionSchema))
    dto: CreateRegionDto,
  ) {
    return this.createRegion.execute(dto);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateRegionSchema))
    dto: UpdateRegionDto,
  ) {
    return this.updateRegion.execute(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.deleteRegion.execute(id);
  }
}
```

### Test the Complete Region API End-to-End

- Test the below six operations

Client -> Controller -> Use Case -> IRegionRepository -> PrismaRegionRepository -> Prisma -> PostgreSQL

#### Start PostgreSQL

From the project root:

docker compose up -d

docker ps

docker exec -it n2p-learning psql -U postgres -d n2p_db

#### Start the NestJS backend

npm run start

Test :
http://localhost:4000/api/docs , Then must saw that all six operations appear.

Try it out on GET /api/v1/regions

Expected out put

```bash

{
  "items": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNext": false,
    "hasPrevious": false
  }
}

```

#### To Test The port

- Add ApiBody on backend/src/presentation/geography/controllers/region.controller.ts and add below sample data before create function

```bash
@Post()
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Addis Ababa',
      },
      code: {
        type: 'string',
        example: 'AA',
      },
      isActive: {
        type: 'boolean',
        example: true,
      },
    },
    required: ['name', 'code'],
  },
})
create(

```

Test POST /api/v1/regions

Expected result will be

```bash


Response body
Download
{
  "id": "f84bac13-f777-4527-a83d-3a2661929933",
  "name": "Addis Ababa",
  "code": "AA",
  "isActive": true,
  "createdAt": "2026-09-02T21:26:32.357Z",
  "updatedAt": "2026-09-02T21:26:32.357Z"
}

```

### Verify the database

docker exec -it easycode psql -U postgres -d easy_db

then run below sql:

SELECT id, name, code, "isActive", "deletedAt" FROM "Region";

### Test Pagination

Add 2 or more Region , Then test:

```
GET /api/v1/regions?page=1&limit=2
```

### Test Search

```

GET /api/v1/regions?search=Addis

```

### Test isActive Filter

```
GET /api/v1/regions?isActive=true

```

### Due to isActive not working successfully update

```
backend/src/application/geography/dto/geography.dto.ts

```

```bash

export const GeographyQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
  regionId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  woredaId: z.string().uuid().optional(),
});

```

With

```bash

export const GeographyQuerySchema = PaginationQuerySchema.extend({
  isActive: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),

  regionId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  woredaId: z.string().uuid().optional(),
});


```

### Test isActive Filter again

```
GET /api/v1/regions?isActive=true
```

### Test GET by ID

```
GET /api/v1/regions/8f3c0e4b-....
```

### Test Invalid UUID

```
GET /api/v1/regions/123 and must display Region not found with HTTP 404
```

### Test Update

#### First Update:

```
backend/src/presentation/geography/controllers/region.controller.ts
```

```bash
import { ApiBody } from '@nestjs/swagger';

@Put(':id')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Amhara Region',
      },
      code: {
        type: 'string',
        example: 'AM',
      },
      isActive: {
        type: 'boolean',
        example: true,
      },
    },
  },
})
update(
  @Param('id') id: string,
  @Body(
    new ZodValidationPipe(UpdateRegionSchema),
  )
  dto: UpdateRegionDto,
) {
  return this.updateRegion.execute(id, dto);
}
```

Then Test by updating on swagger PUT method

### Test Adding duplicate code

Then it displays 500 error.

- Fix it by updating

```
backend/src/application/geography/use-cases/region.usecases.ts
```

- Change the import

From:

```bash

import { Injectable, Inject, NotFoundException } from '@nestjs/common';
```

- to:

```bash
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

```

```bash
if (existing) {
  throw new Error('Region code already exists');
}
```

Changed to

```bash
Change to:

if (existing) {
  throw new ConflictException('Region code already exists');
}
```

- Test is to recreate again.

### Test Validation

Try creating a Region with an empty name: Just update on region.controller.ts

```bash
{
  "name": "",
  "code": "TEST",
  "isActive": true
}
```

Then, Test on Swagger

### Test Missing Code

```bash
{
  "name": "",
  "isActive": true
}
```

### Test Lookup

```
GET /api/v1/regions/lookup
```

### Test Soft Delete

### Test DELETE

- First update

```
backend/src/presentation/geography/controllers/region.controller.ts
```

```bash
import { ApiBody, ApiParam } from '@nestjs/swagger';
@Delete(':id')
@ApiParam({
  name: 'id',
  type: 'string',
  format: 'uuid',
  example: '221a2244-1d7c-484d-b0c3-67fe7160d19d',
  description: 'Region UUID',
})
remove(@Param('id') id: string) {
  return this.deleteRegion.execute(id);
}
```

#### We can Create folder structure based on the below code instead of creating manually step by step, run it on backend folder.

```bash
$folders = @(
"src/domain",
"src/application",
"src/infrastructure",
"src/presentation",
"src/shared/constants",
"src/shared/dto",
"src/shared/enums",
"src/shared/filters",
"src/shared/interceptors",
"src/shared/interfaces",
"src/shared/pipes",
"src/shared/utils"
"src/domain/users/entities",
"src/domain/users/repositories",
"src/domain/users/services",
"src/application/users/dto",
"src/application/users/use-cases",
"src/infrastructure/users/database/entities",
"src/infrastructure/users/database/repositories",
"src/presentation/users/controllers",
"src/presentation/users/providers"
)

foreach ($folder in $folders) {
New-Item -ItemType Directory -Force $folder | Out-Null
}
```

### Final Architecture Check

```
Client
  ↓
Controller
  ↓
Use Case
  ↓
IRegionRepository
  ↓
PrismaRegionRepository
  ↓
Prisma
  ↓
PostgreSQL
```

---

## Initialize Frontend - Next.js

### Create the Next.js project

```
npx create-next-app@latest frontend
```

### Then Test it

```
npm run dev
```

### Install the frontend dependencies

#### Remove the current dependencies and install based on below package.json file

##### First remove the current installation:

```

Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

```

```typescript
{
  "name": "fms-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3016",
    "build": "next build",
    "start": "next start --port 3016",
    "lint": "eslint"
  },
  "dependencies": {
    "@base-ui/react": "^1.3.0",
    "@tanstack/react-query": "^5.95.2",
    "axios": "^1.13.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "formik": "^2.4.9",
    "lucide-react": "^1.7.0",
    "next": "16.2.1",
    "next-auth": "^5.0.0-beta.30",
    "next-intl": "^4.8.3",
    "next-themes": "^0.4.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "recharts": "^3.8.1",
    "shadcn": "^4.1.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.3.6",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

##### Run and Test

npm run dev

## Create the FMS-style Region frontend structure

- Create these folders:

```
New-Item -ItemType Directory -Force `
src/domain/geography/entities, `
src/infrastructure/geography/api, `
src/presentation/components/geography/region, `
src/presentation/hooks/geography, `
src/shared/types
```

### each part will contain

```
domain/
    Region types/models

infrastructure/
    API communication with NestJS

presentation/
    Region UI components + hooks

app/
    Actual Next.js routes/pages

shared/
    Reusable frontend types/utilities

lib/
    Frontend infrastructure/configuration
```

## Create the Region domain entity/type

- Create:

```
frontend/src/domain/geography/entities/index.ts and Add:

```
 
```bash
export interface RegionResponse {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegionRequest {
  name: string;
  code: string;
  isActive?: boolean;
}

export interface UpdateRegionRequest {
  name?: string;
  code?: string;
  isActive?: boolean;
}
```

### Geography domain index

- Create:

```
frontend/src/domain/geography/index.ts   Then add
```

```bash
export * from "./entities";
```

### Why are dates string?

The backend sends JSON:

```bash
{
  "createdAt": "2026-09-02T21:32:06.972Z",
  "updatedAt": "2026-09-02T21:32:06.972Z"
}
```

## Create the Region API response/query types

### Add pagination types

- Create:

```
frontend/src/domain/shared/entities/index.ts
```

```bash

o// ── API Response Wrappers ─────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}


```

#### frontend/src/domain/shared/index.ts

```bash
export * from "./entities";
```

### Run and check

npm run dev

## Create Axios API client

### Create the shared Axios client

- create:

```
frontend/src/infrastructure/api/api-client.ts
```

```bash
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export default api;
```

- create:

```
frontend/src/infrastructure/api/index.ts
```

```bash
export { default as api } from "./api-client";
```

### update ON tconfig.json

```bash
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

```

### Create the Geography API

```
frontend/src/infrastructure/geography/api/geography.api.ts
```

```bash
import api from "../../api/api-client";

import type {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
} from "@/domain/shared/entities";

import type {
  RegionResponse,
  CreateRegionRequest,
  UpdateRegionRequest,
} from "@/domain/geography/entities";
export const regionsApi = {
  // Boredem********
  getAll: async (
  params?: PaginationQuery & {
    isActive?: boolean;
  },

): Promise<PaginatedResponse<RegionResponse>> => {
  const { data } = await api.get<PaginatedResponse<RegionResponse>>(
    "/regions",
    {
      params,
    },
  );

  return data;
},

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<RegionResponse>>(
      `/regions/${id}`,
    );

    return data;
  },

  create: async (payload: CreateRegionRequest) => {
    const { data } = await api.post<ApiResponse<RegionResponse>>(
      "/regions",
      payload,
    );

    return data;
  },

  update: async (id: string, payload: UpdateRegionRequest) => {
    const { data } = await api.put<ApiResponse<RegionResponse>>(
      `/regions/${id}`,
      payload,
    );

    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/regions/${id}`);

    return data;
  },

  lookup: async () => {
    const { data } =
      await api.get<ApiResponse<RegionResponse[]>>("/regions/lookup");

    return data.data ?? [];
  },
};

```

### Add the API URL

- Create: frontend/.env.local
  NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

- Restart Next.js after creating .env.local:

  npm run dev

## Create the Region React Query hooks

- It used to: Component -> React Query Hook -> regionsApi -> Axios -> NestJS backend

### Create the hooks file

- Create:

```
frontend/src/presentation/hooks/geography/region.hooks.ts
```

```bash

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { regionsApi } from "@/infrastructure/geography/api/geography.api";

import type {
  CreateRegionRequest,
  UpdateRegionRequest,
} from "@/domain/geography/entities";

import type { PaginationQuery } from "@/domain/shared/entities";

const REGION_QUERY_KEY = ["regions"];

type RegionQuery = PaginationQuery & {
  isActive?: boolean;
};

export function useRegions(params?: RegionQuery) {
  return useQuery({
    queryKey: [...REGION_QUERY_KEY, params],
    queryFn: () => regionsApi.getAll(params),
  });
}

export function useRegion(id: string) {
  return useQuery({
    queryKey: [...REGION_QUERY_KEY, id],
    queryFn: () => regionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRegionRequest) => regionsApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REGION_QUERY_KEY,
      });
    },
  });
}

export function useUpdateRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRegionRequest;
    }) => regionsApi.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REGION_QUERY_KEY,
      });
    },
  });
}

export function useDeleteRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => regionsApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REGION_QUERY_KEY,
      });
    },
  });
}

export function useRegionLookup() {
  return useQuery({
    queryKey: [...REGION_QUERY_KEY, "lookup"],
    queryFn: () => regionsApi.lookup(),
  });
}


```

### Build

npm run build

## React Query Provider

### Create the provider

- Create:

```
frontend/src/presentation/components/providers.tsx
```

- This may be the final one

```bash

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### move app to src and Add it(provider) to the root layout

```
frontend/src/app/layout.tsx
```

- Import

```bash
import { Providers } from '@/presentation/providers';
```

Then, wrap the application

```bash
<body>
  <Providers>{children}</Providers>
</body>

```

### Build

npm run build

## Create the Region page and display Regions

- Lets create simple region page before creating reusable presentation components which are crud-page.tsx, data-pagination.tsx, loading.tsx, and search-input.tsx.

### Create the Region page

- Create

```
frontend/src/app/geography/regions/page.tsx
```

```bash

'use client';

import { useRegions } from '@/presentation/hooks/geography/region.hooks';

export default function RegionsPage() {
  const { data, isLoading, isError } = useRegions({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  if (isLoading) {
    return <div className="p-6">Loading regions...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load regions.
      </div>
    );
  }

  const regions = data?.items ?? [];

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Regions</h1>

      {regions.length === 0 ? (
        <p>No regions found.</p>
      ) : (
        <div className="space-y-3">
          {regions.map((region) => (
            <div
              key={region.id}
              className="rounded-lg border p-4"
            >
              <h2 className="font-semibold">{region.name}</h2>

              <p className="text-sm text-gray-500">
                Code: {region.code}
              </p>

              <p className="text-sm">
                Status:{' '}
                {region.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

```

### Add enableCors() on backend/src/main.ts before listen the app

```bash
app.enableCors({
  origin: 'http://localhost:3016',
  credentials: true,
});
```

### Run both applications

- Backend

  npm run start:dev

- Frontend

  npm run dev

## Make the region page with reusable CRUD architecture, which reusable components

### Create Reusable CRUD page

- Create:

```
frontend/src/presentation/components/shared/crud-page.tsx
```

```bash
'use client';

import { ReactNode } from 'react';

interface CrudPageProps {
  title: string;
  children: ReactNode;
}

export function CrudPage({
  title,
  children,
}: CrudPageProps) {
  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {children}
    </main>
  );
}

```

### Update the Region page using created CrudPage

- Replace

```
src/app/geography/regions/page.tsx
```

```bash
'use client';

import { CrudPage } from '@/presentation/components/shared/crud-page';
import { useRegions } from '@/presentation/hooks/geography/region.hooks';

export default function RegionsPage() {
  const { data, isLoading, isError } = useRegions({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const regions = data?.items ?? [];

  return (
    <CrudPage title="Regions">
      {isLoading && <p>Loading regions...</p>}

      {isError && (
        <p className="text-red-500">
          Failed to load regions.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Code</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {regions.map((region) => (
                <tr key={region.id} className="border-b">
                  <td className="p-4">{region.name}</td>
                  <td className="p-4">{region.code}</td>
                  <td className="p-4">
                    {region.isActive ? 'Active' : 'Inactive'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CrudPage>
  );
}
```

## shadcn/ui components

### Install Button

```
npx shadcn@latest add button
npx shadcn@latest add badge
................. we can also create others
```

Then it creates src/components/Button.tsx with src/lib/utils.ts, Then we put that utils.ts on

```
src/shared/utils/cn.ts and create src/shared/utils/index.ts
```

- Create

```
src/shared/utils/index.ts

```

```bash
export { cn } from "./cn";


```

And move src/components/Button.tsx to src/presentation/components/ui/Button.tsx. It will be reusable component for ui components.

## Create the reusable DataPagination component

That pagination component will be used by CrudPage.

### Create the file

```
frontend/src/presentation/components/shared/data-pagination.tsx
```

```bash

'use client';

import { Button } from '@/presentation/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import type { PaginationMeta } from '@/domain/shared/entities';

interface DataPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function DataPagination({
  meta,
  onPageChange,
  onLimitChange,
}: DataPaginationProps) {
  const {
    page,
    totalPages,
    total,
    limit,
    hasNext,
    hasPrevious,
  } = meta;

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {total} total record{total !== 1 ? 's' : ''}
        </span>

        {onLimitChange && (
          <>
            <span>·</span>

            <Select
              value={String(limit)}
              onValueChange={(value) =>
                onLimitChange(Number(value))
              }
            >
              <SelectTrigger className="h-7 w-[70px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem
                    key={size}
                    value={String(size)}
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span>per page</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-2 text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevious}
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
        >
          <ChevronRight className="h-3.5 w-3.5" />

        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

```

### Add PaginationMeta

Our shared entities currently need the metadata type.

- Update

```
src/domain/shared/entities/index.ts
```

It is already added before, Then On that file PaginatedResponse can use it(PaginationMeta)

```bash
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}


```

- Create

```
src/presentation/components/shared/index.ts Then add
```

```bash
export * from './data-pagination';
export * from './crud-page';
```

### data flow will eventually be:

```
CrudPage
   ↓
page / limit / search
   ↓
useQuery
   ↓
regionsApi
   ↓
Backend pagination
   ↓
PaginationMeta
   ↓
DataPagination
```

## Create the reusable SearchInput

- Create

```
frontend/src/presentation/components/shared/search-input.tsx
```

```bash

"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/presentation/components/ui/input";
import { Button } from "@/presentation/components/ui/button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (internal !== value) {
        onChange(internal);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internal, value, debounceMs, onChange]);

  return (
    <div className={`relative ${className || ""}`}>
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        className="h-8 pl-8 pr-8 text-sm"
      />

       {internal && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-8 w-8"
          onClick={() => {
            setInternal("");
            onChange("");
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
```

### Export it

- Update:

```
src/presentation/components/shared/index.ts    Add
```

```BASH
export * from './search-input';
```

## PageLoader + EmptyState

- Create loading.tsx

```

frontend/src/presentation/components/shared/loading.tsx

```

```bash
'use client';

import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
    </div>
  );
}

export function InlineLoader({
  text = 'Loading...',
}: {
  text?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span>{text}</span>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center">
      {Icon && (
        <Icon className="h-12 w-12 text-muted-foreground/30" />
      )}

      <div>
        <h3 className="text-sm font-medium text-foreground">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

```

### Update index.ts and add

```bash
export * from './loading';
```

## ConfirmDialog

Create the reusable confirmation dialog that the FMS CrudPage uses before deleting a Region.

- Create

```
src/presentation/components/shared/confirm-dialog.tsx

```

```bash
'use client';

import { Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;

  confirmLabel?: string;
  cancelLabel?: string;

  variant?: 'default' | 'destructive';

  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            variant={variant}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### If not exist Install AlertDialog

```
npx shadcn@latest add alert-dialog
```

### Add it on shared index.ts

```bash
export * from './confirm-dialog';
```

## Update crud-page.tsx

```
src/presentation/components/shared/crud-page.tsx
```

```bash

"use client";

import { useMemo, useState, type ReactNode } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  DataPagination,
  SearchInput,
  ConfirmDialog,
  PageLoader,
  EmptyState,
} from "@/presentation/components/shared";

import { Button } from "@/presentation/components/ui/button";

import { Badge } from "@/presentation/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import type { PaginationMeta, PaginationQuery } from "@/domain/shared/entities";

export interface ColumnDef<T> {
  key: string;
  label: string;
  className?: string;
  render: (item: T) => ReactNode;
}

export interface StatDef {
  label: string;
  value: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
  iconBg: string;
  iconColor: string;
}

interface CrudPageConfig<
  T extends {
    id: string;
    isActive: boolean;
    name: string;
  },
> {
  title: string;
  description: string;
  entityName: string;
  queryKey: string;

  icon: React.ComponentType<{
    className?: string;
  }>;

  api: {
    getAll: (params?: PaginationQuery) => Promise<{
      items: T[];
      meta: PaginationMeta;
    }>;
    delete: (id: string) => Promise<unknown>;
  };

  columns: ColumnDef<T>[];

  getStats: (items: T[], total: number) => StatDef[];

  extraParams?: Record<string, unknown>;

  renderFormDialog: (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editItem: T | null;
    onSuccess: () => void;
  }) => ReactNode;
}

export function CrudPage<
  T extends {
    id: string;
    isActive: boolean;
    name: string;
  },
>({
  title,
  description,
  entityName,
  queryKey,
  icon: Icon,
  api,
  columns,
  getStats,
  extraParams,
  renderFormDialog,
}: CrudPageConfig<T>) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);

  const [editItem, setEditItem] = useState<T | null>(null);

  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  // --------------------------------------------------
  // Get data
  // --------------------------------------------------

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, page, limit, search, extraParams],

    queryFn: () =>
      api.getAll({
        page,
        limit,
        search,
        ...extraParams,
      }),
  });

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const stats = useMemo(() => {
    if (!data?.items) {
      return [];
    }

    return getStats(data.items, data.meta?.total ?? data.items.length);
  }, [data, getStats]);

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });

      setDeleteItem(null);
    },
  });

  // --------------------------------------------------
  // Create
  // --------------------------------------------------

  const handleCreate = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (item: T) => {
    setEditItem(item);
    setFormOpen(true);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Statistics */}

      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-lg border bg-card p-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>

              <div>
                <p className="text-2xl font-bold">{stat.value}</p>

                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Command bar */}

      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleCreate} className="h-8 gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New {entityName}
        </Button>

        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder={`Search ${entityName}s...`}
          className="w-72"
        />

        <span className="ml-auto text-xs text-muted-foreground">
          Showing {data?.items?.length ?? 0} of {data?.meta?.total ?? 0} records
        </span>
      </div>

      {/* Content */}

      {isLoading ? (
        <PageLoader />
      ) : !data?.items?.length ? (
        <EmptyState
          icon={Icon}
          title={`No ${entityName}s found`}
          description={
            search
              ? "Try a different search term"
              : `Get started by adding your first ${entityName}`
          }
          action={
            <Button size="sm" onClick={handleCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              New {entityName}
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-md border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={`h-10 text-xs font-medium text-muted-foreground ${
                        column.className ?? ""
                      }`}
                    >
                      {column.label}
                    </TableHead>
                  ))}

                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/50">
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render(item)}
                      </TableCell>
                    ))}

                    {/* Actions */}

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            />
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => setDeleteItem(item)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}

          {data.meta && (
            <DataPagination
              meta={data.meta}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          )}
        </div>
      )}

      {/* Create / Edit form */}

      {renderFormDialog({
        open: formOpen,
        onOpenChange: setFormOpen,
        editItem,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [queryKey],
          });

          setFormOpen(false);
        },
      })}

      {/* Delete confirmation */}

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteItem(null);
          }
        }}
        title={`Delete ${entityName}`}
        description={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteItem) {
            deleteMutation.mutate(deleteItem.id);
          }
        }}
      />
    </div>
  );
}

// --------------------------------------------------
// Active / Inactive badge
// --------------------------------------------------

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="text-[11px]">
      Inactive
    </Badge>
  );
}


```

## Update geography/regions/page.tsx

```bash
"use client";

import { MapPinned } from "lucide-react";

import {
  CrudPage,
  StatusBadge,
} from "@/presentation/components/shared";

import { regionsApi } from "@/infrastructure/geography/api/geography.api";

import type { RegionResponse } from "@/domain/geography/entities";

export default function RegionsPage() {
  return (
    <CrudPage<RegionResponse>
      title="Regions"
      description="Manage administrative regions."
      entityName="Region"
      queryKey="regions"
      icon={MapPinned}
      api={regionsApi}
      columns={[
        {
          key: "name",
          label: "Name",
          render: (region) => (
            <span className="font-medium">
              {region.name}
            </span>
          ),
        },
        {
          key: "code",
          label: "Code",
          render: (region) => (
            <span>{region.code}</span>
          ),
        },
        {
          key: "status",
          label: "Status",
          render: (region) => (
            <StatusBadge
              isActive={region.isActive}
            />
          ),
        },
      ]}
      getStats={(items, total) => [
        {
          label: "Total Regions",
          value: total,
          icon: MapPinned,
          iconBg: "bg-primary/10",
          iconColor: "text-primary",
        },
        {
          label: "Active",
          value: items.filter(
            (region) => region.isActive,
          ).length,
          icon: MapPinned,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
        },
      ]}
      renderFormDialog={() => null}
    />
  );
}
```

## MasterDataFormDialog

In not exist install label: npx shadcn@latest add label

### Create master-data-form-dialog.tsx

Create

```

src/presentation/components/shared/master-data-form-dialog.tsx

```

```bash
"use client";

import { useState, useEffect, type ReactNode } from "react";

import { useMutation } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type FormValue = string | boolean;

type FormFields = Record<string, FormValue>;

interface MasterDataFormDialogProps<T extends { id: string }> {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  editItem: T | null;
  onSuccess: () => void;
  entityName: string;

  api: {
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
  };

  getDefaults: (item: T | null) => FormFields;

  renderExtraFields?: (
    fields: FormFields,
    setField: (key: string, value: FormValue) => void,
    isLoading: boolean,
  ) => ReactNode;

  showDescription?: boolean;
}

export function MasterDataFormDialog<
  T extends {
    id: string;
    name: string;
    code: string;
  },
>

({
  open,
  onOpenChange,
  editItem,
  onSuccess,
  entityName,
  api,
  getDefaults,
  renderExtraFields,
  showDescription = true,
}: MasterDataFormDialogProps<T>) {
  const isEdit = !!editItem;

  const [fields, setFields] = useState<FormFields>({});

  const setField = (key: string, value: FormValue) => {
    setFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (open) {
      setFields(getDefaults(editItem));
    }
  }, [open, editItem, getDefaults]);

  const createMutation = useMutation({
    mutationFn: (data: FormFields) => api.create(data),

    onSuccess: () => {
      toast.success(`${entityName} created successfully`);

      onSuccess();
    },

    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : `Failed to create ${entityName}`;

      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormFields) => api.update(editItem!.id, data),

    onSuccess: () => {
      toast.success(`${entityName} updated successfully`);

      onSuccess();
    },

    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : `Failed to update ${entityName}`;

      toast.error(message);
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: FormFields = {
      ...fields,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") {
        delete payload[key];
      }
    });

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${entityName}` : `Create ${entityName}`}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? `Update the ${entityName.toLowerCase()} details.`
              : `Add a new ${entityName.toLowerCase()} to the system.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="md-name">Name</Label>

              <Input
                id="md-name"
                value={(fields.name as string) ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-code">Code</Label>

              <Input
                id="md-code"
                value={(fields.code as string) ?? ""}
                onChange={(e) => setField("code", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {showDescription && (
            <div className="space-y-2">
              <Label htmlFor="md-desc">Description</Label>

              <Input
                id="md-desc"
                value={(fields.description as string) ?? ""}
                onChange={(e) => setField("description", e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {renderExtraFields?.(fields, setField, isLoading)}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

              {isEdit ? "Save Changes" : `Create ${entityName}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


```

- Update:

```
src/presentation/components/shared/index.ts

```

```bash

export * from './master-data-form-dialog';

```

### Update

```
src/app/geography/regions/page.tsx
```

```bash
"use client";

import { useCallback } from "react";

import { regionsApi } from "@/infrastructure/geography/api/geography.api";

import {
  CrudPage,
  StatusBadge,
  MasterDataFormDialog,
} from "@/presentation/components/shared";

import type {
  ColumnDef,
  StatDef,
} from "@/presentation/components/shared";

import type {
  RegionResponse,
} from "@/domain/geography/entities";

import {
  Map,
  Check,
  X,
  Database,
} from "lucide-react";

const columns: ColumnDef<RegionResponse>[] = [
  {
    key: "name",
    label: "Name",
    className: "w-[250px]",
    render: (region) => (
      <span className="text-[13px] font-medium text-foreground">
        {region.name}
      </span>
    ),
  },
  {
    key: "code",
    label: "Code",
    render: (region) => (
      <span className="text-[13px] text-muted-foreground">
        {region.code}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (region) => (
      <StatusBadge isActive={region.isActive} />
    ),
  },
];

function getStats(
  items: RegionResponse[],
  total: number,
): StatDef[] {
  return [
    {
      label: "Total Regions",
      value: total,
      icon: Database,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Active",
      value: items.filter(
        (region) => region.isActive,
      ).length,
      icon: Check,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Inactive",
      value: items.filter(
        (region) => !region.isActive,
      ).length,
      icon: X,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];
}

export default function RegionsPage() {
  const getDefaults = useCallback(
    (item: RegionResponse | null) => ({
      name: item?.name ?? "",
      code: item?.code ?? "",
      isActive: item?.isActive ?? true,
    }),
    [],
  );

  return (
    <CrudPage<RegionResponse>
      title="Regions"
      description="Manage Ethiopian administrative regions"
      entityName="Region"
      queryKey="regions"
      icon={Map}
      api={regionsApi}
      columns={columns}
      getStats={getStats}
      renderFormDialog={({
        open,
        onOpenChange,
        editItem,
        onSuccess,
      }) => (
        <MasterDataFormDialog<RegionResponse>
          open={open}
          onOpenChange={onOpenChange}
          editItem={editItem}
          onSuccess={onSuccess}
          entityName="Region"
          api={regionsApi}
          getDefaults={getDefaults}
          showDescription={false}
        />
      )}
    />
  );
}

```

### Update Css and tailwind also for better look

## Smart Toast/ sooner & UI Feedback

If not exist install it

```
npm install sonner
```

### Add Toaster to providers.tsx

```
src/presentation/components/providers.tsx

```

```bash
"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </QueryClientProvider>
  );
}


```

### Make MasterDataFormDialog smarter

Make it to automatically close after success, just add only : onOpenChange(false);

```bash
onSuccess: () => {
  toast.success(`${entityName} created successfully`);

  onSuccess();
  onOpenChange(false);
},

```

The same on update also

```bash
 onSuccess: () => {
      toast.success(`${entityName} updated successfully`);

      onSuccess();
      onOpenChange(false);
    },

```

### Better backend error extraction

- Create:

```
src/lib/api-error.ts

```

```bash
import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}


```

Then import on MasterDataFormDialog:

```bash
import { getApiErrorMessage } from "@/lib/api-error";

```

- Then update on Create Error

```bash
onError: (error: unknown) => {
  toast.error(
    getApiErrorMessage(
      error,
      `Failed to create ${entityName}`,
    ),
  );
},
```

- Update

```bash

onError: (error: unknown) => {
  toast.error(
    getApiErrorMessage(
      error,
      `Failed to update ${entityName}`,
    ),
  );
},

```

### Smart loading behavior

### Smart delete confirmation

Update

```bash
toast.error(
  getApiErrorMessage(
    error,
    `Failed to delete ${entityName}`,
  ),
);

```

- Update on layout.tsx by deleting @/presentation/providers.tsx

```bash

import { Providers } from "@/presentation/components/providers";

```

### Test and move to RBAC

## RBAC

### On backend side

### Replace your current User and add the RBAC models

```
backend/prisma/schema.prisma
```

```bash
model User {
  id           String  @id @default(uuid()) @db.Uuid
  email        String  @unique @db.VarChar(255)
  username     String  @unique @db.VarChar(100)
  mobileNumber String? @unique @map("mobile_number") @db.VarChar(20)
  password     String  @db.VarChar(255)

  firstName String @map("first_name") @db.VarChar(100)
  lastName  String @map("last_name") @db.VarChar(100)

  phone  String? @db.VarChar(20)
  avatar String? @db.VarChar(500)

  isActive Boolean @default(true) @map("is_active")
  isLocked Boolean @default(false) @map("is_locked")

  lastLoginAt         DateTime? @map("last_login_at")
  failedLoginAttempts Int       @default(0) @map("failed_login_attempts")
  passwordChangedAt   DateTime? @map("password_changed_at")

  // Geography assignment
  regionId String? @map("region_id") @db.Uuid

  // Audit
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")
  createdBy String?   @map("created_by") @db.Uuid
  updatedBy String?   @map("updated_by") @db.Uuid

  // Relations
  userRoles UserRole[]
  region    Region?    @relation(fields: [regionId], references: [id])

  @@index([email])
  @@index([username])
  @@index([mobileNumber])
  @@index([deletedAt])
  @@index([regionId])
  @@map("users")
}

model Role {
  id          String  @id @default(uuid()) @db.Uuid
  name        String  @unique @db.VarChar(100)
  displayName String  @map("display_name") @db.VarChar(150)
  description String? @db.VarChar(500)

  isSystem Boolean @default(false) @map("is_system")
  isActive Boolean @default(true) @map("is_active")

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  createdBy String? @map("created_by") @db.Uuid
  updatedBy String? @map("updated_by") @db.Uuid

  userRoles       UserRole[]
  rolePermissions RolePermission[]

  @@index([name])
  @@index([deletedAt])
  @@map("roles")
}

model Permission {
  id          String  @id @default(uuid()) @db.Uuid
  name        String  @unique @db.VarChar(150)
  displayName String  @map("display_name") @db.VarChar(200)
  description String? @db.VarChar(500)

  module String @db.VarChar(100)
  action String @db.VarChar(50)

  isActive Boolean @default(true) @map("is_active")

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  createdBy String? @map("created_by") @db.Uuid
  updatedBy String? @map("updated_by") @db.Uuid

  rolePermissions RolePermission[]

  @@unique([module, action])
  @@index([module])
  @@index([deletedAt])
  @@map("permissions")
}

model UserRole {
  id     String @id @default(uuid()) @db.Uuid
  userId String @map("user_id") @db.Uuid
  roleId String @map("role_id") @db.Uuid

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  createdBy String? @map("created_by") @db.Uuid
  updatedBy String? @map("updated_by") @db.Uuid

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
  @@index([userId])
  @@index([roleId])
  @@index([deletedAt])
  @@map("user_roles")
}

model RolePermission {
  id           String @id @default(uuid()) @db.Uuid
  roleId       String @map("role_id") @db.Uuid
  permissionId String @map("permission_id") @db.Uuid

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  createdBy String? @map("created_by") @db.Uuid
  updatedBy String? @map("updated_by") @db.Uuid

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@index([roleId])
  @@index([permissionId])
  @@index([deletedAt])
  @@map("role_permissions")
}

```

### Create the RBAC migration

```
npx prisma validate
npx prisma generate
```

Check the table user have important data's

```
npx prisma migrate dev --name add_rbac
npx prisma migrate status
npx prisma generate

```

## RBAC Domain Layer

```
src/
└── domain/
    └── rbac/
        ├── entities/
        │   └── index.ts
        │   └── user.entity.ts
        ├── repositories/
        └── use-cases/
```

```

src/domain/rbac/entities/user.entity.ts

```

```bash
export interface UserEntity {
  id: string;

  email: string;
  username: string;

  mobileNumber: string | null;

  /**
   * Password hash.
   *
   * Domain entity contains the hash because the backend
   * needs it for authentication, but it must never be
   * exposed through API response models.
   */
  password: string;

  firstName: string;
  lastName: string;

  phone: string | null;
  avatar: string | null;

  isActive: boolean;
  isLocked: boolean;

  lastLoginAt: Date | null;
  failedLoginAttempts: number;
  passwordChangedAt: Date | null;

  /**
   * Geographic scope assigned to the user.
   *
   * Currently only Region is part of this project.
   */
  regionId: string | null;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  createdBy: string | null;
  updatedBy: string | null;
}

```

### User Response Model

Create a separate response model in order not to return UserEntity directly from controllers. because password: string must never accidentally reach the API. There fore add another response model on same file(user.entity.ts)

Just for clean security boundary

```bash
export interface UserEntity {
  id: string;

  email: string;
  username: string;
  mobileNumber: string | null;

  password: string;

  firstName: string;
  lastName: string;

  phone: string | null;
  avatar: string | null;

  isActive: boolean;
  isLocked: boolean;

  lastLoginAt: Date | null;
  failedLoginAttempts: number;
  passwordChangedAt: Date | null;

  // Geography assignment
  regionId: string | null;

  // Audit
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  createdBy: string | null;
  updatedBy: string | null;
}

export interface UserRoleInfo {
  id: string;
  name: string;
  displayName: string;
}

export interface UserWithRoles extends UserEntity {
  roles: UserRoleInfo[];
  permissions: string[];
}

export interface UserResponseModel {
  id: string;

  email: string;
  username: string;

  firstName: string;
  lastName: string;

  phone: string | null;
  avatar: string | null;

  isActive: boolean;
  isLocked: boolean;

  lastLoginAt: Date | null;

  roles: UserRoleInfo[];

  createdAt: Date;
  updatedAt: Date;
}
```

### Entity Index

- Create:

```
src/domain/rbac/entities/index.ts
```

```bash
export * from "./user.entity";
```

### Role entity

create the Role entity.

```
src/domain/rbac/entities/role.entity.ts

```

```bash
export interface RoleEntity {
  id: string;

  name: string;
  displayName: string;
  description: string | null;

  isSystem: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  createdBy: string | null;
  updatedBy: string | null;
}

export interface RolePermissionInfo {
  id: string;

  name: string;
  displayName: string;

  module: string;
  action: string;
}

export interface RoleResponseModel {
  id: string;

  name: string;
  displayName: string;
  description: string | null;

  isSystem: boolean;
  isActive: boolean;

  permissions: RolePermissionInfo[];
  userCount: number;

  createdAt: Date;
  updatedAt: Date;
}

```

- Update:

```
src/domain/rbac/entities/index.ts

```

```bash
export * from "./role.entity";

```

### Permission entity

- Create:

```
src/domain/rbac/entities/permission.entity.ts

```

```bash
export interface PermissionEntity {
  id: string;
  name: string;
  displayName: string;
  description: string | null;

  module: string;
  action: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  createdBy: string | null;
  updatedBy: string | null;
}

export interface PermissionResponseModel {
  id: string;
  name: string;
  displayName: string;
  description: string | null;

  module: string;
  action: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type GroupedPermissions = Record<
  string,
  PermissionResponseModel[]
>;

```

- update index

```bash
export * from "./permission.entity";

```

## PrismaService for RBAC

Before creating the repository, let's create a central Prisma service

- Create: It is already created, check it

```

src/infrastructure/database/prisma/prisma.service.ts

```

### Create User, role and permission wrapper

- Create:

```
backend/src/infrastructure/rbac/database/entities/user.orm-entity.ts  And Add

```

```bash
/**
 * Prisma User model type mapping and response mapper.
 * Maps raw Prisma results to domain-friendly response objects.
 */
export class UserMapper {
  static toResponseDto(user: any) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || null,
      mobileNumber: user.mobileNumber || null,
      avatar: user.avatar || null,
      isActive: user.isActive,
      isLocked: user.isLocked,
      lastLoginAt: user.lastLoginAt,
      roles: user.userRoles
        ? user.userRoles
            .filter((ur: any) => !ur.deletedAt && ur.role && !ur.role.deletedAt)
            .map((ur: any) => ({
              id: ur.role.id,
              name: ur.role.name,
              displayName: ur.role.displayName,
            }))
        : [],
      region: user.region
        ? { id: user.region.id, name: user.region.name }
        : null,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseDtoList(users: any[]) {
    return users.map((u) => UserMapper.toResponseDto(u));
  }
}

/** Prisma include clause for user with roles and geography */
export const USER_INCLUDE = {
  userRoles: {
    where: { deletedAt: null },
    include: {
      role: {
        include: {
          rolePermissions: {
            where: { deletedAt: null },
            include: { permission: true },
          },
        },
      },
    },
  },
  region: { select: { id: true, name: true } },

} as const;

```

```
backend/src/infrastructure/rbac/database/entities/role.orm-entity.ts  And Add

```

```bash

/**
 * Prisma Role model type mapping and response mapper.
 */
export class RoleMapper {
  static toResponseDto(role: any) {
    return {
      id: role.id,
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      isSystem: role.isSystem,
      isActive: role.isActive,
      permissions: role.rolePermissions
        ? role.rolePermissions
            .filter(
              (rp: any) =>
                !rp.deletedAt && rp.permission && !rp.permission.deletedAt,
            )
            .map((rp: any) => ({
              id: rp.permission.id,
              name: rp.permission.name,
              displayName: rp.permission.displayName,
              module: rp.permission.module,
              action: rp.permission.action,
            }))
        : [],
      userCount: role._count?.userRoles || 0,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  static toResponseDtoList(roles: any[]) {
    return roles.map((r) => RoleMapper.toResponseDto(r));
  }
}

/** Prisma include clause for role with permissions */
export const ROLE_INCLUDE = {
  rolePermissions: {
    where: { deletedAt: null },
    include: {
      permission: true,
    },
  },
  _count: {
    select: {
      userRoles: { where: { deletedAt: null } },
    },
  },
} as const;

```

```
backend/src/infrastructure/rbac/database/entities/permission.orm-entity.ts  And Add

```

```bash

/**
 * Prisma Permission model type mapping and response mapper.
 */
export class PermissionMapper {
  static toResponseDto(permission: any) {
    return {
      id: permission.id,
      name: permission.name,
      displayName: permission.displayName,
      description: permission.description,
      module: permission.module,
      action: permission.action,
      isActive: permission.isActive,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }

  static toResponseDtoList(permissions: any[]) {
    return permissions.map((p) => PermissionMapper.toResponseDto(p));
  }

  static groupByModule(permissions: any[]) {
    const grouped: Record<string, any[]> = {};
    for (const p of permissions) {
      if (!grouped[p.module]) {
        grouped[p.module] = [];
      }
      grouped[p.module].push(PermissionMapper.toResponseDto(p));
    }
    return grouped;
  }
}

```

- Create Index and add 3 of them

```
backend/src/infrastructure/rbac/database/entities/index.ts  And Add

```

```bash
export * from './permission.orm-entity';
export * from './role.orm-entity';
export * from './user.orm-entity';
```

### Implementation of repository for User, role and Permission

```
  src/infrastructure/rbac/database/repositories/user.repository.impl.ts

```

```bash
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IUserRepository } from '../../../../domain/rbac/repositories/user.repository';
import { USER_INCLUDE } from '../entities';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
    roleId?: string;
  }) {
    const where: any = {
      ...this.prisma.softDeleteFilter(),
    };

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { username: { contains: query.search, mode: 'insensitive' } },
        { mobileNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.roleId) {
      where.userRoles = {
        some: { roleId: query.roleId, deletedAt: null },
      };
    }

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          userRoles: {
            where: { deletedAt: null },
            include: { role: true },
          },
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async findById(id: string) {
    return this.prisma.user.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
      include: USER_INCLUDE,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, ...this.prisma.softDeleteFilter() },
      include: USER_INCLUDE,
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username, ...this.prisma.softDeleteFilter() },
      include: USER_INCLUDE,
    });
  }

  async findByMobileNumber(mobileNumber: string) {
    return this.prisma.user.findFirst({
      where: { mobileNumber, ...this.prisma.softDeleteFilter() },
      include: USER_INCLUDE,
    });
  }

  async create(data: any) {
    const { audit, ...userData } = data;
    return this.prisma.user.create({
      data: {
        ...userData,
        ...(audit ? this.prisma.auditCreate(audit.createdBy) : {}),
      },
      include: USER_INCLUDE,
    });
  }

  async update(id: string, data: any) {
    const { audit, ...userData } = data;
    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(audit ? this.prisma.auditUpdate(audit.updatedBy) : {}),
      },
      include: USER_INCLUDE,
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
      this.prisma.userRole.updateMany({
        where: { userId: id, deletedAt: null },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
    ]);
  }

  async assignRoles(userId: string, roleIds: string[], currentUserId?: string) {
    // Soft-delete existing roles
    await this.prisma.userRole.updateMany({
      where: { userId, deletedAt: null },
      data: {
        ...this.prisma.softDelete(),
        ...this.prisma.auditUpdate(currentUserId),
      },
    });

    // Create new role assignments
    if (roleIds.length > 0) {
      await this.prisma.userRole.createMany({
        data: roleIds.map((roleId) => ({
          userId,
          roleId,
          ...this.prisma.auditCreate(currentUserId),
        })),
      });
    }
  }

  async unlock(id: string, updatedBy?: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isLocked: false,
        failedLoginAttempts: 0,
        ...this.prisma.auditUpdate(updatedBy),
      },
    });
  }
}

```

```
  src/infrastructure/rbac/database/repositories/role.repository.impl.ts

```

```bash
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IRoleRepository } from '../../../../domain/rbac/repositories/role.repository';
import { ROLE_INCLUDE } from '../entities';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
  }) {
    const where: any = {
      ...this.prisma.softDeleteFilter(),
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { displayName: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);

    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        include: ROLE_INCLUDE,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.role.count({ where }),
    ]);

    return { roles, total };
  }

  async findById(id: string) {
    return this.prisma.role.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
      include: ROLE_INCLUDE,
    });
  }

  async findByName(name: string) {
    return this.prisma.role.findFirst({
      where: { name, ...this.prisma.softDeleteFilter() },
    });
  }

  async create(data: any) {
    const { audit, ...roleData } = data;
    return this.prisma.role.create({
      data: {
        ...roleData,
        ...(audit ? this.prisma.auditCreate(audit.createdBy) : {}),
      },
      include: ROLE_INCLUDE,
    });
  }

  async update(id: string, data: any) {
    const { audit, ...roleData } = data;
    return this.prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        ...(audit ? this.prisma.auditUpdate(audit.updatedBy) : {}),
      },
      include: ROLE_INCLUDE,
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.$transaction([
      this.prisma.role.update({
        where: { id },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
      this.prisma.rolePermission.updateMany({
        where: { roleId: id, deletedAt: null },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
      this.prisma.userRole.updateMany({
        where: { roleId: id, deletedAt: null },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
    ]);
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
    currentUserId?: string,
  ) {
    // Soft-delete existing permissions
    await this.prisma.rolePermission.updateMany({
      where: { roleId, deletedAt: null },
      data: {
        ...this.prisma.softDelete(),
        ...this.prisma.auditUpdate(currentUserId),
      },
    });

    // Create new permission assignments
    if (permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
          ...this.prisma.auditCreate(currentUserId),
        })),
      });
    }
  }
}


```

```
  src/infrastructure/rbac/database/repositories/permission.repository.impl.ts

```

```bash
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IPermissionRepository } from '../../../../domain/rbac/repositories/permission.repository';
import { PaginationUtil } from '../../../../shared/utils';

@Injectable()
export class PrismaPermissionRepository implements IPermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    module?: string;
    isActive?: boolean;
  }) {
    const where: any = {
      ...this.prisma.softDeleteFilter(),
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { displayName: { contains: query.search, mode: 'insensitive' } },
        { module: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.module) {
      where.module = query.module;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);

    const [permissions, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip,
        take: query.limit,
      }),
      this.prisma.permission.count({ where }),
    ]);

    return { permissions, total };
  }

  async findAllActive() {
    return this.prisma.permission.findMany({
      where: { ...this.prisma.softDeleteFilter(), isActive: true },
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });
  }

  async findById(id: string) {
    return this.prisma.permission.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
    });
  }

  async findByName(name: string) {
    return this.prisma.permission.findFirst({
      where: { name, ...this.prisma.softDeleteFilter() },
    });
  }

  async findByModuleAction(module: string, action: string) {
    return this.prisma.permission.findFirst({
      where: { module, action, ...this.prisma.softDeleteFilter() },
    });
  }

  async create(data: any) {
    const { audit, ...permData } = data;
    return this.prisma.permission.create({
      data: {
        ...permData,
        ...(audit ? this.prisma.auditCreate(audit.createdBy) : {}),
      },
    });
  }

  async update(id: string, data: any) {
    const { audit, ...permData } = data;
    return this.prisma.permission.update({
      where: { id },
      data: {
        ...permData,
        ...(audit ? this.prisma.auditUpdate(audit.updatedBy) : {}),
      },
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.$transaction([
      this.prisma.permission.update({
        where: { id },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
      this.prisma.rolePermission.updateMany({
        where: { permissionId: id, deletedAt: null },
        data: {
          ...this.prisma.softDelete(),
          ...this.prisma.auditUpdate(userId),
        },
      }),
    ]);
  }

  async getDistinctModules() {
    const result = await this.prisma.permission.findMany({
      where: { ...this.prisma.softDeleteFilter(), isActive: true },
      select: { module: true },
      distinct: ['module'],
      orderBy: { module: 'asc' },
    });
    return result.map((r) => r.module);
  }
}


```

- Create index.ts in the same folder and add

```bash
export {PrismaPermissionRepository} from './permission.repository.impl';
export {PrismaRoleRepository} from './role.repository.impl';
export {PrismaUserRepository} from './user.repository.impl';

```

## RBAC Repository Contracts.

Repository layer is the boundary between Domain and Infrastructure.

### Create repository directory

- Create

```
src/domain/rbac/repositories/
├── user.repository.ts
├── role.repository.ts
├── permission.repository.ts
└── index.ts

```

### Create User Repository Contract

- Create

```

src/domain/rbac/repositories/user.repository.ts

```

```bash
import { PermissionEntity } from '../entities';

export interface IPermissionRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    module?: string;
    isActive?: boolean;
  }): Promise<{ permissions: any[]; total: number }>;

  findAllActive(): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  findByName(name: string): Promise<any | null>;
  findByModuleAction(module: string, action: string): Promise<any | null>;
  create(
    data: Partial<PermissionEntity> & { audit?: { createdBy?: string } },
  ): Promise<any>;
  update(
    id: string,
    data: Partial<PermissionEntity> & { audit?: { updatedBy?: string } },
  ): Promise<any>;
  softDelete(id: string, userId?: string): Promise<void>;
  getDistinctModules(): Promise<string[]>;
}


```

### Role repository

```
src/domain/rbac/repositories/role.repository.ts

```

```bash
import { RoleEntity } from '../entities';

export interface IRoleRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    isActive?: boolean;
  }): Promise<{ roles: any[]; total: number }>;

  findById(id: string): Promise<any | null>;
  findByName(name: string): Promise<any | null>;
  create(
    data: Partial<RoleEntity> & { audit?: { createdBy?: string } },
  ): Promise<any>;
  update(
    id: string,
    data: Partial<RoleEntity> & { audit?: { updatedBy?: string } },
  ): Promise<any>;
  softDelete(id: string, userId?: string): Promise<void>;
  assignPermissions(
    roleId: string,
    permissionIds: string[],
    currentUserId?: string,
  ): Promise<void>;
}

```

### Permission repository

```

src/domain/rbac/repositories/permission.repository.ts

```

```bash
import { PermissionEntity } from '../entities';

export interface IPermissionRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    module?: string;
    isActive?: boolean;
  }): Promise<{ permissions: any[]; total: number }>;

  findAllActive(): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  findByName(name: string): Promise<any | null>;
  findByModuleAction(module: string, action: string): Promise<any | null>;
  create(
    data: Partial<PermissionEntity> & { audit?: { createdBy?: string } },
  ): Promise<any>;
  update(
    id: string,
    data: Partial<PermissionEntity> & { audit?: { updatedBy?: string } },
  ): Promise<any>;
  softDelete(id: string, userId?: string): Promise<void>;
  getDistinctModules(): Promise<string[]>;
}

```

### Repository index

```
src/domain/rbac/repositories/index.ts

```

```bash

export * from './user.repository';
export * from './role.repository';
export * from './permission.repository';

```

Also src/domain/rbac/index.ts

```bash

export * from './entities';
export * from './repositories';

```

## RBAC Application Use Cases

Use cases contain business rules. Repositories only handle persistence.

### Create User use case

By keeping our application layer independent of Prisma.

#### Update src/shared/utils/index.ts to include PasswordUtils

```bash
import * as bcrypt from 'bcrypt';
import { RBAC_CONSTANTS } from '../constants';

export class PasswordUtil {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, RBAC_CONSTANTS.PASSWORD.SALT_ROUNDS);
  }

  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
```

#### Create RBAC constraint on shared folder

```
src/shared/constants/rbac.constants.ts

```

```bash

export const RBAC_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    SALT_ROUNDS: 12,
    MAX_FAILED_ATTEMPTS: 5,
  },
  TOKEN: {
    ACCESS_TOKEN_COOKIE: 'access_token',
    REFRESH_TOKEN_COOKIE: 'refresh_token',
  },
} as const;

/** Injection tokens for repository interfaces */
export const REPOSITORY_TOKENS = {
  USER_REPOSITORY: Symbol('IUserRepository'),
  ROLE_REPOSITORY: Symbol('IRoleRepository'),
  PERMISSION_REPOSITORY: Symbol('IPermissionRepository'),
  AUDIT_REPOSITORY: Symbol('IAuditRepository'),
  REFRESH_TOKEN_REPOSITORY: Symbol('IRefreshTokenRepository'),
} as const;

```

- Update index.ts on that constants folder

  export \* from './rbac.constants';

### Now create User use cases

```
src/application/rbac/use-cases/users/create-user.use-case.ts

```

```

```

```


```

```

```

```


```

```

```

## Summary Users Backend Development Order

#### Step 1: Prisma model

#### Step 2: Migration

#### Step 3: Domain entity.

#### Step 4: Repository interface.

#### Step 5: DI token.

#### Step 6: DTO/Zod schema.

#### Step 7: Use cases.

#### Step 8: Mapper.

#### Step 9: Repository implementation.

#### Step 10: Controller.

#### Step 11: Providers.

#### Step 12: Module.

#### Step 13: Register module.

#### Step 14: Permissions.

#### Step 15: Audit.

#### Step 16: Swagger.

#### Step 17: Test API.

### 14. Test Backend Before Frontend

#### 14.1 Before writing the users frontend, test:

#### 15.2 Directory Structure

```
    frontend/
    └── src/
    	├── app/
    	├── domain/
    	├── infrastructure/
    	├── presentation/
    	└── shared/
```

- App will be, and (authenticated) is just a group

```
  app/
  ├── login/
  │ └── page.tsx
  │
  ├── api/
  │ └── v1/
  │
  └── (authenticated)/
  ├── layout.tsx
  ├── dashboard/
  └── users/
```

#### 15.3 Directory Structure

```
frontend/src/
├── middleware.ts                    # NextAuth session check for all routes
├── app/
│   ├── globals.css                 # Tailwind v4 + shadcn theme tokens
│   ├── layout.tsx                  # Root layout with <Providers>
│   ├── page.tsx                    # Redirects to /dashboard
│   ├── login/page.tsx              # Login page
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth handlers
│   │   └── v1/
│   │       ├── [...path]/route.ts  # BFF proxy to NestJS
│   │       └── _lib/bff.ts        # Proxy helper functions
│   └── (authenticated)/
│       ├── layout.tsx              # Auth check + AppShell
│       ├── dashboard/page.tsx
│       ├── users/page.tsx
│       ├── geography/regions/page.tsx
│       ├── demand/farmers/page.tsx
│       └── ...                     # All feature pages
│
├── domain/                         # LAYER 1: Domain (pure types)
│   ├── shared/entities/index.ts    # ApiResponse, PaginatedResponse, SessionUser
│   ├── rbac/
│   │   ├── entities/index.ts       # User, Role, Permission types
│   │   └── services/
│   │       └── rbac-domain.service.ts  # Permission checking logic
│   ├── geography/entities/index.ts
│   ├── demand/entities/index.ts
│   ├── master-data/entities/index.ts
│   └── sales/entities/index.ts
│
├── infrastructure/                 # LAYER 2: API implementations
│   ├── rbac/
│   │   ├── auth/auth.config.ts     # NextAuth v5 configuration
│   │   └── api/
│   │       ├── api-client.ts       # Shared Axios instance (/api/v1)
│   │       ├── users.api.ts
│   │       ├── roles.api.ts
│   │       └── permissions.api.ts
│   ├── geography/api/geography.api.ts
│   ├── demand/api/demand.api.ts
│   ├── master-data/api/master-data.api.ts
│   ├── sales/api/sales.api.ts
│   ├── dashboard/api/dashboard.api.ts
│   ├── admin/api/admin.api.ts
│   └── upload/api/upload.api.ts
│
├── presentation/                   # LAYER 3: React components
│   ├── components/
│   │   ├── layout/                 # AppShell, AppSidebar, AppHeader
│   │   ├── shared/                 # CrudPage, SearchInput, Pagination, etc.
│   │   ├── ui/                     # shadcn/ui components (26+)
│   │   ├── providers.tsx           # SessionProvider, QueryClient, Toaster
│   │   └── <domain>/              # Domain-specific form dialogs
│   ├── hooks/
│   │   └── useAuth.ts             # Session + permission checking
│   ├── guards/
│   │   └── PermissionGate.tsx     # Declarative permission component
│   └── utils/
│       └── export.ts              # CSV/Excel/Print utilities
│
└── shared/                         # Cross-cutting
    ├── constants/rbac.constants.ts # AUDIT_ACTIONS
    ├── stores/
    │   ├── sidebar.store.ts       # Zustand (collapsed state)
    │   └── modal.store.ts         # Zustand (modal open/close)
    └── utils/cn.ts                # clsx + tailwind-merge

```

### Clean Architecture Layers descriptions

```
┌─────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (React Components)                   │
│  Pages (app/), Components, Hooks, Guards                 │
│  • Page components call infrastructure APIs via          │
│    TanStack Query (useQuery/useMutation)                │
│  • Permission-gated rendering via PermissionGate         │
│  • CrudPage<T> provides generic CRUD UI pattern          │
├─────────────────────────────────────────────────────────┤
│  INFRASTRUCTURE LAYER (API Clients)                      │
│  Axios-based API modules (*.api.ts)                      │
│  • Each module exports an object with typed methods      │
│  • All requests go through /api/v1/* (BFF proxy)         │
│  • Shared Axios instance with 401 → auto-logout          │
│  • NextAuth config for JWT tokens + auto-refresh         │
├─────────────────────────────────────────────────────────┤
│  DOMAIN LAYER (Pure TypeScript)                          │
│  Entity interfaces, Domain services                      │
│  • Zero React imports — pure types and logic             │
│  • Defines request/response shapes for all API calls     │
│  • RbacDomainService: permission checking logic          │
├─────────────────────────────────────────────────────────┤
│  SHARED LAYER                                            │
│  Zustand stores, constants, utilities                    │
│  • UI state (sidebar, modals), not server state          │
│  • Server state is managed by TanStack Query             │
└─────────────────────────────────────────────────────────┘

```

## To seed default and sample data

### Create Database ERD

- Before writing Prisma models, create an ERD. which helps as to design Prisma schema much easier.like below-

```
  Region
  │
  └──< Zone
  │
  └──< Woreda
  │
  └──< Kebele
  │
  └──< Farmer
```

### Create your first database model

- Open backend/prisma/schema.prisma

#### Then add:

    ```bash
    // ============================================================================
    // Project_Name- Prisma Schema
    // Phase 1: RBAC + Geography Hierarchy + Master Data
    // ============================================================================

    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
    }

    // ============================================================================
    // RBAC Models
    // ============================================================================

    model User {
      id           String   @id @default(uuid()) @db.Uuid
      email        String   @unique @db.VarChar(255)
      username     String   @unique @db.VarChar(100)
      mobileNumber String?  @unique @map("mobile_number") @db.VarChar(20)
      password     String   @db.VarChar(255)
      firstName    String   @map("first_name") @db.VarChar(100)
      lastName     String   @map("last_name") @db.VarChar(100)
      phone        String?  @db.VarChar(20)
      avatar       String?  @db.VarChar(500)
      isActive     Boolean  @default(true) @map("is_active")
      isLocked     Boolean  @default(false) @map("is_locked")
      lastLoginAt       DateTime? @map("last_login_at")
      failedLoginAttempts Int @default(0) @map("failed_login_attempts")
      passwordChangedAt DateTime? @map("password_changed_at")

      // Geography assignment (only one should be set for non-admin users)
      regionId String? @map("region_id") @db.Uuid
      zoneId   String? @map("zone_id") @db.Uuid
      woredaId String? @map("woreda_id") @db.Uuid
      kebeleId String? @map("kebele_id") @db.Uuid

      // Audit fields
      createdAt DateTime  @default(now()) @map("created_at")
      updatedAt DateTime  @updatedAt @map("updated_at")
      deletedAt DateTime? @map("deleted_at")
      createdBy String?   @map("created_by") @db.Uuid
      updatedBy String?   @map("updated_by") @db.Uuid

      // Relations
      userRoles     UserRole[]
      refreshTokens RefreshToken[]
      auditLogs     AuditLog[]
      region        Region? @relation(fields: [regionId], references: [id])
      zone          Zone?   @relation(fields: [zoneId], references: [id])
      woreda        Woreda? @relation(fields: [woredaId], references: [id])
      kebele        Kebele? @relation(fields: [kebeleId], references: [id])
      warehousesCreated Warehouse[] @relation("WarehouseCreatedBy")
      warehousesUpdated Warehouse[] @relation("WarehouseUpdatedBy")

      @@map("users")
      @@index([email])
      @@index([username])
      @@index([mobileNumber])
      @@index([deletedAt])
      @@index([regionId])
      @@index([zoneId])
      @@index([woredaId])
      @@index([kebeleId])
    }


    model Role {
      id          String  @id @default(uuid()) @db.Uuid
      name        String  @unique @db.VarChar(100)
      displayName String  @map("display_name") @db.VarChar(150)
      description String? @db.VarChar(500)
      isSystem    Boolean @default(false) @map("is_system")
      isActive    Boolean @default(true) @map("is_active")

      // Audit fields
      createdAt DateTime  @default(now()) @map("created_at")
      updatedAt DateTime  @updatedAt @map("updated_at")
      deletedAt DateTime? @map("deleted_at")
      createdBy String?   @map("created_by") @db.Uuid
      updatedBy String?   @map("updated_by") @db.Uuid

      // Relations
      userRoles       UserRole[]
      rolePermissions RolePermission[]

      @@map("roles")
      @@index([name])
      @@index([deletedAt])
    }

    model Permission {
      id          String  @id @default(uuid()) @db.Uuid
      name        String  @unique @db.VarChar(150)
      displayName String  @map("display_name") @db.VarChar(200)
      description String? @db.VarChar(500)
      module      String  @db.VarChar(100)
      action      String  @db.VarChar(50)
      isActive    Boolean @default(true) @map("is_active")

      // Audit fields
      createdAt DateTime  @default(now()) @map("created_at")
      updatedAt DateTime  @updatedAt @map("updated_at")
      deletedAt DateTime? @map("deleted_at")
      createdBy String?   @map("created_by") @db.Uuid
      updatedBy String?   @map("updated_by") @db.Uuid

      // Relations
      rolePermissions RolePermission[]

      @@unique([module, action])
      @@map("permissions")
      @@index([module])
      @@index([deletedAt])
    }

    model UserRole {
      id     String @id @default(uuid()) @db.Uuid
      userId String @map("user_id") @db.Uuid
      roleId String @map("role_id") @db.Uuid

      // Audit fields
      createdAt DateTime  @default(now()) @map("created_at")
      updatedAt DateTime  @updatedAt @map("updated_at")
      deletedAt DateTime? @map("deleted_at")
      createdBy String?   @map("created_by") @db.Uuid
      updatedBy String?   @map("updated_by") @db.Uuid

      // Relations
      user User @relation(fields: [userId], references: [id], onDelete: Cascade)
      role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

      @@unique([userId, roleId])
      @@map("user_roles")
      @@index([userId])
      @@index([roleId])
      @@index([deletedAt])
    }

    model RolePermission {
      id           String @id @default(uuid()) @db.Uuid
      roleId       String @map("role_id") @db.Uuid
      permissionId String @map("permission_id") @db.Uuid

      // Audit fields
      createdAt DateTime  @default(now()) @map("created_at")
      updatedAt DateTime  @updatedAt @map("updated_at")
      deletedAt DateTime? @map("deleted_at")
      createdBy String?   @map("created_by") @db.Uuid
      updatedBy String?   @map("updated_by") @db.Uuid

      // Relations
      role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
      permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

      @@unique([roleId, permissionId])
      @@map("role_permissions")
      @@index([roleId])
      @@index([permissionId])
      @@index([deletedAt])
    }

    model RefreshToken {
      id        String    @id @default(uuid()) @db.Uuid
      token     String    @unique @db.VarChar(500)
      userId    String    @map("user_id") @db.Uuid
      expiresAt DateTime  @map("expires_at")
      revokedAt DateTime? @map("revoked_at")
      ipAddress String?   @map("ip_address") @db.VarChar(45)
      userAgent String?   @map("user_agent") @db.VarChar(500)

      // Audit fields
      createdAt DateTime @default(now()) @map("created_at")
      updatedAt DateTime @updatedAt @map("updated_at")

      // Relations
      user User @relation(fields: [userId], references: [id], onDelete: Cascade)

      @@map("refresh_tokens")
      @@index([userId])
      @@index([token])
      @@index([expiresAt])
    }

    model AuditLog {
      id        String   @id @default(uuid()) @db.Uuid
      userId    String?  @map("user_id") @db.Uuid
      action    String   @db.VarChar(50)
      entity    String   @db.VarChar(100)
      entityId  String?  @map("entity_id") @db.VarChar(100)
      oldValues Json?    @map("old_values")
      newValues Json?    @map("new_values")
      ipAddress String?  @map("ip_address") @db.VarChar(45)
      userAgent String?  @map("user_agent") @db.VarChar(500)
      createdAt DateTime @default(now()) @map("created_at")

      // Relations
      user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

      @@map("audit_logs")
      @@index([userId])
      @@index([entity])
      @@index([action])
      @@index([createdAt])
    }

    // ============================================================================
    // Geography Hierarchy Models
    // ============================================================================

    model Region {
      id       String  @id @default(uuid()) @db.Uuid
      name     String  @unique @db.VarChar(200)
      code     String  @unique @db.VarChar(20)
      isActive Boolean @default(true) @map("is_active")

      createdAt DateTime  @default(now()) @map("created_at")
      updatedAt DateTime  @updatedAt @map("updated_at")
      deletedAt DateTime? @map("deleted_at")
      createdBy String?   @map("created_by") @db.Uuid
      updatedBy String?   @map("updated_by") @db.Uuid

      zones      Zone[]
      users      User[]
      warehouses Warehouse[]

      @@map("regions")
      @@index([deletedAt])
    }

    model Zone {
      id       String  @id @default(uuid()) @db.Uuid
      name     String  @db.VarChar(200)
      code     String  @unique @db.VarChar(20)
      regionId String  @map("region_id") @db.Uuid
      isActive Boolean @default(true) @map("is_active")

      createdAt DateTime  @default(now()) @map("created_at")
      updatedAt DateTime  @updatedAt @map("updated_at")
      deletedAt DateTime? @map("deleted_at")
      createdBy String?   @map("created_by") @db.Uuid
      updatedBy String?   @map("updated_by") @db.Uuid

      region     Region     @relation(fields: [regionId], references: [id])
      woredas    Woreda[]
      users      User[]
      warehouses Warehouse[]

      @@unique([name, regionId])
      @@map("zones")
      @@index([regionId])
      @@index([deletedAt])
    }

    model Woreda {
      id       String  @id @default(uuid()) @db.Uuid
      name     String  @db.VarChar(200)
      code     String  @unique @db.VarChar(20)
      zoneId   String  @map("zone_id") @db.Uuid
      isActive Boolean @default(true) @map("is_active")

      createdAt DateTime  @default(now()) @map("created_at")
      updatedAt DateTime  @updatedAt @map("updated_at")
      deletedAt DateTime? @map("deleted_at")
      createdBy String?   @map("created_by") @db.Uuid
      updatedBy String?   @map("updated_by") @db.Uuid

      zone         Zone                @relation(fields: [zoneId], references: [id])
      kebeles      Kebele[]
      unions       FmsUnion[]
      destinations Destination[]
      stopAdjustments StopAdjustment[]
      users           User[]
      warehouses      Warehouse[]

      @@unique([name, zoneId])
      @@map("woredas")
      @@index([zoneId])
      @@index([deletedAt])
    }

    model Kebele {
      id       String  @id @default(uuid()) @db.Uuid
      name     String  @db.VarChar(200)
      code     String  @unique @db.VarChar(20)
      woredaId String  @map("woreda_id") @db.Uuid
      isActive Boolean @default(true) @map("is_active")

      createdAt DateTime  @default(now()) @map("created_at")
      updatedAt DateTime  @updatedAt @map("updated_at")
      deletedAt DateTime? @map("deleted_at")
      createdBy String?   @map("created_by") @db.Uuid
      updatedBy String?   @map("updated_by") @db.Uuid

      woreda       Woreda              @relation(fields: [woredaId], references: [id])
      cooperatives PrimaryCooperative[]
      farmers      Farmer[]
      stopAdjustments StopAdjustment[]
      users           User[]
      warehouses      Warehouse[]

      @@unique([name, woredaId])
      @@map("kebeles")
      @@index([woredaId])
      @@index([deletedAt])
    }
    ```

#### Add on seed.ts

####================

```bash
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

const MODULES = ['users', 'roles', 'permissions', 'audit'];
const ACTIONS = ['create', 'read', 'update', 'delete', 'manage', 'export'];

async function main() {
console.log('🌱 Seeding database...');

// Create permissions for each module
const permissions: any[] = [];
for (const module of MODULES) {
  for (const action of ACTIONS) {
    const name = `${module}:${action}`;
    const displayName = `${action.charAt(0).toUpperCase() + action.slice(1)} ${module.charAt(0).toUpperCase() + module.slice(1)}`;

    const permission = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: {
        name,
        displayName,
        description: `Permission to ${action} ${module}`,
        module,
        action,
        isActive: true,
      },
    });
    permissions.push(permission);
    console.log(`  ✅ Permission: ${name}`);
  }
}

// Create roles
const superAdminRole = await prisma.role.upsert({
  where: { name: 'super_admin' },
  update: {},
  create: {
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    isSystem: true,
    isActive: true,
  },
});
console.log('  ✅ Role: Super Admin');

const adminRole = await prisma.role.upsert({
  where: { name: 'admin' },
  update: {},
  create: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Administrative access for user and role management',
    isSystem: true,
    isActive: true,
  },
});
console.log('  ✅ Role: Admin');

const managerRole = await prisma.role.upsert({
  where: { name: 'manager' },
  update: {},
  create: {
    name: 'manager',
    displayName: 'Manager',
    description: 'Manager with read and limited update access',
    isSystem: false,
    isActive: true,
  },
});
console.log('  ✅ Role: Manager');

const userRole = await prisma.role.upsert({
  where: { name: 'user' },
  update: {},
  create: {
    name: 'user',
    displayName: 'Standard User',
    description: 'Basic user with read-only access',
    isSystem: false,
    isActive: true,
  },
});
console.log('  ✅ Role: User');

// Assign all permissions to super_admin
for (const permission of permissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: superAdminRole.id,
      permissionId: permission.id,
    },
  });
}
console.log('  ✅ Super Admin: All permissions assigned');

// Assign admin permissions (all except permission management)
const adminPermissions = permissions.filter(
  (p) => p.module !== 'permissions' || p.action === 'read',
);
for (const permission of adminPermissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: permission.id,
    },
  });
}
console.log('  ✅ Admin: Permissions assigned');

// Manager: read on users, roles, and audit
const managerPermissions = permissions.filter(
  (p) =>
    (p.module === 'users' && ['read'].includes(p.action)) ||
    (p.module === 'roles' && ['read'].includes(p.action)) ||
    (p.module === 'audit' && ['read'].includes(p.action)),
);
for (const permission of managerPermissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: managerRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: managerRole.id,
      permissionId: permission.id,
    },
  });
}
console.log('  ✅ Manager: Permissions assigned');

// User: read only on users
const userPermissions = permissions.filter(
  (p) => p.module === 'users' && p.action === 'read',
);
for (const permission of userPermissions) {
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: userRole.id,
        permissionId: permission.id,
      },
    },
    update: {},
    create: {
      roleId: userRole.id,
      permissionId: permission.id,
    },
  });
}
console.log('  ✅ User: Permissions assigned');

// Create super admin user
const hashedPassword = await bcrypt.hash('Admin@123456', SALT_ROUNDS);
const superAdmin = await prisma.user.upsert({
  where: { email: 'admin@fms.com' },
  update: {},
  create: {
    email: 'admin@fms.com',
    username: 'superadmin',
    password: hashedPassword,
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+1234567890',
    isActive: true,
  },
});
console.log('  ✅ Super Admin User created (admin@fms.com / Admin@123456)');

// Assign super_admin role to the user
await prisma.userRole.upsert({
  where: {
    userId_roleId: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  },
  update: {},
  create: {
    userId: superAdmin.id,
    roleId: superAdminRole.id,
  },
});
console.log('  ✅ Super Admin role assigned to admin user');

// Create a demo regular user
const demoPassword = await bcrypt.hash('User@123456', SALT_ROUNDS);
const demoUser = await prisma.user.upsert({
  where: { email: 'user@fms.com' },
  update: {},
  create: {
    email: 'user@fms.com',
    username: 'demouser',
    password: demoPassword,
    firstName: 'Demo',
    lastName: 'User',
    isActive: true,
  },
});

await prisma.userRole.upsert({
  where: {
    userId_roleId: {
      userId: demoUser.id,
      roleId: userRole.id,
    },
  },
  update: {},
  create: {
    userId: demoUser.id,
    roleId: userRole.id,
  },
});
console.log('  ✅ Demo User created (user@fms.com / User@123456)');

console.log('\n🎉 Seeding completed!');
}

main()
.catch((e) => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
```

#### Validate prisma

    	npx prisma validate

#### Then, Run->

    npx prisma migrate dev --name init,

- later i may use : npx prisma migrate dev --name add_model_name

#### if error occur's

    npx prisma migrate reset

#### Then->

    npx prisma generate

#### Insert initial/default data

    /// npx ts-node prisma/seeds/seed.ts
    npx prisma db seed

#### To check seeded data on prisma studio

    npx prisma studio

#### We can also check the postgresql on docker using window powershell

    docker exec -it n3-postgres psql -U postgres -d n3_db

#### Exit

    \q

##### List Database

    \l

##### List Tables

    \dt		\d users

#### Now we have:

    	NestJS
    	  |
    	Prisma
    	  |
    	PostgreSQL

### Default Credentials

| User             | Password       | Role        |
| ---------------- | -------------- | ----------- |
| `admin@test.com` | `Admin@123456` | super_admin |
| `user@test.com`  | `User@123456`  | user        |

### Useful URLs

| URL                                | Description               |
| ---------------------------------- | ------------------------- |
| `http://localhost:4000/api/docs`   | Swagger API documentation |
| `http://localhost:4000/api/v1/...` | Backend API               |
| `http://localhost:3016`            | Frontend                  |
| `http://localhost:3016/api/v1/...` | BFF proxy to backend      |

### 10.1.5 Authentication & Authorization

**Guards** are applied globally in `AppModule`. All routes require authentication by default.

| Decorator                        | Effect                                                 |
| -------------------------------- | ------------------------------------------------------ |
| `@Public()`                      | Skips JWT authentication                               |
| `@Roles('admin', 'manager')`     | Requires user to have ANY of the listed roles          |
| `@Permissions('geography:read')` | Requires user to have the permission                   |
| `@CurrentUser()`                 | Injects `ICurrentUser` (id, email, roles, permissions) |

**Permission format:** `module:action` (e.g., `geography:read`, `demand:create`, `users:delete`)

**Super admin** (`super_admin` role) bypasses all role and permission checks.

### 10.1.6 Shared Utilities

| Utility                 | Location              | Methods                                                        |
| ----------------------- | --------------------- | -------------------------------------------------------------- |
| `PaginationUtil`        | `shared/utils`        | `calculateSkip(page, limit)`, `buildMeta(page, limit, total)`  |
| `PasswordUtil`          | `shared/utils`        | `hash(password)`, `compare(plain, hash)`                       |
| `ZodValidationPipe`     | `shared/pipes`        | Validates `@Query`/`@Body` against Zod schema                  |
| `PaginationQuerySchema` | `shared/dto`          | Base Zod schema: page, limit, sortBy, sortOrder, search        |
| `TransformInterceptor`  | `shared/interceptors` | Wraps all responses in `{ success, message, data, timestamp }` |

### 10.1.7 API Response Format

**All endpoints** return a consistent envelope:

```json

// Success
{
  "success": true,
  "message": "Success",
  "data": { /* ... */ },
  "timestamp": "2026-03-28T10:00:00.000Z"
}

// Paginated
{
  "success": true,
  "message": "Success",
  "data": {
    "items": [ /* ... */ ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "timestamp": "2026-03-28T10:00:00.000Z"
}

// Error
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name is required" }
  ],
  "timestamp": "2026-03-28T10:00:00.000Z"
}

```

## 11. Authentication

- Authentication should be built before ordinary business modules.
- Architecture

```
  Frontend
  │
  │ credentials
  ▼
  NextAuth
  │
  │ POST /auth/login
  ▼
  NestJS
  │
  ├── Validate user
  ├── Check password
  ├── Load roles
  ├── Load permissions
  └── Create JWT
```

### 15.4 Frontend Authentication

- Implement:

```
  Login
  ↓
  NextAuth
  ↓
  Session
  ↓
  Middleware
  ↓
  Authenticated layout
```

- Then:

```
  useAuth()
```

- provides:

```
  user
  roles
  permissions
  isSuperAdmin
  hasPermission()
```

#### 15.5. BFF

- Instead of:

```
  Browser ──────────────> NestJS
```

- use:

```
  Browser
  │
  ▼
  Next.js
  /api/\*
  │
  ▼
  BFF
  │
  ▼
  NestJS
```

- The browser therefore does:

```
  GET /api/v1/users
```

- rather than:

```
  GET http://localhost:4000/api/v1/users/
```

- The BFF handles:

```
  session
  JWT
  authorization header
  backend URL
  response handling
  401 handling
```

#### 15.5.1 BFF Proxy Pattern

The frontend **never** makes direct API calls to the NestJS backend. All API traffic flows through the Next.js BFF (Backend For Frontend) proxy:

```

Browser (React)  ──HTTP──>  Next.js API Route (/api/v1/*)  ──HTTP──>  NestJS Backend (port 4000)
                            │
                            ├── Reads NextAuth session
                            ├── Injects Authorization: Bearer <token>
                            ├── Normalizes paginated responses
                            └── Returns to browser

```

**Why BFF?**

- JWT access tokens never reach the browser's JavaScript
- Backend URL is never exposed to the client
- Centralized response normalization
- Same-origin API calls (no CORS issues in browser)

#### 15.6 Authentication & RBAC

**NextAuth v5** handles authentication:

- **Login:** Credentials provider → calls NestJS `/auth/login`
- **Session:** JWT strategy, 7-day max age, auto-refresh at 14 min
- **Middleware:** All routes except `/login`, `/api`, static assets require session

**Frontend RBAC:**

```tsx

// In any component — check permissions
import { useAuth } from '@/presentation/hooks/useAuth';

const { hasPermission, isSuperAdmin } = useAuth();
if (hasPermission('warehouse:create')) { /* show create button */ }

// Declarative permission gate
import { PermissionGate } from '@/presentation/guards/PermissionGate';

<PermissionGate permission="warehouse:create">
  <Button>Create Warehouse</Button>
</PermissionGate>

<PermissionGate permissions={["warehouse:read", "warehouse:update"]} requireAll>
  <EditForm />
</PermissionGate>

```

#### 15.7 Key Patterns & Components

##### CrudPage Component

The `CrudPage<T>` generic component is used across most CRUD pages. It provides:

- Stat cards at the top
- Search input with debounce
- Paginated data table with sortable columns
- Row action dropdown (View, Edit, Delete)
- Create button (permission-gated)
- Delete confirmation dialog
- Slot for a custom form dialog

**Usage pattern in most pages:**

```tsx

<CrudPage<WarehouseResponse>
  title="Warehouses"
  queryKey="warehouses"
  fetchFn={(params) => warehousesApi.getAll(params)}
  deleteFn={(id) => warehousesApi.delete(id)}
  columns={[...]}
  createPermission="warehouse:create"
  editPermission="warehouse:update"
  deletePermission="warehouse:delete"
  renderFormDialog={(item, onClose) => (
    <WarehouseFormDialog warehouse={item} onClose={onClose} />
  )}
/>

```

#### Infrastructure API Module Pattern

Each API module is an object with typed methods:

```typescript
// infrastructure/<module>/api/<module>.api.ts
import api from "../../rbac/api/api-client";
import {
  WarehouseResponse,
  CreateWarehouseRequest,
} from "@/domain/warehouse/entities";
import { PaginatedResponse, ApiResponse } from "@/domain/shared/entities";

export const warehousesApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<WarehouseResponse>>("/warehouses", { params }),

  getById: (id: string) =>
    api.get<ApiResponse<WarehouseResponse>>(`/warehouses/${id}`),

  create: (data: CreateWarehouseRequest) =>
    api.post<ApiResponse<WarehouseResponse>>("/warehouses", data),

  update: (id: string, data: Partial<CreateWarehouseRequest>) =>
    api.put<ApiResponse<WarehouseResponse>>(`/warehouses/${id}`, data),

  delete: (id: string) => api.delete(`/warehouses/${id}`),

  lookup: (kebeleId?: string) =>
    api.get<ApiResponse<{ id: string; name: string; code: string }[]>>(
      "/warehouses/lookup",
      { params: kebeleId ? { kebeleId } : {} },
    ),
};
```

### 15.8 Frontend State Management

| Concern           | Tool           | Where                                                  |
| ----------------- | -------------- | ------------------------------------------------------ |
| Server data (API) | TanStack Query | `useQuery` / `useMutation` in page components          |
| Authentication    | NextAuth v5    | Session provider, `useAuth()` hook                     |
| Sidebar state     | Zustand        | `useSidebarStore` (collapsed/expanded, active section) |
| Modal state       | Zustand        | `useModalStore` (open/close by ID)                     |
| Form state        | Formik         | Form dialogs                                           |
| Validation        | Zod            | Schema validation in form dialogs                      |

**Rule:** Use TanStack Query for any data from the API. Use Zustand only for UI state that doesn't come from the server.

### Server data, use:

    TanStack Query

    Examples:
    	farmers
    	regions
    	demands
    	sales

### UI state, Use:

    Zustand
    Examples:
    	sidebar open/closed
    	modal state
    	UI preferences

### Form state, Use:

    Formik

### Validation, Use:

    Zod

## 15.9 Build Users Frontend

### Order:

    1. Domain types
    2. API client
    3. Query hook/page logic
    4. Form dialog
    5. Validation
    6. Table
    7. Pagination
    8. Search
    9. Edit
    10. Delete
    11. PermissionGate
    12. Sidebar
    13. Loading state
    14. Error state
    15. Empty state

### Then verify the complete flow:

    Browser
     ↓
    Next.js
     ↓
    BFF
     ↓
    NestJS
     ↓
    Use Case
     ↓
    Repository
     ↓
    Prisma
     ↓
    PostgreSQL

- The first end-to-end milestone.

## 15.10 Step-by-Step: Adding a New Frontend Module

> **Example:** Adding a `users` module (matching the backend module from Section 4.8).

#### Step 1: Domain Layer — Entity Types

**`src/domain/users/entities/index.ts`**

```typescript
export interface UsersResponse {
  id: string;
  name: string;
  code: string;
  location: string | null;
  capacity: number;
  isActive: boolean;
  kebele?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateUsersRequest {
  name: string;
  code: string;
  location?: string;
  capacity?: number;
  isActive?: boolean;
  kebeleId: string;
}

export interface UpdateUsersRequest {
  name?: string;
  code?: string;
  location?: string;
  capacity?: number;
  isActive?: boolean;
  kebeleId?: string;
}
```

#### Step 2: Infrastructure Layer — API Client

**`src/infrastructure/users/api/users.api.ts`**

```typescript
import api from "../../rbac/api/api-client";
import type {
  WarehouseResponse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
} from "@/domain/warehouse/entities";
import type { PaginatedResponse, ApiResponse } from "@/domain/shared/entities";

export const warehousesApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<WarehouseResponse>>("/warehouses", { params }),

  getById: (id: string) =>
    api.get<ApiResponse<WarehouseResponse>>(`/warehouses/${id}`),

  create: (data: CreateWarehouseRequest) =>
    api.post<ApiResponse<WarehouseResponse>>("/warehouses", data),

  update: (id: string, data: UpdateWarehouseRequest) =>
    api.put<ApiResponse<WarehouseResponse>>(`/warehouses/${id}`, data),

  delete: (id: string) => api.delete(`/warehouses/${id}`),

  lookup: (kebeleId?: string) =>
    api.get<ApiResponse<{ id: string; name: string; code: string }[]>>(
      "/warehouses/lookup",
      { params: kebeleId ? { kebeleId } : {} },
    ),
};
```

**`src/infrastructure/warehouse/api/index.ts`**

```typescript
export * from "./warehouse.api";
```

**`src/infrastructure/warehouse/index.ts`**

```typescript
export * from "./api";
```

#### Step 3: Presentation — Form Dialog

**`src/presentation/components/warehouse/warehouse-form-dialog.tsx`**

```tsx
"use client";

import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { warehousesApi } from "@/infrastructure/warehouse";
import type { WarehouseResponse } from "@/domain/warehouse/entities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";

interface Props {
  warehouse?: WarehouseResponse | null;
  open: boolean;
  onClose: () => void;
}

export function WarehouseFormDialog({ warehouse, open, onClose }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!warehouse;

  const mutation = useMutation({
    mutationFn: (values: any) =>
      isEdit
        ? warehousesApi.update(warehouse!.id, values)
        : warehousesApi.create(values),
    onSuccess: () => {
      toast.success(isEdit ? "Warehouse updated" : "Warehouse created");
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Operation failed");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: warehouse?.name || "",
      code: warehouse?.code || "",
      location: warehouse?.location || "",
      capacity: warehouse?.capacity || 0,
      kebeleId: warehouse?.kebele?.id || "",
    },
    onSubmit: (values) => mutation.mutate(values),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"} Warehouse</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              required
            />
          </div>
          <div>
            <Label>Code</Label>
            <Input
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              required
            />
          </div>
          {/* Add kebele selector, location, capacity fields */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

#### Step 4: Presentation — Page

**`src/app/(authenticated)/warehouses/page.tsx`**

```tsx
"use client";

import { CrudPage } from "@/presentation/components/shared/CrudPage";
import { warehousesApi } from "@/infrastructure/warehouse";
import { WarehouseFormDialog } from "@/presentation/components/warehouse/warehouse-form-dialog";
import type { WarehouseResponse } from "@/domain/warehouse/entities";
import { StatusBadge } from "@/presentation/components/shared/StatusBadge";

export default function WarehousesPage() {
  return (
    <CrudPage<WarehouseResponse>
      title="Warehouses"
      queryKey="warehouses"
      fetchFn={(params) => warehousesApi.getAll(params).then((r) => r.data)}
      deleteFn={(id) => warehousesApi.delete(id)}
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "code", label: "Code", sortable: true },
        { key: "location", label: "Location" },
        {
          key: "capacity",
          label: "Capacity (Qt)",
          render: (v) => v.capacity.toFixed(1),
        },
        {
          key: "kebele",
          label: "Kebele",
          render: (v) => v.kebele?.name || "—",
        },
        {
          key: "isActive",
          label: "Status",
          render: (v) => <StatusBadge isActive={v.isActive} />,
        },
      ]}
      createPermission="warehouse:create"
      editPermission="warehouse:update"
      deletePermission="warehouse:delete"
      renderFormDialog={(item, onClose) => (
        <WarehouseFormDialog warehouse={item} open onClose={onClose} />
      )}
    />
  );
}
```

#### Step 5: Add Navigation Entry

In `src/presentation/components/layout/AppSidebar.tsx`, add the warehouse link to the appropriate navigation category:

```typescript

// Inside the navigation items array
{
  label: "Warehouses",
  href: "/warehouses",
  icon: WarehouseIcon,
  permission: "warehouse:read",
},

```

The sidebar automatically hides items the user doesn't have permission for.

#### Frontend Module Checklist

```

✅ domain/warehouse/entities/index.ts      — Request/Response types
✅ infrastructure/warehouse/api/            — API client module
✅ presentation/components/warehouse/       — Form dialog
✅ app/(authenticated)/warehouses/page.tsx  — Page component
✅ AppSidebar navigation entry              — Sidebar link

```

## Order of Implementation

```

1. BACKEND: Prisma Schema
   └── Define model → run migration → generate client

2. BACKEND: Domain Layer
   ├── entities/    → Entity + Response interfaces
   └── repositories/ → Repository interface

3. BACKEND: Shared
   └── constants/   → DI token Symbols

4. BACKEND: Application Layer
   ├── dto/         → Zod validation schemas
   └── use-cases/   → CRUD use case classes

5. BACKEND: Infrastructure Layer
   ├── entities/    → ORM mapper class
   └── repositories/ → Prisma repository implementation

6. BACKEND: Presentation Layer
   ├── controllers/ → HTTP controller
   ├── providers/   → DI bindings (token → implementation)
   └── module.ts    → NestJS module

7. BACKEND: Registration
   ├── app.module.ts → Import new module
   └── seeds/       → Add permissions

8. FRONTEND: Domain Layer
   └── entities/    → TypeScript interfaces

9. FRONTEND: Infrastructure Layer
   └── api/         → Axios API client module

10. FRONTEND: Presentation Layer
    ├── components/ → Form dialog
    └── page.tsx    → CrudPage or custom page

11. FRONTEND: Navigation
    └── AppSidebar  → Add nav entry with permission

```

### File Count Per Module

| Layer          | Backend Files                         | Frontend Files           |
| -------------- | ------------------------------------- | ------------------------ |
| Domain         | 2-4 (entities + repo interfaces)      | 1 (entities)             |
| Application    | 2-3 (dto + use cases)                 | —                        |
| Infrastructure | 2-4 (mapper + repo impl)              | 1-2 (API client)         |
| Presentation   | 3-4 (controller + module + providers) | 2-3 (page + form dialog) |
| Shared/Config  | 1-2 (tokens + seeds)                  | 0-1 (sidebar entry)      |
| **Total**      | **~12-15 files**                      | **~4-6 files**           |

## Environment Variables

### Backend (`.env`)

| Variable           | Example                                     | Description                        |
| ------------------ | ------------------------------------------- | ---------------------------------- |
| `DATABASE_URL`     | `postgresql://user:pass@localhost:5432/fms` | PostgreSQL connection              |
| `PORT`             | `4000`                                      | Server port                        |
| `API_PREFIX`       | `api/v1`                                    | API route prefix                   |
| `JWT_SECRET`       | `your-secret-key`                           | JWT signing secret                 |
| `JWT_EXPIRATION`   | `15m`                                       | Access token TTL                   |
| `FRONTEND_URL`     | `http://localhost:3016`                     | CORS allowed origin                |
| `SUPER_ADMIN_ROLE` | `super_admin`                               | Role name that bypasses all checks |
| `SYSTEM_ROLES`     | `super_admin,admin`                         | Non-deletable roles                |
| `THROTTLE_TTL`     | `60000`                                     | Rate limit window (ms)             |
| `THROTTLE_LIMIT`   | `100`                                       | Max requests per window            |

### Frontend (`.env.local`)

| Variable          | Example                        | Description                |
| ----------------- | ------------------------------ | -------------------------- |
| `BACKEND_URL`     | `http://localhost:4000/api/v1` | NestJS backend URL         |
| `NEXTAUTH_URL`    | `http://localhost:3016`        | NextAuth base URL          |
| `NEXTAUTH_SECRET` | `your-nextauth-secret`         | NextAuth encryption secret |
| `AUTH_SECRET`     | `your-auth-secret`             | NextAuth v5 secret         |

## Database Migrations

### Creating a Migration

```bash

cd fms-backend
npx prisma migrate dev --name describe_your_change

```

### Applying Migrations (production)

```bash

npx prisma migrate deploy

```

### Resetting Database (development only)

```bash

npx prisma migrate reset --force
# Then re-seed:
npx ts-node prisma/seeds/seed.ts

```

### Viewing Data

```bash

npx prisma studio  # Opens GUI at localhost:5555

```

### Migration Best Practices

- One migration per logical change
- Name migrations descriptively: `add_warehouse`, `add_farmer_phone_field`
- Always add `@@index` for foreign keys and `deletedAt`
- Every model needs: `id`, `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy`
- Use `@@map("table_name")` for snake_case table names
- Use `@map("column_name")` for snake_case column names

## Coding Conventions

### Backend

| Convention            | Rule                                                                      |
| --------------------- | ------------------------------------------------------------------------- |
| **File naming**       | `kebab-case.ts` (e.g., `warehouse.controller.ts`)                         |
| **Class naming**      | `PascalCase` (e.g., `WarehouseController`)                                |
| **Interface naming**  | `I` prefix for repository interfaces (e.g., `IWarehouseRepository`)       |
| **DI tokens**         | `Symbol('InterfaceName')` in `*_TOKENS` objects                           |
| **Validation**        | Zod schemas (not class-validator decorators)                              |
| **Error handling**    | Throw NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`) |
| **Soft delete**       | Never use `DELETE FROM`. Always set `deletedAt`                           |
| **Audit logging**     | Every create/update/delete must log to AuditRepository                    |
| **Permission format** | `module:action` (e.g., `warehouse:create`)                                |

### Frontend

| Convention           | Rule                                                              |
| -------------------- | ----------------------------------------------------------------- |
| **File naming**      | `kebab-case.tsx` for components, `camelCase.ts` for utilities     |
| **Component naming** | `PascalCase` (e.g., `WarehouseFormDialog`)                        |
| **API modules**      | Export an object with methods (e.g., `warehousesApi.getAll(...)`) |
| **State**            | TanStack Query for server state, Zustand for UI state             |
| **Permissions**      | Use `<PermissionGate>` or `useAuth().hasPermission()`             |
| **Styling**          | Tailwind CSS utility classes, `cn()` for conditional classes      |
| **Forms**            | Formik + Zod validation                                           |
| **Notifications**    | `toast.success()` / `toast.error()` from Sonner                   |
| **Path alias**       | `@/*` maps to `src/*`                                             |

## 20. Common Patterns Reference

### Backend: Standard Repository Method

```typescript

async findAll(query: any) {
  const where: any = { ...this.prisma.softDeleteFilter() };
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { code: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  // Add more filters as needed
  const skip = PaginationUtil.calculateSkip(query.page, query.limit);
  const [items, total] = await Promise.all([
    this.prisma.model.findMany({ where, orderBy, skip, take: query.limit, include }),
    this.prisma.model.count({ where }),
  ]);
  return { items, total };
}

```

### Backend: Standard Use Case

```typescript
@Injectable()
export class CreateEntityUseCase {
  constructor(
    @Inject(TOKENS.ENTITY_REPOSITORY) private readonly repo: IEntityRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(data: CreateDto, userId: string) {
    const entity = await this.repo.create(data, userId);
    await this.auditRepo.create({
      action: "ENTITY_CREATED",
      entity: "Entity",
      entityId: entity.id,
      userId,
      newValues: data,
    });
    return EntityMapper.toResponseDto(entity);
  }
}
```

### Backend: Standard Controller Method

```typescript

@Post()
@Permissions('module:create')
create(
  @Body(new ZodValidationPipe(CreateSchema)) dto: CreateDto,
  @CurrentUser() user: ICurrentUser,
) {
  return this.createUseCase.execute(dto, user.id);
}

```

### Frontend: Standard CrudPage

```tsx
<CrudPage<EntityResponse>
  title="Entities"
  queryKey="entities"
  fetchFn={(params) => entitiesApi.getAll(params).then((r) => r.data)}
  deleteFn={(id) => entitiesApi.delete(id)}
  columns={[
    { key: "name", label: "Name", sortable: true },
    {
      key: "isActive",
      label: "Status",
      render: (v) => <StatusBadge isActive={v.isActive} />,
    },
  ]}
  createPermission="module:create"
  editPermission="module:update"
  deletePermission="module:delete"
  renderFormDialog={(item, onClose) => (
    <EntityFormDialog entity={item} open onClose={onClose} />
  )}
/>
```

### Frontend: Standard API Module

```typescript
export const entitiesApi = {
  getAll: (params?) =>
    api.get<PaginatedResponse<EntityResponse>>("/entities", { params }),
  getById: (id) => api.get<ApiResponse<EntityResponse>>(`/entities/${id}`),
  create: (data) => api.post<ApiResponse<EntityResponse>>("/entities", data),
  update: (id, data) =>
    api.put<ApiResponse<EntityResponse>>(`/entities/${id}`, data),
  delete: (id) => api.delete(`/entities/${id}`),
  lookup: () => api.get<ApiResponse<LookupItem[]>>("/entities/lookup"),
};
```

### Frontend: Standard Form Dialog

```tsx
const mutation = useMutation({
  mutationFn: (values) =>
    isEdit ? api.update(id, values) : api.create(values),
  onSuccess: () => {
    toast.success(isEdit ? "Updated" : "Created");
    queryClient.invalidateQueries({ queryKey: ["entities"] });
    onClose();
  },
  onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
});
```

## 21: Testing Strategy

- We should have:

### Unit tests, that test:

    Use cases
    Domain services
    Utilities
    Validation

### Integration tests, that test:

    Repository
    Prisma
    PostgreSQL

### API/E2E tests, that test:

    HTTP endpoint
    Authentication
    Authorization
    Validation
    Database

### Frontend tests, test:

    Forms
    PermissionGate
    API handling
    Important components

## 22: Error Handling

- Define standard errors.
  400 Bad Request
  401 Unauthorized, → not logged in
  403 Forbidden, logged in but not authorized
  404 Not Found, resource doesn't exist
  409 Conflict, duplicate code
  422 Validation Error
  429 Too Many Requests
  500 Internal Server Error

## Logging and Auditing

### Application logging

    POST /api/v1/warehouses
    user=123
    status=201
    duration=83m

### Audit logging

    User 123
    created users
    id=abc

## Pagination, Search and Filtering

### Standardize centralized:

    ?page=1
    &limit=20
    &search=...
    &sortBy=name
    &sortOrder=asc

### Then define:

    default page = 1
    default limit = 20
    maximum limit = 100

## Security

### Backend:

    JWT
    Helmet
    CORS
    Rate limiting
    Password hashing
    Input validation
    SQL injection protection
    Authorization
    Sensitive data handling

### Frontend:

    Secure authentication
    No JWT in localStorage
    BFF
    CSRF considerations
    Environment variables
    Permission-based UI

### Never be returned by APIs:

    passwordHash
    JWT secrets
    database credentials
    internal security information

## Environment Management

### backend:

    .env

### Frontend:

    .env.local

## 27. Development Workflow

    Requirement
    	↓
    Business analysis
    	↓
    Database design
    	↓
    ERD
    	↓
    Prisma model
    	↓
    Migration
    	↓
    Backend domain
    	↓
    Backend application
    	↓
    Backend infrastructure
    	↓
    Backend presentation
    	↓
    Swagger/API test
    	↓
    Frontend domain
    	↓
    Frontend API
    	↓
    Frontend UI
    	↓
    Integration test
    	↓
    Review
    	↓
    Git commit

## 28. Quick Reference Card

| Task               | Backend Location                              | Frontend Location                               |
| ------------------ | --------------------------------------------- | ----------------------------------------------- |
| Add entity type    | `domain/<mod>/entities/`                      | `domain/<mod>/entities/`                        |
| Add DB model       | `prisma/schema.prisma`                        | —                                               |
| Add validation     | `application/<mod>/dto/`                      | Zod in form dialog                              |
| Add business logic | `application/<mod>/use-cases/`                | —                                               |
| Add DB queries     | `infrastructure/<mod>/database/repositories/` | —                                               |
| Add API endpoint   | `presentation/<mod>/controllers/`             | —                                               |
| Add API client     | —                                             | `infrastructure/<mod>/api/`                     |
| Add UI page        | —                                             | `app/(authenticated)/<route>/page.tsx`          |
| Add form           | —                                             | `presentation/components/<mod>/`                |
| Add permission     | `seeds/seed.ts` + `shared/constants/`         | `AppSidebar` + `PermissionGate`                 |
| Add navigation     | —                                             | `presentation/components/layout/AppSidebar.tsx` |

Last updated: September 2026

### ============================================================================================

### 10.1.8 Step-by-Step: Adding a New Backend Module

> **Example:** Adding a `Warehouse` module with CRUD operations.

#### Step 1: Define the Prisma Model

Edit `prisma/schema.prisma`:

```prisma

model Warehouse {
  id          String    @id @default(uuid()) @db.Uuid
  name        String    @db.VarChar(200)
  code        String    @unique @db.VarChar(20)
  location    String?   @db.VarChar(500)
  capacity    Float     @default(0)
  isActive    Boolean   @default(true) @map("is_active")
  kebeleId    String    @db.Uuid @map("kebele_id")
  kebele      Kebele    @relation(fields: [kebeleId], references: [id])
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")
  createdBy   String?   @db.Uuid @map("created_by")
  updatedBy   String?   @db.Uuid @map("updated_by")

  @@index([deletedAt])
  @@index([kebeleId])
  @@map("warehouses")
}

```

#### Run migration:

```bash

npx prisma migrate dev --name add_warehouse
npx prisma generate

```

#### Step 2: Define DI Tokens

Create or update `src/shared/constants/warehouse.constants.ts`:

```typescript
export const WAREHOUSE_TOKENS = {
  WAREHOUSE_REPOSITORY: Symbol("IWarehouseRepository"),
};
```

Export in `src/shared/constants/index.ts`.

#### Step 3: Domain Layer — Entity + Repository Interface

**`src/domain/warehouse/entities/warehouse.entity.ts`**

```typescript
export interface WarehouseEntity {
  id: string;
  name: string;
  code: string;
  location: string | null;
  capacity: number;
  isActive: boolean;
  kebeleId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface WarehouseResponseModel {
  id: string;
  name: string;
  code: string;
  location: string | null;
  capacity: number;
  isActive: boolean;
  kebele?: { id: string; name: string };
  createdAt: Date;
  updatedAt: Date;
}
```

**`src/domain/warehouse/entities/index.ts`**

```typescript
export * from "./warehouse.entity";
```

**`src/domain/warehouse/repositories/warehouse.repository.ts`**

```typescript
export interface IWarehouseRepository {
  findAll(query: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    search?: string;
    isActive?: boolean;
    kebeleId?: string;
  }): Promise<{ items: any[]; total: number }>;
  findById(id: string): Promise<any | null>;
  create(data: any, userId?: string): Promise<any>;
  update(id: string, data: any, userId?: string): Promise<any>;
  softDelete(id: string, userId?: string): Promise<void>;
  lookup(kebeleId?: string): Promise<any[]>;
}
```

**`src/domain/warehouse/repositories/index.ts`**

```typescript
export * from "./warehouse.repository";
```

#### Step 4: Application Layer — DTOs + Use Cases

**`src/application/warehouse/dto/warehouse.dto.ts`**

```typescript
import { z } from "zod";
import { PaginationQuerySchema } from "../../../shared/dto";

export const CreateWarehouseSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z.string().min(1, "Code is required").max(20),
  location: z.string().max(500).optional(),
  capacity: z.number().min(0).default(0),
  isActive: z.boolean().optional().default(true),
  kebeleId: z.string().uuid("Invalid kebele ID"),
});

export const UpdateWarehouseSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().min(1).max(20).optional(),
  location: z.string().max(500).optional(),
  capacity: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  kebeleId: z.string().uuid().optional(),
});

export const WarehouseQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
  kebeleId: z.string().uuid().optional(),
});

export type CreateWarehouseDto = z.infer<typeof CreateWarehouseSchema>;
export type UpdateWarehouseDto = z.infer<typeof UpdateWarehouseSchema>;
export type WarehouseQueryDto = z.infer<typeof WarehouseQuerySchema>;
```

**`src/application/warehouse/dto/index.ts`**

```typescript
export * from "./warehouse.dto";
```

**`src/application/warehouse/use-cases/warehouse.usecases.ts`**

```typescript
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { WAREHOUSE_TOKENS } from "../../../shared/constants";
import { REPOSITORY_TOKENS } from "../../../shared/constants";
import { PaginationUtil } from "../../../shared/utils";
import { IWarehouseRepository } from "../../../domain/warehouse/repositories";
import { IAuditRepository } from "../../../domain/rbac/repositories";
// import mapper
import { WarehouseMapper } from "../../../infrastructure/warehouse/database/entities";

@Injectable()
export class GetWarehousesUseCase {
  constructor(
    @Inject(WAREHOUSE_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly repo: IWarehouseRepository,
  ) {}

  async execute(query: any) {
    const { items, total } = await this.repo.findAll(query);
    return {
      items: WarehouseMapper.toResponseDtoList(items),
      meta: PaginationUtil.buildMeta(query.page, query.limit, total),
    };
  }
}

@Injectable()
export class GetWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly repo: IWarehouseRepository,
  ) {}

  async execute(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException("Warehouse not found");
    return WarehouseMapper.toResponseDto(item);
  }
}

@Injectable()
export class CreateWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly repo: IWarehouseRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(data: any, userId: string) {
    const warehouse = await this.repo.create(data, userId);
    await this.auditRepo.create({
      action: "WAREHOUSE_CREATED",
      entity: "Warehouse",
      entityId: warehouse.id,
      userId,
      newValues: data,
    });
    return WarehouseMapper.toResponseDto(warehouse);
  }
}

@Injectable()
export class UpdateWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly repo: IWarehouseRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, data: any, userId: string) {
    const old = await this.repo.findById(id);
    if (!old) throw new NotFoundException("Warehouse not found");
    const updated = await this.repo.update(id, data, userId);
    await this.auditRepo.create({
      action: "WAREHOUSE_UPDATED",
      entity: "Warehouse",
      entityId: id,
      userId,
      oldValues: old,
      newValues: data,
    });
    return WarehouseMapper.toResponseDto(updated);
  }
}

@Injectable()
export class DeleteWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly repo: IWarehouseRepository,
    @Inject(REPOSITORY_TOKENS.AUDIT_REPOSITORY)
    private readonly auditRepo: IAuditRepository,
  ) {}

  async execute(id: string, userId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException("Warehouse not found");
    await this.repo.softDelete(id, userId);
    await this.auditRepo.create({
      action: "WAREHOUSE_DELETED",
      entity: "Warehouse",
      entityId: id,
      userId,
    });
  }
}

@Injectable()
export class LookupWarehousesUseCase {
  constructor(
    @Inject(WAREHOUSE_TOKENS.WAREHOUSE_REPOSITORY)
    private readonly repo: IWarehouseRepository,
  ) {}

  async execute(kebeleId?: string) {
    return this.repo.lookup(kebeleId);
  }
}
```

**`src/application/warehouse/use-cases/index.ts`**

```typescript
export * from "./warehouse.usecases";
```

#### Step 5: Infrastructure Layer — Mapper + Repository Implementation

**`src/infrastructure/warehouse/database/entities/warehouse.orm-entity.ts`**

```typescript
export const WAREHOUSE_INCLUDE = {
  kebele: { select: { id: true, name: true } },
};

export class WarehouseMapper {
  static toResponseDto(warehouse: any) {
    return {
      id: warehouse.id,
      name: warehouse.name,
      code: warehouse.code,
      location: warehouse.location,
      capacity: warehouse.capacity,
      isActive: warehouse.isActive,
      kebele: warehouse.kebele
        ? { id: warehouse.kebele.id, name: warehouse.kebele.name }
        : undefined,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
    };
  }

  static toResponseDtoList(items: any[]) {
    return items.map((i) => WarehouseMapper.toResponseDto(i));
  }
}
```

**`src/infrastructure/warehouse/database/entities/index.ts`**

```typescript
export * from "./warehouse.orm-entity";
```

**`src/infrastructure/warehouse/database/repositories/warehouse.repository.impl.ts`**

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../rbac/database/prisma.service";
import { PaginationUtil } from "../../../../shared/utils";
import { IWarehouseRepository } from "../../../../domain/warehouse/repositories";
import { WAREHOUSE_INCLUDE } from "../entities";

@Injectable()
export class PrismaWarehouseRepository implements IWarehouseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const where: any = { ...this.prisma.softDeleteFilter() };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { code: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.kebeleId) where.kebeleId = query.kebeleId;

    const skip = PaginationUtil.calculateSkip(query.page, query.limit);
    const [items, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        where,
        include: WAREHOUSE_INCLUDE,
        orderBy: { [query.sortBy || "createdAt"]: query.sortOrder || "desc" },
        skip,
        take: query.limit,
      }),
      this.prisma.warehouse.count({ where }),
    ]);
    return { items, total };
  }

  async findById(id: string) {
    return this.prisma.warehouse.findFirst({
      where: { id, ...this.prisma.softDeleteFilter() },
      include: WAREHOUSE_INCLUDE,
    });
  }

  async create(data: any, userId?: string) {
    return this.prisma.warehouse.create({
      data: { ...data, ...this.prisma.auditCreate(userId) },
      include: WAREHOUSE_INCLUDE,
    });
  }

  async update(id: string, data: any, userId?: string) {
    return this.prisma.warehouse.update({
      where: { id },
      data: { ...data, ...this.prisma.auditUpdate(userId) },
      include: WAREHOUSE_INCLUDE,
    });
  }

  async softDelete(id: string, userId?: string) {
    await this.prisma.warehouse.update({
      where: { id },
      data: { ...this.prisma.softDelete(), ...this.prisma.auditUpdate(userId) },
    });
  }

  async lookup(kebeleId?: string) {
    return this.prisma.warehouse.findMany({
      where: {
        isActive: true,
        ...this.prisma.softDeleteFilter(),
        ...(kebeleId ? { kebeleId } : {}),
      },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    });
  }
}
```

**`src/infrastructure/warehouse/database/repositories/index.ts`**

```typescript
export * from "./warehouse.repository.impl";
```

**`src/infrastructure/warehouse/database/index.ts`**

```typescript
export * from "./entities";
export * from "./repositories";
```

#### Step 6: Presentation Layer — Controller + Module + Providers

**`src/presentation/warehouse/controllers/warehouse.controller.ts`**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Permissions, CurrentUser } from "../../rbac/decorators";
import { ZodValidationPipe } from "../../../shared/pipes";
import { ICurrentUser } from "../../../shared/interfaces";
import {
  CreateWarehouseSchema,
  UpdateWarehouseSchema,
  WarehouseQuerySchema,
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseQueryDto,
} from "../../../application/warehouse/dto";
import {
  GetWarehousesUseCase,
  GetWarehouseUseCase,
  CreateWarehouseUseCase,
  UpdateWarehouseUseCase,
  DeleteWarehouseUseCase,
  LookupWarehousesUseCase,
} from "../../../application/warehouse/use-cases";

@ApiTags("Warehouses")
@Controller("warehouses")
export class WarehouseController {
  constructor(
    private readonly getWarehouses: GetWarehousesUseCase,
    private readonly getWarehouse: GetWarehouseUseCase,
    private readonly createWarehouse: CreateWarehouseUseCase,
    private readonly updateWarehouse: UpdateWarehouseUseCase,
    private readonly deleteWarehouse: DeleteWarehouseUseCase,
    private readonly lookupWarehouses: LookupWarehousesUseCase,
  ) {}

  @Get()
  @Permissions("warehouse:read")
  findAll(
    @Query(new ZodValidationPipe(WarehouseQuerySchema))
    query: WarehouseQueryDto,
  ) {
    return this.getWarehouses.execute(query);
  }

  @Get("lookup")
  @Permissions("warehouse:read")
  lookup(@Query("kebeleId") kebeleId?: string) {
    return this.lookupWarehouses.execute(kebeleId);
  }

  @Get(":id")
  @Permissions("warehouse:read")
  findOne(@Param("id") id: string) {
    return this.getWarehouse.execute(id);
  }

  @Post()
  @Permissions("warehouse:create")
  create(
    @Body(new ZodValidationPipe(CreateWarehouseSchema)) dto: CreateWarehouseDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.createWarehouse.execute(dto, user.id);
  }

  @Put(":id")
  @Permissions("warehouse:update")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateWarehouseSchema)) dto: UpdateWarehouseDto,
    @CurrentUser() user: ICurrentUser,
  ) {
    return this.updateWarehouse.execute(id, dto, user.id);
  }

  @Delete(":id")
  @Permissions("warehouse:delete")
  remove(@Param("id") id: string, @CurrentUser() user: ICurrentUser) {
    return this.deleteWarehouse.execute(id, user.id);
  }
}
```

**`src/presentation/warehouse/controllers/index.ts`**

```typescript
export * from "./warehouse.controller";
```

**`src/presentation/warehouse/providers/warehouse.providers.ts`**

```typescript
import { Provider } from "@nestjs/common";
import { WAREHOUSE_TOKENS, REPOSITORY_TOKENS } from "../../../shared/constants";
import { PrismaWarehouseRepository } from "../../../infrastructure/warehouse/database/repositories";
import { PrismaAuditRepository } from "../../../infrastructure/rbac/database/repositories";
import {
  GetWarehousesUseCase,
  GetWarehouseUseCase,
  CreateWarehouseUseCase,
  UpdateWarehouseUseCase,
  DeleteWarehouseUseCase,
  LookupWarehousesUseCase,
} from "../../../application/warehouse/use-cases";

export const repositoryProviders: Provider[] = [
  {
    provide: WAREHOUSE_TOKENS.WAREHOUSE_REPOSITORY,
    useClass: PrismaWarehouseRepository,
  },
  {
    provide: REPOSITORY_TOKENS.AUDIT_REPOSITORY,
    useClass: PrismaAuditRepository,
  },
];

export const useCaseProviders: Provider[] = [
  GetWarehousesUseCase,
  GetWarehouseUseCase,
  CreateWarehouseUseCase,
  UpdateWarehouseUseCase,
  DeleteWarehouseUseCase,
  LookupWarehousesUseCase,
];
```

**`src/presentation/warehouse/warehouse.module.ts`**

```typescript
import { Module } from "@nestjs/common";
import { WarehouseController } from "./controllers";
import {
  repositoryProviders,
  useCaseProviders,
} from "./providers/warehouse.providers";

@Module({
  controllers: [WarehouseController],
  providers: [...repositoryProviders, ...useCaseProviders],
  exports: [...repositoryProviders],
})
export class WarehouseModule {}
```

#### Step 7: Register the Module

In `src/app.module.ts`, add the import:

```typescript
import { WarehouseModule } from './presentation/warehouse/warehouse.module';

@Module({
  imports: [
    // ... existing modules
    WarehouseModule,
  ],
  // ...
})

```

#### Step 8: Seed Permissions

In `prisma/seeds/seed.ts`, add `warehouse` permissions:

```typescript

{ module: 'warehouse', action: 'create' },
{ module: 'warehouse', action: 'read' },
{ module: 'warehouse', action: 'update' },
{ module: 'warehouse', action: 'delete' },
{ module: 'warehouse', action: 'export' },
{ module: 'warehouse', action: 'manage' },

```

Re-run seeds: `npx ts-node prisma/seeds/seed.ts`

#### Backend Module Checklist

```

✅ prisma/schema.prisma          — Model defined, migration run
✅ shared/constants/             — DI tokens
✅ domain/warehouse/entities/     — Entity + Response interfaces
✅ domain/warehouse/repositories/ — Repository interface
✅ application/warehouse/dto/     — Zod schemas + types
✅ application/warehouse/use-cases/ — 6 use case classes
✅ infrastructure/warehouse/database/entities/     — ORM mapper
✅ infrastructure/warehouse/database/repositories/ — Prisma impl
✅ presentation/warehouse/controllers/  — HTTP controller
✅ presentation/warehouse/providers/    — DI bindings
✅ presentation/warehouse/warehouse.module.ts — Module
✅ app.module.ts                 — Module imported
✅ Seeds                         — Permissions created

- If Docker virtualization issue occur

Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -All

bcdedit /set hypervisorlaunchtype auto