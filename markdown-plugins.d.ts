declare module "markdown-it-sub" {
  import { PluginSimple } from "markdown-it";
  const markdownItSub: PluginSimple;
  export default markdownItSub;
}

declare module "markdown-it-link-attributes" {
  import { PluginWithOptions } from "markdown-it";
  const markdownItLinkAttrs: PluginWithOptions<{
    attrs: Record<string, string>;
  }>;
  export default markdownItLinkAttrs;
}
