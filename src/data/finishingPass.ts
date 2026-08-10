import { curriculum, validateCurriculum } from './curriculum'

const mcdp6Assignments: Record<number, string> = {
  1: 'Read the Foreword and Chapter 1, “The Nature of Command and Control,” especially: What is Command and Control?; the relationship between command and control; complexity; the environment of command and control—uncertainty and time; and Command and Control in the Information Age.',
  2: 'Read Chapter 2, “Command and Control Theory,” focusing on the OODA Loop, Information Hierarchy, Image Theory, the Command and Control Spectrum, Information Management Theory, and Decisionmaking Theory. Then read Chapter 3 sections Mission Command and Control, Low-Level Initiative, Commander’s Intent, Mutual Trust, and Implicit Understanding and Communication.',
  30: 'Read Chapter 3, “Creating Effective Command and Control”: Mission Command and Control; Low-Level Initiative; Commander’s Intent; Mutual Trust; Implicit Understanding and Communication; and Decisionmaking. Use these sections to define what subordinate initiative requires from a commander.',
  31: 'Read Chapter 1 sections on complexity, uncertainty and time, and the information age; then Chapter 2 sections on Communications Theory, Information Management Theory, and Decisionmaking Theory. Use these concepts to diagnose Market Garden without inventing a generic “failure modes” chapter.',
  35: 'Read Chapter 3 sections Mission Command and Control, Commander’s Intent, Mutual Trust, Decisionmaking, and The Command and Control Support Structure. Draft delegated authorities and loss-of-communications criteria from those concepts.',
  58: 'Read Chapter 1 on uncertainty and time, Chapter 2 on the Command and Control Spectrum and Communications Theory, and Chapter 3 on Mission Command and Control, Low-Level Initiative, and Commander’s Intent. Use them to design dispersed command under degraded communications.',
  70: 'Read Chapter 1 sections What Does It Mean to Be “In Control”?, complexity, and uncertainty and time; then Chapter 3 sections Mission Command and Control, Commander’s Intent, Implicit Understanding and Communication, and Information Management. Design command arrangements that remain effective with incomplete data.',
  74: 'Read Chapter 2 sections Information Hierarchy, Image Theory, Information Management Theory, and Decisionmaking Theory. Use them to explain how a commander forms, tests, and updates an adversary picture during deception operations.',
  80: 'Read Chapter 2 sections Information Hierarchy, Image Theory, the OODA Loop, Information Management Theory, and Decisionmaking Theory; then Chapter 3 section Focusing Command and Control. Distinguish information volume from actual decision advantage.',
}

const weeklyCommanderTasks: Record<number, string[]> = {
  2: [
    'Define operational art in Civil War terms without forcing modern jargon onto nineteenth-century command.',
    'At Antietam, decide where and when to commit the operational reserve using only information available before the decision.',
    'At Chattanooga, identify the condition that restores operational freedom and sequence actions to exploit it.',
    'Build a theater transportation estimate that connects rail and river throughput to campaign tempo.',
    'Design intelligence requirements for a commander who lacks modern sensors and must act on ambiguous reports.',
    'Calculate where an advance exceeds its operational reach and state the condition that should trigger a pause or change of axis.',
    'Identify observable indicators of culmination before the force loses the ability to continue the offensive effectively.',
    'Compare attrition and maneuver in the Overland Campaign as competing mechanisms for achieving strategic purpose.',
    'Explain how emancipation, occupation, public will, and legitimacy alter military freedom of action.',
    'Frame a theater problem and build genuinely different operational approaches before selecting forces.',
    'Assume Confederate command and exploit Union political, geographic, logistical, and command vulnerabilities.',
    'Produce and defend a Civil War theater campaign that can survive enemy adaptation and logistical friction.',
  ],
  3: [
    'Explain how combined arms creates dilemmas rather than merely combining capabilities.',
    'Use North Africa to identify what a formation must learn after its first assumptions fail in combat.',
    'Translate scale, depth, reserves, and regeneration on the Eastern Front into commander-level decisions.',
    'Define what reconnaissance must discover, by when, and which decision each collection effort supports.',
    'Sequence breach, exploitation, and pursuit in Normandy while preserving enough combat power for the next phase.',
    'Write intent that permits disciplined subordinate initiative during a rapidly changing combined-arms fight.',
    'Identify the decisive assumptions in Market Garden and specify which indicators should have forced replanning.',
    'Build a sustainment estimate that constrains fuel, ammunition, maintenance, medical support, and distribution simultaneously.',
    'Recover from strategic and operational surprise in the Ardennes while preserving alliance cohesion and reserves.',
    'Decide when to commit a reserve, what future option is sacrificed, and what evidence justifies the commitment.',
    'Command a corps-level breach and exploitation while reacting to a credible enemy counterattack.',
    'Compare your combined-arms decisions across the term and identify one recurring command weakness to correct.',
  ],
  4: [
    'Define the joint commander’s problem in terms of effects and component contributions rather than Service activities.',
    'At Guadalcanal, balance airfield defense, sea control, reinforcement, and sustainment under persistent interdiction.',
    'Sequence Central Pacific objectives so each seizure creates the access and basing required for the next.',
    'Design the Normandy lodgment as a theater problem involving deception, force flow, coalition politics, and expansion.',
    'Separate air superiority, interdiction, and strategic bombing effects and test the assumptions linking targets to political outcomes.',
    'Design an amphibious operation in which sea control, fires, landing forces, logistics, and follow-on access are mutually supporting.',
    'At Leyte, reconcile competing command relationships and determine which joint decisions must remain centralized.',
    'Create unity of effort among coalition partners with different national interests, authorities, and tolerance for risk.',
    'Trace a critical resource from production through strategic lift, theater distribution, and final combat consumption.',
    'Allocate scarce forces and shipping between competing theaters and explicitly state the risk accepted elsewhere.',
    'Assume Axis theater command and attack Allied sequencing, coalition cohesion, access, and logistical dependencies.',
    'Design and defend a coalition amphibious campaign under global resource constraints and uncertain enemy reaction.',
  ],
  5: [
    'Frame defense of NATO’s Central Front as both an alliance-political problem and an operational military problem.',
    'Explain Soviet echelonment, depth, tempo, and deception from the perspective of a commander trying to create systemic collapse.',
    'Compare AirLand Battle’s initiative, depth, agility, and synchronization with current operational concepts.',
    'In the 1973 war, identify the assumptions shattered by surprise and air defense, then show how commanders adapted.',
    'Build the Falklands campaign around expeditionary reach, maritime-air integration, weather, and austere sustainment.',
    'Protect reinforcement routes while balancing sea denial, submarine threats, carrier risk, and global commitments.',
    'Integrate sensors, electronic warfare, fires, and signature management without assuming perfect detection or communication.',
    'Estimate mechanized operational tempo as a function of fuel, maintenance, route capacity, command posts, and enemy interference.',
    'Define escalation thresholds and decision responsibilities without treating nuclear employment as a technical optimization problem.',
    'Design dispersed command with redundancy, alternate command posts, delegation, and graceful degradation.',
    'Assume Warsaw Pact theater command and attempt rapid political collapse while controlling escalation risk.',
    'Run a Central Front campaign in which conventional operations, alliance politics, logistics, and escalation all constrain the plan.',
  ],
  6: [
    'Organize a joint force around authorities, supported-supporting relationships, components, and the commander’s decision needs.',
    'Turn air apportionment and targeting into a campaign-priority problem tied to objectives and assessment.',
    'Choose where sea control is necessary, where sea denial is sufficient, and what joint access each decision enables.',
    'Use ground maneuver to create theater-level dilemmas, protect populations, and enable effects in other domains.',
    'Allocate long-range fires by objective, authority, magazine depth, sensor confidence, and escalation risk.',
    'Prioritize scarce air and missile defense across forces, logistics, command nodes, airfields, ports, and civilian infrastructure.',
    'Identify which commander decisions fail first when positioning, timing, communications, warning, or sensing from space degrade.',
    'Map cyber dependencies and authorities at the mission level while treating effects, access, and attribution as uncertain.',
    'Design contested logistics around dispersion, transportation loss, repair, prepositioning, substitution, and endurance.',
    'Create a command-and-control concept that remains viable under deception, emissions constraints, mobility, jamming, and data loss.',
    'Assume a peer adversary and attack joint dependencies, alliance seams, logistics, sensing, and escalation assumptions.',
    'Produce a joint theater campaign whose operational logic remains coherent when multiple domains are degraded at once.',
  ],
  7: [
    'Turn intelligence collection into decision advantage by tying every requirement to a commander decision and deadline.',
    'Design military deception around a specific adversary decision, desired perception, observable indicators, and feedback.',
    'Identify critical friendly information and the observable signatures that could reveal intent to an adversary.',
    'Integrate cyber operations at the command level through authorities, dependencies, risk, timing, and uncertain effects—not exploit mechanics.',
    'Treat the electromagnetic spectrum as a contested command resource involving sensing, attack, protection, and signature discipline.',
    'Prioritize resilient space-enabled services and define graceful degradation when commercial or military support is lost.',
    'Shape public narratives without confusing information activity with credibility, legitimacy, or actual strategic effect.',
    'Define information advantage as better decisions and actions, not simply greater data volume or connectivity.',
    'Compete below armed conflict using coercion, law, proxies, economics, information, and posture while preserving escalation options.',
    'Design strategic signaling for multiple audiences and test whether capability, resolve, and ambiguity communicate what you intend.',
    'Red-team escalation by identifying attribution uncertainty, cognitive bias, red lines, and pathways to unintended conflict.',
    'Run an information-warfare tabletop in which both sides adapt and credibility, legitimacy, and escalation matter as much as tactical effects.',
  ],
  8: [
    'Rank national interests and state what level of cost and risk each interest could justify.',
    'Translate political objectives into military contributions while identifying objectives military power cannot achieve alone.',
    'Build an ends-ways-means-risk strategy with explicit assumptions and a falsifiable theory of success.',
    'Translate strategic demands into capability, organization, training, personnel, and time-horizon decisions rather than platform shopping.',
    'Choose force posture by balancing access, presence, responsiveness, resilience, signaling, and host-nation politics.',
    'Design mobilization and readiness priorities under limits in training capacity, reserves, industrial surge, and time.',
    'Use alliances while managing burden sharing, interoperability, assurance, autonomy, and entrapment risk.',
    'Connect industrial production, stockpiles, workforce, supply chains, finance, and repair capacity to campaign endurance.',
    'Design war termination around bargaining leverage, acceptable outcomes, escalation control, enforcement, and off-ramps.',
    'Define the postwar security order before the campaign ends, including governance, reconstruction, legitimacy, and unintended consequences.',
    'Red-team the entire strategy by attacking assumptions, coalition cohesion, posture, industrial endurance, and termination logic.',
    'Produce, execute, assess, and defend an integrated theater strategy from national interests through postwar conditions.',
  ],
}

const termWordRanges: Record<number, [number, number]> = {
  2: [400, 700],
  3: [450, 750],
  4: [500, 850],
  5: [500, 850],
  6: [550, 950],
  7: [550, 950],
  8: [650, 1200],
}

function progressiveWordTarget(termNumber: number, index: number): number {
  const [low, high] = termWordRanges[termNumber] ?? [450, 750]
  if (index === 11) return high
  if (index === 10) return Math.round(low + (high - low) * 0.7)
  return Math.round(low + (high - low) * (index / 14))
}

for (const term of curriculum) {
  for (let index = 0; index < term.weeks.length; index += 1) {
    const week = term.weeks[index]

    for (const reading of week.readings) {
      if (reading.title === 'MCDP 6, Command and Control' && mcdp6Assignments[week.number]) {
        reading.assignment = mcdp6Assignments[week.number]
        reading.instructions = 'Use the named section headings from MCDP 6. Capture the doctrinal claim, the commander behavior it implies, and one way technology could tempt a headquarters to violate that principle.'
      }
    }

    if (term.number === 1) continue

    const task = weeklyCommanderTasks[term.number]?.[index]
    if (!task) continue

    const decisionStandard = index < 4
      ? 'State one decision you would make and the evidence that supports it.'
      : index < 8
        ? 'Compare at least two courses of action and state the assumption most likely to invalidate your preferred option.'
        : 'Write as the responsible commander: delegate what can be delegated, state accepted risk, and identify the decision point that would force adaptation.'

    week.guidanceSteps = [
      `Frame — ${task}`,
      `Decide — ${decisionStandard}`,
      'Stress-test — Give the adversary a competent response. Recheck sustainment, time, coalition/political constraints, and what happens if your preferred mechanism fails.',
      'Learn — Record the decision, expected result, reconsideration trigger, actual or adjudicated outcome, and one change to your personal doctrine.',
    ]

    if (week.exercises[0]) {
      week.exercises[0].instructions = `${task} ${week.exercises[0].instructions} Do not reveal or consult the historical outcome until after your initial decision when the week is a historical case.`
    }

    if (week.prompts[0]) {
      week.prompts[0].suggestedMinimumWords = progressiveWordTarget(term.number, index)
      week.prompts[0].prompt = `${week.prompts[0].prompt}\n\nFinishing-pass commander focus: ${task} Your answer must separate facts, assessments, assumptions, and unknowns; show the causal logic connecting actions to the desired political or operational condition; and name at least one observable indicator that would prove your theory of success is failing.`
    }
  }
}

const errors = validateCurriculum(curriculum)
if (errors.length) throw new Error(`Invalid finishing-pass curriculum:\n${errors.join('\n')}`)
