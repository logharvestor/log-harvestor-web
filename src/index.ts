import { loadConfig } from './Config';
import { Util } from './Util';
import { API } from './API';
import { attachFormSubmitListeners } from './Form';
import { ETrackingLogType } from './Types';

export * from './Types'

/* V2
    - Fwd is configured remotely via LogHarvestorApp
    - When the script is initialized, it will take the `fwd-token` and use it to fetch
        the Fwd configuration from the logharvestor.com/api/fwd/:token/ endpoint
    - The configuration will be stored via the Cookie class
*/

const load = async () => {
    loadConfig()
    const document = Util.getDocument()

    const _logPage = () => API.sendLog(ETrackingLogType.VIEW)
    if (document) {

        attachFormSubmitListeners()

        const originalPushState = window.history.pushState;
        if (originalPushState) {
            history.pushState = function (data, title, url) {
                originalPushState.apply(this, [data, title, url]);
                _logPage()
            };
            document.addEventListener('popstate', _logPage);
        }

        const handeVis = () => {
            if (document.visibilityState === 'visible') {
                _logPage()
            }
        }
        _logPage()

        document.addEventListener('visibilitychange', handeVis);
    }
}

/* 
    Initializes the script
    - If the window is not defined, it will wait 100ms and try again
    - If the window is defined, it will call load()
    - If the window is not defined after 20 tries, it will stop trying
*/
const init = (count = 0) => {
    if (typeof window !== undefined) {
        load()
    } else if (count < 20) {
        setTimeout(() => init(count + 1), 100)
    }
}

init()