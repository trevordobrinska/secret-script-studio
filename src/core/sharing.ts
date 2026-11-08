import { foldedMessageText, layoutMessage, type MessageLayout } from "./messageLayout";
import type { MyScript } from "./myScript";
import { glyphsUsed, isShareLink, packShareLink, unpackShareLink, type SharedMessage } from "./shareLink";

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
  /**
   * Whether a link (whole URL or fragment) looks like a share link, so the
   * app should open in Reply mode. It only checks the shape (`#m<version>.…`);
   * a broken or unknown-version share link still counts (Reply mode then
   * says it couldn't be opened). Anything else starts the Studio as usual.
   */
  isShareLink(link: string): boolean;
  /** Text (the shared Message, or Dad's reply) laid out in a shared Message's Glyphs. */
  sharedLayout(shared: SharedMessage, text: string): MessageLayout;
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
      const folded = foldedMessageText(text);
      if (folded === undefined) return { ok: false, reason: "empty" };
      const { name, ink, strokeWidth } = script;
      return packShareLink({ name, ink, strokeWidth, text: folded, glyphs: glyphsUsed(folded, script.glyphs) }, appAddress);
    },
    openShareLink: (link) => unpackShareLink(link),
    isShareLink,
    sharedLayout: (shared, text) => layoutMessage(text, shared.glyphs),
  };
}
