# Fix incorrect Tailwind v4 @reference directives across the project
# Replaces all occurrences of: @reference "@tailwindcss";
# with:                        @reference "tailwindcss";

param(
  [string]$RootPath = "."
)

Write-Host "Scanning for incorrect Tailwind @reference directives under" (Resolve-Path $RootPath)

# This must match the line exactly as it appears in your .vue files
$search  = '@reference "@tailwindcss";'
$replace = '@reference "tailwindcss";'

Get-ChildItem -Path $RootPath -Recurse -File -Filter *.vue 2>$null |
  ForEach-Object {
    $path = $_.FullName
    $content = Get-Content -Path $path -Raw
    if ($content.Contains($search)) {
      Write-Host "Fixing:" $path
      $newContent = $content.Replace($search, $replace)
      Set-Content -Path $path -Value $newContent -NoNewline
    }
  }

Write-Host "Done. Re-run your build: pnpm run build"