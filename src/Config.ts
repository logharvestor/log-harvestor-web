import { version } from '../package.json'
import { Util } from './Util'

export const Config = {
    API_URL: 'https://app.logharvestor.com/api',
    GEO_URL: 'https://geolocation-db.com/json/',
    VERSION: version,
    ENV: 'production',
    FWD_TOKEN: '',
    DEBUG: false
}

export const loadConfig = () => {
    const document = Util.getDocument()
    const script = document?.getElementById('log-harvestor') || document?.currentScript
    if (script) {
        const configApiUrl = script.getAttribute(ConfigArgs.CONFIG_ARG_API_URL)
        Config.API_URL = !!configApiUrl ? configApiUrl : Config.API_URL

        const configFwdToken = script.getAttribute(ConfigArgs.CONFIG_ARG_FWD_TOKEN)
        Config.FWD_TOKEN = !!configFwdToken ? configFwdToken : Config.FWD_TOKEN

        const configDebug = script.getAttribute(ConfigArgs.CONFIG_ARG_DEBUG)
        Config.DEBUG = !!configDebug ? configDebug === 'true' : Config.DEBUG
    }
}


export enum ConfigArgs {
    CONFIG_ARG_API_URL = 'data-api-url',
    CONFIG_ARG_FWD_TOKEN = 'data-fwd-token',
    CONFIG_ARG_DEBUG = 'data-debug',
}