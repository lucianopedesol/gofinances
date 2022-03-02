import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';

import { HistoryCard } from "../../components/HistoryCard";
import {
    Container,
    Header,
    Title,
    ChartContainer,
    Content,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer,
    IconFilter,
    TextButton,
    ContainerFilter
} from "./styles";

import { categories } from "../../utils/categories";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";
import { Icon } from "../Dashboard/styles";


interface ITransactionData {
    id: string;
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}
interface ICategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    percent: string;
    color: string;
}
interface IProps {
}
export function Resume({

}: IProps) {
    const filter = useRef<'negative' | 'positive'>('negative')

    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<ICategoryData[]>([]);
    const { user } = useAuth();
    const theme = useTheme();
    function handleChangeData(action: 'next' | 'prev') {
        const newDate = action === 'next' ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1);
        setSelectedDate(newDate);

    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = `@gofinances:transactions_user:${user?.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        let responseFormatted = response ? JSON.parse(response) : null;
        // responseFormatted = [...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted,...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted,...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted,...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted, ...responseFormatted,]
        
        if (responseFormatted) {
            const registers = responseFormatted
                .filter((expensive: ITransactionData) =>
                    expensive?.type === filter.current &&
                    new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                    new Date(expensive.date).getFullYear() === selectedDate.getFullYear());

            const registersTotal = registers
                .reduce((acumullator: number, expensive: ITransactionData) => {
                    return acumullator + Number(expensive.amount);
                }, 0);


            const totalByCategory: ICategoryData[] = [];

            categories.forEach(category => {
                let categorySum = 0;
                registers.forEach((register: ITransactionData) => {
                    if (register.category === category.key) {
                        categorySum += Number(register.amount);
                    }
                });

                if (categorySum > 0) {
                    const total = categorySum.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    });

                    const percent = `${(categorySum / registersTotal * 100).toFixed(0)}%`;

                    totalByCategory.push({
                        key: category.key,
                        name: category.name,
                        total: categorySum,
                        totalFormatted: total,
                        percent,
                        color: category.color
                    });
                }
            });
            setTotalByCategories(totalByCategory);
        }

        setIsLoading(false);
    }

    function handleFilter() {
        filter.current = filter.current === 'negative' ? 'positive' : 'negative';
        loadData();
    }

    function translatedText() {
        return filter.current === 'negative' ? 'Saídas' : 'Entradas';
    }
    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));


    const icon = {
        positive: "arrow-up-circle",
        negative: "arrow-down-circle",

    }
    return (
        <Container >

            <Header>
                <Title>Resumo por categoria </Title>

            </Header>

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight(),
                }}

            >
                <MonthSelect>
                    <MonthSelectButton onPress={() => handleChangeData('prev')}>
                        <MonthSelectIcon name="chevron-left" />
                    </MonthSelectButton>

                    <Month>{format(selectedDate, 'MMMM , yyyy', { locale: ptBR })}</Month>

                    <MonthSelectButton onPress={() => handleChangeData('next')}>
                        <MonthSelectIcon name="chevron-right" />
                    </MonthSelectButton>
                </MonthSelect>

                <ChartContainer>
                    <VictoryPie
                        data={totalByCategories.length > 0 ? totalByCategories : [{ total: "0", percent: '0%' }]}
                        colorScale={totalByCategories.length > 0 ? totalByCategories.map(category => category.color) : ['gray']}
                        style={{
                            labels: {
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape
                            },

                        }}
                        cornerRadius={({ datum }) => 5}
                        labelRadius={50}
                        x="percent"
                        y="total"
                    />
                </ChartContainer>

                <ContainerFilter onPress={handleFilter}>
                    <TextButton
                        type={filter.current}
                    >
                        {translatedText()}
                    </TextButton>
                    <IconFilter
                        name={icon[filter.current]}
                        type={filter.current}
                    ></IconFilter>
                </ContainerFilter>

                {
                    isLoading ?
                        <LoadContainer>
                            <ActivityIndicator
                                color={theme.colors.primary}
                                size='large'
                            />
                        </LoadContainer>
                        :
                        (
                            totalByCategories.map((item) =>
                                <HistoryCard key={item.key}
                                    title={item?.name}
                                    amount={item?.totalFormatted}
                                    color={item?.color}
                                />
                            )
                        )}

            </Content>

        </Container>
    )
}

