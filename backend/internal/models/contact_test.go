package models

import "testing"

func TestContactRequest_Validate(t *testing.T) {
	tests := []struct {
		name    string
		req     ContactRequest
		wantErr map[string]string
	}{
		{
			name:    "valid request",
			req:     ContactRequest{Name: "Ana Silva", Email: "ana@example.com", Message: "Olá!"},
			wantErr: nil,
		},
		{
			name:    "empty name",
			req:     ContactRequest{Name: "", Email: "ana@example.com", Message: "Olá!"},
			wantErr: map[string]string{"name": "required"},
		},
		{
			name:    "empty email",
			req:     ContactRequest{Name: "Ana", Email: "", Message: "Olá!"},
			wantErr: map[string]string{"email": "required"},
		},
		{
			name:    "invalid email format",
			req:     ContactRequest{Name: "Ana", Email: "notanemail", Message: "Olá!"},
			wantErr: map[string]string{"email": "invalid format"},
		},
		{
			name:    "empty message",
			req:     ContactRequest{Name: "Ana", Email: "ana@example.com", Message: ""},
			wantErr: map[string]string{"message": "required"},
		},
		{
			name:    "multiple invalid fields",
			req:     ContactRequest{Name: "", Email: "bad", Message: ""},
			wantErr: map[string]string{"name": "required", "email": "invalid format", "message": "required"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := tt.req.Validate()
			if len(got) != len(tt.wantErr) {
				t.Fatalf("got %d errors, want %d: %v", len(got), len(tt.wantErr), got)
			}
			for field, msg := range tt.wantErr {
				if got[field] != msg {
					t.Errorf("errors[%q] = %q, want %q", field, got[field], msg)
				}
			}
		})
	}
}
