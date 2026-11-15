# S13 Training Camps

A self-contained student training website that runs as one Docker container.

## Single-container architecture

The `app` container provides everything:

- Responsive HTML, CSS, and JavaScript website
- Course catalog API
- Student registration and login API
- Enrollment API
- File-based demo persistence through the `app-data` Docker volume

The application uses only the Node.js standard library and has no package dependencies. CI tags the image with the last four characters of the Git commit SHA; local builds use `latest` when `IMAGE_TAG` is not set.

## Tools used

- HTML5, CSS3, and vanilla JavaScript
- Node.js 22
- Docker and Docker Compose
- Forgejo Actions
- Git and curl

## Run

```bash
docker compose up --build -d
```

Open <http://localhost:8080>.

## Verify

```bash
docker compose ps
curl http://localhost:8080/health
curl http://localhost:8080/api/courses
```

## Stop

```bash
docker compose down
```

Use `docker compose down -v` only when you intentionally want to delete saved demo users and enrollments.

## CI/CD

`.github/workflows/deploy-s13-training-camps.yml` builds the single image, takes the existing stack down, starts the new container with `--force-recreate`, and verifies its health. No repository variables or secrets are required for this student demo.
