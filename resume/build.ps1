# Master:   .\build.ps1
#           resume.tex -> assets\Satyam_Patel_Resume.pdf (the file the portfolio serves)
# Tailored: .\build.ps1 -Job kpmg-ai-builder
#           tailored\kpmg-ai-builder.tex -> tailored\kpmg-ai-builder\Satyam_Patel_Resume.pdf
#           (tailored\ is git-ignored, so job-specific versions stay on this machine)
param([string]$Job)
$ErrorActionPreference = "Stop"
Push-Location $PSScriptRoot
try {
  if ($Job) {
    $tex = "tailored\$Job.tex"
    $out = "tailored\$Job"
    if (-not (Test-Path $tex)) { throw "No $tex — copy resume.tex to it first." }
    New-Item -ItemType Directory -Force $out | Out-Null
  } else {
    $tex = "resume.tex"
    $out = "build"
    New-Item -ItemType Directory -Force $out | Out-Null
  }

  # pdflatex twice so links/refs settle
  foreach ($pass in 1..2) {
    pdflatex -interaction=nonstopmode -halt-on-error -jobname=Satyam_Patel_Resume -output-directory="$out" "$tex" | Out-Null
    if ($LASTEXITCODE -ne 0) { Get-Content "$out\Satyam_Patel_Resume.log" -Tail 40; throw "pdflatex failed (pass $pass)" }
  }
  # TeX wraps log lines at 79 chars, so unwrap before looking for the page count
  $log = (Get-Content -Raw "$out\Satyam_Patel_Resume.log") -replace "\r?\n", ""
  if ($log -notmatch "Output written on .*?\((\d+) pages?") { throw "Couldn't read the page count from the log" }
  $pages = $Matches[1]

  if ($Job) {
    Write-Host "Built $out\Satyam_Patel_Resume.pdf ($pages pages)"
  } else {
    Copy-Item "$out\Satyam_Patel_Resume.pdf" ..\assets\Satyam_Patel_Resume.pdf -Force
    Write-Host "Built master ($pages pages) and updated assets\Satyam_Patel_Resume.pdf"
  }
  if ([int]$pages -gt 2) { Write-Warning "Resume is $pages pages; trim it back to 2." }
}
finally { Pop-Location }
