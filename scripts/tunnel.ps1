# Persistent Tunnel Manager for FINN
$port = 8000
$logFile = "$PSScriptRoot\tunnel.log"

while ($true) {
    Write-Host "[Tunnel] Connecting to localhost.run..."
    $proc = Start-Process -FilePath "ssh" -ArgumentList "-o StrictHostKeyChecking=no -o ServerAliveInterval=10 -o ServerAliveCountMax=3 -R 80:127.0.0.1:$port nokey@localhost.run" -RedirectStandardOutput $logFile -RedirectStandardError "$PSScriptRoot\tunnel_err.log" -PassThru -NoNewWindow

    # Monitor output for URL
    $foundUrl = $null
    for ($i = 0; $i -lt 15; $i++) {
        Start-Sleep -Seconds 1
        if (Test-Path $logFile) {
            $lines = Get-Content $logFile -Tail 20
            foreach ($line in $lines) {
                if ($line -match "https://([a-zA-Z0-9]+\.lhr\.life)") {
                    $foundUrl = $matches[0]
                    break
                }
            }
        }
        if ($foundUrl) { break }
    }

    if ($foundUrl) {
        Write-Host "[Tunnel] Active at: $foundUrl"
        Set-Content -Path "$PSScriptRoot\..\docs\active_tunnel.txt" -Value $foundUrl
        
        # Keepalive loop: ping every 25 seconds to prevent activity timeout
        while (-not $proc.HasExited) {
            Start-Sleep -Seconds 25
            try {
                $null = Invoke-RestMethod -Uri "$foundUrl/api/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
            } catch {}
        }
    } else {
        Start-Sleep -Seconds 5
    }

    Write-Host "[Tunnel] Disconnected. Reconnecting in 3 seconds..."
    Start-Sleep -Seconds 3
}
