import { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import { TextInput } from 'react-native-gesture-handler';


export default function Login(){

    async function atualizaDB(){
        const instance = axios.create({
            baseURL: 'http://localhost:3333/',
            timeout: 1000,
            headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWZmNDYxNzgyZTJmZTBlY2JlYWU5YiIsImlhdCI6MTY1NDY0OTk1MywiZXhwIjoxNjU0NzM2MzUzfQ.kDm1aVppgdgGL3sWO-lohVHALcV-FpxUwDZg68LD0wA'}
          });
          
          instance.get('/projects')
          .then(response => {
              console.log(response.data)
          })
    }

    const navigation = useNavigation();

    const [load, setLoad] = useState(false)
    const [title, setTitle] = useState('');

    useEffect(() => {
        atualizaDB()
        navigation.addListener('focus', () => setLoad(!load))
    }, [load, navigation]);

    const openHome = (item: any) => {
        navigation.navigate("Home", item)

    }


    return(
        <View style={styles.container}>
            <Text>Teste 1</Text>
            <TouchableOpacity onPress={() => openHome(' dados carregados da tela de login' + title)}><Text>ir para teste 1</Text></TouchableOpacity>
            <TextInput
                style={styles.inputText}
                value={title}
                placeholder="E-mail"
                placeholderTextColor="#000"
                maxLength={100}
                onChangeText={(text) => setTitle(text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputText: {
        width: "90%",
        height: "70%",
        backgroundColor: 'white',
        margin: 8,
        borderRadius: 10,
        padding: 10,

    }
  });