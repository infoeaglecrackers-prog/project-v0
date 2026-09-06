import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll position on navigation.
 *
 * BrowserRouter does no scroll management of its own, so moving between routes
 * kept whatever offset the previous page had — landing you mid-page, or at the
 * bottom when the new page was shorter than the old scroll position.
 *
 * (React Router's built-in <ScrollRestoration> isn't an option here: it requires
 * a data router created with createBrowserRouter, and this app uses the
 * declarative <BrowserRouter> + <Routes> setup.)
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  // useLayoutEffect, not useEffect: this runs before the browser paints, so the
  // new page never flashes at the old scroll offset.
  useLayoutEffect(() => {
    // A #anchor is an explicit request to land somewhere specific — leave it alone.
    if (hash) return;

    // `behavior: "instant"` is defensive against CSS smooth scrolling, which
    // would otherwise animate every route change — a long page visibly scrolling
    // itself to the top. index.css does set `scroll-behavior: smooth`, but on
    // `body`, and the viewport takes that property from `html`, so today it
    // almost certainly isn't applying. Passing "instant" explicitly means this
    // keeps working if that rule ever moves to `html`/`:root`.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Public pages scroll on the window, but the admin shell scrolls inside its
    // own <main> (see AdminLayout), so resetting the window alone misses it.
    document
      .querySelectorAll<HTMLElement>("[data-scroll-container]")
      .forEach((el) => {
        el.scrollTop = 0;
        el.scrollLeft = 0;
      });
  }, [pathname, search, hash]);

  return null;
}
