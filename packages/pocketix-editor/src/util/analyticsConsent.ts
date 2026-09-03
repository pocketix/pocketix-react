const CONSENT_STORAGE_KEY = "pocketix-editor-analytics-consent";

/** Guards every localStorage access - unavailable in SSR/privacy-mode contexts. */
function hasStoredConsent(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === "granted";
  } catch {
    return false;
  }
}

function storeConsent(): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
  } catch {
    // Consent just won't persist across reloads; the modal will ask again.
  }
}

export { hasStoredConsent, storeConsent };
