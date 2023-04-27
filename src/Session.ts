import { Cookie } from "./Cookie"
import { Util } from "./Util"
import { Config } from "./Config"
import { ETrackingEvent, ISession, ISessionBuilderData, ITracking } from "./Types"
import { API } from "./API"

export class Session implements ISession {
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
        end: NaN,
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
            const req = await fetch(Config.GEO_URL);
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
            env: Config.ENV,
            version: Config.VERSION,
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
        return true
    };
}