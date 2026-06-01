# CICD_Epic - Continuous Integration & Infrastructure Knowledge API

CICD_Epic is a production-ready, scalable RESTful API built with Node.js, Express, and MongoDB. It acts as an operations control center serving a dataset of **2,708 continuous integration workflow templates and infrastructure guides**. 

It features built-in document version auditing, execution run simulations (streaming logs & diagnostics metrics), secure JWT authentication, role restrictions, and administrative user CRUD dashboards.

---

## 🚀 Local Installation & Running

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Server running locally on port `27017`

### 1. Backend Setup & Configuration
Navigate to the `BACKEND` directory:
```bash
cd BACKEND
```

Install the required dependencies:
```bash
npm install
```

Create/Review the environment file `BACKEND/.env` (pre-configured with local defaults):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cicd-epic-db
NODE_ENV=development
JWT_SECRET=supersecretkeyforjwtcicdepicpatel143
JWT_EXPIRES_IN=30d
```

### 2. Seeding the Database
Run the seeder script to clear previous collections and bulk-load the 2,708 continuous integration records enriched with mock analytics stats, along with two default operational credentials:
```bash
npm run seed
```

**Seeded Credentials:**
- **Lead Administrator (Admin):** `admin@cicd-epic.com` (password: `admin123`)
- **Developer (Standard User):** `user@cicd-epic.com` (password: `user123`)

### 3. Starting the Server
Start the development server with automatic file reload:
```bash
npm run dev
```
The API server will listen on `http://localhost:5000/api/v1`.

### 4. Running Validation Tests
To run the self-contained verification test suite asserting all 49 routes, run:
```bash
node scripts/test_endpoints.js
```

---

## 🗄️ Database Modeling & Schema Design

Our database is designed around four Mongoose collections inside MongoDB:

1. **Workflows (`workflows`):** Represents primary templates/guides. Contains compound text indexes on `instruction` and `output` fields to optimize regex searches, analytics trackers (`views`, `runCount`, `rating`), and a soft-archiving status flag (`isArchived`).
2. **Workflow Versions (`workflowversions`):** Audits historical updates. Recreates a version entry mapping the fields and version counter on every `PUT` or `PATCH` operation.
3. **Workflow Runs (`workflowruns`):** Simulates pipeline execution history, log message lists, and diagnostics telemetry (CPU, Memory, and execution duration).
4. **Users (`users`):** Stores developer accounts. Automatically hashes passwords with `bcryptjs` on pre-save and exposes matching functions.

---

## 🔍 Centralized Query Helper (`queryHelper.js`)
All resource list endpoints are routed through a generic query parser that reads URL search parameters:
- **Pagination:** `?page=1&limit=10` (returns metadata such as pages, totals, previous/next states).
- **Sorting:** `?sort=-views` or `?sort=createdAt` (defaults to newest first).
- **Field Selection:** `?fields=instruction,topic` (excludes or includes specific database fields).
- **Regex Searching:** `?search=kubernetes` (performs case-insensitive regex pattern queries on multiple fields).
- **Key-Value Filtering:** `?difficulty=intermediate&topic=docker` (exact field matching).

---

## 🛠️ API Routing Documentation (49 Routes Total)

### 1. CI/CD Workflows Operations (20 Routes)
Endpoints prefix: `/api/v1/workflows`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **`GET`** | `/api/v1/workflows` | Fetch all workflows with pagination, filtering, searching, and sorting |
| **`GET`** | `/api/v1/workflows/random` | Fetch a random workflow |
| **`GET`** | `/api/v1/workflows/latest` | Fetch the latest workflows sorted by creation date |
| **`GET`** | `/api/v1/workflows/trending` | Fetch trending workflows (sorted by runCount and views desc) |
| **`GET`** | `/api/v1/workflows/recommended` | Fetch recommended workflows (sorted by rating desc) |
| **`GET`** | `/api/v1/workflows/popular` | Fetch popular workflows (sorted by views desc) |
| **`GET`** | `/api/v1/workflows/:id` | Fetch details of a specific workflow (automatically increments views by 1) |
| **`POST`** | `/api/v1/workflows` | Create a new workflow guide (creates version 1) |
| **`PUT`** | `/api/v1/workflows/:id` | Replace workflow details (creates new version log) |
| **`PATCH`** | `/api/v1/workflows/:id/content` | Update workflow content partially (creates new version log) |
| **`DELETE`** | `/api/v1/workflows/:id` | Permanent deletion of workflow, associated versions, and runs |
| **`PATCH`** | `/api/v1/workflows/:id/archive` | Archive a workflow (soft-deletion) |
| **`PATCH`** | `/api/v1/workflows/:id/restore` | Restore an archived workflow |
| **`GET`** | `/api/v1/workflows/:id/versions` | Fetch all historical versions of a workflow |
| **`POST`** | `/api/v1/workflows/:id/clone` | Clone a workflow (creates duplicate with clear metadata) |
| **`GET`** | `/api/v1/workflows/:id/logs` | Fetch latest run logs for a workflow |
| **`GET`** | `/api/v1/workflows/:id/metrics` | Fetch latest run metrics for a workflow |
| **`GET`** | `/api/v1/workflows/history/:id` | Fetch all run execution history logs for a workflow |
| **`POST`** | `/api/v1/workflows/:id/run` | Trigger a mock workflow execution (generates logs/metrics) |
| **`POST`** | `/api/v1/workflows/:id/cancel` | Cancel an active workflow run |

---

### 2. Kubernetes & Infrastructure Routes (20 Routes)
Endpoints prefix: `/api/v1/infra`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **`GET`** | `/api/v1/infra/k8s` | Fetch Kubernetes topic guides |
| **`GET`** | `/api/v1/infra/docker` | Fetch Docker topic guides |
| **`GET`** | `/api/v1/infra/helm` | Fetch Helm topic guides |
| **`GET`** | `/api/v1/infra/terraform` | Fetch Terraform topic guides |
| **`GET`** | `/api/v1/infra/aws` | Fetch AWS keyword matching guides |
| **`GET`** | `/api/v1/infra/gcp` | Fetch GCP keyword matching guides |
| **`GET`** | `/api/v1/infra/azure` | Fetch Azure keyword matching guides |
| **`GET`** | `/api/v1/infra/pods` | Fetch Kubernetes Pod related guides |
| **`GET`** | `/api/v1/infra/services` | Fetch Kubernetes Service related guides |
| **`GET`** | `/api/v1/infra/deployments` | Fetch Kubernetes Deployment related guides |
| **`GET`** | `/api/v1/infra/ingress` | Fetch Ingress guides |
| **`GET`** | `/api/v1/infra/configmaps` | Fetch ConfigMap guides |
| **`GET`** | `/api/v1/infra/secrets` | Fetch Secret management guides |
| **`GET`** | `/api/v1/infra/volumes` | Fetch Volume mounts guides |
| **`GET`** | `/api/v1/infra/networking` | Fetch infrastructure networking guides |
| **`GET`** | `/api/v1/infra/autoscaling` | Fetch scaling/autoscaler guides |
| **`GET`** | `/api/v1/infra/security` | Fetch security topic/keyword guides |
| **`GET`** | `/api/v1/infra/monitoring` | Fetch monitoring setup guides |
| **`GET`** | `/api/v1/infra/logging` | Fetch centralized logging/logs guides |
| **`GET`** | `/api/v1/infra/templates` | Fetch reusable template guides |

---

### 3. User Authentication Routes (4 Routes)
Endpoints prefix: `/api/v1/auth`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/api/v1/auth/signup` | Register a new user | Public |
| **`POST`** | `/api/v1/auth/login` | Login and obtain JWT token | Public |
| **`GET`** | `/api/v1/auth/profile` | Retrieve profile of logged in user | Protected (Token req.) |
| **`PUT`** | `/api/v1/auth/profile` | Modify profile of logged in user | Protected (Token req.) |

---

### 4. Administrative User CRUD Routes (5 Routes)
Endpoints prefix: `/api/v1/users`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/api/v1/users` | List all users with pagination and search | Admin Only |
| **`POST`** | `/api/v1/users` | Register a new user account | Admin Only |
| **`GET`** | `/api/v1/users/:id` | Retrieve single user account details | Admin Only |
| **`PUT`** | `/api/v1/users/:id` | Update user details or edit role | Admin Only |
| **`DELETE`** | `/api/v1/users/:id` | Delete user account permanently | Admin Only |