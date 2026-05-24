import type { TopicNode } from "@/data/types";

export const linuxFundamentals: TopicNode = {
  id: "linux-fundamentals",
  title: "Linux & Shell Fundamentals",
  iconName: "Terminal",
  link: "https://www.gnu.org/software/bash/manual/bash.html",
  theory:
    "Linux is the operating system running virtually every web server, container, and cloud VM. As a fullstack developer you will SSH into servers, manage processes, read logs, configure file permissions, and script routine tasks. Fluency with the shell is the multiplier that makes everything else faster.",
  theoryDetail: {
    keyConcepts: [
      "Filesystem hierarchy: /etc (config), /var/log (logs), /usr/local/bin (installed binaries), /home (user dirs), /tmp (ephemeral)",
      "File permissions: r/w/x bits for owner, group, world — chmod 755 makes executable; chmod 600 protects private keys",
      "stdin/stdout/stderr: the three standard streams — redirect with >, >>, 2>&1; pipe with | to chain commands",
      "Process management: ps aux (list), kill -9 <pid> (force kill), & (background), nohup (persist after logout)",
      "Environment variables: export KEY=value in the shell; printenv to list; source .env to load a file into current shell",
      "Package managers: apt (Debian/Ubuntu), yum/dnf (RHEL/CentOS), apk (Alpine in Docker) — always run apt update before apt install",
      "SSH: ssh user@host -i ~/.ssh/key — key-based auth; scp for file copy; ssh -L for local port forwarding (tunnel)",
    ],
    whyItMatters:
      "Every cloud deployment — EC2, Lightsail, VPS, container — runs Linux. SSH into a broken production server at 2 AM and grep the logs, find what's consuming memory, restart a service — these are basic survival skills for any backend or fullstack developer.",
    commonPitfalls: [
      "Running rm -rf without verifying the path — always echo the path first, or use trash-cli instead",
      "chmod 777 on files — giving world read/write/execute is a security hole; use 755 for executables, 644 for readable files, 600 for secrets",
      "Hardcoding credentials in shell history — use env vars or a secrets manager; HISTIGNORE can exclude sensitive commands",
      "Not using sudo carefully — running commands as root can cause irreversible damage; understand what a command does before elevating",
    ],
    examples: [
      {
        title: "Essential shell commands every developer should know",
        description: "Organised by category — navigation, files, processes, networking, and logs.",
        code: `# ── Navigation ────────────────────────────────────────────
pwd                          # print working directory
ls -lah                      # list with human-readable sizes and hidden files
cd -                         # go back to previous directory
find /var/log -name "*.log" -mtime -7   # files modified in last 7 days

# ── File operations ────────────────────────────────────────
cp -r src/ dst/              # recursive copy
mv old.txt new.txt           # move/rename
rm -rf dist/                 # remove directory recursively (careful!)
tar -czf archive.tar.gz dir/ # compress; -xzf to extract
cat file.txt                 # print file
less file.txt                # pager (q to quit)
head -n 50 file.txt          # first 50 lines
tail -f /var/log/app.log     # stream new lines (follow)

# ── Search ────────────────────────────────────────────────
grep -r "ERROR" /var/log/    # recursive text search
grep -n "exception" app.log  # show line numbers
grep -i "warning" app.log    # case-insensitive
grep -v "DEBUG" app.log      # invert — exclude DEBUG lines

# ── Processes ─────────────────────────────────────────────
ps aux | grep node           # find Node.js processes
kill -15 1234                # graceful SIGTERM to PID 1234
kill -9 1234                 # force kill (SIGKILL) — last resort
top                          # live process monitor (q to quit)
htop                         # improved top (install separately)
lsof -i :3000                # what process is listening on port 3000

# ── Disk & Memory ─────────────────────────────────────────
df -h                        # disk usage per filesystem
du -sh *                     # size of each item in cwd
free -h                      # memory usage

# ── Networking ────────────────────────────────────────────
curl -I https://example.com  # HTTP headers only
curl -X POST -H "Content-Type: application/json" -d '{"key":"val"}' http://localhost:3000/api
wget -O file.zip https://example.com/file.zip
netstat -tulpn | grep LISTEN  # listening ports
ss -tlnp                     # modern netstat alternative`,
        language: "bash",
      },
    ],
  },
};
