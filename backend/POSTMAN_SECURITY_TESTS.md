# Guide de Tests de Sécurité - Postman Collection

## Instructions pour tester tous les aspects de sécurité

### 1. Test d'Enregistrement (Register)

**Endpoint:** `POST http://localhost:3000/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "yassine@example.com",
  "password": "Password123!",
  "firstName": "Yassine",
  "lastName": "Ben Amor",
  "roleId": 1
}
```

**Attendu:** 
- ✅ Status: 201 Created
- ✅ Response: `{ "message": "User created", "user": { ... } }`
- ✅ Mot de passe non présent dans la réponse

**Test validation mot de passe (doit échouer):**
```json
{
  "email": "test2@example.com",
  "password": "pass",  // Trop court, pas de majuscule, etc.
  "firstName": "Test",
  "lastName": "User",
  "roleId": 1
}
```
- ❌ Status: 400 Bad Request
- ❌ Message d'erreur sur la validation du mot de passe

---

### 2. Test de Connexion (Login)

**Endpoint:** `POST http://localhost:3000/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "yassine@example.com",
  "password": "Password123!"
}
```

**Attendu:**
- ✅ Status: 200 OK
- ✅ Response: `{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }`
- ✅ Token JWT valide (peut être décodé sur jwt.io)

**Test mauvais mot de passe (doit échouer):**
```json
{
  "email": "yassine@example.com",
  "password": "WrongPassword123!"
}
```
- ❌ Status: 401 Unauthorized
- ❌ Message: "Invalid credentials"

---

### 3. Test Rate Limiting

**Test brute force sur login:**
1. Faites 3 requêtes login valides en moins de 1 minute → ✅ Succès
2. Faites une 4ème requête login en moins de 1 minute → ❌ Status: 429 Too Many Requests

**Test spam sur register:**
1. Faites 5 requêtes register avec des emails différents en moins de 1 minute → ✅ Succès
2. Faites une 6ème requête register en moins de 1 minute → ❌ Status: 429 Too Many Requests

**Attendu:**
- ✅ Response header: `Retry-After: 60` (secondes avant prochaine requête autorisée)

---

### 4. Test JWT Guards

**Endpoint protégé:** `GET http://localhost:3000/courses`

**Sans token:**
- Headers: Aucun header Authorization
- ❌ Status: 401 Unauthorized
- ❌ Message: "Unauthorized"

**Avec token valide:**
1. Copiez le token obtenu lors du login
2. Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- ✅ Status: 200 OK (si courses existent) ou 404 (si aucune course)

**Avec token invalide:**
```
Authorization: Bearer invalid_token
```
- ❌ Status: 401 Unauthorized

---

### 5. Test Headers HTTP (Helmet)

Faites n'importe quelle requête (ex: register) et vérifiez les headers dans la réponse:

**Headers attendus:**
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Strict-Transport-Security: max-age=31536000; includeSubDomains`

---

### 6. Test CORS

**Requête depuis origine non autorisée:**
1. Configurez Postman pour envoyer header `Origin: http://malicious-site.com`
2. Faites une requête
- ❌ La requête peut être bloquée par CORS

**Requête depuis origine autorisée:**
1. Configurez Postman pour envoyer header `Origin: http://localhost:5173`
2. Faites une requête
- ✅ Succès avec CORS headers appropriés

---

### 7. Test Email Duplication

**Essayer de créer un utilisateur avec le même email:**
```json
{
  "email": "yassine@example.com",
  "password": "AnotherPassword123!",
  "firstName": "Another",
  "lastName": "User",
  "roleId": 1
}
```
- ❌ Status: 409 Conflict
- ❌ Message: "Email already exists"

---

## Checklist de Sécurité

- [ ] Enregistrement fonctionne avec mot de passe complexe
- [ ] Enregistrement échoue avec mot de passe simple
- [ ] Login fonctionne avec identifiants valides
- [ ] Login échoue avec mauvais identifiants
- [ ] Rate limiting bloque après 3 tentatives login
- [ ] Rate limiting bloque après 5 tentatives register
- [ ] Routes protégées nécessitent token JWT
- [ ] Token invalide est rejeté
- [ ] Headers de sécurité Helmet sont présents
- [ ] CORS est configuré correctement
- [ ] Email en double est rejeté
- [ ] Mot de passe n'est pas renvoyé dans les réponses

---

## Commandes curl alternatives

### Register:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"yassine@example.com\",\"password\":\"Password123!\",\"firstName\":\"Yassine\",\"lastName\":\"Ben Amor\",\"roleId\":1}"
```

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"yassine@example.com\",\"password\":\"Password123!\"}"
```

### Test rate limiting (login):
```bash
for i in {1..4}; do
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"yassine@example.com\",\"password\":\"Password123!\"}"
  echo "Request $i"
done
```

### Test protected route:
```bash
curl -X GET http://localhost:3000/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
