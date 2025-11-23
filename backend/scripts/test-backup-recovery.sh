#!/bin/bash

# 🔄 BACKUP RECOVERY TESTING SCRIPT
# This script tests all backup and recovery functionality

set -e

API_URL="${API_URL:-http://localhost:3000}"
AUTH_TOKEN="${AUTH_TOKEN:-}"
ADMIN_TOKEN="${ADMIN_TOKEN:-}"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test functions
test_api_health() {
  log_info "Testing API health..."
  
  response=$(curl -s -w "\n%{http_code}" "$API_URL/health")
  http_code=$(echo "$response" | tail -n1)
  
  if [ "$http_code" = "200" ]; then
    log_success "API is healthy (HTTP $http_code)"
    return 0
  else
    log_error "API unhealthy (HTTP $http_code)"
    return 1
  fi
}

test_backup_creation() {
  log_info "Testing backup creation..."
  
  if [ -z "$ADMIN_TOKEN" ]; then
    log_warning "No admin token provided, skipping backup creation test"
    return 0
  fi
  
  response=$(curl -s -X POST "$API_URL/api/backups/create" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json")
  
  if echo "$response" | grep -q '"success":true'; then
    log_success "Backup created successfully"
    echo "$response" | grep -o '"filename":"[^"]*"'
    return 0
  else
    log_error "Backup creation failed"
    echo "$response"
    return 1
  fi
}

test_backup_list() {
  log_info "Testing backup list..."
  
  if [ -z "$ADMIN_TOKEN" ]; then
    log_warning "No admin token provided, skipping backup list test"
    return 0
  fi
  
  response=$(curl -s -X GET "$API_URL/api/backups/list" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  
  if echo "$response" | grep -q '"success":true'; then
    count=$(echo "$response" | grep -o '"count":[0-9]*' | head -1 | cut -d: -f2)
    log_success "Backups listed successfully (Count: $count)"
    return 0
  else
    log_error "Backup list failed"
    echo "$response"
    return 1
  fi
}

test_backup_stats() {
  log_info "Testing backup statistics..."
  
  if [ -z "$ADMIN_TOKEN" ]; then
    log_warning "No admin token provided, skipping backup stats test"
    return 0
  fi
  
  response=$(curl -s -X GET "$API_URL/api/backups/stats" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  
  if echo "$response" | grep -q '"success":true'; then
    log_success "Backup statistics retrieved"
    echo "$response" | grep -o '"totalBackups":[0-9]*'
    return 0
  else
    log_error "Backup stats failed"
    echo "$response"
    return 1
  fi
}

test_scheduler_status() {
  log_info "Testing scheduler status..."
  
  if [ -z "$ADMIN_TOKEN" ]; then
    log_warning "No admin token provided, skipping scheduler test"
    return 0
  fi
  
  response=$(curl -s -X GET "$API_URL/api/backups/scheduler/status" \
    -H "Authorization: Bearer $ADMIN_TOKEN")
  
  if echo "$response" | grep -q '"success":true'; then
    log_success "Scheduler status retrieved"
    echo "$response" | grep -o '"enabled":[a-z]*'
    return 0
  else
    log_error "Scheduler status failed"
    echo "$response"
    return 1
  fi
}

test_authentication() {
  log_info "Testing authentication requirement..."
  
  response=$(curl -s -w "\n%{http_code}" "$API_URL/api/backups/list")
  http_code=$(echo "$response" | tail -n1)
  
  if [ "$http_code" = "401" ]; then
    log_success "Authentication required (HTTP $http_code)"
    return 0
  else
    log_error "Authentication not properly enforced (HTTP $http_code)"
    return 1
  fi
}

# Main execution
main() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║         🔄 BACKUP & RECOVERY TESTING SCRIPT                ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  
  log_info "API URL: $API_URL"
  echo ""
  
  # Run tests
  tests_passed=0
  tests_failed=0
  
  if test_api_health; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  if test_authentication; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  if test_backup_list; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  if test_backup_stats; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  if test_scheduler_status; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  if test_backup_creation; then
    ((tests_passed++))
  else
    ((tests_failed++))
  fi
  
  echo ""
  echo "╔════════════════════════════════════════════════════════════╗"
  echo "║                    TEST RESULTS                            ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  log_success "Tests Passed: $tests_passed"
  log_error "Tests Failed: $tests_failed"
  
  if [ "$tests_failed" = "0" ]; then
    echo ""
    echo "🎉 All tests passed!"
    exit 0
  else
    echo ""
    echo "⚠️  Some tests failed"
    exit 1
  fi
}

# Run main
main
