import * as React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    Link,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import {FaDownload, FaExternalLinkAlt, FaFileAlt, FaGithub, FaSlack} from "react-icons/fa";
import databaseGraphic from "./assets/database.png";
import networkingGraphic from "./assets/networking.png";
import MahkanaGraphic from "./assets/mahkana.gif";
import { FILECOIN_LINK, GITHUB_REPO_LINK } from "./constants";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <GridItem colStart={2} colEnd={12}>
                <Stack borderRadius="md" justify="center">
                    <Image src={MahkanaGraphic}></Image>
                </Stack>
            </GridItem>
            <GridItem colStart={2} colEnd={5} border="1px" borderColor="gray" borderRadius="lg" padding={5}>
                <VStack align="end">
                    <Text textAlign="right">
                        Filecoin is a layer 1 blockchain that enables distributed and verifiable storage.
                        It disrupts the centralized nature of web2 cloud companies and allows a new class of smaller players to offer storage services.
                    </Text>
                    <ButtonGroup>
                        <Button
                            rightIcon={<FaExternalLinkAlt />}
                            as={RouterLink}
                            to={FILECOIN_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Filecoin Project
                        </Button>
                    </ButtonGroup>
                </VStack>
            </GridItem>
            <GridItem colStart={5} colEnd={12} border="1px" borderColor="gray" borderRadius="lg" padding={5}>
                <VStack align="start">
                    <Text>
                        Mahkana is a layer 2 protocol on top of the Filecoin Virtual Machine that removes the network's specialized hardware requirements
                        and allows anyone to participate in storage deals as a storage provider.
                    </Text>
                    <Text>
                        It taps into the unused capacity on millions of personal computers around the world.
                        One person may only have a few GBs of free space on their laptop and a few online hours a day.
                        But a co-op of these individuals can pool together enough GBs and hours
                        to form a network with large storage and 24/7 connectivity.
                    </Text>
                    <ButtonGroup>
                        <Button leftIcon={<FaDownload />} as="a" href={`${process.env.PUBLIC_URL}/logo192.png`} download>Install App</Button>
                        <Button leftIcon={<FaFileAlt />} as={RouterLink} to="/docs">See Docs</Button>
                    </ButtonGroup>
                </VStack>
            </GridItem>
            <GridItem colStart={2} colEnd={7} border="1px" borderColor="gray" borderRadius="md">
                <VStack margin={5} paddingY={5}>
                    <Text as="b">Storage Provider</Text>
                    <Text>
                        <i>Anyone</i> with a personal computer can offer part of their machine's storage capacity,
                        act as a storage provider, <i>contribute to the network</i>, and be compensated for their services.
                    </Text>
                    <Button as={RouterLink} to="/provider-profile">
                        Register as a Provider
                    </Button>
                </VStack>
            </GridItem>
            <GridItem colStart={7} colEnd={12} border="1px" borderColor="gray" borderRadius="md">
                <VStack margin={5} paddingY={5}>
                    <Text as="b">Storage Requester</Text>
                    <Text>
                        Get storage availability, access speeds, and price rates that are comparable or better
                        than those of dedicated full storage providers.
                    </Text>
                    <Button as={RouterLink} to="/storage-request">
                        Request a Storage Deal
                    </Button>
                </VStack>
            </GridItem>
        </>
    );
};