// src/lib/data/cognitiveDistortions.ts
// Reference data for CBT cognitive distortions

import type { CognitiveDistortion } from '$lib/db/types';

export interface DistortionInfo {
  id: CognitiveDistortion;
  name: string;
  shortDescription: string;
  longDescription: string;
  example: string;
  challengeQuestion: string;
}

export const cognitiveDistortions: DistortionInfo[] = [
  {
    id: 'all-or-nothing',
    name: 'All-or-Nothing Thinking',
    shortDescription: 'Seeing things in black and white categories',
    longDescription: 'You view situations in only two categories rather than on a spectrum. Things are either perfect or a total failure, with no middle ground.',
    example: '"If I don\'t do this perfectly, I\'ve failed completely."',
    challengeQuestion: 'Is there a middle ground between total success and total failure?'
  },
  {
    id: 'overgeneralization',
    name: 'Overgeneralization',
    shortDescription: 'Using "always" or "never" patterns',
    longDescription: 'You view a single negative event as a never-ending pattern of defeat by using words like "always" or "never."',
    example: '"I always mess things up. Nothing ever works out for me."',
    challengeQuestion: 'Have there been times when this wasn\'t true?'
  },
  {
    id: 'mental-filter',
    name: 'Mental Filter',
    shortDescription: 'Focusing only on the negatives',
    longDescription: 'You focus exclusively on the negative aspects of a situation while filtering out all the positive aspects.',
    example: 'Receiving mostly positive feedback but dwelling only on one criticism.',
    challengeQuestion: 'What positive aspects might I be overlooking?'
  },
  {
    id: 'disqualifying',
    name: 'Disqualifying the Positive',
    shortDescription: 'Dismissing good experiences',
    longDescription: 'You dismiss positive experiences by insisting they "don\'t count" for some reason.',
    example: '"They\'re just being nice. They don\'t really mean it."',
    challengeQuestion: 'If someone else had this positive experience, would I dismiss it for them too?'
  },
  {
    id: 'jumping-to-conclusions',
    name: 'Jumping to Conclusions',
    shortDescription: 'Making assumptions without evidence',
    longDescription: 'You make negative interpretations without actual facts to support your conclusion.',
    example: '"They didn\'t text back—they must be angry at me."',
    challengeQuestion: 'What facts support this conclusion? What other explanations are possible?'
  },
  {
    id: 'mind-reading',
    name: 'Mind Reading',
    shortDescription: 'Assuming you know what others think',
    longDescription: 'You assume you know what other people are thinking without checking with them.',
    example: '"I know they think I\'m incompetent."',
    challengeQuestion: 'Do I actually know this, or am I guessing?'
  },
  {
    id: 'fortune-telling',
    name: 'Fortune Telling',
    shortDescription: 'Predicting negative outcomes',
    longDescription: 'You predict that things will turn out badly, as if you can see the future.',
    example: '"There\'s no point in trying—I know it won\'t work out."',
    challengeQuestion: 'Can I really predict the future? What evidence is there for this prediction?'
  },
  {
    id: 'catastrophizing',
    name: 'Catastrophizing',
    shortDescription: 'Expecting the worst-case scenario',
    longDescription: 'You expect disaster to strike and magnify the importance of negative events.',
    example: '"If I make a mistake, it will be absolutely terrible and I won\'t be able to handle it."',
    challengeQuestion: 'What\'s the most likely outcome? Have I handled similar situations before?'
  },
  {
    id: 'minimizing',
    name: 'Minimizing',
    shortDescription: 'Shrinking the importance of positives',
    longDescription: 'You inappropriately shrink the importance of positive events, your own desirable qualities, or others\' imperfections.',
    example: '"That accomplishment was no big deal. Anyone could have done it."',
    challengeQuestion: 'Would I minimize this if someone else achieved it?'
  },
  {
    id: 'emotional-reasoning',
    name: 'Emotional Reasoning',
    shortDescription: 'Treating feelings as facts',
    longDescription: 'You assume that your negative emotions necessarily reflect the way things really are.',
    example: '"I feel like a failure, so I must be one."',
    challengeQuestion: 'Just because I feel this way, does it mean it\'s true?'
  },
  {
    id: 'should-statements',
    name: 'Should Statements',
    shortDescription: 'Rigid rules about how things must be',
    longDescription: 'You have a precise, fixed idea of how you or others should behave, and you overestimate how bad it is that these expectations are not met.',
    example: '"I should always be productive. I shouldn\'t feel this way."',
    challengeQuestion: 'Is this a preference or an absolute rule? What happens if the "should" isn\'t met?'
  },
  {
    id: 'labeling',
    name: 'Labeling',
    shortDescription: 'Attaching negative labels to yourself or others',
    longDescription: 'Instead of describing a specific behavior, you attach a negative label to yourself or others.',
    example: '"I\'m such an idiot" instead of "I made a mistake."',
    challengeQuestion: 'Am I describing a behavior or defining my entire self?'
  },
  {
    id: 'personalization',
    name: 'Personalization',
    shortDescription: 'Taking responsibility for things outside your control',
    longDescription: 'You hold yourself personally responsible for events that aren\'t entirely under your control.',
    example: '"My daughter is unhappy—I must have done something wrong as a parent."',
    challengeQuestion: 'What factors were outside my control? Who else had influence on this outcome?'
  },
  {
    id: 'blaming',
    name: 'Blaming',
    shortDescription: 'Holding others entirely responsible',
    longDescription: 'You focus on the other person as the source of your negative feelings and refuse to take responsibility for changing yourself.',
    example: '"It\'s their fault I feel this way."',
    challengeQuestion: 'What part of this situation is within my control to change?'
  }
];

/**
 * Get distortion info by ID
 */
export function getDistortionById(id: CognitiveDistortion): DistortionInfo | undefined {
  return cognitiveDistortions.find(d => d.id === id);
}

/**
 * Get multiple distortions by IDs
 */
export function getDistortionsByIds(ids: CognitiveDistortion[]): DistortionInfo[] {
  return ids.map(id => getDistortionById(id)).filter((d): d is DistortionInfo => d !== undefined);
}

/**
 * Common distortion combinations for this user's profile
 * Based on GAD + MDD + OCD (mild) diagnoses
 */
export const commonPatterns = {
  anxietyRelated: ['catastrophizing', 'fortune-telling', 'mind-reading', 'overgeneralization'] as CognitiveDistortion[],
  depressionRelated: ['mental-filter', 'disqualifying', 'all-or-nothing', 'labeling'] as CognitiveDistortion[],
  ocdRelated: ['catastrophizing', 'should-statements', 'emotional-reasoning'] as CognitiveDistortion[],
  worriesAboutOthers: ['catastrophizing', 'fortune-telling', 'personalization', 'mind-reading'] as CognitiveDistortion[]
};
