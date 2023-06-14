import { describe, it, beforeAll, expect } from 'vitest'
import { version } from '../../package.json'
import { API } from '../API'
import { Config } from '../Config'
import { ETrackingLogType } from '../Types'

export const mockConfig = () => {
    Config.API_URL = 'http://0.0.0.0:4000/api'
    Config.GEO_URL = 'https://geolocation-db.com/json/'
    Config.VERSION = version
    Config.ENV = 'development'
    Config.FWD_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvcndhcmRlciJ9.eyJfaWQiOiI2NDY0NmUwOWI0NjAwMWRlNmFlMDA4YTYiLCJpYXQiOjE2ODQzMTA2MTF9.sqZf2284qtkcSiO3u9xaOmBNXqfWCvNz_e_qW5hzsCI'
}

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
})