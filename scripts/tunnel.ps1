# Persistent Tunnel Manager for FINN
$port = 8000
$docPath = "$PSScriptRoot\..\docs\active_tunnel.txt"

while ($true) {
    Write-Host "[Tunnel] Starting ssh tunnel to localhost.run..."
    
    # Run ssh process directly and redirect stream
    $pinfo = New-Object System.Diagnostics.ProcessStartInfo
    $pinfo.FileName = "ssh"
    $pinfo.Arguments = "-o StrictHostKeyChecking=no -o ServerAliveInterval=10 -o ServerAliveCountMax=3 -R 80:127.0.0.1:$port nokey@localhost.run"
    $pinfo.RedirectStandardOutput = $true
    $pinfo.RedirectStandardError = $true
    $pinfo.UseShellExecute = $false
    $pinfo.CreateNoWindow = $true

    $proc = New-Object System.Diagnostics.Process
    $proc.StartInfo = $pinfo
    $proc.Start() | Out-Null

    $url = $null
    $startTime = Get-Date

    # Read output asynchronously until URL is discovered
    while (-not $proc.HasExited -and (-not $url) -and ((Get-Date) - $startTime).TotalSeconds -lt 25) {
        $line = $proc.StandardOutput.ReadLine()
        if ($line) {
            Write-Host "[SSH Out] $line"
            if ($line -match "https://([a-zA-Z0-9]+\.lhr\.life)") {
                $url = $matches[0]
                break
            }
        }
    }

    if ($url) {
        Write-Host "========================================"
        Write-Host ">>> ACTIVE PUBLIC TUNNEL: $url <<<"
        Write-Host "========================================"
        Set-Content -Path $docPath -Value $url

        # Active Keepalive Loop: Send an HTTP ping every 15s so localhost.run never times out
        $failCount = 0
        while (-not $proc.HasExited) {
            Start-Sleep -Seconds 15
            try {
                $resp = Invoke-RestMethod -Uri "$url/api/health" -TimeoutSec 5 -ErrorAction Stop
                if ($resp.status -eq "healthy") {
                    Write-Host "[Tunnel Ping] OK: $url"
                    $failCount = 0
                } else {
                    $failCount++
                }
            } catch {
                $failCount++
                Write-Host "[Tunnel Ping] Retrying ($failCount/3)..."
            }

            if ($failCount -ge 3) {
                Write-Host "[Tunnel] 3 consecutive ping failures or tunnel dropped. Killing ssh to recycle..."
                if (-not $proc.HasExited) { $proc.Kill() }
                break
            }
        }
    } else {
        Write-Host "[Tunnel] URL not found or process exited prematurely. Cleaning up..."
        if (-not $proc.HasExited) { $proc.Kill() }
    }

    Write-Host "[Tunnel] Connection lost. Re-establishing in 3 seconds..."
    Start-Sleep -Seconds 3
}
