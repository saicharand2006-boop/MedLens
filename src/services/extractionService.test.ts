import { describe, expect, it } from 'vitest';
import { evaluateRangeStatus, parseReferenceRange, processClinicalDocument } from './extractionService';

describe('parseReferenceRange', () => {
  it('parses inclusive numeric ranges and preserves source text', () => {
    expect(parseReferenceRange('0.50 - 1.10')).toEqual({
      min: 0.5,
      max: 1.1,
      text: '0.50 - 1.10',
    });
  });

  it('parses one-sided ranges', () => {
    expect(parseReferenceRange('<= 150')).toEqual({ max: 150, text: '<= 150' });
    expect(parseReferenceRange('>= 50')).toEqual({ min: 50, text: '>= 50' });
  });

  it('returns null when the source does not provide a range', () => {
    expect(parseReferenceRange('Range Not Provided')).toBeNull();
    expect(parseReferenceRange('')).toBeNull();
    expect(parseReferenceRange('not provided')).toBeNull();
  });

  it('preserves an unrecognized range for provenance without inventing bounds', () => {
    expect(parseReferenceRange('See lab-specific reference')).toEqual({
      text: 'See lab-specific reference',
    });
  });
});

describe('evaluateRangeStatus', () => {
  it('treats range boundaries as within range', () => {
    const range = { min: 70, max: 99 };

    expect(evaluateRangeStatus(70, range)).toBe('within_range');
    expect(evaluateRangeStatus(99, range)).toBe('within_range');
  });

  it('evaluates values below and above a two-sided range', () => {
    const range = { min: 70, max: 99 };

    expect(evaluateRangeStatus(69.9, range)).toBe('below_range');
    expect(evaluateRangeStatus(100, range)).toBe('above_range');
  });

  it('evaluates one-sided ranges and refuses to infer missing ranges', () => {
    expect(evaluateRangeStatus('149 mg/dL', { max: 150 })).toBe('within_range');
    expect(evaluateRangeStatus(151, { max: 150 })).toBe('above_range');
    expect(evaluateRangeStatus(50, { min: 60 })).toBe('below_range');
    expect(evaluateRangeStatus(80, null)).toBe('range_unavailable');
    expect(evaluateRangeStatus('not numeric', { min: 1 })).toBe('range_unavailable');
  });
});

describe('processClinicalDocument', () => {
  it('extracts labs, medications, and conditions with source provenance', async () => {
    const result = await processClinicalDocument({
      name: 'sample-report.txt',
      size: 2048,
      serviceDate: '2026-09-05',
      facility: 'Example Clinic',
      content: [
        'Patient: Example Patient',
        'Glucose, Fasting       168       HIGH   70 - 99            mg/dL',
        'Urine Microalbumin/Cr  24                < 30                 mg/g',
        'Metformin 500 mg oral tablet - twice daily',
        'Diagnosis: Type 2 diabetes',
      ].join('\n'),
    });

    expect(result.extractedLabs).toHaveLength(2);
    expect(result.extractedLabs[0]).toMatchObject({
      testName: 'Glucose, Fasting',
      value: 168,
      status: 'above_range',
      provenance: {
        sourceDocumentName: 'sample-report.txt',
        facility: 'Example Clinic',
      },
    });
    expect(result.extractedMedications).toHaveLength(1);
    expect(result.extractedConditions[0]).toMatchObject({
      name: 'Type 2 diabetes',
      clinicalStatus: 'active',
    });
  });
});
