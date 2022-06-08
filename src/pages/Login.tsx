import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Login() {

    const navigation = useNavigation();

    const [load, setLoad] = useState(false)
    const [loadData, setLoadData] = useState(false)
    const [id, setId] = useState('')
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVivible, setPasswordVisible] = useState(true);
    const [passworForgot, setPasswordForgot] = useState(true);

    useEffect(()=>{
        readData()  
    },[])

    const readData = async () => {

        try {

            const dataEmail = await AsyncStorage.getItem('@email') || ''
            const dataPassaword = await AsyncStorage.getItem('@password') || ''
            const dataToken = await AsyncStorage.getItem('@token') || ''
            const dataId = await AsyncStorage.getItem('@id') || ''
            setMail(dataEmail)
            setPassword(dataPassaword)
            setId(dataId)
            setLoadData(true)

        } catch (e) {}

    }

    const saveDataLogin= async (id:any, email:any, password1:any, token:any)=>{
        try {
            await AsyncStorage.setItem('@email', email)
            await AsyncStorage.setItem('@password', password1)
            await AsyncStorage.setItem('@token', token)
            await AsyncStorage.setItem('@id', id)

            console.log(email, password1, token)
            if(token != '')
            openHome(id)

        } catch (e) {
            ToastAndroid.showWithGravityAndOffset(
                `Não foi possivel salvar os dados ${e}`,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25, 50)
        }

       }

    const Auth = async () => {
        await axios.post('http://172.16.88.123:3333/auth/authenticate',
            {
                "email": mail,
                "password": password
            }).then(response => {
                console.log(response.data.user._id)
                saveDataLogin(response.data.user._id, response.data.user.email, password, response.data.token)
            }).catch(error => {
                msgToast("Não foi possivel fazer Login")
                saveDataLogin(id, mail, password, '')
            })
    }

    const forgot=()=>{
        setPasswordForgot(false)
    }

    const forgotPassword= async ()=>{



        await axios.post('http://172.16.88.123:3333/auth/forgot_password',
            {
                "email": mail
            }).then(response => {
                console.log(response)
                msgToast("Solicitação enviada com sucesso")
                setPasswordForgot(true)
            }).catch(error => {
                msgToast("Não foi possivel enviar")
            }).finally(() => msgToast("Verifique o Email"))
        
    }
    const msgToast = (value:any) => {
        ToastAndroid.showWithGravity(
            value,
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
    }

    const openHome = (item: any) => {
        navigation.navigate("Home", item)

    }

    const biometric = async (value:any) => {


        const authenticationBiometric = await LocalAuthentication.authenticateAsync({
            promptMessage: "Fazer Login",
            cancelLabel: "Cancelar",
            disableDeviceFallback: false,
        });

        if (authenticationBiometric.success) {
            Auth()
        }

    };

    if(loadData == true && id != ''){
    
        biometric(id) 
        setLoadData(false)
    
   }

    return (
        <View style={styles.container}>

            <View style={styles.containerLogin}>
                <View style={styles.subHeader}>
                    {passworForgot &&
                    <Text style={styles.textButton}>Logon</Text>
                    ||
                    <Text style={styles.textButton}>Reset de senha</Text>
                    }
                    
                </View>
               
            <TextInput
                style={styles.inputText}
                value={mail}
                placeholder="E-mail"
                placeholderTextColor="#000"
                maxLength={100}
                onChangeText={(text) => setMail(text)}
            />
             {passworForgot &&
             <View style={styles.inputPassword}>
             <TextInput
                 value={password}
                 style={{width:"90%"}}
                 placeholder="Password"
                 placeholderTextColor="#000"
                 maxLength={100}
                 secureTextEntry={passwordVivible}
                 onChangeText={(text) => setPassword(text)}
             />
             <TouchableOpacity onPress={()=> setPasswordVisible(!passwordVivible)}>
                 { passwordVivible && <Ionicons name="ios-eye-off" size={24} color='rgb(0,146,228)'/> || <Ionicons name="ios-eye" size={24} color='rgb(0,146,228)'/> }
             </TouchableOpacity>
             
             </View>
             }
            {passworForgot && 
            <TouchableOpacity onPress={() => Auth()}  style={styles.button}><Text style={styles.textButton}>Login</Text></TouchableOpacity> 
            || 
            <TouchableOpacity onPress={() => forgotPassword()}  style={styles.button}><Text style={styles.textButton}>Enviar</Text></TouchableOpacity>
            }
            {passworForgot && 
            <TouchableOpacity onPress={() => forgot()}  ><Text style={{color:'black'}}>Redefinir senha</Text></TouchableOpacity>
            ||
            <TouchableOpacity onPress={() => setPasswordForgot(true)}  ><Text style={{color:'black'}}>Voltar para Login</Text></TouchableOpacity>
            }
            
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(210,210,210)',
        alignItems: 'center',
        justifyContent:'center' 
    },
    containerLogin: {
        width:372,
        height:330,
        backgroundColor: 'rgb(243,243,243)',
        borderTopLeftRadius: 30,
        borderBottomRightRadius:30,
        justifyContent:'center',
        alignItems: 'center',
        shadowColor: "#000",
        elevation: 4,
    },
    subHeader:{
        top:6,
        width:'100%',
        height:'15%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'rgb(0,146,228)',
        shadowColor:'#000',
        elevation:3,
        margin:15
    },
    inputText: {
        width: 300,
        height: 50,
        backgroundColor: 'rgb(220,220,220)',
        margin: 6,
        borderRadius: 10,
        padding: 6,
        shadowColor: "#000",
        elevation: 3,
    },
    inputPassword:{
        width: 300,
        height: 50,
        backgroundColor: 'rgb(220,220,220)',
        margin: 6,
        borderRadius: 10,
        padding: 6,
        shadowColor: "#000",
        elevation: 3,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingEnd:15
    },
    button:{
        width:130,
        height:40,
        marginTop:30,
        margin:15,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'rgb(0,146,228)',
        borderRadius:10,
        shadowColor: "#000",
        elevation: 3,
    },
    textButton:{
        color:'white',
    }
});