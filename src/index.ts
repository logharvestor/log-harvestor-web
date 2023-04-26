
import { ETrackingEvent, ISession, ISessionBuilderData, ITracking, ITrackingEvent, ITrackingPageData, ITrackingView } from './types';
import { API_URL, ENVIRONMENT, GEO_URL, VERSION } from './config';
import { v4 } from 'uuid'
import axios from 'axios'
(function () {
    'use strict';


    const FWDR_TOKEN = 'your_forwarder_token'

    class API {

        static getPageData = (): ITrackingPageData => {
            return {
                path: Util.getWindowChild(window.location.pathname, ''),
                title: Util.getWindowChild(document.title, ''),
                referrer: Util.getWindowChild(document.referrer, '')
            }
        }

        static startSession = async (session: ITracking): Promise<ITracking> => {
            return axios({
                method: 'post',
                url: `${API_URL}/tracking/start`,
                headers: {
                    'Authorization': `Bearer ${FWDR_TOKEN}`
                },
                data: {
                    session
                }
            })
        }
        static sendPageView = async (view?: ITrackingView) => {
            const data = { ...view, ...API.getPageData() }
            return axios({
                method: 'post',
                url: `${API_URL}/tracking/view`,
                headers: {
                    'Authorization': `Bearer ${FWDR_TOKEN}`
                },
                data
            })
        }
        static sendEvent = async (event: ITrackingEvent) => {
            const data = { ...event, ...API.getPageData() }
            return axios({
                method: 'post',
                url: `${API_URL}/tracking/event`,
                headers: {
                    'Authorization': `Bearer ${FWDR_TOKEN}`
                },
                data
            })
        }
    }

    class Session implements ISession {
        sessionData: ITracking = {
            _id: '',
            tr_id: '',
            referrer: '',
            ip: '',
            environment: {
                protocol: '',
                host: '',
                env: '',
                version: ''
            },
            address: {
                city: '',
                country_code: '',

                country_name: '',
                postal_code: '',
                state: ''
            },
            geoLocation: {
                longitude: '',
                latitude: ''
            },
            ua: {},
            views: [],
            events: [],
            start: Date.now(),
            end: Date.now(),
            t_ca: NaN,
            t_ua: NaN,
        }

        getTrackingId = () => {
            if (!this.sessionData.tr_id) {
                const tr_id = Util.generateTrackingId()
                this.sessionData.tr_id = tr_id
                return tr_id
            } else {
                return this.sessionData.tr_id
            }
        }

        init = async () => {
            const tr_id = this.getTrackingId()

            const cookie = Cookie.get('log-harvestor')

            if (!cookie || cookie !== tr_id) {
                Cookie.set('log-harvestor', tr_id, 365)
            }

            const sessionBuilderData = await this.fetchSessionData()

            this.buildSessionData(sessionBuilderData)
            return this
        }

        fetchSessionData = async () => {
            try {
                const req = await fetch(GEO_URL);
                return req.json()
            } catch {

            }
        }

        buildSessionData = (data: ISessionBuilderData) => {
            this.sessionData.ip = data?.IPv4
            this.sessionData.referrer = Util.getWindowChild(window?.document?.referrer, '')
            this.sessionData.environment = {
                protocol: Util.getWindowChild(window?.location?.protocol, ''),
                host: Util.getWindowChild(window?.location?.host, ''),
                env: ENVIRONMENT,
                version: VERSION,
            }
            this.sessionData.address = {
                city: Util.cleanString(data?.city, ''),
                country_code: Util.cleanString(data?.country_code, ''),
                country_name: Util.cleanString(data?.country_name, ''),
                postal_code: Util.cleanString(data?.postal, ''),
                state: Util.cleanString(data?.state, '')
            }
            this.sessionData.geoLocation = {
                longitude: Util.cleanString(data?.longitude, ''),
                latitude: Util.cleanString(data?.latitude, '')
            }
            this.sessionData.ua = Util.getWindowChild(window.navigator.userAgent, '')

            this.sessionData.views = [
                {
                    ...API.getPageData(),
                    start: Date.now(),
                    end: NaN,
                }
            ];

            this.sessionData.events = [
                {
                    name: 'start',
                    start: Date.now(),
                    event: ETrackingEvent.START,
                    ...API.getPageData(),
                    metadata: null,
                }
            ]
            console.log(this.sessionData)
            return true
        };
    }

    const Cookie = {
        set: (name: string, value: string, days: number) => {
            let domain, domainParts, date, expires, host;
            if (days) {
                date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            else {
                expires = "";
            }

            host = location.host;
            if (host.split('.').length === 1) {
                document.cookie = name + "=" + value + expires + "; path=/";
            }
            else {
                domainParts = host.split('.');
                domainParts.shift();
                domain = '.' + domainParts.join('.');

                document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
                if (Cookie.get(name) == null || Cookie.get(name) != value) {
                    domain = '.' + host;
                    document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
                }
            }
        },
        get: (name: string) => {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }

                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
        erase: (name: string) => {
            Cookie.set(name, '', -1);
        }
    };

    const Util = {
        getWindowChild: <T = unknown>(o: T, fallback: T): T => {
            return Util.windowAvailable() ? o : fallback
        },
        cleanString: (str: unknown, def: string): string => {
            return typeof str === 'string' ? str : def
        },
        windowAvailable: (): boolean => {
            return typeof window !== undefined
        },
        getDocument: (): Document | null => {
            return Util.windowAvailable() ? window.document : null
        },
        generateTrackingId: (): string => {
            return v4()
        }
    }


    const load = async () => {
        const session = await new Session().init()
        const tracking = await API.startSession(session.sessionData)
        session.sessionData._id = tracking._id

        const document = Util.getDocument()

        const _logPage = () => API.sendPageView()

        if (document) {
            const originalPushState = history.pushState;
            if (originalPushState) {
                history.pushState = function (data, title, url) {
                    originalPushState.apply(this, [data, title, url]);
                };
                addEventListener('popstate', _logPage);
                document.addEventListener('popstate', _logPage);
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
        console.log('init', count)
        if (typeof window !== undefined) {
            load()
        } else if (count < 20) {
            setTimeout(() => init(count + 1), 100)
        }
    }

    init()

})();