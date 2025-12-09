# Admin Dashboard Guide

## Overview
This guide explains how to manage tests, questions, users, assignments, and analytics securely using the admin dashboard. All administrative actions are protected with authentication, role-based access controls, CSRF validation, and audit logging.

## Roles
- Admin (`super_admin`): Full permissions across users, tests, categories/modules, and assignments.
- Moderator (`junior_admin`): Manage tests, questions, categories/modules; limited user actions (no delete/reset).
- Viewer (`viewer` or `user`): Read-only access to analytics; cannot modify data.

## Test Management
- Create tests with title, exam, difficulty, duration, language, passing score, retake policy, category, and module.
- Edit tests to adjust parameters.
- Delete tests (cascade removes questions).
- Manage categories and modules: create, list, delete.
- Upload questions via CSV or add manually; update answer keys and metadata.

## User Management
- Create/update/delete users (Admin only); set roles.
- Reset passwords (Admin only).
- Assign tests to users; optionally manage groups and group-to-test assignments.
- Track progress using user attempts and rankings.

## Analytics and Logs
- View system analytics: totals, averages, completion rates, popular tests.
- Review audit logs of recent admin actions.

## Security
- Ensure `.env` contains edge function URLs and `VITE_CSRF_TOKEN`.
- Configure Supabase function secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ALLOWED_ORIGINS`, `CSRF_SECRET`.
- Use Cloudflare security headers and WAF rules for admin routes.

## Best Practices
- Validate inputs; use confirmation dialogs for destructive actions.
- Prefer bulk operations for efficiency.
- Keep roles minimal; grant elevated access only when necessary.

