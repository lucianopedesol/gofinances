import React from "react";
import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, ITransactionCardProps } from "../../components/TransactionCard";

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
    LogoutButton

} from "./styles";

export interface IDataListProps extends ITransactionCardProps {
    id: string;
}

export function Dashboard() {

    const data: IDataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: "Vendas",
                icon: "dollar-sign"
            },
            date: "13/04/2020"
        },
        {
            id: '2',
            type: 'negative',
            title: "Pizza",
            amount: "R$ 59,90",
            category: {
                name: "Alimentação",
                icon: "coffee"
            },
            date: "10/04/2020"
        },
        {
            id: '3',
            type: 'negative',
            title: "Aluguel Apartamento",
            amount: "R$ 1.200,00",
            category: {
                name: "Casa",
                icon: "shopping-bag"
            },
            date: "10/04/2020"
        },

    ];


    return (
        <Container >
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
                    amount={"R$ 17.400,00"}
                    lastTransaction={"Última entrada dia 13 de abril"}
                />
                <HighlightCard
                    type={"down"}
                    title={"Saidas"}
                    amount={"R$ 1.259,00"}
                    lastTransaction={"Última entrada dia 13 de abril"}
                />
                <HighlightCard
                    type={"total"}
                    title={"Total"}
                    amount={"R$ 16.141,00"}
                    lastTransaction={"Última entrada dia 13 de abril"}
                />
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>
                <TransactionList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

            </Transactions>
        </Container>
    )
}

