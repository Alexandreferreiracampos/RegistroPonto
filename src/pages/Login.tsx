import { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import { TextInput } from 'react-native-gesture-handler';


export default function Login(){

    const [load, setLoad] = useState(false)
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    async function atualizaDB(){
        const instance = axios.create({
            baseURL: 'http://172.16.88.123:3333/',
            timeout: 1000,
            headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTA5MmJlNzM1YjA4YzdkNDc0ODRmYiIsImlhdCI6MTY1NDY5MDY3NywiZXhwIjoxNjU0Nzc3MDc3fQ.ZzlWPyo0lMdKzcI-ujYLRv4aPJqwBt3ygluzIA79AQM'}
          });
          
          instance.post('projects/dot_beat')
          .then(response => {
              console.log(response.data)
          })
    }

    const Auth = async()=>{
    
       await axios.post('http://172.16.88.123:3333/auth/authenticate', 
        {
            "email":mail,
            "password":password
        }).then(response => {
            console.log(response.data.token)
        })
    }

    const navigation = useNavigation();

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
            <TouchableOpacity onPress={() => atualizaDB()}><Text>Login</Text></TouchableOpacity>
            <TextInput
                style={styles.inputText}
                value={mail}
                placeholder="E-mail"
                placeholderTextColor="#000"
                maxLength={100}
                onChangeText={(text) => setMail(text)}
            />
            <TextInput
                style={styles.inputText}
                value={password}
                placeholder="Password"
                placeholderTextColor="#000"
                maxLength={100}
                onChangeText={(text) => setPassword(text)}
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
        width: 300,
        height: 50,
        backgroundColor: 'red',
        margin: 8,
        borderRadius: 10,
        padding: 10,

    }
  });