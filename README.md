# XML Skills Training

A full-stack web application for learning XML through interactive lessons, hands-on exercises, quizzes, and achievement tracking.

## Features

- **Full XML Curriculum** — 7 modules covering XML Basics, DTD, XML Schema (XSD), XPath, XSLT, XQuery, and XML Parsing
- **Interactive Exercises** — Write, fix, and validate XML in a Monaco Editor (VS Code's editor) with real-time feedback
- **Quizzes** — Multiple-choice questions with explanations and scoring
- **Progress Tracking** — Per-lesson and per-module completion percentage
- **Achievements** — 10 badges earned by completing modules, acing quizzes, and finishing the curriculum
- **OAuth Authentication** — Sign in with Google or GitHub

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Monaco Editor |
| Backend | Node.js, Express, Passport.js |
| Database | MongoDB, Mongoose |
| Deployment | Docker, Docker Compose, Nginx |

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- OAuth credentials for [Google](https://console.cloud.google.com/) and/or [GitHub](https://github.com/settings/developers)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/emirastic-000/XML-Exercises.git
   cd XML-Exercises
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your OAuth credentials and a session secret:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   SESSION_SECRET=a_random_secret_string
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Seed the achievements**
   ```bash
   docker exec $(docker ps -qf "name=server") node src/seed.js
   ```

5. **Open the app** at [http://localhost:3000](http://localhost:3000)

### Local Development (without Docker)

```bash
# Terminal 1 — Start MongoDB (or use a cloud instance)
mongod

# Terminal 2 — Server
cd server
npm install
npm run dev

# Terminal 3 — Client
cd client
npm install
npm run dev
```

## Project Structure

```
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Navbar, XMLEditor, QuizPanel, ProgressBar, etc.
│       ├── pages/           # Landing, Dashboard, ModuleList, LessonView, Profile, Achievements
│       ├── context/         # AuthContext (user session state)
│       └── api/             # Axios API client
├── server/                  # Express backend
│   ├── content/             # Lesson content (YAML files)
│   │   ├── 01-xml-basics/
│   │   ├── 02-dtd/
│   │   ├── 03-xml-schema/
│   │   ├── 04-xpath/
│   │   ├── 05-xslt/
│   │   ├── 06-xquery/
│   │   └── 07-xml-parsing/
│   └── src/
│       ├── config/          # DB, Passport, environment
│       ├── models/          # User, Progress, Achievement
│       ├── routes/          # Auth, modules, lessons, progress, achievements, validate
│       └── services/        # Content loader, XML validator, achievement checker
└── docker-compose.yml
```

## Curriculum

| Module | Topics | Lessons |
|--------|--------|---------|
| XML Basics | Elements, attributes, well-formedness, namespaces | 3 |
| DTD | Element/attribute declarations, validation, entities | 2 |
| XML Schema | Simple/complex types, facets, sequences, extensions | 2 |
| XPath | Location paths, axes, predicates, functions | 2 |
| XSLT | Templates, value-of, for-each, apply-templates, conditionals | 1 |
| XQuery | FLWOR expressions, element constructors, functions | 1 |
| XML Parsing | DOM vs SAX vs StAX approaches | 1 |

## Adding Lessons

Lessons are YAML files in `server/content/<module>/`. Create a new file following this structure:

```yaml
id: "lesson-id"
title: "Lesson Title"
order: 1

reading: |
  Markdown content with code examples...

exercises:
  - id: "ex1"
    type: "write-xml"       # write-xml | fix-xml | write-xpath | create-xsd | write-xslt
    prompt: "Instructions..."
    validation:
      wellFormed: true
      requiredElements: ["root", "child"]

quiz:
  - question: "Question text?"
    options: ["A", "B", "C", "D"]
    correct: 0
    explanation: "Why A is correct."
```

## License

MIT
