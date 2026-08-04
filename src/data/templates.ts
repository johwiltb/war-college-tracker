import type { AssessmentCriterion, DocumentType } from '../types/domain'

export interface PlanningTemplate {
  id: string
  label: string
  documentType: DocumentType
  content: string
}

export const planningTemplates: PlanningTemplate[] = [
  {
    id: 'concept-summary',
    label: 'Concept Summary',
    documentType: 'doctrine-ledger',
    content: `## Concept\n\n## Purpose\n\n## Conditions\n\n## Failure mode\n\n## Application\n`,
  },
  {
    id: 'commanders-intent',
    label: "Commander's Intent",
    documentType: 'commanders-intent',
    content: `## Purpose\n\n## Key tasks\n\n## End state\n\n## Main effort\n\n## Acceptable risk\n\n## Delegated decision authority\n`,
  },
  {
    id: 'course-of-action',
    label: 'Course of Action',
    documentType: 'campaign-estimate',
    content: `## Mission\n\n## Main effort\n\n## Supporting efforts\n\n## Phases\n\n## Required resources\n\n## Assumptions\n\n## Risks\n\n## Expected enemy reaction\n\n## Branches\n\n## Decision points\n`,
  },
  {
    id: 'decision-journal',
    label: 'Decision Journal',
    documentType: 'decision-journal',
    content: `## Decision\n\n## Time\n\n## Available information\n\n## Assessment\n\n## Expected enemy response\n\n## Expected result\n\n## Risk accepted\n\n## Reconsideration trigger\n\n## Actual outcome\n\n## Lesson\n`,
  },
  {
    id: 'after-action-review',
    label: 'After-Action Review',
    documentType: 'after-action-review',
    content: `## What was supposed to happen?\n\n## What actually happened?\n\n## Why was there a difference?\n\n## Which assumptions failed?\n\n## What information was missing?\n\n## Which decision mattered most?\n\n## What should change?\n\n## What should remain unchanged?\n`,
  },
  {
    id: 'campaign-estimate',
    label: 'Campaign Estimate',
    documentType: 'campaign-estimate',
    content: `## Political objective\n\n## Military objective\n\n## Desired end state\n\n## Operational environment\n\n## Friendly forces\n\n## Enemy forces\n\n## Neutral actors\n\n## Constraints\n\n## Assumptions\n\n## Intelligence gaps\n\n## Courses of action\n\n## Sustainment\n\n## Risk\n\n## Recommended approach\n\n## Decision points\n\n## Termination criteria\n`,
  },
]

export const assessmentCriteria: AssessmentCriterion[] = [
  { id: 'objectives', label: 'Clear political and military objectives', maxScore: 10 },
  { id: 'enemy-environment', label: 'Understanding of enemy and environment', maxScore: 15 },
  { id: 'coas', label: 'Quality and distinctness of courses of action', maxScore: 10 },
  { id: 'joint-integration', label: 'Joint integration', maxScore: 15 },
  { id: 'sustainment', label: 'Sustainment and operational reach', maxScore: 15 },
  { id: 'risk', label: 'Risk, branches, and decision points', maxScore: 10 },
  { id: 'intent', label: "Clarity of commander's intent", maxScore: 10 },
  { id: 'adaptation', label: 'Adaptation during execution', maxScore: 5 },
  { id: 'aar', label: 'Honesty and depth of after-action review', maxScore: 10 },
]

export const documentTypeLabels: Record<DocumentType, string> = {
  'doctrine-ledger': 'Doctrine ledger',
  'historical-decision': 'Historical decision',
  'campaign-estimate': 'Campaign estimate',
  'commanders-intent': "Commander's intent",
  'decision-journal': 'Decision journal',
  'after-action-review': 'After-action review',
  'personal-doctrine': 'Personal doctrine',
  other: 'Other',
}

export const templateById = (id?: string) => planningTemplates.find((template) => template.id === id)
