<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the hero and copy editor in JSX; the existing TanStack TypeScript shell remains for framework compatibility.
- Keep AI calls in server functions with server-only SDK helpers so credentials never enter the browser.
- Use one saved assessment per editor, selected publicly by assessment ID; share generated copy through the root assessment provider so every section reads the same version.
- Keep applications readable and reviewable only by the assessment owner through authenticated server functions and owner-scoped RLS; applicant submission is public and write-only.
- Store user-facing display names in profiles, never authorization roles, to keep profile edits separate from permissions.
