import { Chain } from "wagmi/chains";

// RainbowKit isn't compatible with the latest version of wagmi,
// so we have to define the Filecoin chains ourselves.
const filecoin: Chain = {
    id: 314,
    name: "Filecoin Mainnet",
    network: "filecoin-mainnet",
    nativeCurrency: {
        decimals: 18,
        name: "filecoin",
        symbol: "FIL",
    },
    rpcUrls: {
        default: {
            http: ["https://api.node.glif.io/rpc/v1"],
        },
        public: {
            http: ["https://api.node.glif.io/rpc/v1"],
        },
    },
    blockExplorers: {
        default: {
            name: "Filfox",
            url: "https://filfox.info/en",
        },
        filscan: {
            name: "Filscan",
            url: "https://filscan.io",
        },
        filscout: {
            name: "Filscout",
            url: "https://filscout.io/en",
        },
        glif: {
            name: "Glif",
            url: "https://explorer.glif.io",
        },
    },
};

const filecoinHyperspace: Chain = {
    id: 3141,
    name: "Filecoin Hyperspace",
    network: "filecoin-hyperspace",
    nativeCurrency: {
        decimals: 18,
        name: "testnet filecoin",
        symbol: "tFIL",
    },
    rpcUrls: {
        default: {
            http: ["https://api.hyperspace.node.glif.io/rpc/v1"],
        },
        public: {
            http: ["https://api.hyperspace.node.glif.io/rpc/v1"],
        },
    },
    blockExplorers: {
        default: {
            name: "Filfox",
            url: "https://hyperspace.filfox.info/en",
        },
        filscan: {
            name: "Filscan",
            url: "https://hyperspace.filscan.io",
        },
    },
};

const providerStorageSizeOptions: ReadonlyArray<number> = [2, 4, 8, 16];
const GITHUB_REPO_LINK = "https://github.com/Yiwen-Gao/micro-storage-platform-monorepo";
const FILECOIN_SLACK_LINK = "https://filecoinproject.slack.com/";

export { filecoin, filecoinHyperspace, providerStorageSizeOptions, GITHUB_REPO_LINK, FILECOIN_SLACK_LINK };