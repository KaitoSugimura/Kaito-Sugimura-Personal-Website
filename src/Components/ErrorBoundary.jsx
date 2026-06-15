import { Component } from "react";

// Section-level error boundary. Every section is mounted at page load (the home
// scroller translates between them), so an uncaught render error in any one of
// them — most likely the large, interactive Shop game — would otherwise white-
// screen the ENTIRE site, including for visitors who never scroll to it. This
// degrades that to a quiet full-height fallback so the rest of the page keeps
// working and the snap-scroll math (one child node per section) is preserved.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Best-effort log; never rethrow.
    if (typeof console !== "undefined" && console.error) {
      console.error("Section error boundary caught:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div
          role="alert"
          style={{
            height: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "8vmin",
            color: "#cdb88f",
            fontFamily: '"Nunito Sans", "Segoe UI", sans-serif',
          }}
        >
          <p style={{ maxWidth: "40ch", lineHeight: 1.5 }}>
            This section hit a snag and couldn&rsquo;t load. The rest of the page
            is fine &mdash; scroll on.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
