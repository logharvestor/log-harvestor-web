import { describe, it, beforeAll, expect } from 'vitest'
import { API } from '../API'
import { mockConfig } from '../Config'
import { ETrackingLogType } from '../Types'


describe('api', () => {
    beforeAll(async () => {
        mockConfig()
    })

    it('should be able to send a page view', async () => {
        const tracking = await API.sendLog(ETrackingLogType.VIEW)
        expect(tracking).not.toThrowError(new Error())
        expect(tracking).toBeDefined()
        expect(tracking).toEqual(null)
        if (tracking) {
            console.log({ tracking })
            expect(tracking?._id).toBeDefined()
        }
    })
    it('should be able to send an event', async () => {
        const tracking = await API.sendLog(ETrackingLogType.EVENT)
        expect(tracking).not.toThrowError(new Error())
        expect(tracking).toBeDefined()
        if (tracking) {
            console.log({ tracking })
            expect(tracking?._id).toBeDefined()
        }
    })
    it('should be able to terminate', async () => {
        const tracking = await API.sendLog(ETrackingLogType.TERMINATE)
        expect(tracking).not.toThrowError(new Error())
        expect(tracking).toBeDefined()
        if (tracking) {
            console.log({ tracking })
            expect(tracking?._id).toBeDefined()
            expect(tracking?.end).toBeDefined()
        }
    })
})