export declare class RateLimitUser {
    id: number;
    userIp: string;
    searchesToday: number;
    totalSearches: number;
    windowStart: Date;
    isPro: boolean;
    lastSeen: Date;
    createdAt: Date;
    updatedAt: Date;
}
