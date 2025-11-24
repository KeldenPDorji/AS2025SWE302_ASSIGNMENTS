# Task 2: SonarQube Setup Guide

## SonarCloud Setup Steps

### Step 1: Create SonarCloud Account ✅
1. Visit: https://sonarcloud.io/
2. Click "Log in" → "Sign up with GitHub"
3. Authorize SonarCloud

### Step 2: Import Your Repository

1. After logging in, click "+" icon (top right) or "Analyze new project"
2. You'll see your GitHub organizations
3. Select your repository: `AS2025SWE302_ASSIGNMENTS`
4. Click "Set Up"

### Step 3: Choose Analysis Method

SonarCloud will ask how you want to analyze your code:

**Choose: "With GitHub Actions"** (Recommended)

This will:
- Analyze automatically on every push
- Show results in pull requests
- Keep history of all scans

### Step 4: Configure Backend Project

SonarCloud needs a configuration file for the Go backend.

**Create this file:** `golang-gin-realworld-example-app/sonar-project.properties`

```properties
sonar.projectKey=KeldenPDorji_AS2025SWE302_ASSIGNMENTS_backend
sonar.organization=keldenpdorji

# This is the name and version displayed in the SonarCloud UI.
sonar.projectName=RealWorld Backend (Go)
sonar.projectVersion=1.0

# Path to source directories
sonar.sources=.

# Encoding of the source code. Default is UTF-8
sonar.sourceEncoding=UTF-8

# Exclusions
sonar.exclusions=**/vendor/**,**/*_test.go,**/scripts/**

# Coverage (if you have coverage reports)
sonar.go.coverage.reportPaths=coverage.out

# Language
sonar.language=go
```

### Step 5: Configure Frontend Project

**Create this file:** `react-redux-realworld-example-app/sonar-project.properties`

```properties
sonar.projectKey=KeldenPDorji_AS2025SWE302_ASSIGNMENTS_frontend
sonar.organization=keldenpdorji

# This is the name and version displayed in the SonarCloud UI.
sonar.projectName=RealWorld Frontend (React)
sonar.projectVersion=1.0

# Path to source directories
sonar.sources=src

# Encoding of the source code
sonar.sourceEncoding=UTF-8

# Exclusions
sonar.exclusions=**/node_modules/**,**/build/**,**/public/**,**/*.test.js,**/setupTests.js

# Test files
sonar.tests=src
sonar.test.inclusions=**/*.test.js

# Coverage (if available)
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

### Step 6: Create GitHub Actions Workflow

SonarCloud will generate a workflow file for you. It should look like this:

**File:** `.github/workflows/sonarcloud.yml`

```yaml
name: SonarCloud Analysis

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Shallow clones should be disabled for better analysis
      
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Step 7: Add Sonar Token to GitHub

1. SonarCloud will provide you with a token
2. Go to your GitHub repo: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `SONAR_TOKEN`
5. Value: [paste the token from SonarCloud]
6. Click "Add secret"

### Step 8: Commit and Push

```bash
cd /Users/keldendrac/Desktop/swe302_assignments

# Add the configuration files
git add golang-gin-realworld-example-app/sonar-project.properties
git add react-redux-realworld-example-app/sonar-project.properties
git add .github/workflows/sonarcloud.yml

# Commit
git commit -m "Add SonarCloud configuration"

# Push to trigger analysis
git push
```

### Step 9: View Results

1. Go to: https://sonarcloud.io/organizations/keldenpdorji/projects
2. Wait 2-5 minutes for analysis to complete
3. Click on each project to see results

---

## What You'll See in SonarCloud

### Dashboard Metrics:
- **Bugs:** Code that is likely to cause errors
- **Vulnerabilities:** Security issues
- **Code Smells:** Maintainability issues
- **Coverage:** Test coverage percentage
- **Duplications:** Duplicated code blocks
- **Security Hotspots:** Potential security issues to review

### Quality Gate:
- **Pass/Fail:** Based on configured thresholds
- Default thresholds:
  - No new bugs
  - No new vulnerabilities
  - Coverage on new code > 80%
  - Duplications on new code < 3%

---

## Next Steps After Analysis

Once the analysis completes, you'll need to:

1. **Take Screenshots:**
   - Backend dashboard
   - Frontend dashboard
   - Issues list
   - Security hotspots

2. **Create Documentation:**
   - `sonarqube-backend-analysis.md`
   - `sonarqube-frontend-analysis.md`
   - `security-hotspots-review.md`

3. **Review and Fix Issues:**
   - Focus on bugs and vulnerabilities
   - Document security hotspots
   - Implement recommended improvements

---

*Setup Guide Created: November 24, 2025*
