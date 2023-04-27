import { version } from '../package.json'
import { Util } from './Util'

export const Config = {
    API_URL: 'https://app.logharvestor.com/api',
    GEO_URL: 'https://geolocation-db.com/json/',
    VERSION: version,
    ENV: 'production',
    FWD_TOKEN: ''
}

export const mockConfig = () => {
    Config.API_URL = 'http://0.0.0.0:4000/api',
    Config.GEO_URL = 'https://geolocation-db.com/json/',
    Config.VERSION = version
    Config.ENV = 'development'
    Config.FWD_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImZvcndhcmRlciJ9.eyJfaWQiOiI2NDQ5OTQ2ZDFjMDU2MzQ4NWUyY2JkOGYiLCJpYXQiOjE2ODI1NDM3MjV9.YQfwV7ibiz4D3-yEEp7i4_pWrZH7KYlN7iuIxS_Ivu0'
}

export const loadConfig = () => {
    const document = Util.getDocument()
    const script = document?.getElementById('log-harvestor') || document?.currentScript
    if (script) {
        const configApiUrl = script.getAttribute('data-api-url')
        const configFwdToken = script.getAttribute('data-fwd-token')
        Config.API_URL = !!configApiUrl ? configApiUrl : Config.API_URL
        Config.FWD_TOKEN = !!configFwdToken ? configFwdToken : Config.FWD_TOKEN
    }
}