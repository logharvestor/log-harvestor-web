import { Util } from "./Util"
import { Config } from './Config'
import { ITracking, ITrackingEvent, ITrackingPageData, ITrackingView } from "./Types"
export class API {

    static getPageData = (): ITrackingPageData => {
        return {
            path: Util.getWindowChild(window.location.pathname, ''),
            title: Util.getWindowChild(document.title, ''),
            referrer: Util.getWindowChild(document.referrer, '')
        }
    }

    static startSession = async (session: ITracking): Promise<ITracking | null> => {
        const payload = JSON.stringify(session)
        try {

            const res = await fetch(`${Config.API_URL}/tracking`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    "Authorization": `Bearer ${Config.FWD_TOKEN}`
                },
                body: payload
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data
        } catch (e) {
            return null
        }
    }
    static sendPageView = async (trackingId?: string, view?: Partial<ITrackingView>): Promise<ITracking | null> => {
        const payload = JSON.stringify({ ...view, ...API.getPageData() })

        try {
            const res = await fetch(`${Config.API_URL}/tracking/${trackingId}/view`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    "Authorization": `Bearer ${Config.FWD_TOKEN}`
                },
                body: payload
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data
        } catch (e) {
            return null
        }
    }
    static sendEvent = async (trackingId?: string, event?: ITrackingEvent): Promise<ITracking | null> => {
        const payload = JSON.stringify({ ...event, ...API.getPageData() })
        try {
            const res = await fetch(`${Config.API_URL}/tracking/${trackingId}/event`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    "Authorization": `Bearer ${Config.FWD_TOKEN}`
                },
                body: payload
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data
        } catch (e) {
            return null
        }
    }

    static terminateSession = async (trackingId?: string): Promise<ITracking | null> => {
        try {
            const res = await fetch(`${Config.API_URL}/tracking/${trackingId}/terminate`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    "Authorization": `Bearer ${Config.FWD_TOKEN}`
                }
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data
        } catch (e) {
            return null
        }
    }
}