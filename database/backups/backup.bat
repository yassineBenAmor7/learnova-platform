@echo off
REM ==============================================================================
REM Learnova - PostgreSQL Automated Backup Script (Windows)
REM ==============================================================================

set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=learnova-platform
set DB_USER=postgres

set BACKUP_DIR=%~dp0archives
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set dt=%%I
set TIMESTAMP=%dt:~0,8%_%dt:~8,6%
set BACKUP_FILE=%BACKUP_DIR%\learnova_backup_%TIMESTAMP%.dump

echo ==========================================
echo Starting Learnova Database Backup...
echo Host:     %DB_HOST%:%DB_PORT%
echo Database: %DB_NAME%
echo Target:   %BACKUP_FILE%
echo ==========================================

pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -F c -b -v -f "%BACKUP_FILE%" %DB_NAME%

if %ERRORLEVEL% equ 0 (
    echo Backup completed successfully!
    echo File: %BACKUP_FILE%
) else (
    echo Backup failed with error code %ERRORLEVEL%.
)
