import dotenv from 'dotenv';
import path from 'path';

// Load .env from monorepo root (always resolves from process.cwd())
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// In production/CI, secrets are injected as env vars (e.g., via hcp vault-secrets run)

export const loadEnv = () => { dotenv.config({ path: path.resolve(process.cwd(), '.env') }); }
