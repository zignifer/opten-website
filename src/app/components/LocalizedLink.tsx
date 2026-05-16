// Post-Phase-3 fix: drop-in <Link> replacement that preserves the /en/ URL prefix
// when the user is currently on a /en/* page. Without this every internal link
// (footer, navbar, "Account") strips the prefix and the next page renders as RU
// — the bug that triggered the post-Phase-3 follow-up.
//
// Behavior contract (per Phase 3 D-07):
// - On /en/*, to="/pay" -> "/en/pay"   (sibling preserved via paths.ts EN_SIBLINGS)
// - On /en/*, to="/account" -> "/account"   (no EN sibling — content layer keeps lang via storage)
// - On unprefixed paths (auto-detect EN flash), URL stays unprefixed (D-07).
// - Non-string `to` props pass through unchanged.

import { Link, type LinkProps } from "react-router";
import { useOnEnPath } from "../../i18n/LangContext";
import { localizeHref } from "../../i18n/paths";

type LocalizedLinkProps = LinkProps & { to: string };

export default function LocalizedLink({ to, ...rest }: LocalizedLinkProps): JSX.Element {
  const onEnPath = useOnEnPath();
  const target = localizeHref(to, onEnPath);
  return <Link to={target} {...rest} />;
}
