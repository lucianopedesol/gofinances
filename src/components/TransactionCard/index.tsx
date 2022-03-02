import React from "react";
import { categories } from "../../utils/categories";

import {
    Container,
    CardHeader,
    Title,
    ButtonDelete,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date
} from "./styles";


export interface ITransactionCardProps {
    id: string;
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}



export interface IProps {
    data: ITransactionCardProps;
    handleConfirmDelete(data: ITransactionCardProps): void;
}
export function TransactionCard({
    data,
    handleConfirmDelete
}: IProps) {
    const [category] = categories.filter(
        item => item.key === data.category
    );


    return (
        <Container>
            <CardHeader>
                <Title>{data.name}</Title>
                <ButtonDelete onPress={() => handleConfirmDelete(data)} >
                    <Icon name='delete' />
                </ButtonDelete>
            </CardHeader>

            <Amount type={data.type}>
                {data.type === 'negative' && '- '}
                {data.amount}
            </Amount>

            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    );
}

