@echo off
echo Starting local web server for portfolio...
echo.
echo Open your browser and navigate to:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
