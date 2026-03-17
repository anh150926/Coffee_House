$response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method Post -ContentType "application/json" -Body '{"username":"owner","password":"password123"}'
$token = $response.data.accessToken
$headers = @{ "Authorization" = "Bearer $token" }
try {
    Write-Output "Generating payroll..."
    $result = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/payrolls/generate?month=2026-03" -Method Post -Headers $headers
    Write-Output "Success!"
    $result | ConvertTo-Json -Depth 10 | Write-Output
} catch {
    Write-Output "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails) {
        Write-Output "Details: $($_.ErrorDetails.Message)"
    }
}
