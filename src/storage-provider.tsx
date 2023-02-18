import * as React from "react"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Divider,
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

import {providerStorageSizeOptions} from "./constants";
import {ProviderData, UserType} from "./types";
import {portalApi} from "./portal-api";
import {StorageDealHistory} from "./storage-deal";

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
            <Divider />
            <Box marginY={5}>
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
                            <Button type="submit">Submit</Button>
                        </FormControl>
                    </VStack>
                </form>
            </Box>
        </GridItem>
    );
};

const Profile = () => {
    const { address, connector, isConnected } = useAccount();
    const navigate = useNavigate();

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
                <Box>
                    <Spinner size="xl" speed="0.5s" thickness="5px" />
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
                <Heading size="md">Provider Profile</Heading>
            </Box>
            <Divider />
            <VStack align="left" marginY={5}>
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
                        <StatHelpText>Since {providerData.registrationDate.toDateString()}</StatHelpText>
                    </Stat>
                </StatGroup>
            </VStack>
            <VStack align="left" marginY={5}>
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