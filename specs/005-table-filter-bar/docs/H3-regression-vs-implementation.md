# H3 Discussion: US2 and US3 Test Strategy

**Issue ID**: H3  
**Category**: Inconsistency  
**Severity**: HIGH  
**Date**: 2025-10-31

## The Question

The specification says:

- **US2 (Effects)**: "System MUST **maintain** filtering across effect names (**existing capability to be preserved and verified**)"
- **US3 (Aroma)**: "System MUST **maintain** filtering across aroma descriptors (**existing capability to be preserved and verified**)"

However, `tasks.md` includes **full RED-GREEN-REFACTOR test suites** for both stories (T024-T038), treating them as new implementations rather than simple verification/regression tests.

## The Discrepancy

**Spec Language** suggests:
- These are **existing features** that already work
- Goal is to **verify** they continue to work (regression tests)
- Minimal changes expected

**Tasks Language** suggests:
- Full TDD cycle with RED phase (write failing tests)
- GREEN phase (implement to make tests pass)
- REFACTOR phase (improve code quality)
- This is the pattern used for **new features** like US4 (taste) and US5 (therapeutic)

## The Core Question

**Are effects and aroma filtering ALREADY IMPLEMENTED and working?**

If YES:
- Use lightweight regression tests (5-10 tests total)
- Tests should PASS immediately (no RED phase needed)
- Minimal code changes (just documentation/comments)
- Tasks T024-T038 are **over-specified**

If NO:
- They need full implementation like taste/therapeutic
- Current task breakdown is appropriate
- But spec should say "extend filtering to include" not "maintain filtering"
- This would be a **spec error**

## Investigation Needed

To resolve this, check the current codebase:

```typescript
// In src/services/filterService.ts

function matchesSearchQuery(terpene: Terpene, query: string): boolean {
  const name = terpene.name.toLowerCase();
  const aroma = terpene.aroma.toLowerCase();
  const effects = terpene.effects.map((e) => e.toLowerCase()).join(' ');

  return name.includes(query) || aroma.includes(query) || effects.includes(query);
}
```

**If this code exists**: US2 and US3 are regression tests  
**If this code doesn't exist**: US2 and US3 are new features

## Recommended Resolution

### Option A: They ARE regression tests (likely scenario)

**Update tasks.md** to simplify T024-T038:

**Phase 4: User Story 2 (Maintain Effects) - SIMPLIFIED**
- T024-T027: Write regression tests (should PASS immediately)
- T028: Document existing logic with JSDoc
- T029: Verify graceful handling
- T030-T031: Integration tests

**Remove**: Full RED-GREEN-REFACTOR cycle, implementation tasks

**Effort**: Reduce from 8 tasks to 5-6 tasks

---

### Option B: They are NOT implemented yet (unlikely)

**Update spec.md** to clarify:

- Change "maintain filtering" → "extend filtering to include effects"
- Change "existing capability" → "NEW capability"
- Make US2 and US3 consistent with US4 and US5 language

**Keep tasks.md as-is**: Full implementation with TDD

---

## Why This Matters

**Effort Estimation**:
- Regression tests: ~2 hours per story = 4 hours total
- Full implementation: ~8 hours per story = 16 hours total
- **Difference: 12 hours** (150% estimate variance)

**Risk Assessment**:
- Over-specifying regression tests wastes time
- Under-specifying new features causes failures
- Current ambiguity blocks accurate planning

**Team Coordination**:
- Developers need clear guidance on what to build
- If they're regression tests, senior dev should verify quickly
- If they're new features, may need pair programming

## Decision Required

**Before proceeding to implementation**, the team must:

1. **Check the codebase**: Does `matchesSearchQuery()` already search effects and aroma?
2. **Clarify the spec**: Update either spec.md or tasks.md to be consistent
3. **Re-estimate effort**: Adjust sprint planning based on clarification
4. **Update this document**: Record the decision and rationale

## Temporary Recommendation

**Until resolved, assume Option A (regression tests)** because:

✅ Spec explicitly says "maintain" and "existing capability"  
✅ Context note mentions "extends existing filter functionality"  
✅ Feature 006 was merged, which may have included effects/aroma search  
✅ The `.idea/005-feature-006-merge-implications.md` analysis states "effects already searched in current implementation"

**Action**: Simplify tasks T024-T038 to regression test pattern.

---

**Status**: Awaiting technical lead decision  
**Blocker**: Cannot proceed with Phase 4-5 until clarified  
**Impact**: 8-16 hours effort variance, affects sprint commitment
