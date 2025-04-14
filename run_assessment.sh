# CRIO_SOLUTION_AND_STUB_ONLY_START_MODULE_ONE
# CRIO_SOLUTION_AND_STUB_ONLY_END_MODULE_ONE
#!/bin/sh
# Exit script on error
set -e
 
# Read the first line starting with http from submit.txt (frontend URL)
FRONTEND_URL=$(grep -m 1 '^http' submit.txt)
# Remove trailing slash if present
FRONTEND_URL="${FRONTEND_URL%/}"
 
# Read the second line starting with http from submit.txt (backend URL)
BACKEND_URL=$(grep -m 2 '^http' submit.txt | tail -n 1)
# Remove trailing slash if present
BACKEND_URL="${BACKEND_URL%/}"
 
# Check if URLs are non-empty
if [ -z "$FRONTEND_URL" ] || [ -z "$BACKEND_URL" ]; then
    echo "ERROR: Both frontend and backend URLs must be provided in submit.txt"
    exit 1
fi

echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
 
cd assessment
rm -rf node_modules package-lock.json
# Update or create .env with both URLs
echo "FRONTEND_URL=$FRONTEND_URL" > .env
echo "BACKEND_URL=$BACKEND_URL" >> .env
 
# Check if dotenv is installed, otherwise install it
if npm list dotenv | grep -q 'dotenv'; then
    echo "dotenv is already installed."
else
    echo "Installing dotenv..."
    npm install dotenv > /dev/null 2>&1 &
fi
 
npm install
node runCypress.js
 
# Run Python script
python3 process_filtered_logs.py cypressResults.json
 
# Check if assessment_result.json exists
if [ -f "assesment_result.json" ]; then
    cp assesment_result.json ..
    echo "Assessment results generated"
else
    echo "Python script failed!!!"
fi
