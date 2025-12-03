package common

import (
	"github.com/gin-gonic/gin"
)

// SecurityHeaders middleware adds security headers to all responses
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Prevent clickjacking attacks
		c.Header("X-Frame-Options", "DENY")

		// Prevent MIME-sniffing attacks
		c.Header("X-Content-Type-Options", "nosniff")

		// Enable XSS protection (legacy browsers)
		c.Header("X-XSS-Protection", "1; mode=block")

		// Enforce HTTPS (only add in production with HTTPS)
		// Commented out for local development
		// c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

		// Control referrer information
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")

		// Content Security Policy
		// Note: This CSP allows inline scripts for React development
		// Tighten this for production
		csp := "default-src 'self'; " +
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
			"font-src 'self' https://fonts.gstatic.com; " +
			"img-src 'self' data: https:; " +
			"connect-src 'self' https://conduit.productionready.io; " +
			"frame-ancestors 'none';"
		c.Header("Content-Security-Policy", csp)

		// Permissions Policy (restrict browser features)
		c.Header("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()")

		// Cross-Origin Policies for Spectre mitigation
		c.Header("Cross-Origin-Embedder-Policy", "require-corp")
		c.Header("Cross-Origin-Opener-Policy", "same-origin")
		c.Header("Cross-Origin-Resource-Policy", "same-origin")

		// Remove server information
		// Note: Gin doesn't set X-Powered-By, but we ensure it's not added

		c.Next()
	}
}
