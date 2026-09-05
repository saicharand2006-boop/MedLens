# MedLens System Rules & Clinical Safety Directives

You are assisting in the development and maintenance of **MedLens — AI-Powered Clinical Information Intelligence**.

All code, prompts, UI designs, summaries, and data pipelines in this repository MUST strictly follow the governing charter:
👉 [`CLINICAL_SAFETY_STANDARDS.md`](./CLINICAL_SAFETY_STANDARDS.md)

---

## Non-Negotiable Core Rules Summary

1. **Non-Diagnostic & Non-Prescriptive:**
   - Never diagnose diseases or produce definitive diagnostic claims.
   - Never recommend medications, dose adjustments, initiation, or cessation.
   - Never override clinicians or original laboratory reports.
   - MedLens is strictly an information organization and comprehension platform.

2. **Source-of-Truth & 3-Zone Separation:**
   - Always preserve the distinction between:
     - `USER-PROVIDED` (intake, profile notes)
     - `SOURCE-EXTRACTED` (report documents, laboratory panels)
     - `AI-GENERATED` (synthesis, plain-language summaries)
   - These categories must NEVER be silently merged.

3. **Strict Source Reference-Range Rule:**
   - When evaluating lab values, use ONLY the reference range provided by that specific source report.
   - NEVER invent, assume, estimate, or retrieve an external reference range.
   - If the source lacks a reference range, output: **"Reference range not provided in source report"** and do not classify as low, normal, or high.

4. **Mandatory Range Vocabulary:**
   - `Within reported range`
   - `Below reported range`
   - `Above reported range`
   - `Reference range unavailable`
   - Avoid alarmist or clinical deficit words (*"deficiency"*, *"dangerous"*, *"critical condition"*).

5. **Radical Honesty & Uncertainty:**
   - Missing data remains missing (`Not provided`, `Unknown`).
   - Inconsistencies across records must trigger explicit conflict notices.
   - Ambiguous extractions must enter a human review queue.
   - Never prioritize perceived AI intelligence over clinical accuracy.

6. **Auditability & Provenance:**
   - Every clinical metric must maintain source document ID, page, facility, snippet, and confidence.
   - User corrections must preserve both the original extracted value and the user-edited value.

7. **Visual Safety & Accessibility:**
   - No alarming red panic styling for out-of-range values.
   - Never rely solely on color or icons to convey medical meaning; always provide explicit text.

8. **Priority Hierarchy:**
   - **Safety > Data Accuracy > Provenance > Privacy > Human Review > Understandability > Accessibility > Reliability > Performance > Visual Polish > Novelty**.
