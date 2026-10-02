# Security Policy - ManganeseAI (SIH26009)

## Overview
ManganeseAI is developed for Smart India Hackathon 2026 Problem Statement SIH26009 (Ministry of Steel / MOIL Ltd.).
This document describes the security protocols, credential management, and best practices implemented in the platform.

## Secret Handling & Environment Variables
1. **Never Commit Secrets**: No API keys, database passwords, or JWT secrets are stored in Git history or source files.
2. **Environment Variables**:
   - `GEMINI_API_KEY`: Server-side only access via `process.env.GEMINI_API_KEY`. Never exposed to client bundles or browser responses.
   - `JWT_SECRET`: Used for cryptographic signing and verification of authentication tokens.
   - `DATABASE_URL`: Production connection string.
3. **Frontend Isolation**: Browser bundles do not import or access private API keys. All AI queries and calculations go through authenticated backend Express proxy routes (`/api/*`).

## Authentication & Authorization
- **Passwords**: Hashed with `bcryptjs` using a minimum salt factor of 10.
- **JWT**: Industry standard JSON Web Tokens with expiration timestamps.
- **Role-Based Access Control**: Mining engineers, geologists, mine planners, and production supervisors have role-defined access.

## Data Processing & Disclaimer
- Remote sensing and satellite analysis data is presented with clear labeling (`SIMULATED SATELLITE DATA` / `DEMO REMOTE-SENSING DATA`).
- AI/ML predictions are formulated as **Potential Zones** and **Model Estimates**, not confirmed mineral reserves, maintaining geological compliance.
