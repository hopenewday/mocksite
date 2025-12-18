# Mocksite Admin

This is the admin application for Mocksite, built with Vue 3, Vite, and Vuestic UI.

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Setup

1.  **Navigate to the admin directory:**

    ```bash
    cd admin
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file:**

    Create a `.env` file in the `admin` directory by copying the example file:

    ```bash
    cp .env.example .env
    ```

    You will need to populate this file with your Supabase project credentials.

    -   `VITE_SUPABASE_URL`: Your Supabase project URL.
    -   `VITE_SUPABASE_ANON_KEY`: Your Supabase project anonymous key.
    -   `VITE_CSRF_TOKEN`: A secret token for CSRF protection. This should match the `CSRF_SECRET` in your Supabase Edge Functions.

4.  **Create an admin user in Supabase:**

    To log in to the admin panel, you need a user with an `admin` role.

    a.  Go to your Supabase project's SQL Editor.
    b.  Run the following SQL to create a new user. Replace the placeholder with a secure password.

        ```sql
        -- Create a new user for the admin panel
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_sent_at, confirmed_at)
        VALUES
          ('00000000-0000-0000-0000-000000000000', uuid_generate_v4(), 'authenticated', 'authenticated', 'admin@example.com', crypt('your-secure-password', gen_salt('bf')), NOW(), '', NULL, NULL, '{"provider":"email","providers":["email"]}', '{"role":"super_admin"}', NOW(), NOW(), '', '', NULL, NOW());
        ```

    c.  The above script sets the user's role to `super_admin` in the `raw_user_meta_data`. Your application logic can then use this role for authorization.

### Running the Development Server

Once the setup is complete, you can start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.
