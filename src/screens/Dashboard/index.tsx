
import React, { useCallback, useEffect, useState } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Alert } from 'react-native';
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
import { useAuth } from "../../hooks/auth";


export interface IHighlightProps {
    amount: string
    lastTransactions: string;
}
export interface IHighlightData {
    entries: IHighlightProps;
    expensive: IHighlightProps;
    total: IHighlightProps
}

export function Dashboard() {
    const [transactions, setTransactions] = useState<ITransactionCardProps[]>();
    const [highlightData, setHighlightData] = useState<IHighlightData>({} as IHighlightData);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const theme = useTheme();
    const { signOut, user } = useAuth();

    function getLastTransactionTypeDate(
        collection: ITransactionCardProps[],
        type: 'positive' | 'negative'
    ) {

        const collectionFilttered = collection
            .filter(transaction => transaction.type === type);

        if (collectionFilttered.length === 0) {
            return 0;
        }
        const lastTransaction =
            new Date(Math.max.apply(Math, collection
                .filter(transaction => transaction.type === type)
                .map(transaction => new Date(transaction.date).getTime())));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
    }

    function getLastTransactionDate(
        collection: ITransactionCardProps[]
    ) {
        if (collection.length === 0) {
            return 0;
        }
        const lastTransaction =
            new Date(Math.max.apply(Math, collection
                .map(transaction => new Date(transaction.date).getTime())));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
    }

    async function loadTransactions() {

        try {
            const dataKey = `@gofinances:transactions_user:${user?.id}`;
            const response = await AsyncStorage.getItem(dataKey);
            const transactions = response ? JSON.parse(response) : null;
            let entriesTotal = 0;
            let expensiveTotal = 0;
            let total = 0;

            if (transactions) {
                const transactionsFormated: ITransactionCardProps[] = transactions
                    .map((item: ITransactionCardProps) => {
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

                setTransactions(transactionsFormated);
                const lastTransactionsEntries = getLastTransactionTypeDate(transactions, 'positive');
                const lastTransactionsExpensives = getLastTransactionTypeDate(transactions, 'negative');
                const lastTransaction = getLastTransactionDate(transactions);

                const totalInterval = `01 à ${lastTransaction}`

                total = entriesTotal - expensiveTotal;
                setHighlightData({
                    entries: {
                        amount: entriesTotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }),
                        lastTransactions: lastTransactionsEntries === 0 ?
                            'Não há transações'
                            : `Última entrada dia ${lastTransactionsEntries}`
                    },
                    expensive: {
                        amount: expensiveTotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }),
                        lastTransactions: lastTransactionsExpensives === 0 ?
                            'Não há transações'
                            : `Última saída dia ${lastTransactionsExpensives}`
                    },
                    total: {
                        amount: total.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }),
                        lastTransactions: lastTransaction === 0 ?
                            'Não há transações'
                            : totalInterval
                    }
                })

            } else {
                const initialValue = {
                    amount: 'R$ 0,00',
                    lastTransactions: 'Não há transações'
                };
                setHighlightData({
                    entries: initialValue,
                    expensive: initialValue,
                    total: initialValue
                });
            }
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
        }
    }

    function handleConfirmDelete(data: ITransactionCardProps) {
        Alert.alert(
            'Atenção!',
            `Deseja confirmar a exclusão?\n
                Nome: ${data.name} \n
                Valor: ${data.amount}
            `,
            [
                {
                    text: 'Cancelar',
                    onPress: () => { console.log('Cancelar') },
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => { handleDelete(data.id) }
                }
            ]
        )
    }

    async function handleDelete(id: string) {
        try {
            const dataKey = `@gofinances:transactions_user:${user?.id}`;
            const response = await AsyncStorage.getItem(dataKey);
            const transactions: ITransactionCardProps[] = response ? JSON.parse(response) : null;
            const newListTransactions = transactions.filter(transaction => transaction.id !== id);
            await AsyncStorage.setItem(dataKey, JSON.stringify(newListTransactions));
            await loadTransactions();
        } catch (error) {
            console.log(error);
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
                                <Photo source={{ uri: user?.photo }} />
                                <User>
                                    <UserGreeting>Olá, </UserGreeting>
                                    <UserName>{user?.name}</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={signOut}>
                                <Icon name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards >
                        <HighlightCard
                            type={"up"}
                            title={"Entradas"}
                            amount={highlightData?.entries?.amount}
                            lastTransaction={highlightData?.entries?.lastTransactions}
                        />
                        <HighlightCard
                            type={"down"}
                            title={"Saidas"}
                            amount={highlightData?.expensive?.amount}
                            lastTransaction={highlightData?.expensive?.lastTransactions}
                        />
                        <HighlightCard
                            type={"total"}
                            title={"Total"}
                            amount={highlightData?.total?.amount}
                            lastTransaction={highlightData?.total?.lastTransactions}
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>
                        <TransactionList
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) =>
                                <TransactionCard
                                    data={item}
                                    handleConfirmDelete={handleConfirmDelete}
                                />
                            }
                        />

                    </Transactions>
                </>
            }
        </Container>
    )
}

