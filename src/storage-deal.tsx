import * as React from "react";
import {useEffect, useState} from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Flex,
    HStack,
    Link,
    Progress,
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

import {StorageDeal as DealData, DealStatus, UserType} from "./types";
import {portalApi} from "./portal-api";

interface StorageDealProps {
    userAddress: string;
    userType: UserType;
    dealAddress: string;
}

interface StorageDealHistoryProps {
    userAddress: string;
    userType: UserType;
    dealAddresses: string[];
}

interface DynamicAccordionButtonProps {
    isExpanded: boolean;
    dealAddress: string;
    deal: DealData;
}

const shortenAddress = (address: string, size = 4) => {
    return `${address.slice(0, size)}...${address.slice(-size)}`;
}

const DynamicAccordionButton = ({ isExpanded, dealAddress, deal }: DynamicAccordionButtonProps) => {
    return isExpanded ? (
        <AccordionButton>
            <Flex flex="1" justify="right">
                <AccordionIcon />
            </Flex>
        </AccordionButton>
    ) : (
        <AccordionButton>
            <Flex flex="1">
                <Text>{shortenAddress(dealAddress, 8)}</Text>
                <Spacer />
                {deal.status !== DealStatus.PENDING && (
                    <>
                        <Text>{deal.startDate.toDateString()}</Text>
                        <Spacer />
                    </>
                )}
                <HStack spacing={2.5}>
                    <Text>{deal.status}</Text>
                    <AccordionIcon />
                </HStack>
            </Flex>
        </AccordionButton>
    );
};

const StorageDeal = ({ dealAddress, userAddress, userType }: StorageDealProps) => {
    const [deal, setDeal] = useState<DealData>();
    const [dealProgress, setDealProgress] = useState(0);

    useEffect(() => {
        portalApi.getStorageDeal(dealAddress)
            .then((deal) => {
                setDeal(deal);
                const now = (new Date()).valueOf();
                const start = deal.startDate.valueOf();
                const end = deal.endDate.valueOf();
                const progress = Math.round(100 * (now - start) / (end - start));
                console.log("num:", now - start, "den:", end - start, "progress:", progress);
                setDealProgress(progress);
            });
    }, [dealAddress])

    if (deal === undefined) {
        return (<></>);
    }

    return (
        <AccordionItem>
            {({ isExpanded }) => (
                <>
                    <DynamicAccordionButton isExpanded={isExpanded} dealAddress={dealAddress} deal={deal} />
                    <AccordionPanel>
                        <VStack spacing={5} align="left">
                            <StatGroup>
                                <Stat>
                                    <StatLabel>Contract Address</StatLabel>
                                    <StatNumber>{shortenAddress(userAddress)}</StatNumber>
                                    <StatHelpText>
                                        <Link>See on Filfox</Link>
                                    </StatHelpText>
                                </Stat>
                                <Stat>
                                    <StatLabel>Storage Requester</StatLabel>
                                    <StatNumber>{shortenAddress(deal.requester)}</StatNumber>
                                    <StatHelpText></StatHelpText>
                                </Stat>
                                <Stat>
                                    <StatLabel>Deal Status</StatLabel>
                                    <StatNumber>{deal.status}</StatNumber>
                                    <StatHelpText></StatHelpText>
                                </Stat>
                            </StatGroup>
                            <StatGroup>
                                <Stat>
                                    <StatLabel>Start Date</StatLabel>
                                    <StatNumber>{deal.startDate.toDateString()}</StatNumber>
                                    <StatHelpText></StatHelpText>
                                </Stat>
                                <Stat>
                                    <StatLabel>End Date</StatLabel>
                                    <StatNumber>{deal.endDate.toDateString()}</StatNumber>
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
                                    <StatNumber>{deal.sectors}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Providers</StatLabel>
                                    <StatNumber>{deal.providers.length}</StatNumber>
                                </Stat>
                                <Stat>
                                    <StatLabel>Restrictions</StatLabel>
                                    <StatNumber>None</StatNumber>
                                </Stat>
                            </StatGroup>
                            <Box>
                                {userType === UserType.PROVIDER && deal.status !== DealStatus.COMPLETE && (
                                    <Button>Download Sectors</Button>
                                )}
                                {userType === UserType.REQUESTER && deal.status === DealStatus.PENDING && (
                                    <Button>Start Deal</Button>
                                )}
                                {userType === UserType.REQUESTER && deal.status === DealStatus.ACTIVE && (
                                    <Button>End Deal</Button>
                                )}
                            </Box>
                        </VStack>
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
}

export const StorageDealHistory = ({ userAddress, userType, dealAddresses }: StorageDealHistoryProps) => {
    if (dealAddresses === undefined) {
        return (
            <Box justifySelf="center">
                <Spinner size="xl" speed="0.5s" thickness="5px" />
                <Text>Loading history...</Text>
            </Box>
        );
    }
    return (
        <Accordion defaultIndex={[0]} allowMultiple>
            {dealAddresses.map((dealAddress) => (
                <StorageDeal dealAddress={dealAddress} userAddress={userAddress} userType={userType} />
            ))}
        </Accordion>
    );
};