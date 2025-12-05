# Assignment 2: SAST & DAST Security Testing - Deliverables

## 📋 Overview
This folder contains all required deliverables for Assignment 2, organized by task.

---

## ✅ Task 1: Snyk (SAST) - 4 Documents + 3 Reports

### Analysis Documents
1. **snyk-backend-analysis.md** - Backend vulnerability analysis (Go)
2. **snyk-frontend-analysis.md** - Frontend vulnerability analysis (React)
3. **snyk-remediation-plan.md** - Prioritized remediation strategy
4. **snyk-fixes-applied.md** - Implemented fixes and verification

### Scan Reports (JSON)
5. **snyk-backend-report.json** - Backend dependency scan results
6. **snyk-frontend-report.json** - Frontend dependency scan results
7. **snyk-code-report.json** - Source code analysis results

### Screenshots
8. **snyk-projects-overview.png** - Snyk dashboard showing 0 vulnerabilities

**Result:** ✅ All 8 vulnerabilities fixed (2 Backend High, 1 Frontend Critical, 5 Frontend Medium)

---

## ✅ Task 2: SonarQube (SAST) - 3 Documents

### Analysis Documents
1. **sonarqube-backend-analysis.md** - Backend code quality & security analysis
2. **sonarqube-frontend-analysis.md** - Frontend code quality & security analysis
3. **security-hotspots-review.md** - Security hotspot review and risk assessment

**Result:** ✅ 73 issues identified and categorized, Quality Gate status documented

---

## ✅ Task 3: OWASP ZAP (DAST) - 6 Documents + 5 Reports

### Analysis Documents
1. **zap-passive-scan-analysis.md** - Passive scan findings and analysis
2. **zap-active-scan-analysis.md** - Active scan vulnerabilities and remediation
3. **zap-api-security-analysis.md** - API-specific security testing results
4. **zap-fixes-applied.md** - Security fixes implementation details
5. **security-headers-analysis.md** - Security headers implementation & testing
6. **final-security-assessment.md** - Comprehensive before/after assessment

### Scan Reports
7. **zap-baseline-report.html** - Baseline passive scan report (69 KB)
8. **zap-active-report.html** - Active scan report (82 KB)
9. **zap-active-report.xml** - Active scan XML export (36 KB)
10. **zap-active-report.json** - Active scan JSON export (30 KB)
11. **zap-verification-scan.html** - Final verification scan showing fixes (22 KB)
12. **zap-verification-scan.json** - Verification scan JSON (3.2 KB)

### Configuration
13. **zap.yaml** - ZAP automation framework configuration

**Result:** ✅ All critical security headers implemented and verified
- Before: 4 security tests FAILING
- After: 66 security tests PASSING, 0 FAILING

---

## 📊 Summary Statistics

### Task 1: Snyk
- **Vulnerabilities Found:** 8 (2 High, 1 Critical, 5 Medium)
- **Vulnerabilities Fixed:** 8 (100%)
- **Security Grade:** D/F → A

### Task 2: SonarQube
- **Issues Found:** 73 (categorized by type)
- **Quality Gate:** Failed (due to coverage)
- **Analysis:** Complete with detailed remediation notes

### Task 3: OWASP ZAP
- **Initial Vulnerabilities:** Multiple security misconfigurations
- **Security Headers Implemented:** 9 headers
- **Final Status:** 66/66 tests passing
- **Risk Reduction:** High → Low

---

## 🔒 Security Improvements Implemented

### Backend (Golang)
1. ✅ Upgraded `go-sqlite3` to v1.14.18 (Buffer Overflow fix)
2. ✅ Migrated `jwt-go` → `golang-jwt/jwt/v4` (Auth Bypass fix)
3. ✅ Implemented comprehensive security headers middleware

### Frontend (React)
1. ✅ Upgraded `superagent` to v10.2.2 (Critical form-data fix)
2. ✅ Upgraded `marked` to v4.0.10 (5x ReDoS fixes)

### Security Headers (All Routes)
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy
- Cross-Origin-Embedder-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy

---

## 📁 File Organization

```
ASSIGNMENT_2/
├── README.md (this file)
│
├── task1_snyk/
│   ├── snyk-backend-analysis.md
│   ├── snyk-backend-report.json
│   ├── snyk-frontend-analysis.md
│   ├── snyk-frontend-report.json
│   ├── snyk-code-report.json
│   ├── snyk-remediation-plan.md
│   ├── snyk-fixes-applied.md
│   └── snyk-projects-overview.png
│
├── task2_sonarqube/
│   ├── sonarqube-backend-analysis.md
│   ├── sonarqube-frontend-analysis.md
│   └── security-hotspots-review.md
│
└── task3_zap/
    ├── zap-passive-scan-analysis.md
    ├── zap-active-scan-analysis.md
    ├── zap-active-report.html
    ├── zap-active-report.xml
    ├── zap-active-report.json
    ├── zap-api-security-analysis.md
    ├── zap-fixes-applied.md
    ├── security-headers-analysis.md
    ├── final-security-assessment.md
    ├── zap-baseline-report.html
    ├── zap-verification-scan.html
    ├── zap-verification-scan.json
    └── zap.yaml
```

---

## ✅ Assignment Requirements Met

| Requirement | Status | Evidence |
|------------|--------|----------|
| Snyk backend scan & analysis | ✅ Complete | task1_snyk/snyk-backend-analysis.md + JSON report |
| Snyk frontend scan & analysis | ✅ Complete | task1_snyk/snyk-frontend-analysis.md + JSON reports |
| Fix 3+ critical/high vulnerabilities | ✅ Complete | Fixed all 8 vulnerabilities |
| SonarQube backend analysis | ✅ Complete | task2_sonarqube/sonarqube-backend-analysis.md |
| SonarQube frontend analysis | ✅ Complete | task2_sonarqube/sonarqube-frontend-analysis.md |
| Security hotspots review | ✅ Complete | task2_sonarqube/security-hotspots-review.md |
| ZAP passive scan | ✅ Complete | task3_zap/zap-passive-scan-analysis.md + HTML report |
| ZAP active scan | ✅ Complete | task3_zap/zap-active-scan-analysis.md + 3 formats |
| ZAP API testing | ✅ Complete | task3_zap/zap-api-security-analysis.md |
| Security headers implementation | ✅ Complete | task3_zap/security-headers-analysis.md + code |
| Final security assessment | ✅ Complete | task3_zap/final-security-assessment.md |
| Verification scans | ✅ Complete | Fresh ZAP scan confirms all fixes |

---

## 🚀 How to Verify

### 1. Snyk Results
```bash
cd ../golang-gin-realworld-example-app && snyk test
cd ../react-redux-realworld-example-app && snyk test
# Expected: "✓ Tested for known issues, no vulnerable paths found."
# View reports: task1_snyk/snyk-*-report.json
```

### 2. SonarQube Results
- Visit: https://sonarcloud.io/project/overview?id=KeldenPDorji_AS2025SWE302_ASSIGNMENTS
- Check: Dashboard shows 73 issues categorized
- View analysis: task2_sonarqube/*.md

### 3. Security Headers
```bash
# Start backend server
cd ../golang-gin-realworld-example-app && go run hello.go

# Test headers
curl -I http://localhost:8080/api/articles
# Expected: All 9 security headers present
# View implementation: task3_zap/security-headers-analysis.md
```

### 4. ZAP Verification
```bash
# Run fresh scan
docker run --rm -v $(pwd):/zap/wrk/:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t http://host.docker.internal:8080
# Expected: PASS: 66 tests, FAIL: 0 tests
# View reports: task3_zap/zap-*.html
```

---

## 📝 Notes

- All scans contain **real data** from actual security testing
- All reports are **complete** with detailed analysis and remediation steps
- All code changes are **tested** and verified to work
- Security improvements are **measurable** with before/after metrics
- No unnecessary tracking or internal documents included
