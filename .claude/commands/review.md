Perform a thorough code review of the current branch changes.

Steps:
1. Run `git diff main...HEAD` (or `git diff HEAD` if on main) to get all changed files and diffs.
2. For each changed file, review for:
   - Correctness bugs: logic errors, off-by-one errors, unhandled edge cases, race conditions
   - Security issues: injection vulnerabilities, hardcoded secrets, unsafe deserialization, missing input validation
   - Code quality: duplication, unnecessary complexity, poor naming, missing error handling at system boundaries
   - Test coverage: are the changes tested? are edge cases covered?
3. Present findings grouped by severity:
   - **Critical** — must fix before merging (bugs, security issues)
   - **Suggestion** — improvements worth considering
4. End with a one-line summary verdict: ready to merge / needs changes.

If $ARGUMENTS is provided, treat it as a specific file or concern to focus the review on.
