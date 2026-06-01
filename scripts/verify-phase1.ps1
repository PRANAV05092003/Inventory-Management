# Phase 1 endpoint verification (run after: docker compose up --build)
$base = "http://localhost:8000"
$failed = 0

function Test-Endpoint {
    param([string]$Name, [string]$Url, [scriptblock]$Assert)
    Write-Host "`n=== $Name ===" -ForegroundColor Cyan
    Write-Host "GET $Url"
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 15
        $response | ConvertTo-Json -Compress
        & $Assert $response
        Write-Host "PASS" -ForegroundColor Green
    } catch {
        Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message }
        $script:failed++
    }
}

Test-Endpoint -Name "Test 2 - Root" -Url "$base/" -Assert {
    param($r)
    if ($r.message -ne "Inventory Management API Running") {
        throw "Unexpected message: $($r.message)"
    }
}

Test-Endpoint -Name "Test 3 - Health" -Url "$base/health" -Assert {
    param($r)
    if ($r.status -ne "healthy" -or $r.database -ne "connected") {
        throw "Expected healthy/connected, got: $($r | ConvertTo-Json -Compress)"
    }
}

Write-Host "`n=== Test 1 - Swagger ===" -ForegroundColor Cyan
Write-Host "Open in browser: $base/docs"
try {
    $docs = Invoke-WebRequest -Uri "$base/docs" -Method Get -TimeoutSec 15
    if ($docs.StatusCode -eq 200) {
        Write-Host "PASS - /docs returned HTTP $($docs.StatusCode)" -ForegroundColor Green
    } else {
        throw "Unexpected status: $($docs.StatusCode)"
    }
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

if ($failed -gt 0) {
    Write-Host "`n$failed test(s) failed. Check: docker compose ps && docker compose logs backend" -ForegroundColor Red
    exit 1
}

Write-Host "`nAll automated checks passed." -ForegroundColor Green
