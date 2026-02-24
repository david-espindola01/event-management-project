FROM postgres:16-alpine

ENV POSTGRES_DB=gestor_eventos
ENV POSTGRES_USER=postgres

# schema.sql runs automatically on first container start
COPY schema.sql /docker-entrypoint-initdb.d/01_schema.sql

EXPOSE 5432