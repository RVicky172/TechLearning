import type { TopicNode } from "@/data/types";

export const linuxScripting: TopicNode = {
  id: "linux-scripting",
  title: "Shell Scripting & Automation",
  iconName: "Code",
  link: "https://www.gnu.org/software/bash/manual/bash.html#Shell-Scripts",
  theory:
    "Bash scripts automate repetitive tasks — deployments, database backups, log rotation, health checks. A script is just a sequence of shell commands with variables, conditionals, and loops. Knowing the basics lets you write CI/CD pipeline steps, Docker entrypoints, and cron jobs.",
  theoryDetail: {
    keyConcepts: [
      "Shebang: #!/usr/bin/env bash — tells the OS which interpreter to use; always make the script executable with chmod +x",
      "set -euo pipefail: the safety triple — exit on error (-e), treat unset variables as errors (-u), propagate pipe failures (-o pipefail)",
      "Variables: NAME=\"value\"; echo \"$NAME\" — always quote variables to handle spaces",
      "Conditionals: if [[ -f \"$file\" ]]; then ... fi — use [[ ]] (bash) not [ ] (POSIX) for safer comparisons",
      "Loops: for f in *.log; do ... done; while IFS= read -r line; do ... done < file.txt",
      "Functions: my_func() { local x=\"$1\"; ... } — use local for function-scoped variables",
      "Exit codes: 0 = success, non-zero = failure — check with $?; exit 1 to fail explicitly",
      "Cron: crontab -e to edit; format: min hour day month weekday command; use @daily, @weekly shortcuts",
    ],
    whyItMatters:
      "Shell scripting is the glue of DevOps. Deployment scripts, CI pipeline steps, database backup cron jobs, and Docker entrypoints are all Bash. A 20-line script can automate a task that would take 15 minutes to do manually every day.",
    commonPitfalls: [
      "Not using set -euo pipefail — without it, the script silently continues after errors and can cause cascading damage",
      "Unquoted variables — MY_DIR=/path/with spaces; cd $MY_DIR fails; cd \"$MY_DIR\" works",
      "Using ls to iterate files — for file in $(ls); breaks on spaces; use for file in *.txt; or find instead",
      "Hardcoding credentials — never put passwords or tokens in a script; read from environment variables or a secrets manager",
    ],
    examples: [
      {
        title: "Production deployment script",
        description:
          "A safe deploy script with error handling, zero-downtime reload, and rollback on failure.",
        code: `#!/usr/bin/env bash
set -euo pipefail

# ── Configuration ──────────────────────────────────────────
APP_DIR="/var/www/myapp"
BACKUP_DIR="/var/backups/myapp"
LOG_FILE="/var/log/deploy.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# ── Backup current build ───────────────────────────────────
log "Backing up current build..."
mkdir -p "$BACKUP_DIR"
cp -r "$APP_DIR/dist" "$BACKUP_DIR/dist_$TIMESTAMP" 2>/dev/null || true

# ── Pull latest code ───────────────────────────────────────
log "Pulling latest code..."
cd "$APP_DIR"
git fetch origin main
git reset --hard origin/main

# ── Install dependencies ───────────────────────────────────
log "Installing dependencies..."
npm ci --only=production

# ── Build ─────────────────────────────────────────────────
log "Building..."
if ! npm run build; then
    log "ERROR: Build failed. Rolling back..."
    cp -r "$BACKUP_DIR/dist_$TIMESTAMP" "$APP_DIR/dist"
    exit 1
fi

# ── Restart app (zero-downtime with PM2) ──────────────────
log "Reloading application..."
pm2 reload ecosystem.config.js --update-env

log "Deployment complete!"

# ── Cron job (add with crontab -e) ────────────────────────
# Backup DB every day at 2:30 AM:
# 30 2 * * * /usr/local/bin/backup-db.sh >> /var/log/backup.log 2>&1`,
        language: "bash",
      },
    ],
  },
};
