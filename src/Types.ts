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

export type ILog = CoreDoc & {
    typ: string
    msg: any
    fwd: string
    // Flagged
    flagged?: boolean
    // Stats fields
    tot_comments?: number
}


export enum ETrackingLogType {
    VIEW = 'Tracking.View',
    EVENT = 'Tracking.Event'
}

export enum ETrackingEventType {
    SESSION_TERMINATED = 'session-terminated',
    SESSION_STARTED = 'session-started',
  }
  

export type ITrackingLog = ILog & {
    typ: ETrackingLogType
    msg: {
        /* ENVIRONMENT */
        protocol: string
        host: string
        env: string
        version: string
        /* IP ADDRESS */
        ip: string
        /* DEVICE ANALYTICS */
        ua: unknown
        /* GEO LOCATION */
        city: string
        country_code: string
        country_name: string
        postal_code: string
        state: string
        longitude: string
        latitude: string
        /* PAGE INFO */
        path?: string
        title?: string
        referrer?: string
        /* REFS */
        tr_id?: string
        user?: string
        /* EVENT ONLY */
        eventType?: ETrackingEventType
    }
}