CREATE DATABASE IF NOT EXISTS expense_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE expense_tracker;
-- Spring Data JPA creates/updates tables using application.properties (ddl-auto=update).
-- This file intentionally creates only the database so it can be used before starting Spring Boot.
