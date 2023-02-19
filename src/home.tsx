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
import { FaGithub, FaSlack } from "react-icons/fa";
import databaseGraphic from "./assets/database.png";
import networkingGraphic from "./assets/networking.png";
import MahkanaGraphic from "./assets/mahkana.gif";
import { FILECOIN_SLACK_LINK, GITHUB_REPO_LINK } from "./constants";

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
                <VStack>
                    <Text align="right">
                        <i>Anyone</i> with a personal computer can offer part of their machine's storage capacity,
                        act as a storage provider, and <i>contribute to the network</i>.
                    </Text>
                    <ButtonGroup>
                        <Button as={RouterLink} to={GITHUB_REPO_LINK} target="_blank" rel="noopener noreferrer">
                            <FaGithub />
                        </Button>
                        <Button as={RouterLink} to={FILECOIN_SLACK_LINK} target="_blank" rel="noopener noreferrer">
                            <FaSlack />
                        </Button>
                    </ButtonGroup>
                </VStack>
            </GridItem>
            <GridItem colStart={5} colEnd={12} border="1px" borderColor="gray" borderRadius="lg" padding={5}>
                <VStack>
                    <Text align="left">
                        Mahkana taps the unused capacity on millions of personal computers around the world.

                        One person may only have a few GBs of free space on their laptop and a few online hours a day.
                        But a co-op of these individuals can pool together enough GBs and hours
                        to form a network with large storage and 24/7 connectivity.
                    </Text>
                    <ButtonGroup>
                        <Button as={RouterLink} to="/docs">See Setup</Button>
                        <Button as="a" href={`${process.env.PUBLIC_URL}/logo192.png`} download>Install App</Button>
                    </ButtonGroup>
                </VStack>
            </GridItem>
            <GridItem colStart={2} colEnd={7} border="1px" borderColor="gray" borderRadius="md">
                <VStack margin={5} paddingY={5}>
                    {/*<Box boxSize="xs">*/}
                    {/*    <Image src={networkingGraphic} />*/}
                    {/*</Box>*/}
                    <Text as="b">Storage Provider</Text>
                    <Button as={RouterLink} to="/provider-profile">
                        Start Providing
                    </Button>
                </VStack>
            </GridItem>
            <GridItem colStart={7} colEnd={12} border="1px" borderColor="gray" borderRadius="md">
                <VStack margin={5} paddingY={5}>
                    {/*<Box boxSize="xs">*/}
                    {/*    <Image src={databaseGraphic} />*/}
                    {/*</Box>*/}
                    <Text as="b">Storage Requester</Text>
                    <Button as={RouterLink} to="/storage-request">
                        Start Requesting
                    </Button>
                </VStack>
            </GridItem>
        </>
    );
};