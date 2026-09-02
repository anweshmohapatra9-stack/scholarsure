const findings = [
  {
    severity: 'Fix now',
    title: 'Name mismatch across documents',
    summary:
      '“Aarav Kumar” on Aadhaar does not match “Aarav K.” on the marksheet.',
    action:
      'Request a corrected marksheet or attach the accepted name-declaration form.',
    evidence: 'Guidelines · Identity requirements · Page 4',
    tone: 'danger',
    icon: 'identity',
  },
  {
    severity: 'Fix now',
    title: 'Income certificate is too old',
    summary:
      'The uploaded certificate is 14 months old; the scheme allows up to 12 months.',
    action:
      'Apply for a fresh income certificate before beginning the scholarship form.',
    evidence: 'Guidelines · Required documents · Page 7',
    tone: 'warning',
    icon: 'calendar',
  },
  {
    severity: 'Missing',
    title: 'OTR proof was not found',
    summary:
      'A One Time Registration number is mandatory, but no OTR proof is in this file.',
    action:
      'Complete OTR registration and add the acknowledgement page to this application.',
    evidence: 'Guidelines · Registration · Page 2',
    tone: 'warning',
    icon: 'file',
  },
];

const passedChecks = [
  'Academic score meets the 80% threshold',
  'Aadhaar document is present and readable',
  'Income is within the scheme limit',
  'File formats match submission rules',
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { documentNames?: unknown };

    if (!Array.isArray(body.documentNames) || body.documentNames.length === 0) {
      return Response.json(
        { error: 'Add at least one document before starting the audit.' },
        { status: 400 },
      );
    }

    return Response.json({
      scheme: 'PM-USP CSSS',
      score: 67,
      deadline: '31 October 2026',
      findings,
      passedChecks,
      checksWithoutAction: 5,
      disclaimer:
        'Illustrative prototype result. Verify every finding against the official scheme rules.',
    });
  } catch {
    return Response.json(
      { error: 'The audit request could not be read.' },
      { status: 400 },
    );
  }
}
