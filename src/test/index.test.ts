import { describe, it, beforeAll, expect } from 'vitest'
import { API } from '../API'
import { mockConfig } from '../Config'
import { ETrackingEvent } from '../Types'
import { Session } from '../Session'


describe('api', () => {
    let session: Session = new Session()
    beforeAll(async () => {
        mockConfig()
        await session.init()
    })

    it('should be able to start', async () => {
        const tracking = await API.startSession(session.sessionData)
        expect(tracking).not.toThrowError(new Error())
        expect(tracking).toBeDefined()
        if (tracking) {
            session.sessionData._id = tracking._id
            expect(tracking?._id).toBeDefined()
        }
    })
    it('should be able to send a page view', async () => {
        const tracking = await API.sendPageView(session.sessionData._id, {
            path: '/test',
            title: 'test',
            referrer: 'test',
            start: Date.now()
        })
        expect(tracking).not.toThrowError(new Error())
        expect(tracking).toBeDefined()
        expect(tracking).toEqual(null)
        if (tracking) {
            console.log({ tracking })
            expect(tracking?._id).toBeDefined()
        }
    })
    it('should be able to send an event', async () => {
        const tracking = await API.sendEvent(session.sessionData._id, {
            name: 'test',
            event: ETrackingEvent.TEST,
            metadata: {
                test: 'test'
            },
            start: Date.now()
        })
        expect(tracking).not.toThrowError(new Error())
        expect(tracking).toBeDefined()
        if (tracking) {
            console.log({ tracking })
            expect(tracking?._id).toBeDefined()
        }
    })
    it('should be able to terminate a session', async () => {
        const tracking = await API.terminateSession(session.sessionData._id)
        expect(tracking).not.toThrowError(new Error())
        expect(tracking).toBeDefined()
        if (tracking) {
            console.log({ tracking })
            expect(tracking?._id).toBeDefined()
            expect(tracking?.end).toBeDefined()
        }
    })
})