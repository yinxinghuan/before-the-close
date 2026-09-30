// Only definitive no-commit rejections. Timeouts, transport failures and
// MODEL_CALL_PENDING_OR_INTERRUPTED retain their original action envelope.
export const financeTerminalErrors=Object.freeze([
 'OUT_OF_REACH','TARGET_OUT_OF_REACH','OPENING_REQUIRED',
 'INTRODUCTION_REQUIRED','DIALOGUE_UNAVAILABLE','MODEL_BUDGET_EXHAUSTED',
]);
