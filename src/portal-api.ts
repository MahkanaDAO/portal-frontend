import { ProviderData, ProviderTimeAvailability, StorageDeal } from "./types";

const apiUrl = process.env.API_URL;

class PortalAPI {
    registerProvider(walletAddress: string, storageAvailability: number, timeAvailability: ProviderTimeAvailability): Promise<void> {
        return fetch(`${apiUrl}/provider-registration`, {
            method: "POST",
            body: JSON.stringify({
                walletAddress,
                storageAvailability,
                ...timeAvailability,
            }),
        }).then((resp) => console.log("registerProvider():", resp));
    }

    requestStorage(walletAddress: string, startDate: Date, endDate: Date, data: string): Promise<void> {
        return fetch(`${apiUrl}/storage-request`, {
            method: "POST",
            body: JSON.stringify({
                walletAddress,
                data,
            }),
        }).then((resp) => console.log("requestStorage():", resp));
    }

    getStorageDeal(contractAddress: string): Promise<StorageDeal> {
        return fetch(`${apiUrl}/deals/${contractAddress}`, {
            method: "GET",
        }).then((resp) => {
            return {
                startDate: new Date(),
                endDate: new Date(),
                status: "PENDING",
                requester: "0x123",
                providers: ["0x567", "0x765"],
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
                isRegistered: true,
                reputation: {
                    rating: 0,
                    fulfillments: 0,
                    commitments: 0,
                },
                storageDeal: "",
            };
        });
    }

    getRequesterData(walletAddress: string): Promise<any> {
        return fetch(`${apiUrl}/requesters/${walletAddress}`, {
            method: "GET",
        }).then((resp) => {
            return {
                storageDeals: ["0x123", "0x456"],
            };
        });
    }
}

const portalApi = new PortalAPI();
export { portalApi };