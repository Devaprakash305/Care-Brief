# CareBrief AI

## Supabase setup

The frontend reads and writes Supabase using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.local`. The local environment file is ignored by git.

Run the SQL in [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor before using the application. It creates the tables used by the frontend and enables RLS for authenticated users. The current UI does not include an authentication screen, so configure your Supabase auth/session flow before exposing patient data.

The app expects these tables: `user_profiles`, `patients`, `clinical_notes`, `discharge_summaries`, and `activity_logs`. Summary content and verification are stored as JSONB in `discharge_summaries`.

Because the current frontend has no login screen, enable **Anonymous Sign-Ins** in Supabase under **Authentication -> Providers -> Anonymous**. The app creates an anonymous session at startup so the existing authenticated-only RLS policies can authorize database access. For production clinical data, replace this with real user authentication.

If anonymous sign-in reports `null value in column "full_name" of relation "profiles"`, run [supabase/fix-anonymous-profile.sql](supabase/fix-anonymous-profile.sql) in the Supabase SQL Editor. This fixes the existing profile trigger contract that is separate from the CareBrief tables.

## OpenRouter setup

Summary generation runs in the Supabase Edge Function at [supabase/functions/generate-summary/index.ts](supabase/functions/generate-summary/index.ts). Store the OpenRouter key as a Supabase secret, never as a `VITE_*` variable:

```bash
supabase secrets set OPENROUTER_API_KEY="replace-with-a-new-key"
supabase functions deploy generate-summary
```

The OpenRouter key shared during development has been exposed and must be revoked and replaced before deployment.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
