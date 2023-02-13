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
    isRegistered: boolean;
    reputation: ProviderReputation;
    storageDeal: string | undefined;
}

interface StorageDeal {
    startDate: Date;
    endDate: Date;
    status: string;
    requester: string;
    providers: string[];
    sectors: number;
}

export type { ProviderTimeAvailability, ProviderReputation, ProviderData, StorageDeal };