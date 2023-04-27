import { loadConfig } from './Config';
import { Util } from './Util';
import { Session } from './Session';
import { API } from './API';

export * from './Types'

const load = async () => {
    loadConfig()
    const session = await new Session().init()
    const tracking = await API.startSession(session.sessionData)
    if (tracking) {
        session.sessionData._id = tracking._id
        const document = Util.getDocument()

        const _logPage = () => API.sendPageView(tracking._id)
        const _terminateSession = () => API.terminateSession(tracking._id)

        if (document) {
            const originalPushState = window.history.pushState;
            if (originalPushState) {
                history.pushState = function (data, title, url) {
                    originalPushState.apply(this, [data, title, url]);
                    _logPage()
                };
                document.addEventListener('popstate', _logPage);
            }
            const handeVis = () => {
                if (document.visibilityState === 'hidden') {
                    _terminateSession()
                }
            }
            document.addEventListener('visibilitychange', handeVis);
        }
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