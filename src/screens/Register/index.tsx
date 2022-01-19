import React, { useState } from "react";
import { Modal } from "react-native";
import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { Input } from "../../components/Forms/Input";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsType,
} from "./styles";


export function Register() {
    const [transactionsType, setTransactionsType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    function handleTransactionsTypeSelect(type: 'up' | 'down') {
        setTransactionsType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategory() {
        setCategoryModalOpen(false);
    }

    return (
        <Container >
            <Header>
                <Title>Cadastro</Title>
            </Header>
            <Form>
                <Fields>
                    <Input placeholder="Nome" />
                    <Input placeholder="Preço" />
                    <TransactionsType>
                        <TransactionTypeButton
                            title="Income"
                            type="up"
                            onPress={() => handleTransactionsTypeSelect('up')}
                            isActive={transactionsType === 'up'}
                        />
                        <TransactionTypeButton
                            title="Outcome"
                            type="down"
                            onPress={() => handleTransactionsTypeSelect('down')}
                            isActive={transactionsType === 'down'}
                        />
                    </TransactionsType>
                    <CategorySelectButton
                        title={category.name}
                        onPress={handleOpenSelectCategoryModal}
                    />
                </Fields>
                <Button title="Enviar" />
            </Form>
            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategory}
                />
            </Modal>
        </Container>
    )
}

