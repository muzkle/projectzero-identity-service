# Dependência @muzkle/contracts

Este serviço consome o pacote privado `@muzkle/contracts` do GitHub Packages (conta **muzkle**).

## Local

```powershell
$env:NODE_AUTH_TOKEN = "ghp_xxxx"
npm ci
```

Alternativa em monorepo local: `npm link` a partir de `projectzero-contracts`.

## CI / Railway

Secret **`NODE_AUTH_TOKEN`** (PAT com `read:packages`) no GitHub e no Railway.
