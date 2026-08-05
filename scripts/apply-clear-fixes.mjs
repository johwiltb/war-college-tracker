import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(path, 'utf8')
}

function write(path, content) {
  fs.writeFileSync(path, content)
}

function replaceOnce(path, search, replacement) {
  const content = read(path)
  if (!content.includes(search)) {
    throw new Error(`Expected text was not found in ${path}: ${search.slice(0, 100)}`)
  }
  write(path, content.replace(search, replacement))
}

function replaceMany(path, replacements) {
  let content = read(path)
  for (const [search, replacement] of replacements) {
    if (!content.includes(search)) {
      throw new Error(`Expected text was not found in ${path}: ${search.slice(0, 100)}`)
    }
    content = content.replace(search, replacement)
  }
  write(path, content)
}

replaceOnce(
  'src/types/domain.ts',
  `  estimatedHours: number\n  learningObjectives: string[]`,
  `  estimatedHours: number\n  coreMinutes: number\n  extensionMinutes: number\n  guidanceSteps: string[]\n  learningObjectives: string[]`,
)

replaceOnce(
  'src/data/curriculum.ts',
  `  campaign?: string\n  hours?: number\n}`,
  `  campaign?: string\n  hours?: number\n  sourceIndexes?: [number, number]\n}`,
)

const termOneWeekReplacements = [
  [`      { title: 'The Nature of War', topic: 'Friction, uncertainty, violence, and the contest of human wills', era: 'Foundations', level: 'All echelons' },`, `      { title: 'The Nature of War', topic: 'Friction, uncertainty, violence, and the contest of human wills', era: 'Foundations', level: 'All echelons', sourceIndexes: [0, 1] },`],
  [`      { title: 'Command and Control', topic: 'Command philosophy, information, decision, and feedback', era: 'Foundations', level: 'Battalion–corps' },`, `      { title: 'Command and Control', topic: 'Command philosophy, information, decision, and feedback', era: 'Foundations', level: 'Battalion–corps', sourceIndexes: [1, 0] },`],
  [`      { title: 'Planning Under Uncertainty', topic: 'Planning as preparation for adaptation rather than prediction', era: 'Foundations', level: 'Brigade–corps' },`, `      { title: 'Planning Under Uncertainty', topic: 'Planning as preparation for adaptation rather than prediction', era: 'Foundations', level: 'Brigade–corps', sourceIndexes: [2, 0] },`],
  [`      { title: 'Logistics as a Warfighting Function', topic: 'Sustainment, tempo, reach, and logistics risk', era: 'Foundations', level: 'Brigade–theater' },`, `      { title: 'Logistics as a Warfighting Function', topic: 'Sustainment, tempo, reach, and logistics risk', era: 'Foundations', level: 'Brigade–theater', sourceIndexes: [3, 2] },`],
  [`      { title: 'Vicksburg Strategic Setting', topic: 'Political aims, the Mississippi River, and competing command problems', era: 'American Civil War', level: 'Theater', campaign: 'Vicksburg' },`, `      { title: 'Vicksburg Strategic Setting', topic: 'Political aims, the Mississippi River, and competing command problems', era: 'American Civil War', level: 'Theater', campaign: 'Vicksburg', sourceIndexes: [5, 4] },`],
  [`      { title: 'Geography and the Operational Environment', topic: 'Terrain, rivers, populations, weather, and operational approach', era: 'American Civil War', level: 'Army–theater', campaign: 'Vicksburg' },`, `      { title: 'Geography and the Operational Environment', topic: 'Terrain, rivers, populations, weather, and operational approach', era: 'American Civil War', level: 'Army–theater', campaign: 'Vicksburg', sourceIndexes: [6, 5] },`],
  [`      { title: 'Friendly and Enemy Estimates', topic: 'Capabilities, intentions, assumptions, and intelligence gaps', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg' },`, `      { title: 'Friendly and Enemy Estimates', topic: 'Capabilities, intentions, assumptions, and intelligence gaps', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg', sourceIndexes: [6, 2] },`],
  [`      { title: 'Course-of-Action Development', topic: 'Distinct, feasible, acceptable, suitable, and complete options', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg' },`, `      { title: 'Course-of-Action Development', topic: 'Distinct, feasible, acceptable, suitable, and complete options', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg', sourceIndexes: [2, 6] },`],
  [`      { title: 'Course-of-Action Wargaming', topic: 'Action–reaction–counteraction and decision-point identification', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg' },`, `      { title: 'Course-of-Action Wargaming', topic: 'Action–reaction–counteraction and decision-point identification', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg', sourceIndexes: [2, 6] },`],
  [`      { title: 'Campaign Execution', topic: 'Crossing, maneuver, sustainment, tempo, and adaptation', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg', hours: 2.5 },`, `      { title: 'Campaign Execution', topic: 'Crossing, maneuver, sustainment, tempo, and adaptation', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg', hours: 2.5, sourceIndexes: [6, 3] },`],
  [`      { title: 'Red Command', topic: 'Confederate options, constraints, and counter-campaign design', era: 'American Civil War', level: 'Army–theater', campaign: 'Vicksburg' },`, `      { title: 'Red Command', topic: 'Confederate options, constraints, and counter-campaign design', era: 'American Civil War', level: 'Army–theater', campaign: 'Vicksburg', sourceIndexes: [6, 4] },`],
  [`      { title: 'Vicksburg Command Review', topic: 'Critical decisions, counterfactuals, AAR, and personal doctrine', era: 'American Civil War', level: 'Army–theater', campaign: 'Vicksburg', hours: 3 },`, `      { title: 'Vicksburg Command Review', topic: 'Critical decisions, counterfactuals, AAR, and personal doctrine', era: 'American Civil War', level: 'Army–theater', campaign: 'Vicksburg', hours: 3, sourceIndexes: [6, 5] },`],
]
replaceMany('src/data/curriculum.ts', termOneWeekReplacements)

const curriculumAdditions = `
const term1ReadingAssignments: Record<number, [string, string]> = {
  1: ['Read the foreword and Chapter 1 sections defining war, friction, uncertainty, fluidity, disorder, and the human dimension.', 'Read the introduction and opening discussion of command and control; identify how information supports—but cannot replace—judgment.'],
  2: ['Read the introduction and the sections explaining the nature, theory, and practice of command and control, including decision and feedback.', 'Revisit the sections on friction, uncertainty, and the clash of opposing wills; connect each to a command-and-control failure mode.'],
  3: ['Read the foreword, introduction, and opening planning chapters on problem framing, decision, and preparation for adaptation.', 'Read the sections on uncertainty, tempo, and initiative; note why planning cannot eliminate battlefield disorder.'],
  4: ['Read the introduction and opening chapters on the nature and theory of logistics, operational reach, and the relationship between logistics and tempo.', 'Read the sections addressing feasibility, risk, and the need to adapt plans when assumptions or resources change.'],
  5: ['Read the Civil War sections covering the Mississippi Valley and the strategic setting of the Vicksburg campaign through the end of 1862.', 'Read the chapters or sections covering the 1862–1863 strategic situation, the Mississippi River, and the political importance of Vicksburg.'],
  6: ['Read the staff-ride sections on terrain, river approaches, roads, railroads, weather, population, and other operational-environment factors.', 'Read the Vicksburg campaign narrative through the Union decision to seek a crossing south of the city.'],
  7: ['Read the staff-ride order of battle, commander biographies, dispositions, capabilities, and intelligence available before the decisive campaign.', 'Read the mission-analysis sections dealing with facts, assumptions, information requirements, constraints, and risk.'],
  8: ['Read the sections on course-of-action development, including suitability, feasibility, acceptability, distinguishability, and completeness.', 'Read the staff-ride account of failed approaches and pre-crossing options; identify at least three genuinely different Union approaches.'],
  9: ['Read the course-of-action wargaming sections on action–reaction–counteraction, decision points, branches, and recording results.', 'Read the staff-ride sections covering the proposed crossing and likely Confederate reactions before studying the historical outcome.'],
  10: ['Read the staff-ride narrative from the Bruinsburg crossing through the inland maneuver, battles, and investment of Vicksburg.', 'Read the sections on operational reach, distribution, maintenance, health services, and sustaining tempo during extended maneuver.'],
  11: ['Read the staff-ride sections presenting Confederate command relationships, options, constraints, and responses during the campaign.', 'Read the Vicksburg and Confederate-home-front sections; identify political pressures that shaped military choices.'],
  12: ['Read the staff-ride conclusions and critical-decision discussions, then revisit the maps and timeline without reading the authors’ lessons first.', 'Read the official history’s summary of Vicksburg and its strategic consequences for the remainder of the war.'],
}

const term1Guidance: Record<number, string[]> = {
  1: ['Capture three doctrinal claims in your own words.', 'Write a 150-word concept note before opening the main prompt.', 'Use one historical example and one engineering or cybersecurity analogy, then state where the analogy fails.', 'Score only the rubric categories you can support with evidence; explain any zero rather than guessing.'],
  2: ['Describe the decision the commander must make, not merely the communications technology available.', 'Draft a purpose, key tasks, and end state that subordinates could use during communications loss.', 'Test the intent against one subordinate action you did not explicitly authorize.', 'Record where additional control would help and where it would slow adaptation.'],
  3: ['Separate facts, assumptions, assessments, and unknowns.', 'Create two materially different courses of action before selecting one.', 'Name the assumption most likely to invalidate your preferred plan.', 'Write one observable trigger for reframing the problem.'],
  4: ['Estimate demand, capacity, distance, time, and the weakest sustainment link.', 'Identify where the force culminates if the estimate is wrong.', 'Change one logistics assumption and revise the operational approach.', 'Explain which combat action you would reduce to preserve endurance.'],
  5: ['State the Union and Confederate political objectives separately.', 'Mark what you know only because of hindsight.', 'Define the theater problem without proposing a solution.', 'List three strategic constraints that cannot be solved by battlefield success alone.'],
  6: ['Build or annotate a map before writing prose.', 'Identify terrain that enables movement, terrain that channels it, and terrain that protects sustainment.', 'Explain how season, disease, population, and transportation interact.', 'Propose one operational approach and one reason geography may defeat it.'],
  7: ['Build friendly and enemy capability summaries from the assigned sources.', 'State the most likely and most dangerous enemy courses of action.', 'List priority intelligence requirements and the decisions each supports.', 'Flag every assumption that substitutes for missing intelligence.'],
  8: ['Develop three courses of action that differ in mechanism, risk, and operational approach.', 'Check each for suitability, feasibility, acceptability, distinguishability, and completeness.', 'Identify the main effort and accepted risk for each option.', 'Select comparison criteria before choosing your preferred course.'],
  9: ['Wargame each course of action phase by phase.', 'Use action–reaction–counteraction rather than narrating only friendly success.', 'Record decision points, branches, resource demands, and likely culmination.', 'Revise or reject any course whose theory of success depends on enemy cooperation.'],
  10: ['Issue intent and initial orders before reviewing the historical sequence.', 'Execute at least three decision turns without reloading an unfavorable result.', 'Record each consequential decision, expected enemy response, and reconsideration trigger.', 'Stop at the first major divergence and assess whether the plan or an assumption failed.'],
  11: ['Adopt the Confederate command problem without using Union hindsight.', 'Identify how to impose delay, political cost, and logistical strain rather than merely seek battle.', 'Attack the assumptions in your Week 8 plan.', 'Write the strongest Confederate counter-campaign you can defend from available evidence.'],
  12: ['Compare your decisions with the historical campaign without grading yourself on imitation.', 'Identify one sound decision that failed, one poor decision that succeeded, and why.', 'Complete the full after-action review and update your personal doctrine.', 'Choose one decision point to replay and specify what evidence would justify a different choice.'],
}

const defaultGuidance = [
  'Read the required source and record two claims, one assumption, and one question.',
  'Complete the applied exercise before drafting the command analysis.',
  'Make enemy agency, sustainment, risk, and a reassessment trigger explicit.',
  'Score the rubric based on demonstrated reasoning rather than simulated victory.',
]

const term1WordTargets: Record<number, number> = {
  1: 250, 2: 250, 3: 300, 4: 300, 5: 300, 6: 300,
  7: 350, 8: 350, 9: 350, 10: 450, 11: 450, 12: 700,
}
`
replaceOnce('src/data/curriculum.ts', `\nconst termOutlines: TermOutline[] = [`, `${curriculumAdditions}\nconst termOutlines: TermOutline[] = [`)

replaceOnce(
  'src/data/curriculum.ts',
  `function buildReading(source: SourceSpec, week: WeekOutline, weekNumber: number, index: number): Reading {\n  const requirement = index === 0 ? 'required' : 'optional'\n  return {`,
  `function buildReading(source: SourceSpec, week: WeekOutline, weekNumber: number, index: number): Reading {\n  const requirement = index === 0 ? 'required' : 'optional'\n  const assignmentOverride = term1ReadingAssignments[weekNumber]?.[index]\n  return {`,
)
replaceOnce(
  'src/data/curriculum.ts',
  `    assignment: index === 0 ? \`Read the sections most directly addressing \${week.topic.toLowerCase()}; target 25–35 pages.\` : \`Consult the index and relevant campaign or doctrinal section for \${week.title}.\`,\n    requirement,\n    estimatedMinutes: index === 0 ? 45 : 25,`,
  `    assignment: assignmentOverride ?? (index === 0 ? \`Read the sections most directly addressing \${week.topic.toLowerCase()}; target 25–35 pages.\` : \`Consult the index and relevant campaign or doctrinal section for \${week.title}.\`),\n    requirement,\n    estimatedMinutes: index === 0 ? 35 : 20,`,
)
replaceOnce(
  'src/data/curriculum.ts',
  `  const primary = term.sources[weekIndex % term.sources.length]\n  const secondary = term.sources[(weekIndex + 1) % term.sources.length]`,
  `  const [primaryIndex, secondaryIndex] = outline.sourceIndexes ?? [weekIndex % term.sources.length, (weekIndex + 1) % term.sources.length]\n  const primary = term.sources[primaryIndex]\n  const secondary = term.sources[secondaryIndex]`,
)
replaceOnce(
  'src/data/curriculum.ts',
  `    estimatedHours: outline.hours ?? 2,\n    learningObjectives: [`,
  `    estimatedHours: outline.hours ?? 2,\n    coreMinutes: 120,\n    extensionMinutes: Math.max(20, Math.round(((outline.hours ?? 2) * 60) - 120)),\n    guidanceSteps: term1Guidance[weekNumber] ?? defaultGuidance,\n    learningObjectives: [`,
)
replaceOnce(
  'src/data/curriculum.ts',
  `      suggestedMinimumWords: weekIndex === 11 ? 900 : 450,`,
  `      suggestedMinimumWords: term1WordTargets[weekNumber] ?? (weekIndex === 11 ? 900 : 450),`,
)
replaceOnce(
  'src/data/curriculum.ts',
  `    if (week.learningObjectives.length < 3) errors.push(\`\${week.id} has fewer than 3 objectives.\`)`,
  `    if (week.coreMinutes < 60 || week.coreMinutes > 120) errors.push(\`\${week.id} must keep the core path between 60 and 120 minutes.\`)\n    if (week.extensionMinutes < 0) errors.push(\`\${week.id} has a negative extension estimate.\`)\n    if (week.guidanceSteps.length < 3) errors.push(\`\${week.id} has insufficient learner guidance.\`)\n    if (week.learningObjectives.length < 3) errors.push(\`\${week.id} has fewer than 3 objectives.\`)`,
)

replaceMany('src/pages/WeekWorkspacePage.tsx', [
  [`<span><Clock3 size={15} /> {week.estimatedHours} estimated hours</span>`, `<span><Clock3 size={15} /> {week.coreMinutes} min core</span><span>+ {week.extensionMinutes} min optional extension</span>`],
  [`      <div className="unclassified-banner"><ShieldAlert size={18} /><span><strong>Unclassified personal study only.</strong> Never enter classified, CUI, export-controlled, employer-sensitive, or current operational information.</span></div>\n\n      <div className="workspace-layout">`, `      <div className="unclassified-banner"><ShieldAlert size={18} /><span><strong>Unclassified personal study only.</strong> Never enter classified, CUI, export-controlled, employer-sensitive, or current operational information.</span></div>\n\n      <section className="workspace-section objectives-section"><div className="section-icon"><Clock3 /></div><div><p className="section-number">00 · BATTLE RHYTHM</p><h2>Two-hour core path</h2><p>Complete the core sequence first. Optional readings and expanded exercises belong in the extension block; they should not prevent steady weekly progress.</p><ol>{week.guidanceSteps.map((step) => <li key={step}>{step}</li>)}</ol><div className="week-meta"><span>{week.coreMinutes} minutes core</span><span>{week.extensionMinutes} minutes optional extension</span><span>{week.estimatedHours} hours full path</span></div></div></section>\n\n      <div className="workspace-layout">`],
  [`requirement === 'required' ? 'Required' : 'Optional'`, `requirement === 'required' ? 'Required' : 'Optional extension'`],
  [`<span>Estimated load <b>{week.estimatedHours}h</b></span>`, `<span>Core path <b>{week.coreMinutes}m</b></span><span>Optional extension <b>{week.extensionMinutes}m</b></span>`],
])

replaceOnce(
  'src/pages/CurriculumPage.tsx',
  `<span>{week.estimatedHours} hrs</span><span>{week.readings.length} readings</span>`,
  `<span>{week.coreMinutes} min core</span><span>+{week.extensionMinutes} min optional</span><span>{week.readings.length} readings</span>`,
)

replaceOnce(
  'src/test/curriculum.test.ts',
  `      expect(week.learningObjectives.length).toBeGreaterThanOrEqual(3)`,
  `      expect(week.coreMinutes).toBeGreaterThanOrEqual(60)\n      expect(week.coreMinutes).toBeLessThanOrEqual(120)\n      expect(week.extensionMinutes).toBeGreaterThanOrEqual(0)\n      expect(week.guidanceSteps.length).toBeGreaterThanOrEqual(3)\n      expect(week.learningObjectives.length).toBeGreaterThanOrEqual(3)`,
)
replaceOnce(
  'src/test/curriculum.test.ts',
  `  it('keeps week numbering and IDs stable', () => {`,
  `  it('gives Term 1 exact section-level reading assignments and progressive writing targets', () => {\n    const termOne = allWeeks.slice(0, 12)\n    termOne.forEach((week) => {\n      expect(week.readings[0].assignment).not.toContain('sections most directly addressing')\n      expect(week.readings[0].assignment.length).toBeGreaterThan(80)\n    })\n    expect(termOne[0].prompts[0].suggestedMinimumWords).toBe(250)\n    expect(termOne[11].prompts[0].suggestedMinimumWords).toBe(700)\n  })\n\n  it('keeps week numbering and IDs stable', () => {`,
)

replaceMany('.github/workflows/deploy-pages.yml', [
  [`uses: actions/checkout@v4`, `uses: actions/checkout@v6`],
  [`uses: actions/setup-node@v4`, `uses: actions/setup-node@v6`],
  [`uses: actions/upload-pages-artifact@v3`, `uses: actions/upload-pages-artifact@v4`],
  [`      - name: Install dependencies\n        run: npm ci\n      - name: Build application`, `      - name: Install dependencies\n        run: npm ci\n      - name: Lint\n        run: npm run lint\n      - name: Type check\n        run: npm run typecheck\n      - name: Unit tests\n        run: npm run test\n      - name: Audit production dependencies\n        run: npm audit --omit=dev --audit-level=high\n      - name: Audit full dependency tree for critical findings\n        run: npm audit --audit-level=critical\n      - name: Build application`],
])

write('.github/workflows/quality.yml', `name: Quality checks\n\non:\n  pull_request:\n    branches: [main]\n  workflow_dispatch:\n\npermissions:\n  contents: read\n\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Check out repository\n        uses: actions/checkout@v6\n      - name: Set up Node\n        uses: actions/setup-node@v6\n        with:\n          node-version: 22\n          cache: npm\n      - name: Install dependencies\n        run: npm ci\n      - name: Lint\n        run: npm run lint\n      - name: Type check\n        run: npm run typecheck\n      - name: Unit tests\n        run: npm run test\n      - name: Audit production dependencies\n        run: npm audit --omit=dev --audit-level=high\n      - name: Audit full dependency tree for critical findings\n        run: npm audit --audit-level=critical\n      - name: Production build\n        run: npm run build\n`)

replaceOnce(
  'README.md',
  `Available checks:\n\n\`\`\`bash\nnpm run lint\nnpm run typecheck\nnpm run test\nnpm run build\nnpm run preview\n\`\`\``,
  `Available checks:\n\n\`\`\`bash\nnpm run lint\nnpm run typecheck\nnpm run test\nnpm run build\nnpm run preview\n\`\`\`\n\nThe deployment workflow now gates publication on linting, type checking, unit tests, a high-severity production-dependency audit, a critical-severity full-tree audit, and the production build. Pull requests receive the same checks through \`.github/workflows/quality.yml\`.`,
)
replaceOnce(
  'README.md',
  `- External source availability and doctrine editions change; several readings intentionally omit a URL pending human verification.`,
  `- Term 1 now uses curated section-level assignments and a two-hour core path with optional extension work. Later terms retain broader topic-level assignments and should receive the same instructor-level curation before formal use.\n- External source availability and doctrine editions change; several readings intentionally omit a URL pending human verification.`,
)

replaceOnce(
  'docs/CURRICULUM_VERIFICATION.md',
  `## Sources requiring link verification`,
  `## Term 1 curation status\n\n- Weeks 1–12 use source selections chosen for each week rather than rotating sources mechanically.\n- Required readings now name the chapter, section group, campaign phase, or staff-ride material to study without inventing edition-dependent page numbers.\n- The normal path is capped at 120 core minutes. Optional readings and expanded simulations are labeled as extension work.\n- Writing targets increase from 250 words in the opening weeks to a 700-word Vicksburg command review.\n- Each week includes a sequenced learner battle rhythm so early assignments provide more scaffolding and later assignments demand greater independence.\n\n## Sources requiring link verification`,
)
replaceOnce(
  'docs/CURRICULUM_VERIFICATION.md',
  `- The normal workload is approximately two hours: about 45 minutes of required reading, up to 25 minutes of optional reading, and an applied/writing product. Major simulations are labeled from 3 to 5 hours.`,
  `- The normal workload is a 120-minute core path: approximately 35 minutes of required reading, 35–60 minutes of application, and the remaining time for writing and reflection. Optional reading and expanded execution are identified as extension work. Major simulations retain a longer full-path estimate.`,
)

console.log('CLEAR remediation source changes applied successfully.')
