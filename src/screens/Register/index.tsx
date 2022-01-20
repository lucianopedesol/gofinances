import React, { useState } from "react";
import {
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { InputForm } from "../../components/Forms/InputForm";
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

interface IFormData {
    [name: string]: any;
}

const schema = yup.object({
    name: yup
        .string()
        .required('Nome é obrigatório'),

    amount: yup
        .number()
        .typeError('Informe um valor numérico')
        .positive('Valor não pode ser negativo')
        .required('Valor é obrigatório'),

}).required();


export function Register() {
    const [transactionsType, setTransactionsType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
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

    function handleRegister(form: IFormData) {
        if (!transactionsType) {
            return Alert.alert('Selecione o tipo da transação');
        }

        if (category.key === 'category') {
            return Alert.alert('Selecione o tipo de categoria');
        }

        const data = {
            name: form.name,
            amount: form.amount,
            transactionsType,
            category: category.key
        }
        console.log(data)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container >
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />
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
                    <Button
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>
                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategory}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}

