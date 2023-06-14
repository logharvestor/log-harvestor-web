export const Util = {
    getWindowChild: <T = unknown>(o: T, fallback: T): T => {
        return Util.windowAvailable() ? o : fallback
    },
    cleanString: (str: unknown, def: string): string => {
        return typeof str === 'string' ? str : def
    },
    windowAvailable: (): boolean => {
        return typeof window !== undefined
    },
    getDocument: (): Document | null => {
        return Util.windowAvailable() ? window.document : null
    },
    generateTrackingId: (): string => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    },
    debug: (msg: any, ...args: unknown[]): void => {
        console.log(`[log-harvestor]`, msg, ...args)
    }
}