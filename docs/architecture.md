# Mimari Harita (Parcalara Ayrilmis)

Bu dokuman, projeyi tek karmasik graf yerine is alanlarina boler.

## 1) Sistem Gorunumu

```mermaid
flowchart LR
    U[Kullanici\nStajyer / Yonetici]

    subgraph FE[Next.js Frontend]
      Auth[Auth Sayfalari\n/login, /register]
      Shell[DashboardLayout + AppSidebar]
      Intern[Stajyer Ekranlari\n/activities, /activities/new]
      Manager[Yonetici Ekranlari\n/dashboard, /students, /students/:id]
      UI[UI Bilesenleri\ncomponents/ui/*]
      Charts[Grafikler\nline-chart, pie-chart]
    end

    subgraph BFF[Veri Katmani]
      SDK[lib/appwrite.ts\nAuth + DB Fonksiyonlari]
      Roles[utils/roles.ts]
    end

    subgraph BE[Appwrite]
      Acc[Account]
      DB[(Databases)]
      ColUsers[users collection]
      ColAct[activities collection]
    end

    U --> Auth
    U --> Shell
    Shell --> Intern
    Shell --> Manager
    Intern --> UI
    Manager --> UI
    Manager --> Charts

    Auth --> SDK
    Intern --> SDK
    Manager --> SDK
    SDK --> Roles

    SDK --> Acc
    SDK --> DB
    DB --> ColUsers
    DB --> ColAct
```

## 2) Auth ve Yonlendirme Akisi

```mermaid
sequenceDiagram
    participant User as Kullanici
    participant Login as /login
    participant SDK as lib/appwrite.ts
    participant Acc as Appwrite Account
    participant Users as users collection
    participant Router as Next Router

    User->>Login: email + password
    Login->>SDK: login(email, password)
    SDK->>Acc: createEmailPasswordSession
    Login->>SDK: getCurrentUser()
    SDK->>Acc: account.get()
    Login->>SDK: getUserProfile(userId)
    SDK->>Users: listDocuments(userId)
    alt role=yonetici
      Login->>Router: /dashboard
    else role=stajyer
      Login->>Router: /activities
    end
```

## 3) Stajyer Aktivite Akisi

```mermaid
flowchart LR
    A[Stajyer] --> B[/activities/new Form]
    B --> C[Validation\nzod + react-hook-form]
    C --> D[createActivity]
    D --> E[lib/appwrite.ts]
    E --> F[(activities collection)]
    F --> G[/activities listesi]
    G --> H[getActivityByUser]
    H --> E
```

## 4) Yonetici Izleme ve Geri Bildirim

```mermaid
flowchart LR
    M[Yonetici] --> D[/dashboard]
    M --> S[/students]
    S --> SD[/students/:id]

    D --> API1[getTotalInterns/getTotalActivities/...]
    SD --> API2[getActivityByUser + updateActivity]
    API1 --> APP[lib/appwrite.ts]
    API2 --> APP
    APP --> USERS[(users)]
    APP --> ACT[(activities)]
    SD --> CH[LineChart + PieChart]
```

## 5) Klasor Bazli Sorumluluk

- `app/`: route ve sayfa seviyesinde akislari kurar
- `components/`: ekran ve ortak UI bilesenleri
- `lib/appwrite.ts`: tum Appwrite auth + database cagri merkezi
- `hooks/`: ekran yardimci hooklar
- `utils/`: rol gibi kucuk saf yardimci mantiklar

## 6) Eraser.io icin Kullanim

- Bu dosyadaki her Mermaid blogunu ayri canvas olarak acin.
- Her canvas'i su isimlerle tutun:
- `01-system-overview`
- `02-auth-flow`
- `03-intern-activity-flow`
- `04-manager-analytics-flow`
- Tek devasa grafik yerine 4 kucuk grafik kullanin; okunabilirlik ciddi artar.
