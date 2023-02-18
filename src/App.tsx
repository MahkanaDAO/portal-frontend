import * as React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    ChakraProvider,
    Box,
    Button,
    Code,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Link,
    theme,
    Spacer,
    Stack,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"

import "@rainbow-me/rainbowkit/styles.css";
import {
    getDefaultWallets,
    RainbowKitProvider,
    ConnectButton,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { filecoin, filecoinHyperspace } from "./constants";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { Home } from "./home";
import { Profile as ProviderProfile, RegistrationForm as ProviderRegistrationForm } from "./storage-provider";
import { Profile as RequesterProfile, RequestForm as StorageRequestForm } from "./storage-requester";

const { chains, provider } = configureChains(
    [filecoin, filecoinHyperspace],
    [
        alchemyProvider({ apiKey: process.env.ALCHEMY_ID ?? "" }),
        publicProvider()
    ],
);
const { connectors } = getDefaultWallets({
  appName: "Makhana",
  chains,
});
const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

const Header = () => (
    <Flex direction="row" padding={5}>
        <Box>
            <Heading>m</Heading>
        </Box>
        <Spacer />
        <Box>
            <ConnectButton />
            {/*<ColorModeSwitcher justifySelf="flex-end" />*/}
        </Box>
    </Flex>
);

const Footer = () => (
    <></>
);

export const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <BrowserRouter>
                        <Box bg="blackAlpha.700">
                            <Header />
                            <Grid templateColumns="repeat(12, 1fr)" gap={5}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/provider-registration" element={<ProviderRegistrationForm />} />
                                    <Route path="/provider-profile" element={<ProviderProfile />} />
                                    <Route path="/storage-request" element={<StorageRequestForm />} />
                                    <Route path="/requester-profile" element={<RequesterProfile />} />
                                </Routes>
                            </Grid>
                            <Footer />
                        </Box>
                    </BrowserRouter>
                </RainbowKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    );
};
