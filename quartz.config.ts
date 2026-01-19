import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration for Exodus Loop Documentation
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Exodus Loop Documentation",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "www.blamechris.com/exodus-loop-docs",
    ignorePatterns: ["private", "templates", ".obsidian", "quartz", "node_modules", "archive", "package*.json", "tsconfig.json", "*.config.ts", "*.layout.ts"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Orbitron",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f8f9fa",
          lightgray: "#e1e5eb",
          gray: "#8b9bb4",
          darkgray: "#3d4f6f",
          dark: "#1a2744",
          secondary: "#4a7c9b",
          tertiary: "#6eb5a8",
          highlight: "rgba(74, 124, 155, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#0d1117",
          lightgray: "#1c2333",
          gray: "#4a5568",
          darkgray: "#c9d1d9",
          dark: "#e6edf3",
          secondary: "#58a6ff",
          tertiary: "#7ee787",
          highlight: "rgba(88, 166, 255, 0.15)",
          textHighlight: "#58a6ff44",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
