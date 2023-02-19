import { DateTime } from "luxon";
import {
    DealStatus,
    ProviderData,
    ProviderTimeAvailability,
    RequesterData,
    StorageDeal,
} from "./types";

const apiUrl = process.env.API_URL;

class PortalAPI {
    registerProvider(walletAddress: string, storageAvailability: number, startTime: Date, endTime: Date): Promise<boolean> {
        return fetch(`${apiUrl}/provider-registration`, {
            method: "POST",
            body: JSON.stringify({
                // walletAddress,
                // storageAvailability,
            })
        }).then((resp: Response) => {
            return resp.status === 201 ? true : false;
        });
    }

    requestStorage(walletAddress: string, startDate: Date, endDate: Date, files: FileList): Promise<boolean> {
        return fetch(`${apiUrl}/storage-request`, {
            method: "POST",
            body: JSON.stringify({
                walletAddress,
                data: files,
            }),
        }).then((resp: Response) => {
            return resp.status === 201 ? true : false;
        });
    }

    getStorageDeal(contractAddress: string): Promise<StorageDeal> {
        return fetch(`${apiUrl}/deals/${contractAddress}`, {
            method: "GET",
        }).then((resp) => {
            return {
                startDate: DateTime.fromISO("2023-01-01"),
                endDate: DateTime.fromISO("2023-10-10"),
                status: DealStatus.PENDING,
                requester: "0x12345678",
                providers: ["0x567876", "0x7650909"],
                sectors: 10,
            };
        });
    }

    getProviderSectors(walletAddress: string): Promise<string> {
        return fetch(`${apiUrl}/sectors/${walletAddress}`, {
            method: "GET",
        }).then((resp) => {
            return "123456789";
        });
    }

    getProviderData(walletAddress: string): Promise<ProviderData> {
        return fetch(`${apiUrl}/providers/${walletAddress}`, {
            method: "GET",
        }).then((resp) => {
            return {
                registrationDate: DateTime.fromISO("2021-05-08"),
                reputation: {
                    rating: 0,
                    fulfillments: 0,
                    commitments: 0,
                },
                storageDeals: ["0x47fhfdjnkdke", "0x234jdn$9fdg"],
            };
        });
    }

    getRequesterData(walletAddress: string): Promise<RequesterData> {
        return fetch(`${apiUrl}/requesters/${walletAddress}`, {
            method: "GET",
        }).then((resp) => {
            return {
                registrationDate: DateTime.fromISO("2020-01-15"),
                pendingDeals: 0,
                activeDeals: 1,
                completeDeals: 5,
                storageDeals: ["0x1239876", "0x456456456"],
            };
        });
    }
}

const portalApi = new PortalAPI();
export { portalApi };