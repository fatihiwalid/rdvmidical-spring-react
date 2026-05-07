# MediRDV — Système de Gestion des Rendez-vous Médicaux

> Projet universitaire — Application web full-stack de gestion de rendez-vous médicaux
> développée avec Spring Boot 3, React 18 et MySQL 8, conteneurisée via Docker Compose.

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Objectifs pédagogiques](#2-objectifs-pédagogiques)
3. [Fonctionnalités par rôle](#3-fonctionnalités-par-rôle)
4. [Architecture générale](#4-architecture-générale)
5. [Modèle de données](#5-modèle-de-données)
6. [Sécurité et authentification JWT](#6-sécurité-et-authentification-jwt)
7. [Structure du projet](#7-structure-du-projet)
8. [Technologies utilisées](#8-technologies-utilisées)
9. [API REST — Référence complète](#9-api-rest--référence-complète)
10. [Interface frontend — Pages par rôle](#10-interface-frontend--pages-par-rôle)
11. [Démarrage rapide (Docker)](#11-démarrage-rapide-docker)
12. [Développement local (sans Docker)](#12-développement-local-sans-docker)
13. [Variables d'environnement](#13-variables-denvironnement)
14. [Comptes de test](#14-comptes-de-test)
15. [Infrastructure Docker](#15-infrastructure-docker)

---

## 1. Présentation du projet

**MediRDV** est une application web complète de gestion de rendez-vous médicaux. Elle permet à des patients de réserver des consultations auprès de médecins, à des agents de secrétariat de gérer les rendez-vous au nom des patients, aux médecins de gérer leur agenda et leurs disponibilités, et à un administrateur de superviser l'ensemble du système.

L'application est construite sur une architecture **client-serveur découplée** :

- Le **backend** expose une API REST sécurisée par JWT, développée avec Spring Boot 3.
- Le **frontend** est une Single Page Application (SPA) développée avec React 18.
- La **base de données** est MySQL 8, gérée via Spring Data JPA / Hibernate.
- L'ensemble est orchestré par **Docker Compose** pour un déploiement en un seul commande.

---

## 2. Objectifs pédagogiques

Ce projet couvre les compétences suivantes :

| Domaine | Compétences démontrées |
|---|---|
| **Java / Spring Boot** | API REST, injection de dépendances, JPA/Hibernate, validation Bean |
| **Sécurité** | Spring Security, authentification JWT stateless, RBAC (contrôle d'accès par rôle) |
| **Base de données** | Modélisation relationnelle, relations JPA (OneToOne, ManyToOne), requêtes JPQL |
| **React** | Composants fonctionnels, hooks (useState, useEffect, useContext), React Router v6 |
| **Architecture** | Séparation en couches (Controller → Service → Repository), pattern DTO |
| **DevOps** | Docker, Docker Compose, multi-stage builds, Nginx, healthchecks |
| **API Design** | RESTful endpoints, OpenAPI 3 / Swagger, gestion globale des erreurs |

---

## 3. Fonctionnalités par rôle

Le système définit **4 rôles** avec des accès strictement cloisonnés.

### Patient
- Créer un compte et se connecter
- Consulter la liste des médecins disponibles avec leurs spécialités et tarifs
- Prendre un rendez-vous avec un médecin en choisissant date et heure
- Consulter l'historique de ses rendez-vous avec leur statut
- Annuler un rendez-vous en attente ou confirmé
- Modifier son profil (coordonnées, date de naissance, groupe sanguin, antécédents médicaux)

### Médecin (MEDECIN)
- Consulter son tableau de bord avec les statistiques de ses rendez-vous
- Gérer ses disponibilités hebdomadaires (jours, plages horaires)
- Voir tous ses rendez-vous planifiés
- Confirmer ou rejeter un rendez-vous en attente
- Marquer un rendez-vous comme terminé (COMPLETED)
- Modifier son profil professionnel (spécialité, biographie, honoraires)

### Agent de secrétariat (AGENT)
- Accéder à la liste complète des patients enregistrés
- Créer un rendez-vous au nom d'un patient
- Consulter et gérer tous les rendez-vous
- Servir d'intermédiaire entre patients et médecins

### Super Administrateur (SUPER_ADMIN)
- Tableau de bord avec statistiques globales (utilisateurs, rendez-vous, médecins, patients)
- Liste et gestion de tous les utilisateurs
- Vue d'ensemble de tous les rendez-vous du système
- Accès complet en lecture à toutes les données

---

## 4. Architecture générale

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React SPA)                       │
│   Browser → http://localhost:3000                               │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Patient  │  │ Médecin  │  │  Agent   │  │    Admin     │   │
│  │  Pages   │  │  Pages   │  │  Pages   │  │    Pages     │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│        │              │             │               │           │
│        └──────────────┴─────────────┴───────────────┘          │
│                              │                                  │
│                     AuthContext + Axios                         │
│                    (JWT Bearer Token)                           │
└──────────────────────────────┼──────────────────────────────────┘
                               │ HTTP/JSON
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Spring Boot 3)                       │
│   http://localhost:8080                                         │
│                                                                 │
│  JwtAuthenticationFilter → SecurityConfig → Controllers        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      Controllers                        │   │
│  │  AuthController  PatientController  DoctorController    │   │
│  │  AppointmentController  AgentController  AdminController│   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                       Services                          │   │
│  │  AuthService  PatientService  DoctorService             │   │
│  │  AppointmentService  AdminService                       │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │                     Repositories                        │   │
│  │  UserRepo  PatientRepo  DoctorRepo  AppointmentRepo     │   │
│  │  AvailabilityRepo  MedicalRecordRepo                    │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────┘
                               │ JDBC / JPA
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MySQL 8.0 Database                          │
│   Tables: users, patients, doctors, appointments,               │
│           availabilities, medical_records                       │
└─────────────────────────────────────────────────────────────────┘
```

### Pattern en couches (Layered Architecture)

```
HTTP Request
     │
     ▼
[ Controller ]   ← reçoit la requête, délègue au service, retourne DTO
     │
     ▼
[  Service   ]   ← logique métier, orchestration, validation
     │
     ▼
[ Repository ]   ← accès données via Spring Data JPA
     │
     ▼
[  Database  ]   ← MySQL via Hibernate
```

---

## 5. Modèle de données

### Entités JPA

#### `User` — Utilisateur (table `users`)
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Long | PK, Auto | Identifiant unique |
| firstName | String | NOT NULL | Prénom |
| lastName | String | NOT NULL | Nom de famille |
| username | String | UNIQUE, NOT NULL | Identifiant de connexion |
| email | String | UNIQUE, NOT NULL | Adresse e-mail |
| password | String | NOT NULL | Mot de passe haché (BCrypt) |
| phone | String | — | Numéro de téléphone |
| role | RoleType | NOT NULL | Enum : PATIENT, MEDECIN, AGENT, SUPER_ADMIN |
| enabled | boolean | NOT NULL | Compte actif ou désactivé |
| createdAt | LocalDateTime | Auto | Date de création |
| updatedAt | LocalDateTime | Auto | Date de mise à jour |

#### `Patient` — Profil patient (table `patients`)
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Long | PK, Auto | Identifiant |
| user | User | FK, OneToOne | Référence vers `users` |
| dateOfBirth | LocalDate | — | Date de naissance |
| bloodType | String | — | Groupe sanguin (A+, O-, etc.) |
| address | String | — | Adresse postale |
| medicalHistory | String (1000) | — | Antécédents médicaux |

#### `Doctor` — Profil médecin (table `doctors`)
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Long | PK, Auto | Identifiant |
| user | User | FK, OneToOne | Référence vers `users` |
| specialization | String | NOT NULL | Spécialité médicale |
| licenseNumber | String | — | Numéro de licence médicale |
| consultationFee | Double | — | Tarif de consultation (MAD) |
| bio | String (500) | — | Biographie professionnelle |
| available | boolean | NOT NULL | Médecin accepte des RDV |

#### `Appointment` — Rendez-vous (table `appointments`)
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Long | PK, Auto | Identifiant |
| patient | Patient | FK, ManyToOne | Patient concerné |
| doctor | Doctor | FK, ManyToOne | Médecin consulté |
| appointmentDate | LocalDate | NOT NULL | Date du RDV |
| startTime | LocalTime | — | Heure de début |
| endTime | LocalTime | — | Heure de fin |
| status | AppointmentStatus | NOT NULL | Statut (voir enum) |
| reason | String | — | Motif de la consultation |
| notes | String (1000) | — | Notes du médecin |
| createdBy | User | FK | Utilisateur ayant créé le RDV |
| createdAt | LocalDateTime | Auto | Date de création |

#### `Availability` — Disponibilités médecin (table `availabilities`)
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Long | PK, Auto | Identifiant |
| doctor | Doctor | FK, ManyToOne | Médecin propriétaire |
| dayOfWeek | DayOfWeek | NOT NULL | Jour de la semaine (Enum Java) |
| startTime | LocalTime | NOT NULL | Heure de début |
| endTime | LocalTime | NOT NULL | Heure de fin |
| available | boolean | NOT NULL | Créneau actif |

### Énumérations

#### `AppointmentStatus`
```
PENDING    → En attente de confirmation par le médecin
CONFIRMED  → Confirmé par le médecin
REJECTED   → Refusé par le médecin
CANCELLED  → Annulé par le patient ou l'agent
COMPLETED  → Consultation terminée
```

#### `RoleType`
```
PATIENT     → Patient enregistré
MEDECIN     → Médecin praticien
AGENT       → Agent de secrétariat médical
SUPER_ADMIN → Administrateur système
```

### Diagramme des relations

```
User ──OneToOne──► Patient
User ──OneToOne──► Doctor
Doctor ──OneToMany──► Availability
Patient ──ManyToOne──► Appointment ◄──ManyToOne── Doctor
User ──ManyToOne──► Appointment (createdBy)
```

---

## 6. Sécurité et authentification JWT

### Flux d'authentification

```
Client                          Backend
  │                                │
  │─── POST /api/auth/login ──────►│
  │    { username, password }      │
  │                                │ Vérifie credentials
  │                                │ Génère JWT (JJWT 0.12.3)
  │◄── { token, role, ... } ───────│
  │                                │
  │  [Stockage token localStorage] │
  │                                │
  │─── GET /api/patients/profile ─►│
  │    Authorization: Bearer <JWT> │ JwtAuthenticationFilter
  │                                │ valide la signature
  │                                │ extrait username + rôle
  │◄── { profil patient } ─────────│
```

### Composants de sécurité

| Classe | Rôle |
|---|---|
| `JwtTokenProvider` | Génère, signe et valide les tokens JWT (HMAC-SHA256) |
| `JwtAuthenticationFilter` | Filtre HTTP qui intercepte chaque requête et extrait le JWT |
| `UserDetailsServiceImpl` | Charge l'utilisateur depuis la BDD pour Spring Security |
| `SecurityConfig` | Configure la filter chain, les routes publiques/protégées, stateless session |
| `CorsConfig` | Autorise les requêtes cross-origin du frontend (localhost:3000) |

### Règles d'accès

```
Public (aucune authentification) :
  POST /api/auth/login
  POST /api/auth/register

Authentifié (token valide requis) :
  PUT /api/appointments/{id}/cancel

Rôle PATIENT uniquement :
  /api/patients/**

Rôle MEDECIN uniquement :
  /api/doctors/appointments
  /api/doctors/availability
  /api/doctors/profile

Rôle AGENT uniquement :
  /api/agent/**

Rôle SUPER_ADMIN uniquement :
  /api/admin/**
```

### Token JWT — Structure

```
Header  : { "alg": "HS256", "typ": "JWT" }
Payload : { "sub": "username", "role": "PATIENT", "iat": ..., "exp": ... }
Signature : HMAC-SHA256(base64(header) + "." + base64(payload), secret)
```

Durée de validité configurable via `JWT_EXPIRATION` (défaut : 86400000 ms = 24h).

---

## 7. Structure du projet

```
walid-java-projet/
│
├── backend/                          # Application Spring Boot
│   ├── Dockerfile                    # Multi-stage build (Maven + JRE)
│   ├── pom.xml                       # Dépendances Maven
│   └── src/main/java/com/medical/appointment/
│       ├── MedicalAppointmentApplication.java   # Point d'entrée Spring Boot
│       │
│       ├── component/
│       │   └── DataInitializer.java  # Initialisation BDD au démarrage (CommandLineRunner)
│       │
│       ├── config/
│       │   ├── CorsConfig.java       # Configuration CORS (autorise frontend)
│       │   ├── SecurityConfig.java   # Filter chain Spring Security
│       │   └── SwaggerConfig.java    # Configuration OpenAPI / Swagger UI
│       │
│       ├── controller/
│       │   ├── AuthController.java       # POST /api/auth/login|register
│       │   ├── PatientController.java    # GET|PUT /api/patients/**
│       │   ├── DoctorController.java     # GET /api/doctors, gestion agenda
│       │   ├── AppointmentController.java # POST|PUT /api/appointments/**
│       │   ├── AgentController.java      # GET /api/agent/**
│       │   └── AdminController.java      # GET /api/admin/**
│       │
│       ├── dto/
│       │   ├── request/
│       │   │   ├── LoginRequest.java         # { username, password }
│       │   │   ├── RegisterRequest.java      # Données d'inscription
│       │   │   ├── AppointmentRequest.java   # Création de RDV
│       │   │   ├── AvailabilityRequest.java  # Plage de disponibilité
│       │   │   └── UpdateProfileRequest.java # Mise à jour profil
│       │   └── response/
│       │       ├── AuthResponse.java    # { token, id, username, role, ... }
│       │       ├── AppointmentDTO.java  # RDV sérialisé
│       │       ├── DoctorDTO.java       # Médecin sérialisé
│       │       ├── PatientDTO.java      # Patient sérialisé
│       │       ├── StatsDTO.java        # Statistiques admin
│       │       └── UserDTO.java         # Utilisateur sérialisé
│       │
│       ├── entity/
│       │   ├── User.java               # Entité utilisateur (table users)
│       │   ├── Patient.java            # Entité patient (table patients)
│       │   ├── Doctor.java             # Entité médecin (table doctors)
│       │   ├── Appointment.java        # Entité rendez-vous (table appointments)
│       │   ├── Availability.java       # Entité disponibilité (table availabilities)
│       │   ├── MedicalRecord.java      # Entité dossier médical
│       │   ├── AppointmentStatus.java  # Enum : PENDING|CONFIRMED|REJECTED|CANCELLED|COMPLETED
│       │   └── RoleType.java           # Enum : PATIENT|MEDECIN|AGENT|SUPER_ADMIN
│       │
│       ├── exception/
│       │   ├── BadRequestException.java       # HTTP 400
│       │   ├── ResourceNotFoundException.java # HTTP 404
│       │   └── GlobalExceptionHandler.java    # @ControllerAdvice — réponses d'erreur uniformes
│       │
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── PatientRepository.java
│       │   ├── DoctorRepository.java
│       │   ├── AppointmentRepository.java
│       │   ├── AvailabilityRepository.java
│       │   └── MedicalRecordRepository.java
│       │
│       ├── security/
│       │   ├── JwtTokenProvider.java          # Génération et validation des tokens JWT
│       │   ├── JwtAuthenticationFilter.java   # Filtre HTTP — extraction du token
│       │   └── UserDetailsServiceImpl.java    # Chargement utilisateur pour Spring Security
│       │
│       └── service/
│           ├── AuthService.java         # Inscription, connexion, génération JWT
│           ├── PatientService.java      # Gestion profil patient, RDV patient
│           ├── DoctorService.java       # Gestion profil médecin, agenda, disponibilités
│           ├── AppointmentService.java  # Création, annulation, changement statut RDV
│           └── AdminService.java        # Statistiques globales, gestion utilisateurs
│
├── frontend/                         # Application React
│   ├── Dockerfile                    # Build React + Nginx
│   ├── nginx.conf                    # Reverse proxy et SPA fallback
│   └── src/
│       ├── index.js                  # Point d'entrée React
│       ├── index.css                 # Styles globaux
│       ├── App.js                    # Routeur principal (BrowserRouter + Routes)
│       │
│       ├── api/
│       │   └── axios.js              # Instance Axios configurée (baseURL + intercepteur JWT)
│       │
│       ├── context/
│       │   └── AuthContext.js        # Contexte React — état utilisateur, login/logout
│       │
│       ├── components/
│       │   ├── Layout.js             # Mise en page globale (Sidebar + contenu)
│       │   ├── PrivateRoute.js       # Garde de route — vérifie rôle requis
│       │   ├── Sidebar.js            # Navigation latérale selon le rôle
│       │   └── StatusBadge.js        # Badge coloré pour statut de RDV
│       │
│       └── pages/
│           ├── Login.js              # Page de connexion
│           ├── Register.js           # Page d'inscription (champs dynamiques par rôle)
│           │
│           ├── patient/
│           │   ├── PatientDashboard.js   # Tableau de bord patient
│           │   ├── MyAppointments.js     # Liste des RDV + annulation
│           │   ├── BookAppointment.js    # Formulaire de réservation
│           │   ├── DoctorsList.js        # Annuaire des médecins
│           │   └── PatientProfile.js     # Modification du profil
│           │
│           ├── doctor/
│           │   ├── DoctorDashboard.js    # Tableau de bord médecin
│           │   ├── DoctorAppointments.js # Gestion des RDV (confirmer/rejeter/terminer)
│           │   ├── DoctorAvailability.js # Gestion des disponibilités hebdomadaires
│           │   └── DoctorProfile.js      # Modification du profil médecin
│           │
│           ├── agent/
│           │   └── AgentDashboard.js     # Tableau de bord agent (RDV + patients + réservation)
│           │
│           └── admin/
│               └── AdminDashboard.js     # Tableau de bord admin (stats + utilisateurs + RDV)
│
├── docker-compose.yml               # Orchestration 3 services : db, backend, frontend
├── .env                             # Variables d'environnement (secrets, ports)
└── README.md                        # Ce fichier
```

---

## 8. Technologies utilisées

### Backend

| Technologie | Version | Usage |
|---|---|---|
| Java | 17 (LTS) | Langage de programmation |
| Spring Boot | 3.2.0 | Framework application (IoC, auto-config) |
| Spring Web | 3.2.0 | Serveur HTTP, contrôleurs REST |
| Spring Security | 3.2.0 | Authentification, autorisation, filter chain |
| Spring Data JPA | 3.2.0 | ORM, repositories, requêtes JPQL |
| Hibernate | 6.x | Implémentation JPA, DDL auto-update |
| Spring Validation | 3.2.0 | Validation des DTOs (@NotBlank, @Email…) |
| MySQL Connector/J | 8.x | Driver JDBC pour MySQL |
| JJWT | 0.12.3 | Génération et validation tokens JWT |
| Lombok | 1.18.x | Réduction boilerplate (getters, builders, logs) |
| SpringDoc OpenAPI | 2.3.0 | Documentation Swagger UI automatique |
| Maven | 3.9+ | Gestionnaire de build et dépendances |

### Frontend

| Technologie | Version | Usage |
|---|---|---|
| React | 18.x | Framework UI (composants fonctionnels + hooks) |
| React Router DOM | v6 | Navigation SPA, routes protégées |
| Axios | 1.x | Client HTTP, intercepteurs JWT |
| Bootstrap | 5.x | Framework CSS responsive |
| Context API | React 18 | Gestion état global (authentification) |

### Infrastructure

| Technologie | Usage |
|---|---|
| Docker | Conteneurisation de chaque service |
| Docker Compose | Orchestration multi-conteneurs |
| Nginx | Serveur web pour le build React + proxy |
| MySQL 8.0 | Base de données relationnelle |

---

## 9. API REST — Référence complète

Base URL : `http://localhost:8080/api`

> Documentation interactive Swagger : `http://localhost:8080/swagger-ui.html`

### Authentification

| Méthode | Endpoint | Corps | Accès | Description |
|---|---|---|---|---|
| POST | `/auth/login` | `{ username, password }` | Public | Connexion — retourne JWT |
| POST | `/auth/register` | `{ firstName, lastName, username, email, password, phone, role }` | Public | Inscription |

**Réponse `/auth/login` :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "username": "patient1",
  "firstName": "Hassan",
  "lastName": "Moukrim",
  "email": "hassan@example.com",
  "role": "PATIENT"
}
```

### Patient

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/patients/profile` | PATIENT | Récupérer son profil |
| PUT | `/patients/profile` | PATIENT | Mettre à jour son profil |
| GET | `/patients/appointments` | PATIENT | Liste de ses rendez-vous |

### Médecin

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/doctors` | Tous (authentifiés) | Liste de tous les médecins disponibles |
| GET | `/doctors/appointments` | MEDECIN | Ses rendez-vous |
| PUT | `/doctors/appointments/{id}/status` | MEDECIN | Changer le statut d'un RDV |
| POST | `/doctors/availability` | MEDECIN | Ajouter une disponibilité |
| GET | `/doctors/availability` | MEDECIN | Ses disponibilités |
| DELETE | `/doctors/availability/{id}` | MEDECIN | Supprimer une disponibilité |
| GET | `/doctors/profile` | MEDECIN | Son profil médecin |
| PUT | `/doctors/profile` | MEDECIN | Mettre à jour son profil |

### Rendez-vous

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| POST | `/appointments` | PATIENT, AGENT | Créer un rendez-vous |
| PUT | `/appointments/{id}/cancel` | Authentifié | Annuler un rendez-vous |

**Corps POST `/appointments` :**
```json
{
  "doctorId": 1,
  "patientId": 2,
  "appointmentDate": "2026-05-15",
  "startTime": "09:00",
  "endTime": "09:30",
  "reason": "Douleurs thoraciques"
}
```

### Agent

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/agent/appointments` | AGENT | Tous les rendez-vous |
| GET | `/agent/patients` | AGENT | Liste de tous les patients |
| POST | `/agent/appointments` | AGENT | Créer un RDV pour un patient |

### Administrateur

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/admin/stats` | SUPER_ADMIN | Statistiques globales |
| GET | `/admin/users` | SUPER_ADMIN | Liste de tous les utilisateurs |
| GET | `/admin/appointments` | SUPER_ADMIN | Tous les rendez-vous |

**Réponse `/admin/stats` :**
```json
{
  "totalUsers": 7,
  "totalDoctors": 3,
  "totalPatients": 2,
  "totalAppointments": 10,
  "pendingAppointments": 3,
  "confirmedAppointments": 5
}
```

### Gestion des erreurs

Le `GlobalExceptionHandler` retourne des réponses uniformes :

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Patient not found with id: 99",
  "timestamp": "2026-05-07T09:00:00"
}
```

| Exception | Code HTTP |
|---|---|
| `ResourceNotFoundException` | 404 Not Found |
| `BadRequestException` | 400 Bad Request |
| Validation échouée | 400 Bad Request |
| Accès non autorisé | 403 Forbidden |
| Token manquant/invalide | 401 Unauthorized |

---

## 10. Interface frontend — Pages par rôle

### Routes publiques

| Route | Page | Description |
|---|---|---|
| `/login` | Login.js | Formulaire de connexion avec validation |
| `/register` | Register.js | Inscription avec champs dynamiques selon le rôle choisi |

### Routes Patient (`/patient/*`)

| Route | Page | Fonctionnalité |
|---|---|---|
| `/patient/dashboard` | PatientDashboard | Résumé des RDV récents, stats rapides |
| `/patient/appointments` | MyAppointments | Liste complète avec statut + bouton annuler |
| `/patient/book` | BookAppointment | Sélection médecin + date + motif |
| `/patient/doctors` | DoctorsList | Annuaire des médecins (spécialité, tarif, bio) |
| `/patient/profile` | PatientProfile | Modification profil, antécédents médicaux |

### Routes Médecin (`/doctor/*`)

| Route | Page | Fonctionnalité |
|---|---|---|
| `/doctor/dashboard` | DoctorDashboard | Statistiques RDV, résumé du jour |
| `/doctor/appointments` | DoctorAppointments | Gestion complète (confirmer, rejeter, terminer) |
| `/doctor/availability` | DoctorAvailability | Gestion des créneaux hebdomadaires |
| `/doctor/profile` | DoctorProfile | Modification profil, spécialité, honoraires |

### Routes Agent (`/agent/*`)

| Route | Page | Fonctionnalité |
|---|---|---|
| `/agent/dashboard` | AgentDashboard | Vue unifiée : patients, RDV, réservation inline |

### Routes Admin (`/admin/*`)

| Route | Page | Fonctionnalité |
|---|---|---|
| `/admin/dashboard` | AdminDashboard | Stats globales, utilisateurs, tous les RDV |

### Composants partagés

| Composant | Description |
|---|---|
| `Layout.js` | Wrapper global avec Sidebar et zone de contenu |
| `Sidebar.js` | Navigation latérale — liens différents selon le rôle de l'utilisateur |
| `PrivateRoute.js` | HOC de protection — redirige vers `/login` si non authentifié, `/unauthorized` si mauvais rôle |
| `StatusBadge.js` | Badge Bootstrap coloré selon le statut du RDV (vert=confirmé, rouge=annulé…) |
| `AuthContext.js` | Contexte global — stocke `user`, `token`, fournit `login()` et `logout()` |

### Redirection automatique à la connexion

```
PATIENT     → /patient/dashboard
MEDECIN     → /doctor/dashboard
AGENT       → /agent/dashboard
SUPER_ADMIN → /admin/dashboard
```

---

## 11. Démarrage rapide (Docker)

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (inclut Docker Compose)

### Lancer l'application

```bash
# 1. Cloner le projet
git clone <repo-url>
cd walid-java-projet

# 2. Démarrer tous les services (MySQL + Backend + Frontend)
docker-compose up --build

# 3. Attendre que les 3 services soient UP (environ 1-2 minutes)
#    Le backend attend que MySQL soit healthy avant de démarrer.
```

### URLs d'accès

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:3000 |
| Backend (API REST) | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| MySQL (externe) | localhost:3306 |

### Arrêter l'application

```bash
# Arrêter les conteneurs
docker-compose down

# Arrêter ET supprimer les volumes (efface la base de données)
docker-compose down -v
```

---

## 12. Développement local (sans Docker)

### Prérequis

| Outil | Version minimale |
|---|---|
| Java JDK | 17+ |
| Maven | 3.9+ |
| Node.js | 20+ |
| MySQL | 8.0+ |

### 1. Base de données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE medical_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'medical_user'@'localhost' IDENTIFIED BY 'medical_pass123';
GRANT ALL PRIVILEGES ON medical_db.* TO 'medical_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Backend

```bash
cd backend

# Configurer la connexion (optionnel — les variables peuvent être dans application.properties)
export DB_HOST=localhost
export DB_NAME=medical_db
export DB_USER=medical_user
export DB_PASSWORD=medical_pass123
export JWT_SECRET=myVerySecretKeyForJWTTokenGeneration2024
export JWT_EXPIRATION=86400000

# Compiler et lancer
mvn spring-boot:run

# Le backend démarre sur http://localhost:8080
# Les données de test sont chargées automatiquement au premier démarrage
```

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en mode développement
npm start

# Le frontend démarre sur http://localhost:3000
```

---

## 13. Variables d'environnement

Copier `.env.example` vers `.env` et adapter les valeurs avant le premier lancement.

| Variable | Description | Valeur par défaut |
|---|---|---|
| `DB_HOST` | Hôte MySQL | `db` (Docker) / `localhost` (local) |
| `DB_PORT` | Port MySQL | `3306` |
| `DB_NAME` | Nom de la base | `medical_db` |
| `DB_USER` | Utilisateur MySQL | `medical_user` |
| `DB_PASSWORD` | Mot de passe utilisateur | `medical_pass123` |
| `DB_ROOT_PASSWORD` | Mot de passe root MySQL | — |
| `DB_EXTERNAL_PORT` | Port MySQL exposé sur l'hôte | `3306` |
| `JWT_SECRET` | Clé secrète HMAC-SHA256 (≥ 32 caractères) | Voir `.env` |
| `JWT_EXPIRATION` | Durée de validité du token (millisecondes) | `86400000` (24h) |
| `BACKEND_PORT` | Port exposé pour le backend | `8080` |
| `FRONTEND_PORT` | Port exposé pour le frontend | `3000` |

---

## 14. Comptes de test

Les comptes suivants sont créés automatiquement au premier démarrage via `DataInitializer.java`.

| Rôle | Username | Mot de passe | Détails |
|---|---|---|---|
| Super Admin | `admin` | `admin123` | Accès complet au système |
| Agent | `agent1` | `agent123` | Marie Dupont — secrétariat |
| Médecin | `dr.benali` | `doctor123` | Ahmed Benali — Cardiologie — 500 MAD |
| Médecin | `dr.zahra` | `doctor123` | Fatima Zahra — Pédiatrie — 400 MAD |
| Médecin | `dr.mansouri` | `doctor123` | Karim Mansouri — Médecine Générale — 300 MAD |
| Patient | `patient1` | `patient123` | Hassan Moukrim — A+ — Casablanca |
| Patient | `patient2` | `patient123` | Aicha Benmoussa — O+ — Rabat |

> Les mots de passe sont stockés hachés en base avec **BCrypt**. Les valeurs en clair ci-dessus ne sont utilisées que pour la connexion initiale.

---

## 15. Infrastructure Docker

### Services Docker Compose

```
┌─────────────────────────────────────────────────────┐
│                 Docker Network: medical_network      │
│                                                     │
│  ┌─────────────┐   ┌─────────────┐   ┌───────────┐ │
│  │   medical   │   │   medical   │   │  medical  │ │
│  │    _db      │   │  _backend   │   │ _frontend │ │
│  │  MySQL 8.0  │   │ Spring Boot │   │   Nginx   │ │
│  │  :3306      │   │   :8080     │   │   :80     │ │
│  └──────┬──────┘   └──────┬──────┘   └─────┬─────┘ │
│         │                │                 │       │
└─────────┼────────────────┼─────────────────┼───────┘
          │ healthcheck     │ depends_on      │ depends_on
          │ mysqladmin ping  │ service_healthy │ backend
          ▼                 ▼                 ▼
      :3306 (host)      :8080 (host)      :3000 (host)
```

### Détails des services

#### Service `db`
- Image : `mysql:8.0`
- Données persistées dans le volume Docker `mysql_data`
- Healthcheck : `mysqladmin ping` toutes les 10s, 10 tentatives max
- Le backend ne démarre qu'une fois MySQL déclaré healthy

#### Service `backend`
- Build multi-stage : Maven compile le JAR, puis JRE 17 slim l'exécute
- Dépend de `db` (condition : `service_healthy`)
- Variables d'environnement injectées depuis `.env`
- DDL Hibernate en mode `update` : le schéma est créé automatiquement

#### Service `frontend`
- Build multi-stage : Node.js build React → copie dans Nginx Alpine
- `nginx.conf` configure le fallback SPA (`try_files $uri /index.html`)
- `REACT_APP_API_URL` passé en build-arg pour pointer vers le backend

### Commandes Docker utiles

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Reconstruire sans cache
docker-compose build --no-cache

# Voir l'état des conteneurs
docker-compose ps

# Exécuter une commande dans un conteneur
docker exec -it medical_backend sh

# Accéder à la base MySQL depuis l'hôte
mysql -h 127.0.0.1 -P 3306 -u medical_user -p medical_db
```

---

*Projet réalisé dans le cadre d'un projet universitaire — Spring Boot 3 + React 18 + MySQL 8 + Docker Compose*
