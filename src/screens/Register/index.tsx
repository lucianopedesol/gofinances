import React, { useEffect, useState } from "react";
import {
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import AsyncStorage from '@react-native-async-storage/async-storage'

import { InputForm } from "../../components/Forms/InputForm";
import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
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
import { useAuth } from "../../hooks/auth";

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
    const { user } = useAuth();

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionsTypeSelect(type: 'positive' | 'negative') {
        setTransactionsType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategory() {
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: IFormData) {
        if (!transactionsType) {
            return Alert.alert('Selecione o tipo da transação');
        }

        if (category.key === 'category') {
            return Alert.alert('Selecione o tipo de categoria');
        }

        const newTransacion = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionsType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = `@gofinances:transactions_user:${user?.id}`;

            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransacion
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
            reset();
            setTransactionsType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            })

            navigation.navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível salvar.')
        }
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
                                onPress={() => handleTransactionsTypeSelect('positive')}
                                isActive={transactionsType === 'positive'}
                            />
                            <TransactionTypeButton
                                title="Outcome"
                                type="down"
                                onPress={() => handleTransactionsTypeSelect('negative')}
                                isActive={transactionsType === 'negative'}
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

