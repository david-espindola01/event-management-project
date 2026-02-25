FROM postgres:16-alpine

ENV POSTGRES_DB=gestor_eventos
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=admin

COPY schema.sql /docker-entrypoint-initdb.d/01_schema.sql

EXPOSE 5432