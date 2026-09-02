# ScholarSure

![ScholarSure — Catch errors before they cost a scholarship](public/og.jpg)

ScholarSure is a judge-ready hackathon prototype that audits a scholarship application before submission. It compares a scheme's requirements with a student's document set, flags costly inconsistencies, cites the relevant rule location, and turns each issue into an action plan.

> **One-line pitch:** Grammarly for scholarship applications—ScholarSure catches the mistakes that could cost a student their education funding.

## The problem

Scholarship applications often fail at the last mile: a name is inconsistent, a certificate is too old, or a mandatory registration proof is missing. These mistakes are easy to overlook and expensive for a student.

## Demo flow

1. Review the preloaded PM-USP CSSS sample application.
2. Add a local PDF or image to demonstrate the document intake flow.
3. Run the 12-point application audit.
4. Explore three evidence-backed findings and four passed checks.
5. Generate a prioritized recovery plan before the deadline.

The prototype includes a working frontend-to-backend request. Its sample findings are deterministic so the judging demo remains reliable. A production version would replace this sample analyzer with OCR, structured extraction, scheme-rule retrieval, and a human-verifiable AI comparison step.

## Architecture

```text
Student documents
       ↓
Responsive React workspace
       ↓  POST /api/audit
Server-side audit contract
       ↓
Structured findings + evidence + actions
       ↓
Readiness score and recovery plan
```

## Built with

- React 19 and TypeScript
- Vinext and Vite
- Tailwind CSS
- Lucide icons
- Cloudflare Workers-compatible server route

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## API contract

`POST /api/audit`

```json
{
  "documentNames": ["Scholarship guidelines.pdf", "Aadhaar card.pdf"]
}
```

The endpoint returns a readiness score, deadline, prioritized findings, source locations, passed checks, and a safety disclaimer.

## Responsible design

- Uploaded files stay in the browser in this prototype.
- The app never submits an application on a student's behalf.
- Findings are presented with source locations for human verification.
- The UI clearly labels the experience as a prototype with illustrative results.
- Production deployments should encrypt uploads, minimize retention, redact sensitive identifiers, and use official scheme sources only.

## Next production milestones

- OCR and layout-aware extraction for PDFs and phone photos
- Versioned scholarship-rule ingestion from official sources
- Field-level confidence scores and human review
- Complete Hindi and regional-language support
- Encrypted storage with automatic deletion

## License

MIT
