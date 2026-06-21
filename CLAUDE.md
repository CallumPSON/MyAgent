# MyAgent

## Skills (slash commands)

| Command | Description |
|---------|-------------|
| `/goal <condition>` | Set or display the current session goal |
| `/review [file]` | Code review of current branch changes |
| `/test [pattern]` | Run the test suite and report results |
| `/research <query>` | Web search and summarize findings |

## Agent capabilities

- **Code review & quality** — Analyzes diffs for bugs, security issues, and quality problems. Use `/review`.
- **Goal tracking** — Set a session goal with `/goal <condition>` and check progress throughout the session.
- **Testing & CI** — Auto-detects the test runner and reports pass/fail. Use `/test`.
- **Web search & research** — Searches the web and synthesizes findings. Use `/research <query>`.

## Setup

```bash
bash ./setup.sh --local
```
