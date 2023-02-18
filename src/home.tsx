import * as React from "react";
import { useNavigate } from "react-router-dom";
import {Box, Button, ButtonGroup, Flex, Grid, GridItem, Heading, Image, Link, Stack, Text, VStack} from "@chakra-ui/react";
import databaseGraphic from "./assets/database.png";
import networkingGraphic from "./assets/networking.png";
import MahkanaGraphic from "./assets/mahkana.png";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <GridItem colStart={2} colEnd={12}>
                <Box borderRadius="md">
                    <Image src={MahkanaGraphic}></Image>
                </Box>
            </GridItem>
            <GridItem colStart={2} colEnd={5} border="1px" borderColor="gray" borderRadius="lg" padding={5}>
                <VStack>
                    <Text align="right">
                        <i>Anyone</i> with a personal computer can offer part of their machine's storage capacity,
                        act as a storage provider, and <i>contribute to the network</i>.
                    </Text>
                    <ButtonGroup>
                        <Button>See Source</Button>
                    </ButtonGroup>
                </VStack>
            </GridItem>
            <GridItem colStart={5} colEnd={12} border="1px" borderColor="gray" borderRadius="lg" padding={5}>
                <VStack>
                    <Text align="left">
                        Mahkana taps into the unused capacity on millions of personal computers around the world.

                        One person may only have a few GBs of free space on their laptop and is only online a few hours a day.
                        But a collective of these individuals can pool together enough GBs and hours
                        to form a network with large storage and 24/7 connectivity.
                    </Text>
                    <ButtonGroup>
                        <Button>Download App</Button>
                        <Button>See Docs</Button>
                    </ButtonGroup>
                </VStack>
            </GridItem>
            <GridItem colStart={2} colEnd={7} border="1px" borderColor="gray" borderRadius="md">
                <VStack margin={5} paddingY={5}>
                    {/*<Box boxSize="xs">*/}
                    {/*    <Image src={networkingGraphic} />*/}
                    {/*</Box>*/}
                    <Text as="b">Storage Provider</Text>
                    <Button onClick={() => navigate("/provider-profile")}>
                        Start Providing
                    </Button>
                </VStack>
            </GridItem>
            <GridItem colStart={7} colEnd={12} border="1px" borderColor="gray" borderRadius="md">
                <VStack>
                    {/*<Box boxSize="xs">*/}
                    {/*    <Image src={databaseGraphic} />*/}
                    {/*</Box>*/}
                    <Text as="b">Storage Requester</Text>
                    <Button onClick={() => navigate("/requester-profile")}>
                        Start Requesting
                    </Button>
                </VStack>
            </GridItem>
            <GridItem colSpan={6} marginY={5}>
                <VStack align="left" marginY={5}>
                    <Heading as="h2" size="md" id="setup-instructions">Setup Instructions</Heading>
                    <Box>
                        <Text fontSize="sm">
                            The reliability rating affects how providers are selected for new storage deals.
                            It's calculated by dividing the number of sectors that a provider has successfully proven
                            by the the number of sectors that it has promised to prove.
                            If no work history is available, a default rating is given.
                        </Text>
                    </Box>
                    <Box>
                    </Box>
                </VStack>
                <Link href="https://www.flaticon.com/free-icons/shield" title="shield icons">
                    <Text size="xs">Shield icons created by Gregor Cresnar - Flaticon.</Text>
                </Link>
            </GridItem>
        </>
    );
};