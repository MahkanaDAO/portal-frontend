import * as React from "react";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Image,
    Link,
    Progress,
    Spacer, Spinner,
    Stat,
    StatGroup,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    VStack,
} from "@chakra-ui/react";

import { StorageDeal as DealData } from "./types";
import { portalApi } from "./portal-api";

interface StorageDealProps {
    contractAddress: string;
}

export const StorageDeal = ({ contractAddress }: StorageDealProps) => {
    const [dealData, setDealData] = useState<DealData>();
    const [dealProgress, setDealProgress] = useState(0);

    useEffect(() => {
        portalApi.getStorageDeal(contractAddress).then((data) => {
            setDealData(data);
            const now = new Date();
            // const progress = Math.round(
            //     (data.endDate.getMilliseconds() - data.startDate.getMilliseconds())
            //     / (now.getMilliseconds() - data.startDate.getMilliseconds())
            // );
            const progress = 75;
            setDealProgress(progress);
        });
    }, [contractAddress]);

    const shortenAddress = (address: string) => {
        return `${address.slice(4)}...${address.slice(-4)}`;
    }


    if (dealData === undefined) {
        return (
            <Box justifySelf="center">
                <Spinner size="xl" speed="0.5s" thickness="5px" />
                <Text>Loading deal...</Text>
            </Box>
        );
    }
    return (
        <VStack spacing={5} align="left">
            <StatGroup>
                <Stat>
                    <StatLabel>Contract Address</StatLabel>
                    <StatNumber>{shortenAddress(contractAddress)}</StatNumber>
                    <StatHelpText>
                        <Link>See on Filfox</Link>
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel>Storage Requester</StatLabel>
                    <StatNumber>{shortenAddress(dealData.requester)}</StatNumber>
                    <StatHelpText></StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel>Deal Status</StatLabel>
                    <StatNumber>{dealData.status}</StatNumber>
                    <StatHelpText></StatHelpText>
                </Stat>
            </StatGroup>
            <StatGroup>
                <Stat>
                    <StatLabel>Start Date</StatLabel>
                    <StatNumber>{dealData.startDate.toDateString()}</StatNumber>
                    <StatHelpText></StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel>End Date</StatLabel>
                    <StatNumber>{dealData.endDate.toDateString()}</StatNumber>
                    <StatHelpText></StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel>Duration</StatLabel>
                    <StatNumber>{60} Days</StatNumber>
                    <StatHelpText>{45} Days remaining</StatHelpText>
                </Stat>
            </StatGroup>
            <Box>
                <Progress value={dealProgress}></Progress>
            </Box>
            <StatGroup>
                <Stat>
                    <StatLabel>Sectors</StatLabel>
                    <StatNumber>{dealData.sectors}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Providers</StatLabel>
                    <StatNumber>{dealData.providers.length}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Restrictions</StatLabel>
                    <StatNumber>None</StatNumber>
                </Stat>
            </StatGroup>
        </VStack>
    );
};