import "@/styles/sections.css";

export default function NotFound() {
  return <main id="main-content" className="content-width recovery-page" tabIndex={-1}><h1>Page not found.</h1><p>This address doesn’t lead to a page. Explore the complete work archive or return to the homepage.</p><div className="recovery-links"><a className="button button-primary" href="/work/">Explore work</a><a className="button button-outline" href="/">Back home</a></div></main>;
}
