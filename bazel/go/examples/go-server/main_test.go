package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHelloServer(t *testing.T) {
	request, _ := http.NewRequest(http.MethodGet, "/test", nil)
	response := httptest.NewRecorder()

	HelloServer(response, request)

	if response.Code != http.StatusOK {
		t.Errorf("Expected status OK, got %v", response.Code)
	}

	if response.Body.String() != "Hello what, test!" {
		t.Errorf("Expected 'Hello what, test!', got %v", response.Body.String())
	}
}
