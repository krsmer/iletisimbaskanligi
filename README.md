# Performans Takip

## Docker ile calistirma

1. Ornek ortam dosyasini kopyalayin:

```bash
cp .env.local.example .env.local
```

2. `.env.local` icindeki Appwrite degiskenlerini kendi degerlerinizle doldurun.

3. Uygulamayi Docker Compose ile ayaga kaldirin:

```bash
docker compose --env-file .env.local up --build
```

4. Uygulamaya gidin: `http://localhost:3000`

## Sadece Docker image build/run

```bash
docker build -t performans-takip .
docker run --rm -p 3000:3000 --env-file .env.local performans-takip
```

## Durdurma

```bash
docker compose down
```
