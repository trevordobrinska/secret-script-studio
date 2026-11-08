import "./write.css";
import { TYPEABLE_SLOTS } from "../core/messageLayout";
import { slotLabel, type GlyphSlot } from "../core/myScript";
import { glyphImage } from "../render/glyphRenderer";
import { messageView } from "../render/messageView";
import { playKey, playTap } from "../sound/sound";
import { el, type RenderScreen } from "./screen";

const MESSAGE_CELL = 64;
const KEY_GLYPH = 44;

/**
 * The Write screen: the draft Message in his Glyphs (plain letters under
 * each), and below it a keyboard of his own Glyphs with space and
 * backspace. The keyboard is built once and never moves; only the Message
 * redraws as he types. Tapping a Missing Glyph opens the canvas for it and
 * comes back here. (Saving the Message is ticket 06.)
 */
export const writeScreen: RenderScreen<{ name: "write"; scriptId: string }> = (root, screen, { core, go }) => {
  const script = core.myScript(screen.scriptId);
  if (!script) {
    root.append(el("p", "placeholder", "This My Script isn't here."));
    return;
  }
  const scriptId = script.id;

  root.append(el("h1", "screen-title", script.name));

  const message = el("div", "wr-message");
  const keyboard = el("div", "wr-keyboard");
  root.append(message, keyboard);

  function drawMessage(): void {
    const draft = core.draft(scriptId);
    if (draft === "") {
      message.replaceChildren(el("p", "wr-hint", "Tap the keys to write in " + script!.name + "."));
      return;
    }
    const view = messageView(core.messageLayout(scriptId, draft), script!, {
      cellSize: MESSAGE_CELL,
      onMissingGlyph: (slot) => {
        playTap();
        go({ name: "glyphCanvas", scriptId, slot, returnTo: { name: "write", scriptId } });
      },
    });
    message.replaceChildren(view);
    message.scrollTop = message.scrollHeight;
  }

  for (const slot of TYPEABLE_SLOTS) keyboard.append(glyphKey(slot));
  const back = keyButton("wr-key wr-backspace", () => core.backspace(scriptId));
  back.append(el("span", "wr-backspace-mark", "⌫"));
  back.setAttribute("aria-label", "Backspace");
  keyboard.append(back);

  function glyphKey(slot: GlyphSlot): HTMLButtonElement {
    const glyph = script!.glyphs[slot];
    const key = keyButton(`wr-key${glyph ? "" : " missing"}${slot === "space" ? " wr-space" : ""}`, () =>
      core.typeKey(scriptId, slot),
    );
    const box = el("span", "wr-key-box");
    if (glyph) box.append(glyphImage(glyph.strokes, script!, KEY_GLYPH));
    key.append(box, el("span", "wr-key-label", slotLabel(slot)));
    return key;
  }

  function keyButton(className: string, press: () => void): HTMLButtonElement {
    const key = el("button", className);
    key.type = "button";
    key.addEventListener("click", () => {
      playKey();
      press();
      drawMessage();
    });
    return key;
  }

  drawMessage();
};
