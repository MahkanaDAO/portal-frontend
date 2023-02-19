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
import {DateTime, Duration, DurationLikeObject, Interval} from "luxon";

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
                        <Text>{deal.startDate.toLocaleString()}</Text>
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
    const [totalDuration, setTotalDuration] = useState<Duration>();
    const [remainingDuration, setRemainingDuration] = useState<Duration>();

    const toNumber = (duration: Duration | undefined, unit: keyof DurationLikeObject = "days") => {
        return duration === undefined ? 0 : Math.round(duration.as(unit));
    }

    useEffect(() => {
        portalApi.getStorageDeal(dealAddress)
            .then((deal) => {
                setDeal(deal);

                const { startDate: start, endDate: end } = deal;
                const now = DateTime.utc();
                const total = Interval.fromDateTimes(start, end).toDuration();
                const elapsed = Interval.fromDateTimes(start, now).toDuration();

                setTotalDuration(total);
                setRemainingDuration(total.minus(elapsed));
                const progress = Math.round(100 * toNumber(elapsed) / toNumber(total));
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
                                    <StatNumber>{deal.startDate.toLocaleString()}</StatNumber>
                                    <StatHelpText></StatHelpText>
                                </Stat>
                                <Stat>
                                    <StatLabel>End Date</StatLabel>
                                    <StatNumber>{deal.endDate.toLocaleString()}</StatNumber>
                                    <StatHelpText></StatHelpText>
                                </Stat>
                                <Stat>
                                    <StatLabel>Duration</StatLabel>
                                    <StatNumber>{totalDuration && `${toNumber(totalDuration)} Days`}</StatNumber>
                                    <StatHelpText>{remainingDuration && `${toNumber(remainingDuration)} Days remaining`}</StatHelpText>
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
            <Flex direction="column" height="full" justify="center" align="center">
                <Spinner size="xl" speed="0.5s" thickness="5px" />
                <Text>Loading history...</Text>
            </Flex>
        );
    }
    return (
        <Accordion defaultIndex={[0]} allowMultiple>
            {dealAddresses.map((dealAddress, idx) => (
                <StorageDeal key={idx} dealAddress={dealAddress} userAddress={userAddress} userType={userType} />
            ))}
        </Accordion>
    );
};