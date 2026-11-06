// Restored root-level article URLs (old machinefanatic.com paths with backlinks).
// Literal imports only, never a template-literal expression (see CLAUDE.md).
export const legacyLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  "what-is-a-plunge-saw": () => import("./legacy/what-is-a-plunge-saw"),
  "best-cordless-circular-saw": () => import("./legacy/best-cordless-circular-saw"),
  "what-does-a-lathe-do": () => import("./legacy/what-does-a-lathe-do"),
  "ryobi-p516-vs-p517": () => import("./legacy/ryobi-p516-vs-p517"),
  "dewalt-780-vs-festool-kapex": () => import("./legacy/dewalt-780-vs-festool-kapex"),
};
export const legacySlugs = Object.keys(legacyLoaders);
