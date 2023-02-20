import * as React from "react"
import {useEffect, useState} from "react"
import {useNavigate, Link as RouterLink} from "react-router-dom";
import {
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    GridItem,
    Heading,
    Input,
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
import {useAccount} from "wagmi";
import { DateTime } from "luxon";

import {providerStorageSizeOptions} from "./constants";
import {ProviderData, UserType} from "./types";
import {portalApi} from "./portal-api";
import {StorageDealHistory} from "./storage-deal";

interface RegistrationFormInputs {
    startTime: { value: string };
    endTime: { value: string };
    storage: { value: string };
}

const RegistrationForm = () => {
    const navigate = useNavigate();
    const { address, connector, isConnected } = useAccount();

    const [isStorageError, setIsStorageError] = useState(false);
    const [isTimeError, setIsTimeError] = useState(false);
    const [isSubmissionError, setIsSubmissionError] = useState(false);

    const checkInvalidRange = (start: string, end: string) => {
        return (
            start === undefined || start === ""
            || start === undefined || start === ""
            || DateTime.fromISO(start) >= DateTime.fromISO(end)
            || DateTime.fromISO(end) <= DateTime.utc()
        );
    }

    const registerProvider = async (event: React.FormEvent) => {
        try {
            event.preventDefault();

            const {
                startTime: { value: startTime },
                endTime: { value: endTime },
                storage: { value: storage },
            } = event.target as typeof event.target & RegistrationFormInputs;

            setIsStorageError(false)
            setIsTimeError(false);
            setIsSubmissionError(false);

            if (address === undefined) {
                return;
            } else if (storage === "") {
                setIsStorageError(true);
            } else if (checkInvalidRange(startTime, endTime)) {
                setIsTimeError(true);
            } else {
                console.log("address:", address);
                console.log("storage:", storage);
                console.log("start:", startTime);
                console.log("end:", endTime);
                const isRegistered = await portalApi.registerProvider(address, parseInt(storage), new Date(startTime), new Date(endTime));
                if (!isRegistered) {
                    setIsSubmissionError(true);
                } else {
                    navigate("/provider-profile");
                }
            }
        } catch (error) {
            setIsSubmissionError(true);
            console.log("unable to register provider:", error);
        }
    };

    return (
        <GridItem colStart={2} colEnd={6} textAlign="left">
            <Box marginY={5}>
                <Heading size="md">Register as a Provider</Heading>
            </Box>
            <Divider />
            <Box marginY={5}>
                <form onSubmit={registerProvider}>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel>Wallet Address</FormLabel>
                            <Input disabled type="text" value={isConnected ? address : "0x..."} />
                            {address === undefined && (
                                <FormHelperText>Click <i>Connect Wallet</i> in the top right.</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl isRequired isInvalid={isStorageError}>
                            <FormLabel>Storage Availability</FormLabel>
                            <Select name="storage" placeholder="Select size...">
                                {providerStorageSizeOptions.map((size, idx) => (<option key={idx} value={size}>{size} GiB</option>))}
                            </Select>
                            {isStorageError ? (
                                <FormErrorMessage>Please select a valid storage size.</FormErrorMessage>
                            ) : (
                                <FormHelperText>Select the maximum amount of storage space you're willing to commit.</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Start Time</FormLabel>
                            <Input name="startTime" type="datetime-local" />
                        </FormControl>
                        <FormControl isRequired isInvalid={isTimeError}>
                            <FormLabel>End Time</FormLabel>
                            <Input name="endTime" type="datetime-local" />
                            <FormErrorMessage>Please specify a valid start and end time range.</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={isSubmissionError}>
                            <Button type="submit">Submit</Button>
                            <FormErrorMessage>
                                Sorry, we were unable to register you as a provider and are looking into the issue.
                                Please try again in a few minutes!
                            </FormErrorMessage>
                        </FormControl>
                    </VStack>
                </form>
            </Box>
        </GridItem>
    );
};

const Profile = () => {
    const navigate = useNavigate();
    const { address, connector, isConnected } = useAccount();

    const [providerData, setProviderData] = useState<ProviderData>();

    useEffect(() => {
        if (address) {
            portalApi.getProviderData(address).then((data) => {
                if (data) {
                    setProviderData(data);
                } else {
                    navigate("/provider-registration");
                }
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
    if (providerData === undefined) {
        return (
            <GridItem colSpan={12}>
                <Flex direction="column" height="full" justify="center" align="center">
                    <Spinner size="xl" speed="0.5s" thickness="5px" />
                    <Text>Loading profile...</Text>
                </Flex>
            </GridItem>
        );
    }
    return (
        <GridItem colStart={2} colEnd={12} textAlign="left">
            <Box marginY={5}>
                <Heading size="md">Provider Profile</Heading>
            </Box>
            <Divider />
            <VStack align="stretch" marginY={5}>
                <Heading as="h2" size="md" id="storage-stats">Storage Stats</Heading>
                <StatGroup>
                    <Stat>
                        <StatLabel>Reliability Rating</StatLabel>
                        <StatNumber>{providerData.reputation.rating}</StatNumber>
                        <StatHelpText>
                        </StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>Fulfillments</StatLabel>
                        <StatNumber>{providerData.reputation.fulfillments}</StatNumber>
                        <StatHelpText></StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>Commitments</StatLabel>
                        <StatNumber>{providerData.reputation.commitments}</StatNumber>
                        <StatHelpText></StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>Membership</StatLabel>
                        <StatNumber>3 Years</StatNumber>
                        <StatHelpText>Since {providerData.registrationDate.toLocaleString()}</StatHelpText>
                    </Stat>
                </StatGroup>
            </VStack>
            <VStack align="stretch" marginY={5}>
                <Heading as="h2" size="md" id="storage-history">Storage History</Heading>
                <Box border="1px" borderColor="gray" borderRadius="md">
                    {providerData.storageDeals ? (
                        <StorageDealHistory
                            userAddress={address}
                            userType={UserType.PROVIDER}
                            dealAddresses={providerData.storageDeals}
                        />
                    ) : (
                        <Text fontSize="sm">No participation in any storage deals.</Text>
                    )}
                </Box>
            </VStack>
        </GridItem>
    );
};

export { RegistrationForm, Profile };