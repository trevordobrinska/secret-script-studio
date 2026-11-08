import "./reply.css";
import type { SharedMessage, StudioCore } from "../core/studioCore";
import { messageView } from "../render/messageView";
import { el } from "../screens/screen";

/** Glyph size on Dad's phone (a phone is about 360–430 CSS px wide). */
const CELL = 44;
/** A reply longer than this would be a letter, not a note. */
const MAX_REPLY = 400;

/**
 * Reply mode: the app opened on Dad's phone from a share link. It runs
 * outside the router, with a core that has no real storage (nothing is
 * saved on his phone): the link holds everything. It shows the Message in
 * the kid's Glyphs, a button to reveal the plain letters, and a box where
 * Dad types a reply that is laid out in the same Glyphs.
 */
export async function startReplyPage(core: StudioCore, root: HTMLElement, link: string): Promise<void> {
  root.dataset.screen = "reply";
  const opened = await core.openShareLink(link);
  root.replaceChildren(opened.ok ? replyPage(core, opened.message) : couldntOpenPage());
}

function replyPage(core: StudioCore, shared: SharedMessage): HTMLElement {
  const page = el("div", "rp-page");
  document.title = `A secret note in ${shared.name}`;

  page.append(el("h1", "rp-title", "A secret note"), el("p", "rp-subtitle", `written in ${shared.name}`));

  // The Message, letters hidden until Dad asks.
  let revealed = false;
  const note = el("div", "rp-card rp-note");
  const reveal = el("button", "rp-button", "Show the letters");
  reveal.type = "button";
  const drawNote = () => {
    note.replaceChildren(
      messageView(core.sharedLayout(shared, shared.text), shared, { cellSize: CELL, plainLetters: revealed }),
    );
    reveal.textContent = revealed ? "Hide the letters" : "Show the letters";
  };
  reveal.addEventListener("click", () => {
    revealed = !revealed;
    drawNote();
  });
  drawNote();
  page.append(note, reveal);

  // Dad's reply, laid out live in the shared Glyphs.
  page.append(el("h2", "rp-heading", "Write back in his Glyphs"));
  const input = el("textarea", "rp-input");
  input.rows = 3;
  input.maxLength = MAX_REPLY;
  input.placeholder = "Type your reply…";
  input.setAttribute("autocapitalize", "characters");
  input.setAttribute("aria-label", "Your reply");
  const reply = el("div", "rp-card rp-reply");
  const drawReply = () => {
    const text = input.value;
    reply.replaceChildren(
      text.trim() === ""
        ? el("p", "rp-empty", "Your reply shows up here in his Glyphs.")
        : messageView(core.sharedLayout(shared, text), shared, { cellSize: CELL }),
    );
  };
  input.addEventListener("input", drawReply);
  drawReply();
  page.append(
    input,
    reply,
    el(
      "p",
      "rp-small",
      "Dotted boxes are letters he hasn't drawn yet, or that weren't in his note. Hand him your phone to read it.",
    ),
  );

  // Ticket 08 (printing): the Print buttons for the reply go in here.
  const actions = el("div", "rp-actions");
  page.append(actions);

  return page;
}

function couldntOpenPage(): HTMLElement {
  const page = el("div", "rp-page rp-couldnt");
  page.append(
    el("h1", "rp-title", "This secret note couldn't be opened."),
    el("p", "rp-subtitle", "The link may have been cut short. Ask for the code again and scan it once more."),
  );
  return page;
}
