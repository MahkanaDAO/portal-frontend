import * as React from "react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Code,
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
    Spacer,
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

import { providerStorageSizeOptions } from "./constants";
import { ProviderReputation, ProviderTimeAvailability } from "./types";
import { portalApi } from "./portal-api";
import { StorageDeal } from "./storage-deal";

const RegistrationForm = () => {
    const { address, connector, isConnected } = useAccount();

    const [storageAvailability, setStorageAvailability] = useState(2);
    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();

    const [addressError, setAddressError] = useState("");
    const [timeAvailabilityError, setTimeAvailabilityError] = useState("");

    const registerProvider = async () => {
        try {
            setAddressError("");
            setTimeAvailabilityError("");

            if (address === undefined) {
                setAddressError("Please connect your wallet.");
            } else if (startTime === undefined || endTime === undefined) {
                setTimeAvailabilityError("Please specify a start and end date.");
            } else {
                const timeAvailability = { startTime, endTime };
                await portalApi.registerProvider(address, storageAvailability, timeAvailability);
            }
        } catch (error) {
            console.log("unable to register provider:", error);
        }
    };

    return (
        <GridItem colStart={2} colEnd={6} textAlign="left">
            <Box marginY={5}>
                <Heading size="md">Register as a Provider</Heading>
            </Box>
            <form onSubmit={registerProvider}>
                <VStack spacing={5}>
                    <FormControl isRequired>
                        <FormLabel>Wallet Address</FormLabel>
                        <Input disabled type="text" value={isConnected ? address : "0x..."} />
                        {addressError ? (
                            <FormErrorMessage>{addressError}</FormErrorMessage>
                        ) : (
                            <FormHelperText>Click <i>Connect Wallet</i> in the top right.</FormHelperText>
                        )}
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Storage Availability</FormLabel>
                        <Select
                            placeholder="Select size..."
                            value={storageAvailability}
                            onChange={(event) => setStorageAvailability(parseInt(event.target.value))}
                        >
                            {providerStorageSizeOptions.map((size) => (<option value={size}>{size} GiB</option>))}
                        </Select>
                        <FormHelperText>Select the maximum amount of storage space you're willing to commit.</FormHelperText>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Start Time</FormLabel>
                        <Input
                            type="datetime-local"
                            value={startTime?.toISOString().split(".")[0] ?? ""}
                            onChange={(event) => {
                                const date = new Date(event.target.value);
                                console.log(event.target.value, date)
                                setStartTime(date);
                            }}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>End Time</FormLabel>
                        <Input
                            type="datetime-local"
                            value={endTime?.toISOString().split(".")[0] ?? ""}
                            onChange={(event) => {
                                const date = new Date(event.target.value);
                                setEndTime(date);
                            }}
                        />
                    </FormControl>
                        <FormErrorMessage>{timeAvailabilityError}</FormErrorMessage>
                    <FormControl>
                        <Input type="submit" />
                    </FormControl>
                </VStack>
            </form>
        </GridItem>
    );
};

const Profile = () => {
    const { address, connector, isConnected } = useAccount();
    const navigate = useNavigate();

    const [reputation, setReputation] = useState<ProviderReputation>();
    const [storageDealAddress, setStorageDealAddress] = useState<string>();

    useEffect(() => {
        if (address) {
            portalApi.getProviderData(address).then((data) => {
                if (data) {
                    setReputation(data.reputation);
                    setStorageDealAddress(data.storageDeal);
                } else {
                    navigate("/provider-registration");
                }
            });
        }
    }, [address]);

    if (!address) {
        return (
            <GridItem colStart={3} colEnd={5}>
                <Text>Please click <i>Connect Wallet</i> in the top right.</Text>
            </GridItem>
        );
    }
    if (reputation === undefined) {
        return (
            <Box justifySelf="center">
                <Spinner size="xl" speed="0.5s" thickness="5px" />
                <Text>Loading profile...</Text>
            </Box>
        );
    }
    return (
        <GridItem colStart={2} colEnd={6} textAlign="left">
            <Box marginY={5}>
                <Heading size="md">Provider Profile</Heading>
            </Box>
            <Accordion defaultIndex={[0, 1]} allowMultiple allowToggle>
                <AccordionItem>
                    <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                            Basics
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <StatGroup>
                            <Stat>
                                <StatLabel>Reliability Rating</StatLabel>
                                <StatNumber>{reputation.rating}</StatNumber>
                                <StatHelpText>
                                    {reputation.fulfillments} fulfilled
                                    / {reputation.commitments} committed
                                </StatHelpText>
                            </Stat>
                            <Stat>
                                <StatLabel>Membership</StatLabel>
                                <StatNumber>3 Years</StatNumber>
                                <StatHelpText>Since Jan 05, 2020</StatHelpText>
                            </Stat>
                        </StatGroup>
                        <div>
                            <Text fontSize="sm">
                                The reliability rating affects how providers are selected for new storage deals.
                                It's calculated by dividing the number of sectors that a provider has successfully proven
                                by the the number of sectors that it has promised to prove.
                                If no work history is available, a default rating is given.
                            </Text>
                        </div>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                            Storage Deal
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        {storageDealAddress ? (
                            <>
                                <StorageDeal contractAddress={storageDealAddress} />
                                <Button>Download Sectors</Button>
                            </>
                        ) : (
                            <Text fontSize="sm">You're not participating in any ongoing storage deals.</Text>
                        )}
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                            Setup Instructions
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <Button>Download Binary</Button>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </GridItem>
    );
};

export { RegistrationForm, Profile };