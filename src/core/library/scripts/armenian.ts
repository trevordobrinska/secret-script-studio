import type { WorldScript } from "../worldScript";

/**
 * The Armenian alphabet (38 letters), with sounds as said in Eastern Armenian. "Sharp" letters are
 * said with a little pop and no breath; "with a puff" ones with a breath of air.
 */
const armenian: WorldScript = {
  id: "armenian",
  name: "Armenian",
  kind: "writing",
  characters: [
    { text: "Ա ա", name: "ayb", sound: "AH" },
    { text: "Բ բ", name: "ben", sound: "B" },
    { text: "Գ գ", name: "gim", sound: "G" },
    { text: "Դ դ", name: "da", sound: "D" },
    { text: "Ե ե", name: "yech", sound: "EH (YEH at the start of a word)" },
    { text: "Զ զ", name: "za", sound: "Z" },
    { text: "Է է", name: "e", sound: "EH (as in bed)" },
    { text: "Ը ը", name: "et", sound: "UH" },
    { text: "Թ թ", name: "to", sound: "T (with a puff)" },
    { text: "Ժ ժ", name: "zhe", sound: "ZH (like s in treasure)" },
    { text: "Ի ի", name: "ini", sound: "EE" },
    { text: "Լ լ", name: "lyun", sound: "L" },
    { text: "Խ խ", name: "khe", sound: "KH (like clearing your throat)" },
    { text: "Ծ ծ", name: "tsa", sound: "TS (sharp)" },
    { text: "Կ կ", name: "ken", sound: "K (sharp)" },
    { text: "Հ հ", name: "ho", sound: "H" },
    { text: "Ձ ձ", name: "dza", sound: "DZ" },
    { text: "Ղ ղ", name: "ghat", sound: "GH (like a gargle)" },
    { text: "Ճ ճ", name: "che", sound: "CH (sharp)" },
    { text: "Մ մ", name: "men", sound: "M" },
    { text: "Յ յ", name: "hi", sound: "Y" },
    { text: "Ն ն", name: "nu", sound: "N" },
    { text: "Շ շ", name: "sha", sound: "SH" },
    { text: "Ո ո", name: "vo", sound: "OH (VO at the start of a word)" },
    { text: "Չ չ", name: "cha", sound: "CH (with a puff)" },
    { text: "Պ պ", name: "pe", sound: "P (sharp)" },
    { text: "Ջ ջ", name: "je", sound: "J" },
    { text: "Ռ ռ", name: "ra", sound: "R (rolled)" },
    { text: "Ս ս", name: "se", sound: "S" },
    { text: "Վ վ", name: "vev", sound: "V" },
    { text: "Տ տ", name: "tyun", sound: "T (sharp)" },
    { text: "Ր ր", name: "re", sound: "R (soft)" },
    { text: "Ց ց", name: "tso", sound: "TS (with a puff)" },
    { text: "Ւ ւ", name: "hyun", sound: "used after ո to make OO (ու)" },
    { text: "Փ փ", name: "pyur", sound: "P (with a puff)" },
    { text: "Ք ք", name: "ke", sound: "K (with a puff)" },
    { text: "Օ օ", name: "o", sound: "OH" },
    { text: "Ֆ ֆ", name: "fe", sound: "F" },
  ],
  numerals: [],
};

export default armenian;
