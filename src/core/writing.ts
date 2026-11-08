import { charForSlot, foldMessageText, layoutMessage, type MessageCell } from "./messageLayout";
import type { GlyphSlot, MyScript } from "./myScript";

/** The Write screen part of the Studio core's interface. */
export interface WritingCommands {
  /**
   * Message text laid out in a My Script's Glyphs, as they are now (so a
   * redrawn Glyph shows its new shape). Empty for an unknown id.
   */
  messageLayout(scriptId: string, text: string): readonly MessageCell[];
  /**
   * The Message he is writing in a My Script, not saved yet (folded to
   * uppercase). It is kept while he goes off to draw a Glyph and comes
   * back, but not across a reload. "" if he hasn't started one.
   */
  draft(scriptId: string): string;
  /** Types one key of the Glyph keyboard (a letter, digit, mark or space) at the end of the draft. */
  typeKey(scriptId: string, slot: GlyphSlot): void;
  /** Removes the last character of the draft (nothing happens if it's empty). */
  backspace(scriptId: string): void;
  /**
   * Puts text in a My Script's draft (folded), e.g. a saved Message he
   * wants to edit; `editing` is that Message's id, so saving updates it
   * instead of adding a new one. Ignored for an unknown My Script.
   */
  setDraft(scriptId: string, text: string, editing?: string): void;
  /** Empties a My Script's draft and stops editing any saved Message ("New Message", or after saving). */
  clearDraft(scriptId: string): void;
  /** The id of the saved Message the draft is editing, or undefined for a new Message. */
  editingMessage(scriptId: string): string | undefined;
}

interface WritingDeps {
  myScript(id: string): MyScript | undefined;
}

/** The core's Write screen rules. Not exported from the core: tests go through StudioCore. */
export function createWriting({ myScript }: WritingDeps): WritingCommands {
  const drafts = new Map<string, string>();
  const editing = new Map<string, string>();

  return {
    messageLayout(scriptId, text) {
      const script = myScript(scriptId);
      return script ? layoutMessage(text, script.glyphs) : [];
    },
    draft: (scriptId) => drafts.get(scriptId) ?? "",
    typeKey(scriptId, slot) {
      const char = charForSlot(slot);
      if (!char || !myScript(scriptId)) return;
      drafts.set(scriptId, foldMessageText((drafts.get(scriptId) ?? "") + char));
    },
    backspace(scriptId) {
      const chars = Array.from(drafts.get(scriptId) ?? "");
      chars.pop();
      drafts.set(scriptId, chars.join(""));
    },
    setDraft(scriptId, text, editingId) {
      if (!myScript(scriptId)) return;
      drafts.set(scriptId, foldMessageText(text));
      if (editingId === undefined) editing.delete(scriptId);
      else editing.set(scriptId, editingId);
    },
    clearDraft(scriptId) {
      drafts.delete(scriptId);
      editing.delete(scriptId);
    },
    editingMessage: (scriptId) => editing.get(scriptId),
  };
}
