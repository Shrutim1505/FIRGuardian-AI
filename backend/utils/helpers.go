package utils

import (
	"fmt"
	"math/rand"
	"strings"
	"time"
)

func GenerateFIRNumber() string {
	rand.Seed(time.Now().UnixNano())
	year := time.Now().Year()
	sequence := rand.Intn(9999) + 1
	return fmt.Sprintf("FIR/%d/%04d", year, sequence)
}

func ToLower(s string) string {
	return strings.ToLower(s)
}

func Contains(s, substr string) bool {
	return strings.Contains(s, substr)
}

func FormatTime(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

func Paginate(page, limit int) (int, int) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}
	
	offset := (page - 1) * limit
	return offset, limit
}