# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)


## Optional Turso (libsql) analytics + Ollama model registry

The `supabase/functions/chat` edge function can persist lightweight chat analytics and maintain an Ollama model registry in Turso.

Configure these environment variables in Supabase functions settings:

- `TURSO_DATABASE_URL` (example: `libsql://database-indigo-river-vercel-icfg-qivv1kbkreujp9aduvoqvzh0.aws-us-east-1.turso.io`)
- `TURSO_AUTH_TOKEN`
- `OLLAMA_APP_BUILDER_MODEL` (optional, default: `qwen2.5-coder:32b`)

If `TURSO_AUTH_TOKEN` is missing, the app still works normally and simply skips persistence.

### Download and sync Ollama model to cloud storage

Use the helper script:

```sh
./scripts/sync-ollama-model.sh "qwen2.5-coder:32b" ./artifacts/qwen2.5-coder-32b.tar.gz
```

To auto-upload after export, provide an upload command:

```sh
STORAGE_UPLOAD_COMMAND='aws s3 cp "{file}" s3://my-bucket/ollama/' ./scripts/sync-ollama-model.sh
```
