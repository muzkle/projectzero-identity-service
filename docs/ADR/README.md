# ADR-001: Multi-repo architecture

Each microservice lives in its own repository (directory). Shared contracts via `@projectzero/contracts`.

# ADR-002: TypeORM + PostgreSQL

All services use TypeORM with dedicated PostgreSQL database per service.

# ADR-003: BullMQ for async events

Redis + BullMQ for cross-service events (MVP). Kafka deferred.
