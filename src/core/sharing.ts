import { foldMessageText, layoutMessage, type MessageCell } from "./messageLayout";
import type { MyScript } from "./myScript";
import { glyphsUsed, packShareLink, unpackShareLink, type SharedMessage } from "./shareLink";

export type { SharedMessage } from "./shareLink";

export type ShareLinkResult =
  | { readonly ok: true; readonly link: string }
  /** tooLong: won't fit a QR code a phone reads reliably (suggest splitting the Message). */
  | { readonly ok: false; readonly reason: "tooLong" | "empty" | "noScript" };

export type OpenShareLinkResult =
  | { readonly ok: true; readonly message: SharedMessage }
  | { readonly ok: false; readonly reason: "couldntOpen" };

/** The share-link part of the Studio core's interface. */
export interface SharingCommands {
  /**
   * A link to `appAddress` that carries the Message `text` written in a My
   * Script: its name, ink, width, the text and only the Glyphs it uses.
   * Works for the Write screen's draft and for a saved Message alike.
   */
  shareLink(scriptId: string, text: string, appAddress: string): Promise<ShareLinkResult>;
  /** Opens a share link (whole URL or fragment) into a read-only shared Message. Never throws. */
  openShareLink(link: string): Promise<OpenShareLinkResult>;
  /** Text (the shared Message, or Dad's reply) laid out in a shared Message's Glyphs. */
  sharedLayout(shared: SharedMessage, text: string): readonly MessageCell[];
}

interface SharingDeps {
  myScript(id: string): MyScript | undefined;
}

/** The core's share-link rules. Not exported from the core: tests go through StudioCore. */
export function createSharing({ myScript }: SharingDeps): SharingCommands {
  return {
    async shareLink(scriptId, text, appAddress) {
      const script = myScript(scriptId);
      if (!script) return { ok: false, reason: "noScript" };
      const folded = foldMessageText(text);
      if (folded.trim() === "") return { ok: false, reason: "empty" };
      return packShareLink(
        {
          name: script.name,
          ink: script.ink,
          strokeWidth: script.strokeWidth,
          text: folded,
          glyphs: glyphsUsed(folded, script.glyphs),
        },
        appAddress,
      );
    },
    openShareLink: (link) => unpackShareLink(link),
    sharedLayout: (shared, text) => layoutMessage(text, shared.glyphs),
  };
}
