function ScriptContent
{
    rm db.sqlite -ErrorAction SilentlyContinue
    npx typeorm-ts-node-commonjs schema:sync -d .\src\data-source.ts
}

Write-Host "WARNING: This will delete the database file and resync the schema!" -ForegroundColor Yellow
$confirmation = Read-Host "Are you sure you want to continue? (Y/N)"

if ($confirmation -eq 'Y' -or $confirmation -eq 'y')
{
    Write-Host "Deleting database file..." -ForegroundColor Red
    ScriptContent
    Write-Host "Database resync completed." -ForegroundColor Green
}
else
{
    Write-Host "Operation cancelled." -ForegroundColor Blue
}
pause