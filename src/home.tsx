import * as React from "react";
import { useNavigate } from "react-router-dom";
import {Box, Button, Flex, Grid, GridItem, Image, Link, Text, VStack} from "@chakra-ui/react";
import databaseGraphic from "./assets/database.png";
import networkingGraphic from "./assets/networking.png";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            <GridItem colStart={3} colEnd={5}>
                <Text as="b">Micro-storage on Filecoin</Text>
                <Text>
                    Anyone with a personal computer can offer part of their machine's storage capacity
                    and contribute to the network
                </Text>
            </GridItem>
            <GridItem colStart={2} colEnd={4}>
                <VStack>
                    <Box boxSize="xs">
                        <Image src={networkingGraphic} />
                    </Box>
                    <Text as="b">Storage Provider</Text>
                    <Button onClick={() => navigate("/provider-profile")}>
                        Start Providing
                    </Button>
                </VStack>
            </GridItem>
            <GridItem colStart={4} colEnd={6}>
                <VStack>
                    <Box boxSize="xs">
                        <Image src={databaseGraphic} />
                    </Box>
                    <Text as="b">Storage Requester</Text>
                    <Button onClick={() => navigate("/requester-profile")}>
                        Start Requesting
                    </Button>
                </VStack>
            </GridItem>
            <GridItem colSpan={6} marginY={5}>
                <Link href="https://www.flaticon.com/free-icons/shield" title="shield icons">
                    <Text size="xs">Shield icons created by Gregor Cresnar - Flaticon.</Text>
                </Link>
            </GridItem>
        </>
    );
};