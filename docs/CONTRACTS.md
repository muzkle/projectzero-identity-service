# Dependência @projectzero/contracts

Este serviço consome o pacote privado `@projectzero/contracts` do GitHub Packages.

## Local

```powershell
$env:NODE_AUTH_TOKEN = "ghp_xxxx"   # PAT com read:packages
npm ci
```

Alternativa em monorepo local: `npm link` a partir de `projectzero-contracts`.

## CI / Railway

Adicione o secret **`NODE_AUTH_TOKEN`** (PAT com `read:packages`) no GitHub e no Railway (variável de build).

Dockerfile usa `ARG NODE_AUTH_TOKEN` — configure no Railway em **Build → Build Arguments**.
