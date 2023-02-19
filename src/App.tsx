import * as React from "react"
import { BrowserRouter, Route, Routes, Link as RouterLink } from "react-router-dom";
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
import { Docs } from "./docs";

const { chains, provider } = configureChains(
    [filecoin, filecoinHyperspace],
    [
        alchemyProvider({ apiKey: process.env.ALCHEMY_ID ?? "" }),
        publicProvider(),
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
            <Button fontSize="4xl" as={RouterLink} to="/">
                m
            </Button>
        </Box>
        <HStack marginX={5}>
            <Button as={RouterLink} to="/provider-profile" variant="ghost">
                Provider
            </Button>
            <Button as={RouterLink} to="/requester-profile" variant="ghost">
                Requester
            </Button>
            <Button as={RouterLink} to="/docs" variant="ghost">
                Docs
            </Button>
        </HStack>
        <Spacer />
        <Box>
            <ConnectButton />
        </Box>
    </Flex>
);

const Footer = () => (
    <Flex padding={5}></Flex>
);

const NotFound = () => (
    <GridItem colSpan={12}>
        <Flex direction="column" height="full" justify="center" align="center">
            <Heading fontSize="6xl">404 Not Found</Heading>
            <Text>Sorry, we weren't able to find the requested page.</Text>
        </Flex>
    </GridItem>
);

export const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <BrowserRouter>
                        <Box bg="gray.900">
                            <Header />
                            <Grid minHeight="100vh" templateColumns="repeat(12, 1fr)" gap={5}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/provider-registration" element={<ProviderRegistrationForm />} />
                                    <Route path="/provider-profile" element={<ProviderProfile />} />
                                    <Route path="/storage-request" element={<StorageRequestForm />} />
                                    <Route path="/requester-profile" element={<RequesterProfile />} />
                                    <Route path="/docs" element={<Docs />} />
                                    <Route path="*" element={<NotFound />} />
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
