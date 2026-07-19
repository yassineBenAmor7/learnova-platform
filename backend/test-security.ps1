# Test complet de sécurité pour Learnova API
Write-Host "=== Tests de Sécurité Learnova API ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Enregistrement avec mot de passe complexe
Write-Host "Test 1: Enregistrement (Register)" -ForegroundColor Yellow
$body = @{
    email = "yassine.test@example.com"
    password = "Password123!"
    firstName = "Yassine"
    lastName = "Ben Amor"
    roleId = 1
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "[OK] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "[OK] Response: $($response.Content)" -ForegroundColor Green
    $token = ($response.Content | ConvertFrom-Json).access_token
} catch {
    Write-Host "[FAIL] Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "[FAIL] Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $errorBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorBody)
        $errorText = $reader.ReadToEnd()
        Write-Host "[FAIL] Response: $errorText" -ForegroundColor Red
    }
}
Write-Host ""

# Test 2: Enregistrement avec mot de passe faible (doit échouer)
Write-Host "Test 2: Enregistrement avec mot de passe faible (doit échouer)" -ForegroundColor Yellow
$body = @{
    email = "test2@example.com"
    password = "pass"
    firstName = "Test"
    lastName = "User"
    roleId = 1
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "[FAIL] Devrait échouer mais a réussi!" -ForegroundColor Red
} catch {
    Write-Host "[OK] Correctement rejeté" -ForegroundColor Green
    Write-Host "[OK] Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Green
}
Write-Host ""

# Test 3: Connexion (Login)
Write-Host "Test 3: Connexion (Login)" -ForegroundColor Yellow
$body = @{
    email = "yassine.test@example.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "[OK] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "[OK] Response: $($response.Content)" -ForegroundColor Green
    $token = ($response.Content | ConvertFrom-Json).access_token
    Write-Host "[OK] Token obtenu: $($token.Substring(0, 50))..." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Connexion avec mauvais mot de passe (doit échouer)
Write-Host "Test 4: Connexion avec mauvais mot de passe (doit échouer)" -ForegroundColor Yellow
$body = @{
    email = "yassine.test@example.com"
    password = "WrongPassword123!"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "[FAIL] Devrait échouer mais a réussi!" -ForegroundColor Red
} catch {
    Write-Host "[OK] Correctement rejeté" -ForegroundColor Green
    Write-Host "[OK] Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Green
}
Write-Host ""

# Test 5: Rate limiting sur login (4 requêtes)
Write-Host "Test 5: Rate limiting sur login (4 requêtes)" -ForegroundColor Yellow
$body = @{
    email = "yassine.test@example.com"
    password = "Password123!"
} | ConvertTo-Json

for ($i = 1; $i -le 4; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        Write-Host "Requete $i : [OK] Status $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "Requete $i : [FAIL] Status $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        if ($_.Exception.Response.StatusCode.value__ -eq 429) {
            Write-Host "[OK] Rate limiting fonctionne!" -ForegroundColor Green
        }
    }
    Start-Sleep -Milliseconds 100
}
Write-Host ""

# Test 6: Route protégée sans token (doit échouer)
Write-Host "Test 6: Route protégée sans token (doit échouer)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/courses" -Method GET -ErrorAction Stop
    Write-Host "[FAIL] Devrait échouer mais a réussi!" -ForegroundColor Red
} catch {
    Write-Host "[OK] Correctement rejeté" -ForegroundColor Green
    Write-Host "[OK] Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Green
}
Write-Host ""

# Test 7: Route protégée avec token
Write-Host "Test 7: Route protégée avec token" -ForegroundColor Yellow
$body = @{
    email = "yassine.test@example.com"
    password = "Password123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $token = ($loginResponse.Content | ConvertFrom-Json).access_token
    
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/courses" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "[OK] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "[OK] Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "[FAIL] Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 8: Headers de sécurité (Helmet)
Write-Host "Test 8: Headers de sécurité (Helmet)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $headers = $response.Headers
    
    $securityHeaders = @(
        "X-Content-Type-Options",
        "X-Frame-Options", 
        "X-XSS-Protection",
        "Strict-Transport-Security"
    )
    
    foreach ($header in $securityHeaders) {
        if ($response.Headers[$header]) {
            Write-Host "[OK] $header : $($response.Headers[$header])" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] $header : Manquant" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "[FAIL] Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Tests terminés ===" -ForegroundColor Cyan
