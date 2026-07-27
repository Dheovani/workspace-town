# Banco de dados

Este documento descreve a configuração inicial de banco do Workspace Town para desenvolvimento local.

## Banco local

O repositório possui um `docker-compose.yml` na raiz com um serviço PostgreSQL local:

```txt
host: localhost
port: 5432
database: workspace_town
user: workspace_town
password: workspace_town
```

A URL de desenvolvimento correspondente é:

```env
DATABASE_URL=postgresql://workspace_town:workspace_town@localhost:5432/workspace_town
```

Essa configuração é destinada apenas ao ambiente local.

## Comandos

Subir o banco:

```bash
bun run db:up
```

Esse comando requer Docker Desktop ou outro Docker engine ativo.

Parar o banco:

```bash
bun run db:down
```

Ver logs do banco:

```bash
bun run db:logs
```

Gerar migrations a partir do schema Drizzle:

```bash
cd apps/web
bun run db:generate
```

Aplicar migrations:

```bash
cd apps/web
bun run db:migrate
```

A migration inicial foi validada nesse ambiente local e cria 22 tabelas públicas, incluindo as tabelas de autenticação e dos domínios iniciais.

Abrir o Drizzle Studio:

```bash
cd apps/web
bun run db:studio
```

## Schema atual

O schema inicial fica em:

```txt
apps/web/db/schema.ts
```

As migrations ficam em:

```txt
apps/web/drizzle/
```

## Cliente server-side

O cliente em `apps/web/db/client.ts` usa `postgres` com `drizzle-orm/postgres-js`. Essa configuração aceita a URL TCP do PostgreSQL local e URLs PostgreSQL da Neon.

O driver HTTP de `@neondatabase/serverless` não é usado pelo cliente atual porque não conecta diretamente ao PostgreSQL local do Docker Compose. A dependência permanece instalada enquanto as necessidades de deploy são avaliadas.

O schema atual inclui tabelas para:

- autenticação do `better-auth`;
- usuários e players do domínio;
- workspaces, membros, salas e configurações;
- definições de itens e objetos posicionados;
- mensagens de chat;
- sessões de chamada e participantes;
- templates e sessões de reunião;
- notas, action items e cards de retrospectiva.

## Regras de persistência

Dados persistentes, como workspaces, salas, objetos colocados e reuniões, pertencem ao PostgreSQL.

Dados efêmeros, como posição atual do avatar, presença online e movimento contínuo, não devem ser gravados continuamente no PostgreSQL. No MVP, esses dados permanecem locais. No futuro, devem ser tratados por um serviço realtime.

## Autenticação

O `better-auth` usa o banco configurado em `DATABASE_URL`. Para testar cadastro e login reais em desenvolvimento:

1. copie `apps/web/.env.example` para `apps/web/.env.local`;
2. substitua `BETTER_AUTH_SECRET` por um valor local longo;
3. suba o PostgreSQL com `bun run db:up`;
4. aplique as migrations com `bun run db:migrate`;
5. rode o app web e teste `/auth/register` e `/auth/login`.

O fluxo de cadastro, login, leitura de sessão em rota protegida e logout foi validado contra o PostgreSQL local.
