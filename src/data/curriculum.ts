import type { CurriculumTerm, CurriculumWeek, Reading } from '../types/domain'

interface WeekOutline {
  title: string
  topic: string
  era: string
  level: string
  campaign?: string
  hours?: number
}

interface TermOutline {
  title: string
  description: string
  sources: SourceSpec[]
  weeks: WeekOutline[]
}

interface SourceSpec {
  title: string
  author: string
  publication: string
  url: string | null
  citation: string
  availabilityNotes?: string
}

const officialLinkNote = 'Use the linked official edition; confirm page numbering against the edition cited in your notes.'
const verificationNote = 'Locate through the issuing organization or a professional military education library; current public link requires verification.'

const marineDoctrine: SourceSpec[] = [
  { title: 'MCDP 1, Warfighting', author: 'United States Marine Corps', publication: 'Marine Corps Doctrinal Publication 1', url: 'https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/899837/mcdp-1/', citation: 'United States Marine Corps. MCDP 1, Warfighting. Washington, DC: Headquarters Marine Corps.', availabilityNotes: officialLinkNote },
  { title: 'MCDP 6, Command and Control', author: 'United States Marine Corps', publication: 'Marine Corps Doctrinal Publication 6', url: 'https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/898678/mcdp-6/', citation: 'United States Marine Corps. MCDP 6, Command and Control. Washington, DC: Headquarters Marine Corps.', availabilityNotes: officialLinkNote },
  { title: 'MCDP 5, Planning', author: 'United States Marine Corps', publication: 'Marine Corps Doctrinal Publication 5', url: 'https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/899841/mcdp-5/', citation: 'United States Marine Corps. MCDP 5, Planning. Washington, DC: Headquarters Marine Corps.', availabilityNotes: officialLinkNote },
  { title: 'MCDP 4, Logistics', author: 'United States Marine Corps', publication: 'Marine Corps Doctrinal Publication 4', url: 'https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/899840/mcdp-4/', citation: 'United States Marine Corps. MCDP 4, Logistics. Washington, DC: Headquarters Marine Corps.', availabilityNotes: officialLinkNote },
]

const civilWarSources: SourceSpec[] = [
  { title: 'The Civil War: A Concise History', author: 'Louis P. Masur', publication: 'Oxford University Press', url: null, citation: 'Masur, Louis P. The Civil War: A Concise History. Oxford University Press, 2011.', availabilityNotes: 'Copyrighted work; use a library or owned copy. Do not reproduce the text.' },
  { title: 'American Military History, Volume I', author: 'U.S. Army Center of Military History', publication: 'Army Historical Series', url: 'https://history.army.mil/Publications/Publications-Catalog/American-Military-History-Volume-I/', citation: 'U.S. Army Center of Military History. American Military History, Volume I: The United States Army and the Forging of a Nation, 1775–1917.', availabilityNotes: officialLinkNote },
  { title: 'Vicksburg Campaign Staff Ride Briefing Book', author: 'Combat Studies Institute', publication: 'U.S. Army Combined Arms Center', url: null, citation: 'Combat Studies Institute. Vicksburg Campaign Staff Ride Briefing Book. Fort Leavenworth, KS.', availabilityNotes: verificationNote },
]

const wwiiSources: SourceSpec[] = [
  { title: 'American Military History, Volume II', author: 'U.S. Army Center of Military History', publication: 'Army Historical Series', url: 'https://history.army.mil/Publications/Publications-Catalog/American-Military-History-Volume-II/', citation: 'U.S. Army Center of Military History. American Military History, Volume II: The United States Army in a Global Era, 1917–2008.', availabilityNotes: officialLinkNote },
  { title: 'Selected Campaign Brochure', author: 'U.S. Army Center of Military History', publication: 'World War II Campaign Brochures', url: null, citation: 'U.S. Army Center of Military History. World War II Campaign Brochure series.', availabilityNotes: verificationNote },
  { title: 'FM 3-0, Operations', author: 'Department of the Army', publication: 'Field Manual 3-0', url: null, citation: 'Department of the Army. FM 3-0, Operations. Washington, DC: Headquarters, Department of the Army.', availabilityNotes: 'Confirm the current edition and official Army Publishing Directorate URL.' },
]

const jointSources: SourceSpec[] = [
  { title: 'JP 3-0, Joint Campaigns and Operations', author: 'Joint Chiefs of Staff', publication: 'Joint Publication 3-0', url: null, citation: 'Joint Chiefs of Staff. JP 3-0, Joint Campaigns and Operations. Washington, DC.', availabilityNotes: 'Confirm the current edition and official Joint Electronic Library URL.' },
  { title: 'JP 5-0, Joint Planning', author: 'Joint Chiefs of Staff', publication: 'Joint Publication 5-0', url: 'https://www.jcs.mil/Doctrine/Joint-Doctrine-Pubs/5-0-Planning-Series/', citation: 'Joint Chiefs of Staff. JP 5-0, Joint Planning. Washington, DC.', availabilityNotes: 'Official doctrine-series page; confirm the edition date before study.' },
  { title: 'Joint Doctrine Note 1-19, Competition Continuum', author: 'Joint Chiefs of Staff', publication: 'Joint Doctrine Note 1-19', url: null, citation: 'Joint Chiefs of Staff. Joint Doctrine Note 1-19, Competition Continuum. Washington, DC.', availabilityNotes: verificationNote },
]

const strategySources: SourceSpec[] = [
  { title: 'Strategy: The Logic of War and Peace', author: 'Edward N. Luttwak', publication: 'Belknap Press', url: null, citation: 'Luttwak, Edward N. Strategy: The Logic of War and Peace. Revised edition. Belknap Press, 2001.', availabilityNotes: 'Copyrighted work; use a library or owned copy. Do not reproduce the text.' },
  { title: 'On War', author: 'Carl von Clausewitz', publication: 'Public-domain translation or licensed edition', url: 'https://www.gutenberg.org/ebooks/1946', citation: 'Clausewitz, Carl von. On War. Translated by J. J. Graham. Project Gutenberg public-domain edition.', availabilityNotes: 'Public-domain English translation; compare terminology with a modern scholarly edition.' },
  { title: 'National Security Strategy', author: 'The White House', publication: 'National Security Strategy of the United States', url: null, citation: 'The White House. National Security Strategy of the United States. Current edition.', availabilityNotes: 'Confirm the current edition at whitehouse.gov before study.' },
]

const termOutlines: TermOutline[] = [
  {
    title: 'Nature of War and Command',
    description: 'Theory, uncertainty, command, planning, logistics, and the Vicksburg command problem.',
    sources: [...marineDoctrine, ...civilWarSources],
    weeks: [
      { title: 'The Nature of War', topic: 'Friction, uncertainty, violence, and the contest of human wills', era: 'Foundations', level: 'All echelons' },
      { title: 'Command and Control', topic: 'Command philosophy, information, decision, and feedback', era: 'Foundations', level: 'Battalion–corps' },
      { title: 'Planning Under Uncertainty', topic: 'Planning as preparation for adaptation rather than prediction', era: 'Foundations', level: 'Brigade–corps' },
      { title: 'Logistics as a Warfighting Function', topic: 'Sustainment, tempo, reach, and logistics risk', era: 'Foundations', level: 'Brigade–theater' },
      { title: 'Vicksburg Strategic Setting', topic: 'Political aims, the Mississippi River, and competing command problems', era: 'American Civil War', level: 'Theater', campaign: 'Vicksburg' },
      { title: 'Geography and the Operational Environment', topic: 'Terrain, rivers, populations, weather, and operational approach', era: 'American Civil War', level: 'Army–theater', campaign: 'Vicksburg' },
      { title: 'Friendly and Enemy Estimates', topic: 'Capabilities, intentions, assumptions, and intelligence gaps', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg' },
      { title: 'Course-of-Action Development', topic: 'Distinct, feasible, acceptable, suitable, and complete options', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg' },
      { title: 'Course-of-Action Wargaming', topic: 'Action–reaction–counteraction and decision-point identification', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg' },
      { title: 'Campaign Execution', topic: 'Crossing, maneuver, sustainment, tempo, and adaptation', era: 'American Civil War', level: 'Army', campaign: 'Vicksburg', hours: 2.5 },
      { title: 'Red Command', topic: 'Confederate options, constraints, and counter-campaign design', era: 'American Civil War', level: 'Army–theater', campaign: 'Vicksburg' },
      { title: 'Vicksburg Command Review', topic: 'Critical decisions, counterfactuals, AAR, and personal doctrine', era: 'American Civil War', level: 'Army–theater', campaign: 'Vicksburg', hours: 3 },
    ],
  },
  {
    title: 'Civil War Operational Art',
    description: 'Operational reach, intelligence, logistics, maneuver, attrition, and civil-military problems in major Civil War campaigns.',
    sources: [...civilWarSources, marineDoctrine[2]],
    weeks: [
      { title: 'Operational Art in the Civil War', topic: 'Linking tactical action to strategic purpose across distance and time', era: 'American Civil War', level: 'Army–theater' },
      { title: 'Antietam: Decisions in Limited Time', topic: 'Intelligence, tempo, reserves, and political constraint', era: 'American Civil War', level: 'Army', campaign: 'Antietam' },
      { title: 'Chattanooga: Restoring Operational Freedom', topic: 'Relief, interior lines, command change, and seizing initiative', era: 'American Civil War', level: 'Army group', campaign: 'Chattanooga' },
      { title: 'Rail and River Logistics', topic: 'Transportation networks, throughput, protection, and campaigning capacity', era: 'American Civil War', level: 'Theater' },
      { title: 'Intelligence Under Constraint', topic: 'Scouts, cavalry, signals, newspapers, and ambiguous reporting', era: 'American Civil War', level: 'Army' },
      { title: 'Operational Reach', topic: 'Basing, communications, logistics, and the geometry of advance', era: 'American Civil War', level: 'Army–theater' },
      { title: 'Culmination', topic: 'Recognizing declining relative power before the offensive fails', era: 'American Civil War', level: 'Army' },
      { title: 'Attrition and Maneuver in the Overland Campaign', topic: 'Operational objectives, replacement capacity, and relentless contact', era: 'American Civil War', level: 'Army group', campaign: 'Overland Campaign' },
      { title: 'Civil-Military Considerations', topic: 'Emancipation, occupation, public will, and political legitimacy', era: 'American Civil War', level: 'Theater–national' },
      { title: 'Civil War Campaign Design Workshop', topic: 'Frame a theater problem and construct competing operational approaches', era: 'American Civil War', level: 'Theater', hours: 2.5 },
      { title: 'Confederate Red Team', topic: 'Exploit Union political, geographic, and command vulnerabilities', era: 'American Civil War', level: 'Theater' },
      { title: 'Civil War Operational Campaign Exercise', topic: 'Plan, execute, assess, and revise a multi-army campaign', era: 'American Civil War', level: 'Theater', hours: 3 },
    ],
  },
  {
    title: 'World War II Combined Arms',
    description: 'Division- and corps-level combined-arms command across the major land campaigns of World War II.',
    sources: [...wwiiSources, marineDoctrine[1]],
    weeks: [
      { title: 'Combined Arms and Battlefield Systems', topic: 'Creating dilemmas through mutually supporting arms and services', era: 'World War II', level: 'Division–corps' },
      { title: 'North Africa: Learning in Contact', topic: 'Coalition friction, adaptation, logistics, and operational tempo', era: 'World War II', level: 'Corps–army', campaign: 'North Africa' },
      { title: 'Eastern Front: Scale and Depth', topic: 'Operational depth, mass, reserves, and regeneration', era: 'World War II', level: 'Army group', campaign: 'Eastern Front' },
      { title: 'Reconnaissance and Security', topic: 'Information collection, counter-reconnaissance, and preserving freedom of action', era: 'World War II', level: 'Division–corps' },
      { title: 'Normandy: Breach and Exploitation', topic: 'Obstacle reduction, fire support, breakout, and pursuit', era: 'World War II', level: 'Corps–army', campaign: 'Normandy' },
      { title: 'Mission Command in High-Tempo Operations', topic: 'Intent, initiative, control measures, and disciplined disobedience', era: 'World War II', level: 'Division–corps' },
      { title: 'Market Garden: Reach and Risk', topic: 'Air-ground synchronization, assumptions, communications, and a narrow corridor', era: 'World War II', level: 'Corps–army', campaign: 'Market Garden' },
      { title: 'Tactical and Operational Sustainment', topic: 'Fuel, ammunition, maintenance, medical support, and distribution', era: 'World War II', level: 'Division–army' },
      { title: 'Ardennes: Surprise and Recovery', topic: 'Warning, resilience, reserves, terrain, and coalition response', era: 'World War II', level: 'Corps–army group', campaign: 'Ardennes' },
      { title: 'Reserves and Decision Points', topic: 'Preserving options and committing combat power at the decisive moment', era: 'World War II', level: 'Division–corps' },
      { title: 'Corps-Level Combined-Arms Simulation', topic: 'Plan and execute a breach, exploitation, and defense against counterattack', era: 'World War II', level: 'Corps', hours: 3 },
      { title: 'Combined-Arms Command Review', topic: 'Assess decisions, adaptation, sustainment, and mission command', era: 'World War II', level: 'Division–corps', hours: 2.5 },
    ],
  },
  {
    title: 'World War II Joint and Coalition Campaigning',
    description: 'Joint functions, coalition command, amphibious operations, global logistics, and theater prioritization.',
    sources: [...jointSources, ...wwiiSources],
    weeks: [
      { title: 'Joint Campaigning Foundations', topic: 'Integrating components, domains, functions, and operational objectives', era: 'World War II', level: 'Theater' },
      { title: 'Guadalcanal: Contested Joint Sustainment', topic: 'Sea control, airfields, ground defense, and fragile logistics', era: 'World War II', level: 'Joint task force', campaign: 'Guadalcanal' },
      { title: 'Central Pacific: Operational Sequencing', topic: 'Bypass, seizure, basing, and cumulative joint advantage', era: 'World War II', level: 'Theater', campaign: 'Central Pacific' },
      { title: 'Normandy Theater Planning', topic: 'Coalition objectives, deception, force flow, and lodgment expansion', era: 'World War II', level: 'Theater', campaign: 'Normandy' },
      { title: 'Air Superiority and Strategic Bombing', topic: 'Control of the air, targeting theory, effects, and moral risk', era: 'World War II', level: 'Theater–strategic' },
      { title: 'Maritime Control and Amphibious Operations', topic: 'Sea control, landing force support, and ship-to-shore integration', era: 'World War II', level: 'Joint task force' },
      { title: 'Leyte: Joint Convergence', topic: 'Competing command relationships, maritime battle, and land campaign', era: 'World War II', level: 'Theater', campaign: 'Leyte' },
      { title: 'Coalition Command', topic: 'Unity of effort, national caveats, personalities, and combined staffs', era: 'World War II', level: 'Theater' },
      { title: 'Global Logistics', topic: 'Shipping, ports, production, allocation, and theater distribution', era: 'World War II', level: 'Global–theater' },
      { title: 'Theater Prioritization', topic: 'Scarcity, sequencing, risk, and competition between theaters', era: 'World War II', level: 'Strategic' },
      { title: 'Axis Coalition Red Team', topic: 'Disrupt Allied sequencing, cohesion, access, and logistics', era: 'World War II', level: 'Theater' },
      { title: 'Joint Campaign Exercise', topic: 'Design and assess a coalition amphibious campaign under global constraints', era: 'World War II', level: 'Theater', hours: 3.5 },
    ],
  },
  {
    title: 'Cold War Operational Art',
    description: 'Mechanized operational tempo, escalation, air-land integration, maritime competition, and dispersed command.',
    sources: [...jointSources, ...wwiiSources],
    weeks: [
      { title: 'NATO Central Front', topic: 'Alliance defense, terrain, force ratios, reinforcement, and political cohesion', era: 'Cold War', level: 'Theater' },
      { title: 'Soviet Operational Concepts', topic: 'Echelons, operational maneuver, depth, tempo, and maskirovka', era: 'Cold War', level: 'Front–army' },
      { title: 'AirLand Battle', topic: 'Initiative, depth, agility, synchronization, and close-deep-rear integration', era: 'Cold War', level: 'Corps–theater' },
      { title: 'The 1973 Arab-Israeli War', topic: 'Surprise, air defense, armor, adaptation, and escalation', era: 'Cold War', level: 'Theater', campaign: '1973 Arab-Israeli War' },
      { title: 'The Falklands War', topic: 'Expeditionary reach, maritime-air integration, and austere sustainment', era: 'Cold War', level: 'Joint task force', campaign: 'Falklands War' },
      { title: 'Cold War Naval Competition', topic: 'Sea denial, carrier operations, submarines, and reinforcement routes', era: 'Cold War', level: 'Theater–global' },
      { title: 'Electronic Warfare and the Reconnaissance-Strike Complex', topic: 'Sensors, emitters, jamming, fires, and signature management', era: 'Cold War', level: 'Corps–theater' },
      { title: 'Mechanized Operational Tempo', topic: 'Mobility, maintenance, fuel, command posts, and exploitation', era: 'Cold War', level: 'Corps–army group' },
      { title: 'Nuclear Escalation Risk', topic: 'Thresholds, signaling, theater nuclear forces, and command responsibility', era: 'Cold War', level: 'Theater–strategic' },
      { title: 'Dispersed Command', topic: 'Delegation, redundancy, alternate command posts, and degraded communications', era: 'Cold War', level: 'Corps–theater' },
      { title: 'Warsaw Pact Red Team', topic: 'Create rapid political collapse while managing escalation', era: 'Cold War', level: 'Theater' },
      { title: 'NATO–Warsaw Pact Simulation', topic: 'Defend or penetrate the Central Front under conventional and nuclear constraints', era: 'Cold War', level: 'Theater', hours: 3.5 },
    ],
  },
  {
    title: 'Modern Joint All-Domain Operations',
    description: 'Joint force organization, component operations, cross-domain dependencies, contested C2, and theater campaigning.',
    sources: [...jointSources, marineDoctrine[0], marineDoctrine[3]],
    weeks: [
      { title: 'Joint Force Organization', topic: 'Combatant commands, joint task forces, components, authorities, and support relationships', era: 'Contemporary', level: 'Joint task force' },
      { title: 'Air Tasking and Targeting', topic: 'Apportionment, allocation, dynamic targeting, effects, and assessment', era: 'Contemporary', level: 'Theater' },
      { title: 'Maritime Control and Denial', topic: 'Sea control, sea denial, power projection, chokepoints, and access', era: 'Contemporary', level: 'Theater' },
      { title: 'Ground Maneuver in a Joint Campaign', topic: 'Seizing terrain, presenting dilemmas, protecting populations, and enabling joint effects', era: 'Contemporary', level: 'Corps–theater' },
      { title: 'Long-Range Fires', topic: 'Targeting, authorities, sensor-to-shooter chains, magazine depth, and escalation', era: 'Contemporary', level: 'Theater' },
      { title: 'Integrated Air and Missile Defense', topic: 'Detection, active defense, passive defense, prioritization, and capacity', era: 'Contemporary', level: 'Theater' },
      { title: 'Space Support to Joint Operations', topic: 'Positioning, timing, communications, warning, sensing, and resilience', era: 'Contemporary', level: 'Joint task force' },
      { title: 'Cyber Dependencies', topic: 'Mission dependencies, access, defensive risk, authorities, and uncertain effects', era: 'Contemporary', level: 'Joint task force' },
      { title: 'Contested Logistics', topic: 'Distributed sustainment, attrition, transportation, prepositioning, and repair', era: 'Contemporary', level: 'Theater' },
      { title: 'Contested Command and Control', topic: 'Deception, emissions, mobility, redundancy, delegation, and data discipline', era: 'Contemporary', level: 'Joint task force' },
      { title: 'Peer Adversary Red Team', topic: 'Attack joint dependencies, fracture alliances, and impose escalation dilemmas', era: 'Contemporary', level: 'Theater' },
      { title: 'Modern Joint Theater Campaign', topic: 'Plan, execute, and assess a joint campaign across contested domains', era: 'Contemporary', level: 'Theater', hours: 4 },
    ],
  },
  {
    title: 'Information, Cyber, Space, and Competition',
    description: 'Information advantage, technical dependencies, competition, signaling, deception, and escalation management.',
    sources: [...jointSources, marineDoctrine[1]],
    weeks: [
      { title: 'Intelligence and Decision Advantage', topic: 'Requirements, collection, analysis, dissemination, bias, and uncertainty', era: 'Contemporary', level: 'Joint task force' },
      { title: 'Military Deception', topic: 'Target behavior, narratives, indicators, feedback, and operational security', era: 'Contemporary', level: 'Theater' },
      { title: 'Operations Security', topic: 'Critical information, observable indicators, adversary collection, and countermeasures', era: 'Contemporary', level: 'All echelons' },
      { title: 'Cyber Operations', topic: 'Access, persistence, authorities, reversible effects, and operational integration', era: 'Contemporary', level: 'Joint task force' },
      { title: 'Electronic Warfare', topic: 'Sensing, attack, protection, spectrum competition, and electromagnetic maneuver', era: 'Contemporary', level: 'Corps–theater' },
      { title: 'Space Dependencies and Resilience', topic: 'Orbital services, ground segments, commercial support, and degradation', era: 'Contemporary', level: 'Theater' },
      { title: 'Public Narratives', topic: 'Audience analysis, credibility, legitimacy, tempo, and strategic communication', era: 'Contemporary', level: 'Theater–strategic' },
      { title: 'Information Advantage', topic: 'Integrating information, command, fires, maneuver, and assessment', era: 'Contemporary', level: 'Joint task force' },
      { title: 'Gray-Zone Competition', topic: 'Coercion below armed conflict, proxies, law, economics, and incrementalism', era: 'Contemporary', level: 'Theater–strategic' },
      { title: 'Strategic Signaling', topic: 'Commitment, ambiguity, audiences, capabilities, and credibility', era: 'Contemporary', level: 'Strategic' },
      { title: 'Escalation and Misperception', topic: 'Thresholds, attribution, cognitive bias, red lines, and crisis communication', era: 'Contemporary', level: 'Strategic' },
      { title: 'Information-Warfare Tabletop', topic: 'Compete for decision advantage while preserving credibility and escalation control', era: 'Contemporary', level: 'Theater', hours: 3.5 },
    ],
  },
  {
    title: 'Strategy, Force Design, and Capstone Command',
    description: 'Translate national interests into strategy, forces, campaigns, termination conditions, and durable postwar outcomes.',
    sources: [...strategySources, ...jointSources],
    weeks: [
      { title: 'National Interests', topic: 'Interests, values, threats, opportunities, priorities, and acceptable costs', era: 'Strategic studies', level: 'National' },
      { title: 'Political Objectives', topic: 'Policy aims, military contribution, limits, legitimacy, and coalition alignment', era: 'Strategic studies', level: 'National' },
      { title: 'Military Strategy', topic: 'Ends, ways, means, risk, assumptions, and theory of success', era: 'Strategic studies', level: 'National–theater' },
      { title: 'Force Development', topic: 'Capabilities, concepts, organization, training, personnel, and time horizons', era: 'Contemporary', level: 'Service–joint' },
      { title: 'Force Posture', topic: 'Access, presence, responsiveness, resilience, signaling, and host-nation politics', era: 'Contemporary', level: 'Global–theater' },
      { title: 'Mobilization and Readiness', topic: 'Force generation, industrial surge, reserves, training, and opportunity cost', era: 'Contemporary', level: 'National' },
      { title: 'Alliances', topic: 'Shared interests, burden sharing, interoperability, assurance, and entrapment risk', era: 'Strategic studies', level: 'National–theater' },
      { title: 'Defense Industrial Capacity', topic: 'Production, stockpiles, supply chains, workforce, finance, and endurance', era: 'Contemporary', level: 'National' },
      { title: 'War Termination', topic: 'Bargaining, exhaustion, escalation, leverage, off-ramps, and enforcement', era: 'Strategic studies', level: 'National–theater' },
      { title: 'Postwar Conditions', topic: 'Security order, governance, reconstruction, legitimacy, and unintended consequences', era: 'Strategic studies', level: 'National–theater' },
      { title: 'Capstone Red Team', topic: 'Attack the strategy’s assumptions, coalition, posture, force design, and termination logic', era: 'Contemporary', level: 'National–theater', hours: 3 },
      { title: 'Full Theater-Strategy Capstone', topic: 'Produce, execute, assess, and defend an integrated theater strategy', era: 'Contemporary', level: 'National–theater', hours: 5 },
    ],
  },
]

const rhythm = [
  { label: 'concept', exercise: 'Build a one-page concept map identifying purpose, conditions, mechanisms, and failure modes.', template: 'concept-summary', responseType: 'short-analysis' as const },
  { label: 'historical problem', exercise: 'Write a mission analysis and two distinct courses of action before reviewing the historical outcome.', template: 'course-of-action', responseType: 'estimate' as const },
  { label: 'simulation', exercise: 'Issue commander’s intent, execute three decision turns, and record every consequential decision and assumption.', template: 'decision-journal', responseType: 'order' as const },
  { label: 'red-team and review', exercise: 'Reframe the problem from the opposing command, replay the critical decision, and complete an after-action review.', template: 'after-action-review', responseType: 'aar' as const },
]

function buildReading(source: SourceSpec, week: WeekOutline, weekNumber: number, index: number): Reading {
  const requirement = index === 0 ? 'required' : 'optional'
  return {
    id: `w${weekNumber}-r${index + 1}`,
    title: source.title,
    author: source.author,
    publication: source.publication,
    assignment: index === 0 ? `Read the sections most directly addressing ${week.topic.toLowerCase()}; target 25–35 pages.` : `Consult the index and relevant campaign or doctrinal section for ${week.title}.`,
    requirement,
    estimatedMinutes: index === 0 ? 45 : 25,
    url: source.url,
    citation: source.citation,
    instructions: `Annotate the author’s central claim, command implications, unstated assumptions, and one point that may not transfer to another era.`,
    availabilityNotes: source.availabilityNotes,
  }
}

function buildWeek(term: TermOutline, termIndex: number, outline: WeekOutline, weekIndex: number): CurriculumWeek {
  const weekNumber = termIndex * 12 + weekIndex + 1
  const pattern = rhythm[weekIndex % rhythm.length]
  const primary = term.sources[weekIndex % term.sources.length]
  const secondary = term.sources[(weekIndex + 1) % term.sources.length]
  const campaign = outline.campaign ? [outline.campaign] : []
  return {
    id: `week-${weekNumber}`,
    number: weekNumber,
    termId: `term-${termIndex + 1}`,
    title: outline.title,
    topic: outline.topic,
    era: outline.era,
    commandLevel: outline.level,
    estimatedHours: outline.hours ?? 2,
    learningObjectives: [
      `Explain how ${outline.topic.toLowerCase()} affects command decisions at the ${outline.level.toLowerCase()} level.`,
      `Evaluate at least two competing approaches to the ${outline.title.toLowerCase()} problem using explicit evidence and assumptions.`,
      `Apply the week’s ideas in a ${pattern.label} product that identifies risk, decision points, and indicators for reassessment.`,
    ],
    readings: [buildReading(primary, outline, weekNumber, 0), buildReading(secondary, outline, weekNumber, 1)],
    exercises: [{
      id: `w${weekNumber}-e1`,
      title: `${outline.title}: ${pattern.label} exercise`,
      instructions: `${pattern.exercise} Keep political purpose, enemy agency, sustainment, and uncertainty visible throughout.`,
      estimatedMinutes: outline.hours && outline.hours >= 3 ? 80 : 45,
      templateId: pattern.template,
    }],
    prompts: [{
      id: `w${weekNumber}-p1`,
      title: 'Command analysis',
      prompt: `You are the responsible commander or senior planner confronting ${outline.title}. Define the political and military objective, identify the most consequential uncertainty, compare two genuinely distinct options, and recommend a decision. Explain the enemy response you expect, the sustainment constraint most likely to govern the operation, the risk you accept, and the observable trigger that would make you reconsider. Do not judge quality solely by whether the historical or simulated side “won.”`,
      responseType: pattern.responseType,
      suggestedMinimumWords: weekIndex === 11 ? 900 : 450,
      planningTemplateId: pattern.template,
      rubricCriteria: ['Objectives', 'Enemy and environment', 'Courses of action', 'Sustainment', 'Risk and decision points', 'Clarity'],
    }],
    historicalCampaigns: campaign,
    tags: [outline.topic, pattern.label, term.title, ...campaign],
  }
}

export const curriculum: CurriculumTerm[] = termOutlines.map((term, termIndex) => ({
  id: `term-${termIndex + 1}`,
  number: termIndex + 1,
  title: term.title,
  description: term.description,
  weeks: term.weeks.map((week, weekIndex) => buildWeek(term, termIndex, week, weekIndex)),
}))

export const allWeeks = curriculum.flatMap((term) => term.weeks)

export function validateCurriculum(terms: CurriculumTerm[] = curriculum): string[] {
  const errors: string[] = []
  const weeks = terms.flatMap((term) => term.weeks)
  if (terms.length !== 8) errors.push(`Expected 8 terms; found ${terms.length}.`)
  if (weeks.length !== 96) errors.push(`Expected 96 weeks; found ${weeks.length}.`)
  const ids = new Set<string>()
  weeks.forEach((week, index) => {
    if (week.number !== index + 1) errors.push(`Week sequence breaks at ${week.id}.`)
    if (ids.has(week.id)) errors.push(`Duplicate week ID: ${week.id}.`)
    ids.add(week.id)
    if (!week.title.trim() || !week.topic.trim()) errors.push(`${week.id} lacks substantive title or topic.`)
    if (week.learningObjectives.length < 3) errors.push(`${week.id} has fewer than 3 objectives.`)
    if (!week.readings.some((reading) => reading.requirement === 'required')) errors.push(`${week.id} has no required reading.`)
    if (!week.exercises.length) errors.push(`${week.id} has no exercise.`)
    if (!week.prompts.length || week.prompts[0].prompt.length < 200) errors.push(`${week.id} has no substantive prompt.`)
  })
  return errors
}

const curriculumErrors = validateCurriculum()
if (curriculumErrors.length) throw new Error(`Invalid curriculum:\n${curriculumErrors.join('\n')}`)
