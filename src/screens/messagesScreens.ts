import "./myScripts.css";
import "./messages.css";
import type { Message } from "../core/message";
import { messageView } from "../render/messageView";
import { playTap } from "../sound/sound";
import { stopSpeaking } from "../sound/speech";
import { openPrintChoice } from "./printChoice";
import { el, type RenderScreen } from "./screen";
import { readItToMeButton } from "./readItToMeButton";
import { secretToggle } from "./secretToggle";

/** How many cells of a Message its card previews. */
const PREVIEW_CELLS = 14;
const PREVIEW_CELL = 40;
const READ_CELL = 72;

/**
 * A My Script's diary: "Write a Message" in a fixed spot at the top, then
 * one card per saved Message, newest first, each previewing its start in
 * his Glyphs (current shapes) with the day it was written. Tap to re-read.
 */
export const messagesScreen: RenderScreen<{ name: "messages"; scriptId: string }> = (root, screen, { core, go }) => {
  const script = core.myScript(screen.scriptId);
  if (!script) {
    root.append(el("p", "placeholder", "This My Script isn't here."));
    return;
  }
  const scriptId = script.id;
  root.append(el("h1", "screen-title", `${script.name}: Messages`));

  const top = el("div", "msg-actions");
  const write = button("Write a Message", "ms-write");
  write.addEventListener("click", () => {
    playTap();
    go({ name: "write", scriptId });
  });
  const glyphs = button("Glyphs", "");
  glyphs.addEventListener("click", () => {
    playTap();
    go({ name: "glyphGrid", scriptId });
  });
  top.append(glyphs, secretToggle(core, draw), write);
  const list = el("div", "msg-list");
  root.append(top, list);

  function draw(): void {
    const messages = core.messages(scriptId);
    list.replaceChildren(
      ...(messages.length === 0 ? [el("p", "ms-hint", "No Messages yet. Write your first secret!")] : []),
      ...messages.map(card),
    );
  }

  function card(message: Message): HTMLElement {
    const open = button("", "msg-card");
    open.dataset.messageId = message.id;
    const chars = Array.from(message.text);
    const preview = el("span", "msg-preview");
    preview.append(messageView(core.messageLayout(scriptId, chars.slice(0, PREVIEW_CELLS).join("")), script!, {
      cellSize: PREVIEW_CELL,
      plainLetters: !core.secretMode(),
    }));
    if (chars.length > PREVIEW_CELLS) preview.append(el("span", "msg-more", "…"));
    open.append(preview, el("span", "msg-date", dayOf(message.createdAt)));
    open.addEventListener("click", () => {
      playTap();
      go({ name: "message", messageId: message.id });
    });
    return open;
  }

  draw();
};

/**
 * Re-reading one saved Message, big, in his current Glyphs. Missing
 * Glyphs can be tapped to draw them (and he comes back here). Edit puts
 * it on the Write screen; Read it to me says it in his Sounds; Share
 * shows it as a QR code; Delete asks first, in place.
 */
export const messageScreen: RenderScreen<{ name: "message"; messageId: string }> = (root, screen, { core, go }) => {
  const message = core.message(screen.messageId);
  const script = message && core.myScript(message.scriptId);
  if (!message || !script) {
    root.append(el("p", "placeholder", "This Message isn't here any more."));
    return;
  }
  const here = { name: "message", messageId: message.id } as const;
  root.append(el("h1", "screen-title", script.name));

  const actions = el("div", "msg-actions");
  const box = el("div", "msg-read");
  root.append(actions, box);

  let asking = false;
  // Made once, so a Read it to me that's speaking keeps its glow when the row redraws.
  const readAloud = readItToMeButton(() => core.readItToMe(message!.text, script!.glyphs));

  function drawMessage(): void {
    box.replaceChildren(
      messageView(core.messageLayout(script!.id, message!.text), script!, {
        cellSize: READ_CELL,
        plainLetters: !core.secretMode(),
        onMissingGlyph: (slot) => {
          playTap();
          go({ name: "glyphCanvas", scriptId: script!.id, slot, returnTo: here });
        },
      }),
    );
  }

  function drawActions(): void {
    if (asking) {
      const question = el("p", "msg-ask", "Delete this Message? It can't come back.");
      const keep = button("Keep it", "ms-small");
      keep.addEventListener("click", () => {
        playTap();
        asking = false;
        drawActions();
      });
      const yes = button("Delete it", "ms-small ms-danger");
      yes.addEventListener("click", () => {
        playTap();
        core.deleteMessage(message!.id);
        go({ name: "messages", scriptId: script!.id });
      });
      actions.replaceChildren(question, keep, yes);
      return;
    }
    const all = button("All Messages", "");
    all.addEventListener("click", () => {
      playTap();
      go({ name: "messages", scriptId: script!.id });
    });
    const edit = button("Edit", "ms-write");
    edit.addEventListener("click", () => {
      playTap();
      core.editMessage(message!.id);
      go({ name: "write", scriptId: script!.id });
    });
    const share = button("Share", "wr-share");
    share.addEventListener("click", () => {
      playTap();
      go({ name: "share", scriptId: script!.id, text: message!.text, returnTo: here });
    });
    const print = button("Print", "wr-print");
    print.addEventListener("click", () => {
      playTap();
      openPrintChoice((options) => {
        const result = core.printLayout(script!.id, message!.text, options);
        return result.ok ? result.layout : undefined;
      }, playTap);
    });
    const remove = button("Delete", "ms-danger");
    remove.addEventListener("click", () => {
      playTap();
      asking = true;
      drawActions();
    });
    actions.replaceChildren(all, secretToggle(core, drawMessage), readAloud, edit, share, print, remove);
  }

  drawActions();
  drawMessage();
  return stopSpeaking;
};

function button(text: string, className: string): HTMLButtonElement {
  const b = el("button", `ms-button ${className}`, text);
  b.type = "button";
  return b;
}

/** "7 Nov": the day a Message was written, the kid-friendly way. */
function dayOf(time: number): string {
  return new Date(time).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
