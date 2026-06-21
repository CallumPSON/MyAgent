Run the project's test suite and report results.

Steps:
1. Detect the test runner by checking for: package.json (jest/vitest/mocha), pytest, go test, cargo test, Makefile test target, or other common patterns.
2. Run the appropriate test command. Common commands to try in order:
   - `npm test` / `npx vitest run` / `npx jest`
   - `pytest`
   - `go test ./...`
   - `cargo test`
   - `make test`
3. Parse the output and report:
   - Total tests: passed / failed / skipped
   - Any failing test names with their error messages
   - Any test output that looks like an important warning
4. If tests fail, suggest the most likely fix based on the error messages.
5. If $ARGUMENTS is provided (e.g. a file name or test name pattern), run only matching tests.

If no test runner is detected, say so and ask the user how to run tests in this project.
