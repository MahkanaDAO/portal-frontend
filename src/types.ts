// TODO @ygao change this to a declaration file?
import { DateTime } from "luxon";

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
    registrationDate: DateTime;
    reputation: ProviderReputation;
    storageDeals: string[] | undefined;
}

interface RequesterData {
    registrationDate: DateTime;
    pendingDeals: number;
    activeDeals: number;
    completeDeals: number;
    storageDeals: string[];
}

interface StorageDeal {
    startDate: DateTime;
    endDate: DateTime;
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