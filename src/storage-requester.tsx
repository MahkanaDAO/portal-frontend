import * as React from "react";
import { useEffect, useState } from "react";
import {
    Box,
    Divider,
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
    Text,
    VStack,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { portalApi } from "./portal-api";
import { StorageDeal } from "./storage-deal";

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
                        <Input type="submit" />
                    </FormControl>
                </VStack>
            </form>
        </GridItem>
    );
};

const Profile = () => {
    const { address } = useAccount();
    const [storageDealAddresses, setStorageDealAddresses] = useState([]);

    useEffect(() => {
        if (address) {
            portalApi.getRequesterData(address).then((data) => {
                setStorageDealAddresses(data.storageDeals);
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
    return (
        <GridItem colStart={2} colEnd={6} textAlign="left">
            <Box marginY={5}>
                <Heading size="md">Requester Profile</Heading>
            </Box>
            <VStack align="left" spacing={5}>
                {storageDealAddresses.map((address) => {
                    return (
                        <>
                            <Divider />
                            <StorageDeal contractAddress={address} />
                        </>
                    );
                })}
            </VStack>
        </GridItem>
    );
};

export { RequestForm, Profile };