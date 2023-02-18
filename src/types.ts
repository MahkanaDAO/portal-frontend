// TODO @ygao change this to a declaration file?

interface ProviderTimeAvailability {
    startTime: Date;
    endTime: Date;
}

interface ProviderReputation {
    rating: number;
    fulfillments: number;
    commitments: number;
}

interface ProviderData {
    registrationDate: Date;
    reputation: ProviderReputation;
    storageDeals: string[] | undefined;
}

interface RequesterData {
    registrationDate: Date;
    pendingDeals: number;
    activeDeals: number;
    completeDeals: number;
    storageDeals: string[];
}

interface StorageDeal {
    startDate: Date;
    endDate: Date;
    status: DealStatus;
    requester: string;
    providers: string[];
    sectors: number;
}

enum DealStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    COMPLETE = "COMPLETE",
}

enum UserType {
    PROVIDER,
    REQUESTER,
}

export type { ProviderTimeAvailability, ProviderReputation, ProviderData, RequesterData, StorageDeal };
export { DealStatus, UserType };