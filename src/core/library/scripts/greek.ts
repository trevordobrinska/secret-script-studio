import type { WorldScript } from "../worldScript";

const greek: WorldScript = {
  id: "greek",
  name: "Greek",
  kind: "writing",
  characters: [
    { text: "Α α", name: "alpha", sound: "A" },
    { text: "Β β", name: "beta", sound: "B" },
    { text: "Γ γ", name: "gamma", sound: "G" },
    { text: "Δ δ", name: "delta", sound: "D" },
    { text: "Ε ε", name: "epsilon", sound: "E (as in pet)" },
    { text: "Ζ ζ", name: "zeta", sound: "Z" },
    { text: "Η η", name: "eta", sound: "long E" },
    { text: "Θ θ", name: "theta", sound: "TH (as in thin)" },
    { text: "Ι ι", name: "iota", sound: "I" },
    { text: "Κ κ", name: "kappa", sound: "K" },
    { text: "Λ λ", name: "lambda", sound: "L" },
    { text: "Μ μ", name: "mu", sound: "M" },
    { text: "Ν ν", name: "nu", sound: "N" },
    { text: "Ξ ξ", name: "xi", sound: "KS" },
    { text: "Ο ο", name: "omicron", sound: "O (short)" },
    { text: "Π π", name: "pi", sound: "P" },
    { text: "Ρ ρ", name: "rho", sound: "R" },
    { text: "Σ σ ς", name: "sigma", sound: "S" },
    { text: "Τ τ", name: "tau", sound: "T" },
    { text: "Υ υ", name: "upsilon", sound: "U" },
    { text: "Φ φ", name: "phi", sound: "F" },
    { text: "Χ χ", name: "chi", sound: "KH" },
    { text: "Ψ ψ", name: "psi", sound: "PS" },
    { text: "Ω ω", name: "omega", sound: "O (long)" },
  ],
  numerals: [],
};

export default greek;
