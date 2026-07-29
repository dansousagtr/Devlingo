# Relação entre as tabelas (devlingo.sql)

Diagrama apenas das tabelas e suas relações (foreign keys).

```mermaid
erDiagram
  auth_users {
    uuid id PK
  }

  units {
    uuid id PK
    text title
    text description
    text level
    timestamptz created_at
  }

  lessons {
    uuid id PK
    text title
    text description
    int xp_reward
    uuid unit_id FK
    timestamptz created_at
  }

  user_profiles {
    uuid id PK "FK auth.users"
    text email
    text name
    int total_xp
    timestamptz created_at
    timestamptz updated_at
  }

  user_lessons {
    uuid id PK
    uuid user_id FK
    uuid lesson_id FK
    bool is_completed
    int xp_earned
    timestamptz completed_at
  }

  user_units {
    uuid id PK
    uuid user_id FK
    uuid unit_id FK
    bool is_completed
    timestamptz completed_at
  }

  lesson_questions {
    uuid id PK
    uuid lesson_id FK
    text question_text
    text question_type
    int position
    timestamptz created_at
  }

  lesson_question_options {
    uuid id PK
    uuid question_id FK
    text option_text
    bool is_correct
    int position
    timestamptz created_at
  }

  auth_users ||--o| user_profiles : "id"
  auth_users ||--o{ user_lessons : "user_id"
  auth_users ||--o{ user_units : "user_id"

  units ||--o{ lessons : "unit_id"
  units ||--o{ user_units : "unit_id"

  lessons ||--o{ user_lessons : "lesson_id"
  lessons ||--o{ lesson_questions : "lesson_id"

  lesson_questions ||--o{ lesson_question_options : "question_id"
```

## Resumo das relações

| Tabela | Referencia |
|--------|------------|
| **user_profiles** | `id` → `auth.users(id)` |
| **user_lessons** | `user_id` → `auth.users(id)`, `lesson_id` → `lessons(id)` |
| **user_units** | `user_id` → `auth.users(id)`, `unit_id` → `units(id)` |
| **lessons** | `unit_id` → `units(id)` |
| **lesson_questions** | `lesson_id` → `lessons(id)` |
| **lesson_question_options** | `question_id` → `lesson_questions(id)` |

- **auth.users**: tabela do Supabase Auth (não criada pelo script).
- **public**: `units`, `lessons`, `user_profiles`, `user_lessons`, `user_units`, `lesson_questions`, `lesson_question_options`.
