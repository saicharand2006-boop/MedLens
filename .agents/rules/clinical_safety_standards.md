# MedLens Clinical Safety Standards Rule
# Scope: Project-wide

All agent operations, code generation, refactoring, UI changes, and prompt designs within MedLens must adhere to the 35 principles defined in CLINICAL_SAFETY_STANDARDS.md.

Key Enforcement Points:
- Range evaluations MUST ONLY use the range extracted from that report. Never supply default reference ranges.
- Status strings MUST use: "Within reported range" | "Below reported range" | "Above reported range" | "Reference range unavailable".
- Three zones must be visually and structurally kept apart: User-provided, Source-extracted, AI-generated.
- No definitive diagnostic language or treatment recommendations.
- Emergency questions must be directed to medical professionals / emergency services.
- Never prioritize perceived AI intelligence over truth and provenance.
