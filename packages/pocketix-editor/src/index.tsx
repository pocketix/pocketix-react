import { PocketixEditor } from "./components/PocketixEditor";
import { EditorSettings, MenuSettings, TextEditorSettings, VisualEditorSettings } from "./model/editor-settings.model";
import { capabilityTemplate } from "./util/capabilityTemplate";
import { defaultSettings } from "./util/defaultSettings";
import posthog from 'posthog-js';

posthog.init('phc_Rnee6Qq5vgXvJ5NCh2ls9RIFvWgpO83bjuUb53yvss2', {
    api_host: 'https://posthog.pocketix.org',
    person_profiles: 'always',
    autocapture: true
});

export {PocketixEditor};
export type { EditorSettings, MenuSettings, VisualEditorSettings, TextEditorSettings };
export {capabilityTemplate};
export {defaultSettings};
