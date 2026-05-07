# MediRDV — Gestion des Rendez-vous Médicaux

Système de gestion de rendez-vous médicaux complet avec Spring Boot, React et MySQL.

## Architecture

```
walid-java-projet/
├── backend/          # Spring Boot REST API
│   ├── src/
│   │   └── main/java/com/medical/appointment/
│   │       ├── config/       # Security, CORS, Swagger
│   │       ├── controller/   # REST endpoints
│   │       ├── dto/          # Request/Response DTOs
│   │       ├── entity/       # JPA entities + enums
│   │       ├── exception/    # Global error handling
│   │       ├── repository/   # Spring Data JPA
│   │       ├── security/     # JWT provider & filter
│   │       └── service/      # Business logic
│   ├── Dockerfile
│   └── pom.xml
├── frontend/         # React SPA
│   ├── src/
│   │   ├── api/      # Axios instance
│   │   ├── components/
│   │   ├── context/  # Auth context
│   │   └── pages/    # Patient / Doctor / Agent / Admin
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

## Démarrage rapide (Docker)

```bash
# Cloner le projet
git clone <repo-url>
cd walid-java-projet

# Démarrer tous les services
docker-compose up --build

# L'application démarre sur :
# Frontend  → http://localhost:3000
# Backend   → http://localhost:8080
# Swagger   → http://localhost:8080/swagger-ui.html
```

## Développement local

### Prérequis
- Java 17+
- Maven 3.9+
- Node.js 20+
- MySQL 8.0+

### Backend

```bash
cd backend

# Créer la base de données MySQL
mysql -u root -p -e "CREATE DATABASE medical_db;"

# Lancer
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Comptes de test (chargés automatiquement)

| Rôle        | Username   | Mot de passe |
|-------------|------------|--------------|
| Super Admin | admin      | admin123     |
| Agent       | agent1     | agent123     |
| Médecin     | dr.benali  | doctor123    |
| Médecin     | dr.zahra   | doctor123    |
| Patient     | patient1   | patient123   |
| Patient     | patient2   | patient123   |

## API REST — Endpoints principaux

| Méthode | URL                                    | Accès          |
|---------|----------------------------------------|----------------|
| POST    | /api/auth/login                        | Public         |
| POST    | /api/auth/register                     | Public         |
| GET     | /api/patients/profile                  | PATIENT        |
| PUT     | /api/patients/profile                  | PATIENT        |
| GET     | /api/patients/appointments             | PATIENT        |
| GET     | /api/doctors                           | Tous           |
| GET     | /api/doctors/appointments              | MEDECIN        |
| PUT     | /api/doctors/appointments/{id}/status  | MEDECIN        |
| POST    | /api/doctors/availability              | MEDECIN        |
| POST    | /api/appointments                      | PATIENT/AGENT  |
| PUT     | /api/appointments/{id}/cancel          | Authentifié    |
| GET     | /api/agent/appointments                | AGENT          |
| GET     | /api/agent/patients                    | AGENT          |
| GET     | /api/admin/stats                       | SUPER_ADMIN    |
| GET     | /api/admin/users                       | SUPER_ADMIN    |

Documentation complète : `http://localhost:8080/swagger-ui.html`

## Technologies

| Couche      | Technologie               |
|-------------|---------------------------|
| Backend     | Spring Boot 3.2, Java 17  |
| Sécurité    | Spring Security + JWT     |
| ORM         | Spring Data JPA/Hibernate |
| Base        | MySQL 8.0                 |
| Frontend    | React 18, React Router v6 |
| UI          | Bootstrap 5               |
| HTTP client | Axios                     |
| Docs API    | Swagger / OpenAPI 3       |
| Docker      | Docker Compose            |

## Variables d'environnement

Voir `.env` pour la configuration complète.

| Variable         | Description              | Défaut              |
|------------------|--------------------------|---------------------|
| DB_HOST          | Hôte MySQL               | db (Docker)         |
| DB_NAME          | Nom de la base           | medical_db          |
| DB_USER          | Utilisateur DB           | medical_user        |
| DB_PASSWORD      | Mot de passe DB          | medical_pass123     |
| JWT_SECRET       | Clé secrète JWT (≥32 c.) | voir .env           |
| JWT_EXPIRATION   | Durée token (ms)         | 86400000 (24h)      |
| BACKEND_PORT     | Port backend             | 8080                |
| FRONTEND_PORT    | Port frontend            | 3000                |
