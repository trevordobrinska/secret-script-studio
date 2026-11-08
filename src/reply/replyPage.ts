import "./reply.css";
import type { SharedMessage, StudioCore } from "../core/studioCore";
import { messageView } from "../render/messageView";
import { openPrintChoice } from "../screens/printChoice";
import { readItToMeButton } from "../screens/readItToMeButton";
import { el } from "../screens/screen";

/** Glyph size on Dad's phone (a phone is about 360–430 CSS px wide). */
const CELL = 44;
/** A reply longer than this would be a letter, not a quick answer. */
const MAX_REPLY = 400;

/**
 * Reply mode: the app opened on Dad's phone from a share link. It runs
 * outside the router, with a core that has no real storage (nothing is
 * saved on his phone): the link holds everything. It shows the Message in
 * the kid's Glyphs, a button to reveal the plain letters, and a box where
 * Dad types a reply that is laid out in the same Glyphs. Both can be read
 * aloud in the kid's Sounds (the link carries them).
 */
export async function startReplyPage(core: StudioCore, root: HTMLElement, link: string): Promise<void> {
  root.dataset.screen = "reply";
  const opened = await core.openShareLink(link);
  root.replaceChildren(opened.ok ? replyPage(core, opened.message) : couldntOpenPage());
}

function replyPage(core: StudioCore, shared: SharedMessage): HTMLElement {
  const page = el("div", "rp-page");
  document.title = `A secret Message in ${shared.name}`;

  page.append(el("h1", "rp-title", "A secret Message"), el("p", "rp-subtitle", `written in ${shared.name}`));

  // The Message, letters hidden until Dad asks.
  let revealed = false;
  const messageCard = el("div", "rp-card rp-note");
  const reveal = el("button", "rp-button", "Show the letters");
  reveal.type = "button";
  const drawMessage = () => {
    messageCard.replaceChildren(
      messageView(core.sharedLayout(shared, shared.text), shared, { cellSize: CELL, plainLetters: revealed }),
    );
    reveal.textContent = revealed ? "Hide the letters" : "Show the letters";
  };
  reveal.addEventListener("click", () => {
    revealed = !revealed;
    drawMessage();
  });
  drawMessage();
  const messageActions = el("div", "rp-actions");
  messageActions.append(reveal, phoneButton(readItToMeButton(() => core.readItToMe(shared.text, shared.glyphs))));
  page.append(messageCard, messageActions);

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
  // Read Dad's reply aloud in the shared Sounds, as it is when he taps.
  const readReply = phoneButton(readItToMeButton(() => core.readItToMe(input.value, shared.glyphs)));
  const updateReadReply = () => (readReply.disabled = input.value.trim() === "");
  input.addEventListener("input", updateReadReply);
  updateReadReply();
  const replyActions = el("div", "rp-actions");
  replyActions.append(readReply);
  page.append(
    input,
    reply,
    replyActions,
    el(
      "p",
      "rp-small",
      "Dotted boxes are letters he hasn't drawn yet, or that weren't in his Message. Hand him your phone to read it.",
    ),
  );

  // Printing, for when the tablet can't print: his Message, or Dad's reply, each in his Glyphs.
  const actions = el("div", "rp-actions");
  const printMessage = el("button", "rp-button", "Print his Message");
  printMessage.type = "button";
  printMessage.addEventListener("click", () => printText(shared.text));
  const printReply = el("button", "rp-button", "Print your reply");
  printReply.type = "button";
  printReply.addEventListener("click", () => printText(input.value));
  const updatePrintReply = () => (printReply.disabled = input.value.trim() === "");
  input.addEventListener("input", updatePrintReply);
  updatePrintReply();
  actions.append(printMessage, printReply);
  page.append(actions);

  function printText(text: string): void {
    openPrintChoice((options) => {
      const result = core.sharedPrintLayout(shared, text, options);
      return result.ok ? result.layout : undefined;
    });
  }

  return page;
}

/** Gives a Studio button the reply page's look, keeping its other classes (such as its glow). */
function phoneButton(button: HTMLButtonElement): HTMLButtonElement {
  button.classList.replace("ms-button", "rp-button");
  return button;
}

function couldntOpenPage(): HTMLElement {
  const page = el("div", "rp-page rp-couldnt");
  page.append(
    el("h1", "rp-title", "This secret Message couldn't be opened."),
    el("p", "rp-subtitle", "The link may have been cut short. Ask for the code again and scan it once more."),
  );
  return page;
}
