import * as React from "react";
import { useEffect, useState } from "react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
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
import {DateTime} from "luxon";

interface RequestFormInputs {
    startDate: { value: string };
    endDate: { value: string };
    files: { files: FileList };
}

const RequestForm = () => {
    const navigate = useNavigate();
    const { address, connector, isConnected } = useAccount();

    const [isDurationError, setIsDurationError] = useState(false);
    const [isFilesError, setIsFilesError] = useState(false);
    const [isSubmissionError, setIsSubmissionError] = useState(false);

    const checkInvalidRange = (start: string, end: string) => {
        return (
            start === undefined || start === ""
            || end === undefined || end === ""
            || DateTime.fromISO(start) >= DateTime.fromISO(end)
            || DateTime.fromISO(end) <= DateTime.utc()
        );
    }

    const requestStorage = async (event: React.FormEvent) => {
        try {
            event.preventDefault();

            const {
                startDate: { value: startDate },
                endDate: { value: endDate },
                files: { files: files },
            } = event.target as typeof event.target & RequestFormInputs;

            setIsDurationError(false);
            setIsFilesError(false);
            setIsSubmissionError(false);

            if (address === undefined) {
                return;
            } else if (checkInvalidRange(startDate, endDate)) {
                setIsDurationError(true);
            } else if (files === undefined || files === null || files.length === 0) {
                setIsFilesError(true);
            } else {
                console.log("address:", address);
                console.log("start:", startDate);
                console.log("end:", endDate);
                const fileName = files[0].name
                console.log("userData:", fileName)
                const isProcessed = await portalApi.requestStorage(address, new Date(startDate), new Date(endDate), files);
                if (!isProcessed) {
                    setIsSubmissionError(true);
                } else {
                    navigate("/requester-profile");
                }
            }
        } catch (error) {
            setIsSubmissionError(true);
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
                            {address === undefined && (
                                <FormHelperText>Click <i>Connect Wallet</i> in the top right.</FormHelperText>
                            )}
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Start Time</FormLabel>
                            <Input name="startDate" type="date" />
                        </FormControl>
                        <FormControl isRequired isInvalid={isDurationError}>
                            <FormLabel>End Time</FormLabel>
                            <Input name="endDate" type="date" />
                            <FormErrorMessage>Please specify a valid start and end date range.</FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired isInvalid={isFilesError}>
                            <FormLabel>Data Upload</FormLabel>
                            <Input name="files" type="file" />
                            <FormErrorMessage>Please upload a valid data file.</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={isSubmissionError}>
                            <Button type="submit">Submit</Button>
                            <FormErrorMessage>
                                Sorry, we were unable to process your storage request and are looking into the issue.
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
                <Flex direction="column" height="full" justify="center" align="center">
                    <Spinner size="xl" speed="05s" thickness="5px" />
                    <Text>Loading profile...</Text>
                </Flex>
            </GridItem>
        );
    }
    return (
        <GridItem colStart={2} colEnd={12} textAlign="left">
            <Box marginY={5}>
                <Heading size="md">Requester Profile</Heading>
            </Box>
            <Box marginY={5}>
                <Button as={RouterLink} to="/storage-request">Request Storage</Button>
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