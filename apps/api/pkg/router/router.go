package router

import (
	"api/pkg/handlers"
	"api/pkg/middleware"
	"net/http"
)

func Router(audience, domain string) http.Handler {
	router := http.NewServeMux()

	// Uncommented auth routes if needed
	// router.HandleFunc("/auth/login",
	// middleware.CorsMiddlewareFunc(handlers.LoginHandler),
	// )
	// router.HandleFunc("/auth/signup",
	// middleware.CorsMiddlewareFunc(handlers.SignUpHandler),
	// )
	// router.HandleFunc("/auth/refresh",
	// middleware.CorsMiddlewareFunc(handlers.RefreshHandler),
	// )

	// Tenant routes
	router.HandleFunc("/api/tenants", handlers.TenantsHandler)
	router.HandleFunc("/api/tenant", handlers.TenantHandler)

	// Test routes
	router.HandleFunc("/test/api/public", handlers.PublicApiHandler)
	router.Handle("/test/api/private",
		middleware.CorsMiddleware(
			middleware.EnsureValidToken(
				http.HandlerFunc(handlers.AdminApiHandler),
			),
		),
	)
	router.Handle("/test/api/admin",
		middleware.EnsureValidToken(
			http.HandlerFunc(handlers.ProtectedApiHandler),
		),
	)

	// Catch-all route for undefined routes
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "403 Forbidden", http.StatusForbidden)
	})

	return router
}
