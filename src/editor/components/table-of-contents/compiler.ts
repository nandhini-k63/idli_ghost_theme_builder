import { BuilderBlock } from "@/types/theme";
import { TOCProps, defaultProps } from "./schema";
import { getBackgroundCSS } from "../shared/background";
import { escapeHtml } from "../shared/escape";

export const generateHTML = (block: BuilderBlock): string => {
  const p = { ...defaultProps, ...block.props } as TOCProps;
  const styles = block.styles || {};
  const wrapperId = `toc-${block.id}`;
  const bgCss = getBackgroundCSS(styles);

  const selectorMap = {
    h2: "h2",
    "h2-h3": "h2, h3",
    "h2-h3-h4": "h2, h3, h4",
  };
  const selectorQuery = selectorMap[p.headingSelector] || "h2, h3";

  return `
<style>
  #${wrapperId} {
    ${bgCss}
    margin: 2.5rem 0;
    box-sizing: border-box;
    font-family: inherit;
  }
  #${wrapperId}.is-sticky {
    position: sticky;
    top: 5rem;
    z-index: 10;
  }
  #${wrapperId} .gh-toc-card {
    background: var(--color-canvas-soft, #f8fafc);
    border: 1px solid var(--color-hairline, #ebebeb);
    border-radius: 0.75rem;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }
  #${wrapperId} .gh-toc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-hairline, #ebebeb);
  }
  #${wrapperId} .gh-toc-title-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  #${wrapperId} .gh-toc-icon {
    width: 1.125rem;
    height: 1.125rem;
    color: var(--color-ink, #171717);
    flex-shrink: 0;
  }
  #${wrapperId} .gh-toc-title {
    font-size: 0.8125rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-ink, #171717);
    margin: 0;
  }
  #${wrapperId} .gh-toc-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  #${wrapperId} .gh-toc-progress-badge {
    font-family: var(--font-mono, monospace);
    font-size: 0.6875rem;
    font-weight: 600;
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-hairline, #ebebeb);
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    color: var(--color-body, #525252);
  }
  #${wrapperId} .gh-toc-toggle-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-mute, #a3a3a3);
    padding: 0.25rem;
    display: flex;
    align-items: center;
    transition: color 0.2s ease;
  }
  #${wrapperId} .gh-toc-toggle-btn:hover {
    color: var(--color-ink, #171717);
  }
  #${wrapperId} .gh-toc-progress-bar-wrap {
    width: 100%;
    height: 3px;
    background: var(--color-hairline, #ebebeb);
    border-radius: 9999px;
    margin: 0.75rem 0;
    overflow: hidden;
  }
  #${wrapperId} .gh-toc-progress-fill {
    height: 100%;
    width: 0%;
    background: var(--ghost-accent-color, var(--color-ink, #171717));
    transition: width 0.15s ease-out;
  }
  #${wrapperId} .gh-toc-body {
    padding-top: 0.75rem;
    transition: all 0.2s ease;
  }
  #${wrapperId} .gh-toc-body.is-collapsed {
    display: none;
  }
  #${wrapperId} .gh-toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  #${wrapperId} .gh-toc-item {
    font-size: 0.8125rem;
    line-height: 1.4;
  }
  #${wrapperId} .gh-toc-item.gh-toc-level-3 {
    padding-left: 1rem;
    font-size: 0.75rem;
  }
  #${wrapperId} .gh-toc-item.gh-toc-level-4 {
    padding-left: 1.75rem;
    font-size: 0.6875rem;
  }
  #${wrapperId} .gh-toc-link {
    color: var(--color-body, #525252);
    text-decoration: none;
    display: inline-block;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    transition: all 0.15s ease;
    border-left: 2px solid transparent;
  }
  #${wrapperId} .gh-toc-link:hover {
    color: var(--color-ink, #171717);
    background: rgba(0, 0, 0, 0.03);
  }
  #${wrapperId} .gh-toc-link.is-active {
    color: var(--ghost-accent-color, var(--color-ink, #171717));
    font-weight: 600;
    border-left-color: var(--ghost-accent-color, var(--color-ink, #171717));
    background: rgba(0, 0, 0, 0.03);
    padding-left: 0.5rem;
  }
  #${wrapperId} .gh-toc-num {
    font-family: var(--font-mono, monospace);
    font-size: 0.6875rem;
    color: var(--color-mute, #a3a3a3);
    margin-right: 0.375rem;
  }

  /* Dark mode */
  html.dark #${wrapperId} .gh-toc-card {
    background: var(--color-bg, #141414);
    border-color: rgba(255, 255, 255, 0.1);
  }
  html.dark #${wrapperId} .gh-toc-header {
    border-color: rgba(255, 255, 255, 0.1);
  }
  html.dark #${wrapperId} .gh-toc-icon,
  html.dark #${wrapperId} .gh-toc-title {
    color: #ffffff;
  }
  html.dark #${wrapperId} .gh-toc-link {
    color: rgba(255, 255, 255, 0.7);
  }
  html.dark #${wrapperId} .gh-toc-link:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
  }
  html.dark #${wrapperId} .gh-toc-link.is-active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }
  html.dark #${wrapperId} .gh-toc-progress-badge {
    background: #000000;
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }
</style>

<nav id="${wrapperId}" class="gh-toc-container ${p.layoutMode === "sticky-sidebar" ? "is-sticky" : ""}" aria-label="Table of contents">
  <div class="gh-toc-card">
    <div class="gh-toc-header">
      <div class="gh-toc-title-wrap">
        <svg class="gh-toc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="21" y1="10" x2="7" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="21" y1="18" x2="7" y2="18"></line>
        </svg>
        <span class="gh-toc-title">${escapeHtml(p.title || "Table of Contents")}</span>
      </div>

      <div class="gh-toc-meta">
        ${
          p.showReadingProgress
            ? `<span class="gh-toc-progress-badge" id="${wrapperId}-progress-text">0%</span>`
            : ""
        }
        ${
          p.collapsible
            ? `<button type="button" class="gh-toc-toggle-btn" id="${wrapperId}-toggle" aria-label="Toggle Table of Contents">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>`
            : ""
        }
      </div>
    </div>

    ${
      p.showReadingProgress
        ? `<div class="gh-toc-progress-bar-wrap">
            <div class="gh-toc-progress-fill" id="${wrapperId}-progress-fill"></div>
          </div>`
        : ""
    }

    <div class="gh-toc-body" id="${wrapperId}-body">
      <ul class="gh-toc-list" id="${wrapperId}-list"></ul>
    </div>
  </div>

  <script>
    (function() {
      const root = document.getElementById("${wrapperId}");
      if (!root) return;
      const list = document.getElementById("${wrapperId}-list");
      const body = document.getElementById("${wrapperId}-body");
      const toggle = document.getElementById("${wrapperId}-toggle");
      const progFill = document.getElementById("${wrapperId}-progress-fill");
      const progText = document.getElementById("${wrapperId}-progress-text");

      if (toggle && body) {
        toggle.addEventListener("click", () => {
          body.classList.toggle("is-collapsed");
          toggle.style.transform = body.classList.contains("is-collapsed") ? "rotate(180deg)" : "rotate(0deg)";
        });
      }

      const content = document.querySelector(".gh-content, .post-content, .kg-canvas, article.post-full-content, .article-content");
      if (!content || !list) {
        root.style.display = "none";
        return;
      }

      const headings = Array.from(content.querySelectorAll("${selectorQuery}"));
      if (headings.length < 2) {
        root.style.display = "none";
        return;
      }

      let h2Idx = 0;
      let h3Idx = 0;
      let h4Idx = 0;

      headings.forEach((h, index) => {
        if (!h.id) {
          const slug = (h.textContent || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          h.id = "heading-" + (slug || index);
        }

        const tag = h.tagName.toLowerCase();
        let levelClass = "gh-toc-level-2";
        let numStr = "";

        if (tag === "h2") {
          h2Idx++;
          h3Idx = 0;
          h4Idx = 0;
          numStr = "${p.numbered}" === "true" ? h2Idx + ". " : "";
        } else if (tag === "h3") {
          h3Idx++;
          h4Idx = 0;
          levelClass = "gh-toc-level-3";
          numStr = "${p.numbered}" === "true" ? h2Idx + "." + h3Idx + " " : "";
        } else if (tag === "h4") {
          h4Idx++;
          levelClass = "gh-toc-level-4";
          numStr = "${p.numbered}" === "true" ? h2Idx + "." + h3Idx + "." + h4Idx + " " : "";
        }

        const li = document.createElement("li");
        li.className = "gh-toc-item " + levelClass;

        const a = document.createElement("a");
        a.href = "#" + h.id;
        a.className = "gh-toc-link";

        if (numStr) {
          const numSpan = document.createElement("span");
          numSpan.className = "gh-toc-num";
          numSpan.textContent = numStr;
          a.appendChild(numSpan);
        }

        const textSpan = document.createElement("span");
        textSpan.textContent = (h.textContent || "").trim();
        a.appendChild(textSpan);

        a.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.getElementById(h.id);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            try { history.pushState(null, "", "#" + h.id); } catch(err) {}
          }
        });

        li.appendChild(a);
        list.appendChild(li);
      });

      // Dynamic ScrollSpy
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const activeId = entry.target.id;
              list.querySelectorAll(".gh-toc-link").forEach((link) => {
                if (link.getAttribute("href") === "#" + activeId) {
                  link.classList.add("is-active");
                } else {
                  link.classList.remove("is-active");
                }
              });
            }
          });
        }, { rootMargin: "0px 0px -65% 0px" });

        headings.forEach((h) => observer.observe(h));
      }

      // Reading progress tracking
      if (progFill || progText) {
        window.addEventListener("scroll", () => {
          const totalHeight = content.scrollHeight;
          const rect = content.getBoundingClientRect();
          const scrolled = Math.max(0, -rect.top);
          const percent = Math.min(100, Math.max(0, Math.round((scrolled / (totalHeight - window.innerHeight + 200)) * 100))) || 0;
          if (progFill) progFill.style.width = percent + "%";
          if (progText) progText.textContent = percent + "%";
        }, { passive: true });
      }
    })();
  </script>
</nav>`;
};

export const compileToHbs = generateHTML;
