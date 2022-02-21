
import React, { useCallback, useEffect, useState } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, ITransactionCardProps } from "../../components/TransactionCard";
import { useTheme } from 'styled-components';
import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer

} from "./styles";

export interface IDataListProps extends ITransactionCardProps {
    id: string;
}
export interface IHighlightProps {
    amount: string
}
export interface IHighlightData {
    entries: IHighlightProps;
    expensive: IHighlightProps;
    total: IHighlightProps
}

export function Dashboard() {
    const [transactions, setTransactions] = useState<IDataListProps[]>();
    const [highlightData, setHighlightData] = useState<IHighlightData>({} as IHighlightData);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const theme = useTheme();


    async function loadTransactions() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : null;

        let entriesTotal = 0;
        let expensiveTotal = 0;


        if (transactions) {
            const transactionsFormated: IDataListProps[] = transactions
                .map((item: IDataListProps) => {
                    if (item.type === 'positive') {
                        entriesTotal += Number(item.amount);
                    } else {
                        expensiveTotal += Number(item.amount);
                    }
                    const amount = Number(item.amount)
                        .toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        });

                    const date = Intl.DateTimeFormat('pr-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                    }).format(new Date(item.date));

                    return {
                        id: item.id,
                        name: item.name,
                        type: item.type,
                        category: item.category,
                        amount,
                        date,
                    }

                });

            const total = entriesTotal - expensiveTotal;

            setHighlightData({
                entries: {
                    amount: entriesTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                },
                expensive: {
                    amount: expensiveTotal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                },
                total: {
                    amount: total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }),
                }
            })

            setTransactions(transactionsFormated);
            setIsLoading(false);
        }

    }

    useEffect(() => {
        loadTransactions();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));




    return (
        <Container >

            {isLoading ?
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size='large'
                    />
                </LoadContainer>
                :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/60025358?v=4' }} />
                                <User>
                                    <UserGreeting>Olá, </UserGreeting>
                                    <UserName>Luciano</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={() => { }}>
                                <Icon name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards >
                        <HighlightCard
                            type={"up"}
                            title={"Entradas"}
                            amount={highlightData?.entries?.amount}
                            lastTransaction={"Última entrada dia 13 de abril"}
                        />
                        <HighlightCard
                            type={"down"}
                            title={"Saidas"}
                            amount={highlightData?.expensive?.amount}
                            lastTransaction={"Última entrada dia 13 de abril"}
                        />
                        <HighlightCard
                            type={"total"}
                            title={"Total"}
                            amount={highlightData?.total?.amount}
                            lastTransaction={"Última entrada dia 13 de abril"}
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>
                        <TransactionList
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} />}
                        />

                    </Transactions>
                </>
            }
        </Container>
    )
}

