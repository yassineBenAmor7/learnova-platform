@echo off
REM ==============================================================================
REM Learnova - PostgreSQL Automated Restore Script (Windows)
REM ==============================================================================

if "%~1"=="" (
    echo Usage: restore.bat ^<path_to_backup_file.dump^>
    exit /b 1
)

set BACKUP_FILE=%~1
if not exist "%BACKUP_FILE%" (
    echo Error: Backup file '%BACKUP_FILE%' not found.
    exit /b 1
)

set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=learnova-platform
set DB_USER=postgres

echo ==========================================
echo Starting Learnova Database Restore...
echo Host:     %DB_HOST%:%DB_PORT%
echo Database: %DB_NAME%
echo Source:   %BACKUP_FILE%
echo ==========================================

set /p confirm=Warning: This will overwrite data in %DB_NAME%. Continue? (y/N): 
if /i not "%confirm%"=="y" (
    echo Restore cancelled.
    exit /b 0
)

pg_restore -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c --if-exists -v "%BACKUP_FILE%"

if %ERRORLEVEL% equ 0 (
    echo Database restored successfully!
) else (
    echo Restore encountered an error with code %ERRORLEVEL%.
)
