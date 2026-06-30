# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Yes              |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub Issues.**

If you discover a security vulnerability in this project, please report it by:

1. **Email:** Send details to the project maintainer via GitHub profile.
2. **Include the following in your report:**
   - A description of the vulnerability and its potential impact.
   - Steps to reproduce the issue.
   - Any proof-of-concept code or screenshots.

You can expect:
- An acknowledgement within **48 hours**.
- A fix or patch within **7 days** for confirmed critical vulnerabilities.
- Credit in the CHANGELOG if you choose to be acknowledged.

## Security Architecture

This application implements the following security measures:

- **Authentication:** Stateless JWT (HS256) with a configurable expiration (default: 24h).
- **Password Storage:** BCrypt hashing (strength 10) — passwords are never stored in plain text.
- **Role-Based Access Control:** Spring Security protects endpoints at the filter level.
- **Input Validation:** All API request payloads are validated using Jakarta Bean Validation.
- **CORS:** Configured to allow only the trusted Angular frontend origin (`localhost:4200` in dev).
- **No Secrets in Code:** JWT secrets should be provided via environment variables in production.

## Known Limitations (For Portfolo/Demo Purposes)

- The JWT secret in `application.properties` is a **development-only** placeholder.
  In production, it must be injected via `APP_JWT_SECRET` environment variable.
- The H2 in-memory database resets on restart. No persistent storage is provided by default.
- JWT refresh tokens are not yet implemented (planned for v1.1).
