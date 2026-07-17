# Global Google PageSpeed setup

PageSpeed is configured at the Windows user level, not inside this repository.
The same setup works from every project and can audit any public HTTP(S) URL.

## Run an audit

```powershell
# Mobile performance (default, one API request)
pagespeed https://opten.space/

# Mobile and desktop
pagespeed https://opten.space/ -Strategy both

# All Lighthouse categories
pagespeed https://opten.space/ -Strategy both -Category all

# Full Google response for later analysis
pagespeed https://opten.space/ -Json > pagespeed.json
```

The summary separates Lighthouse lab data from CrUX field data. A public URL
can have Lighthouse results but no CrUX data when Google does not have enough
real-user traffic for that URL or origin.

## Where the key and tools live

- Secret: Windows user environment variable `PAGESPEED_API_KEY`.
- Command: `%USERPROFILE%\.local\bin\pagespeed.cmd`.
- Implementation: `%USERPROFILE%\.local\bin\pagespeed.ps1`.
- MCP switch: `%USERPROFILE%\.local\bin\pagespeed-mcp.cmd`.
- Global policy: `%USERPROFILE%\.codex\AGENTS.md` and
  `%USERPROFILE%\.claude\CLAUDE.md`.

Do not put the API key in `.env`, `package.json`, `AGENTS.md`, source code, or
Git. The Google Cloud key should be restricted to the PageSpeed Insights API.

## Memory-safe MCP policy

The `pagespeed` MCP is disabled by default. Each connected AI client can keep a
separate PowerShell → npx → Node process chain alive, so routine audits must use
the one-shot `pagespeed <url>` command instead. That command calls Google and
exits as soon as the report is printed.

Only enable MCP when a task specifically requires its tools:

```powershell
pagespeed-mcp status
pagespeed-mcp on
# Restart Codex/Claude, complete the MCP-specific task, then:
pagespeed-mcp off
# Restart the client again so it cannot recreate the old connection.
```

`pagespeed-mcp on/off` manages both user-level Codex and Claude configurations.
Use `-Client codex` or `-Client claude` to target one client. Never add a
project-local duplicate; user-level configuration already covers every project.

The API measures public pages from Google's infrastructure. Use local
Lighthouse instead when a page is available only on `localhost`, behind VPN, or
behind authentication.

### Verified status (2026-07-17)

Live keyed requests succeeded for mobile performance, desktop performance,
Accessibility, and all four Lighthouse categories. Repeated lab runs naturally
returned different performance scores. Google emitted one transient
`429 RESOURCE_EXHAUSTED` response during verification, then accepted subsequent
keyed calls; the command therefore retries one 429 automatically. If the error
persists after that retry, inspect **Google Cloud → APIs & Services → PageSpeed
Insights API → Quotas** rather than replacing or committing the key.

## Block to copy into another project's `AGENTS.md`

```md
## Shared PageSpeed audits

Google PageSpeed Insights is configured globally for this Windows user. Run
`pagespeed <public-url>` from any directory; add `-Strategy both` for mobile +
desktop or `-Category all` for all Lighthouse categories. The command reads the
user-level `PAGESPEED_API_KEY`; never copy the key into this repository or ask
for its value. Keep the PageSpeed MCP disabled by default because it retains
PowerShell/npx/Node processes; normal audits must use the one-shot command. Only
for an MCP-specific task, run `pagespeed-mcp on`, restart the client, complete
the task, then run `pagespeed-mcp off` and restart again. Never add a
project-local duplicate. Keep Lighthouse lab metrics separate from CrUX field
metrics; missing CrUX data is not a failed Lighthouse audit.
```

## Set up another computer

Enable the PageSpeed Insights API in Google Cloud, create an API key restricted
to that API, and save it interactively for the Windows user:

```powershell
[Environment]::SetEnvironmentVariable(
  'PAGESPEED_API_KEY',
  '<paste-key-interactively>',
  'User'
)
```

Copy the four global command files to `%USERPROFILE%\.local\bin` and restart
terminal/AI clients so they inherit the user environment. Never send the actual
key through chat or commit it to a repository.
