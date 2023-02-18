import * as React from "react";
import { useEffect, useState } from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    HStack,
    Input,
    Link,
    Select,
    Spinner,
    Stat,
    StatGroup,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { RequesterData, UserType } from "./types";
import { portalApi } from "./portal-api";
import { StorageDealHistory } from "./storage-deal";

const RequestForm = () => {
    const { address, connector, isConnected } = useAccount();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [userData, setUserData] = useState<string>();

    const [addressError, setAddressError] = useState("");
    const [dealDurationError, setDealDurationError] = useState("");
    const [userDataError, setUserDataError] = useState("");

    const requestStorage = async () => {
        try {
            setAddressError("");
            setDealDurationError("");
            setUserDataError("");

            if (address === undefined) {
                setAddressError("Please connect your wallet.");
            } else if (startDate === undefined || endDate === undefined) {
                setDealDurationError("Please specify a start and end date");
            } else if (userData === undefined) {
                setUserData("Please upload your data.")
            } else {
                await portalApi.requestStorage(address, startDate, endDate, userData);
            }
        } catch (error) {
            console.log("unable to request storage:", error);
        }
    }

    return (
        <GridItem colStart={2} colEnd={6} textAlign="left">
            <Box marginY={5}>
                <Heading size="md">Request a Storage Deal</Heading>
            </Box>
            <Divider />
            <Box marginY={5}>
                <form onSubmit={requestStorage}>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel>Wallet Address</FormLabel>
                            <Input disabled type="text" value={isConnected ? address : "0x..."} />
                            {(address === undefined || addressError) && (
                                <FormHelperText>Click <i>Connect Wallet</i> in the top right.</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Start Time</FormLabel>
                            <Input
                                type="date"
                                value={startDate?.toDateString() ?? ""}
                                onChange={(event) => {
                                    const date = new Date(event.target.value);
                                    setStartDate(date);
                                }}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>End Time</FormLabel>
                            <Input
                                type="date"
                                value={endDate?.toDateString() ?? ""}
                                onChange={(event) => {
                                    const date = new Date(event.target.value);
                                    setEndDate(date);
                                }}
                            />
                            <FormErrorMessage>{dealDurationError}</FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Data Upload</FormLabel>
                            <Input type="file" />
                            <FormErrorMessage>{userDataError}</FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <Button type="submit">Submit</Button>
                        </FormControl>
                    </VStack>
                </form>
            </Box>
        </GridItem>
    );
};

const Profile = () => {
    const { address } = useAccount();
    const [requesterData, setRequesterData] = useState<RequesterData>();

    useEffect(() => {
        if (address) {
            portalApi.getRequesterData(address).then((data) => {
                setRequesterData(data);
            });
        }
    }, [address]);

    if (!address) {
        return (
            <GridItem colStart={3} colEnd={11}>
                <Text>Please click <i>Connect Wallet</i> in the top right.</Text>
            </GridItem>
        );
    }
    if (requesterData === undefined) {
        return (
            <GridItem colSpan={12}>
                <Box>
                    <Spinner size="xl" speed="05s" thickness="5px" />
                </Box>
                <Box>
                    <Text>Loading profile...</Text>
                </Box>
            </GridItem>
        );
    }
    return (
        <GridItem colStart={2} colEnd={12} textAlign="left">
            <Box marginY={5}>
                <Heading size="md">Requester Profile</Heading>
            </Box>
            <Divider />
            <VStack align="left" marginY={5}>
                <Heading as="h2" size="md" id="storage-summary">Storage Summary</Heading>
                <StatGroup>
                    <Stat>
                        <StatLabel>Pending Deals</StatLabel>
                        <StatNumber>{requesterData.pendingDeals}</StatNumber>
                        <StatHelpText></StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>Active Deals</StatLabel>
                        <StatNumber>{requesterData.activeDeals}</StatNumber>
                        <StatHelpText></StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>Complete Deals</StatLabel>
                        <StatNumber>{requesterData.completeDeals}</StatNumber>
                        <StatHelpText></StatHelpText>
                    </Stat>
                </StatGroup>
            </VStack>
            <VStack align="left" marginY={5}>
                <Heading size="md" id="storage-history">Storage History</Heading>
                <Box border="1px" borderColor="gray" borderRadius="md">
                    <StorageDealHistory
                        userAddress={address}
                        userType={UserType.REQUESTER}
                        dealAddresses={requesterData.storageDeals}
                    />
                </Box>
            </VStack>
        </GridItem>
    );
};

export { RequestForm, Profile };