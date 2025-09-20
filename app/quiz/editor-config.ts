import { config } from "md-editor-rt";
import markdownItSub from "markdown-it-sub";
import markdownItLinkAttrs from "markdown-it-link-attributes";

config({
  markdownItConfig(mdit) {
    mdit.use(markdownItSub);
    mdit.use(markdownItLinkAttrs, {
      attrs: {
        target: "_blank",
        rel: "noopener",
      },
    });
  },
});
