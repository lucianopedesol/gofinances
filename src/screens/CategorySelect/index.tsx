import React from "react";
import { FlatList } from "react-native";

import { Button } from "../../components/Forms/Button";
import { categories } from "../../utils/categories";

import {
    Container,
    Header,
    Title,
    Category,
    Icon,
    Name,
    Separator,
    Footer,
} from "./styles";

interface ICategory {
    key: string;
    name: string;
}

interface IProps {
    category: ICategory;
    setCategory: (category: ICategory) => void;
    closeSelectCategory: () => void;
}
export function CategorySelect({
    category,
    setCategory,
    closeSelectCategory,
}: IProps) {

    function handleCategorySelect(item: ICategory) {
        setCategory(item)
    }
    return (
        <Container >
            <Header>
                <Title>Categoria</Title>
            </Header>

            <FlatList
                data={categories}
                style={{ flex: 1, width: '100%' }}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <Category
                        onPress={() => handleCategorySelect(item)}
                        isActive={category.key === item.key}
                    >
                        <Icon name={item.icon} />
                        <Name>{item.name}</Name>
                    </Category>
                )}
                ItemSeparatorComponent={() => <Separator />}
            />

            <Footer>
                <Button
                    title="Selecionar"
                    onPress={closeSelectCategory}
                />
            </Footer>
        </Container>
    )
}

