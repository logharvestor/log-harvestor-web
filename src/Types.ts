export type Timestamp = number

export type BaseDoc = {
    _id?: string
}

export type Archives = {
    isArchived?: boolean
    archivedOn?: Timestamp
}

export type Timestamps = {
    t_ca: Timestamp //CreatedAt
    t_ua: Timestamp //UpdatedAt
}

export type CoreDoc = BaseDoc & Archives & Timestamps

export enum ETrackingEvent {
    TERMINATE = 'TERMINATE',
    RESUME = 'RESUME',
    START = 'START',
    TEST = 'TEST',
}
export type ITrackingEnv = {
    protocol: string
    host: string
    env: string
    version: string
}

export type ITrackingAddress = {
    city: string
    country_code: string
    country_name: string
    postal_code: string
    state: string
}

export type ITrackingGeo = {
    longitude: string
    latitude: string
}
export type ITrackingPageData = {
    path?: string
    title?: string
    referrer?: string
}
export type ITrackingEvent = BaseDoc & ITrackingPageData & {
    name: string
    event: ETrackingEvent
    metadata?: unknown
    start: Timestamp
}


export type ITrackingView = BaseDoc & ITrackingPageData & {
    start: Timestamp
    end: Timestamp
}

export type ITracking = CoreDoc & {
    tr_id: string
    user?: string
    fwd?: string
    ip: unknown
    referrer: unknown
    environment: ITrackingEnv
    address: ITrackingAddress
    geoLocation: ITrackingGeo
    ua: unknown
    views: ITrackingView[]
    events: ITrackingEvent[]
    start: Timestamp
    end: Timestamp
}

export type ISessionBuilderData = {
    IPv4: unknown;
    city: unknown;
    country_code: unknown;
    country_name: unknown;
    postal: unknown;
    state: unknown;
    longitude: unknown;
    latitude: unknown;
}

export type ISession = {
    sessionData: ITracking
    init: () => unknown
    fetchSessionData: () => Promise<ISessionBuilderData>
    buildSessionData: (d: ISessionBuilderData) => boolean
}