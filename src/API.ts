import { Util } from "./Util"
import { Config } from './Config'
import { Cookie } from "./Cookie";
import { ETrackingLogType } from "./Types";


export class API {

    private static buildHeaders = (): Headers => {
        const headers = new Headers()
        headers.append('content-type', 'application/json')
        headers.append('Authorization', `Bearer ${Config.FWD_TOKEN}`)
        return headers
    }
    private static buildPageData = async (meta = {}) => {
        
        const pageData = {
            /* ENVIRONMENT */
            protocol: Util.getWindowChild(window?.location?.protocol, ''),
            host: Util.getWindowChild(window?.location?.host, ''),
            env: Config.ENV,
            version: Config.VERSION,
            /* PAGE INFO */
            path: Util.getWindowChild(window.location.pathname, ''),
            title: Util.getWindowChild(document.title, ''),
            referrer: Util.getWindowChild(document.referrer, ''),
            ...meta
        }

        const req = await fetch(Config.GEO_URL);
        const geoData: any = await req.json()

        let trackingId = ''
        const cookie = Cookie.get('log-harvestor')
        if (!cookie) {
            trackingId = Util.generateTrackingId()
            Cookie.set('log-harvestor', trackingId, 365)
        } else {
            trackingId = cookie
        }
        let userId = ''
        const localAuth: any = localStorage.getItem('log-harvestor')
        try {
            if (localAuth) {
                const parsed = JSON.parse(localAuth)
                if (parsed?.User?._id) {
                    userId = Util.cleanString(parsed?.User?._id, 'unparsable user id')
                }
            }
        } catch (e) { }


        return ({
            ...pageData,
            /* IP ADDRESS */
            ip: Util.cleanString(geoData?.IPv4, ''),
            /* DEVICE ANALYTICS */
            ua: Util.getWindowChild(window.navigator.userAgent, ''),
            /* GEO LOCATION */
            city: Util.cleanString(geoData?.city, ''),
            country_code: Util.cleanString(geoData?.country_code, ''),
            country_name: Util.cleanString(geoData?.country_name, ''),
            postal_code: geoData?.postal_code,
            state: Util.cleanString(geoData?.state, ''),
            longitude: geoData?.longitude,
            latitude: geoData?.latitude,
            /* REFS */
            tr_id: trackingId,
            user: userId
        })
    }


    static sendLog = async (logType: ETrackingLogType, meta?: Object): Promise<any | null> => {
        const payload = JSON.stringify({
            typ: logType,
            msg: await API.buildPageData(meta)
        })

        try {
            Util.debug({ payload })
            const res = await fetch(`${Config.API_URL}/log`, {
                method: 'post',
                headers: API.buildHeaders(),
                body: payload
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data
        } catch (e) {
            return null
        }

    }
}