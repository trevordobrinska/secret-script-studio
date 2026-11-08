import "./myScripts.css";
import "./share.css";
import { renderSVG } from "uqr";
import type { Screen } from "../core/studioCore";
import { playTap } from "../sound/sound";
import { el, type RenderScreen } from "./screen";

/**
 * The QR code's error-correction level. M (15% recovery) copes with glare
 * and smudges on a tablet screen; the core's "too long" limit is worked
 * out for it (see MAX_SHARE_LINK_LENGTH).
 */
const QR_ECC = "M";
/** The standard quiet zone: 4 white modules around the code, which phone cameras need. */
const QR_BORDER = 4;

/**
 * The Share screen: a big QR code Dad scans with his phone camera. It
 * opens the app on his phone in Reply mode with the Message in the link.
 * Opened with `go({ name: "share", scriptId, text, returnTo })`, from the
 * Write screen's draft or from a saved Message (ticket 06).
 */
export const shareScreen: RenderScreen<Extract<Screen, { name: "share" }>> = (root, screen, { core, go }) => {
  let left = false;
  const back = screen.returnTo ?? { name: "write", scriptId: screen.scriptId };

  root.append(el("h1", "screen-title", "Show this to Dad"));
  const body = el("div", "sh-body");
  const footer = el("div", "sh-footer");
  const hint = el("p", "sh-hint", "Making the code…");
  const backButton = el("button", "ms-button", "Back");
  backButton.type = "button";
  backButton.addEventListener("click", () => {
    playTap();
    go(back);
  });
  footer.append(hint, backButton);
  root.append(body, footer);

  void core.shareLink(screen.scriptId, screen.text, appAddress()).then((result) => {
    if (left) return;
    if (result.ok) {
      const code = el("div", "sh-qr");
      code.innerHTML = renderSVG(result.link, { ecc: QR_ECC, border: QR_BORDER });
      code.setAttribute("role", "img");
      code.setAttribute("aria-label", "QR code for this Message");
      body.replaceChildren(code);
      hint.textContent = "Dad points his phone camera here.";
      return;
    }
    const note = el("div", "sh-note");
    if (result.reason === "tooLong") {
      note.append(
        el("p", "sh-note-big", "This Message is too long for one code."),
        el("p", "sh-note-small", "Try splitting it into two shorter Messages, and share them one at a time."),
      );
    } else if (result.reason === "empty") {
      note.append(el("p", "sh-note-big", "Write something first, then share it."));
    } else {
      note.append(el("p", "sh-note-big", "This My Script isn't here."));
    }
    body.replaceChildren(note);
    hint.textContent = "";
  });

  return () => {
    left = true;
  };
};

/** This app's own address (no fragment): where the share link points. */
function appAddress(): string {
  return location.href.split("#")[0];
}
