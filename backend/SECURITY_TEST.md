# Tests de Sécurité - Learnova API

## 1. Test d'Enregistrement (Register)

**Endpoint:** `POST http://localhost:3000/auth/register`

**Body:**
```json
{
  "email": "test@example.com",
  "password": "Password123!",
  "firstName": "Yassine",
  "lastName": "Ben Amor",
  "roleId": 1
}
```

**Attendu:** 
- ✅ Succès avec message "User created"
- ✅ Mot de passe haché dans la base de données
- ✅ Mot de passe non renvoyé dans la réponse

**Test validation mot de passe:**
- ❌ Mot de passe trop court (< 8 caractères)
- ❌ Sans majuscule
- ❌ Sans chiffre
- ❌ Sans caractère spécial

---

## 2. Test de Connexion (Login)

**Endpoint:** `POST http://localhost:3000/auth/login`

**Body:**
```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

**Attendu:**
- ✅ Token JWT généré
- ✅ Token contient sub, email, role
- ✅ Token expire après 7 jours

---

## 3. Test Rate Limiting

**Test brute force sur login:**
- Faire 4 requêtes login en moins de 1 minute
- Attendu: 4ème requête rejetée (429 Too Many Requests)

**Test spam sur register:**
- Faire 6 requêtes register en moins de 1 minute  
- Attendu: 6ème requête rejetée (429 Too Many Requests)

---

## 4. Test JWT Guards

**Endpoint protégé:** `GET http://localhost:3000/courses`

**Sans token:**
- Attendu: 401 Unauthorized

**Avec token valide:**
- Header: `Authorization: Bearer <token>`
- Attendu: 200 OK

---

## 5. Test Headers HTTP (Helmet)

Vérifier les headers dans la réponse:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Strict-Transport-Security

---

## 6. Test CORS

**Requête depuis origine non autorisée:**
- Attendu: Rejet par CORS

**Requête depuis origine autorisée (localhost:5173):**
- Attendu: Succès avec credentials

---

## Commandes curl pour tests rapides

### Register:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\",\"firstName\":\"Yassine\",\"lastName\":\"Ben Amor\",\"roleId\":1}"
```

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\"}"
```

### Test rate limiting (login):
```bash
for i in {1..4}; do
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\"}"
  echo "Request $i"
done
```
