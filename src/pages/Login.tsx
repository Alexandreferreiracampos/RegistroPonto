import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import {API_URL} from '../../util';

export default function Login() {


    
  
    const navigation = useNavigation();

    const [load, setLoad] = useState(false)
    const [loadData, setLoadData] = useState(false)
    const [id, setId] = useState('')
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [passworForgot, setPasswordForgot] = useState(true);
    const [passwordVivible, setPasswordVisible] = useState(true);
    const [visibleFinger, setVisibleFinger] = useState(true);
    
    useEffect(() => {
        setPassword('')
        if(id != ''){
            setVisibleFinger(false)
        }
        
        navigation.addListener('focus', () => setLoad(!load))
    }, [load, navigation])

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

    const saveDataLogin= async (id:any, email:any, password1:any, token:any, jsonData:object)=>{
        try {
            await AsyncStorage.setItem('@email', email)
            await AsyncStorage.setItem('@password', password1)
            await AsyncStorage.setItem('@token', token)
            await AsyncStorage.setItem('@id', id)
            if(token != '')
            var StringJson = JSON.stringify(jsonData)

            openHome(StringJson)

        } catch (e) {
            ToastAndroid.showWithGravityAndOffset(
                `Não foi possivel salvar os dados ${e}`,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25, 50)
        }

       }

    const Auth = async (value:any) => {
        if( value == true && password != ""){
            await axios.post(API_URL+'/auth/authenticate',
            {
                "email": mail,
                "password": password
            }).then(response => {
                if(response.status == 200){
                    saveDataLogin(response.data.user._id, response.data.user.email, password, response.data.token, response.data)
                } 
            })
            .catch(function (error) {
                if(error.response.status != 0 && error.response.status != 200){
                    saveDataLogin('', mail, '', '', {})
                }
                if (error.response) {
                    const err = error.response.data.error
                    if(error.response.status == 400){
                        msgToast(err)
                        
                    }
                }else{
                    msgToast("Erro no servidor") 
                }
              });
        }if(value == false && password == ""){
            setPasswordVisible(true)
            readData()
        }else{
            await axios.post(API_URL+'/auth/authenticate',
            {
                "email": mail,
                "password": password
            }).then(response => {
                if(response.status == 200){
                    saveDataLogin(response.data.user._id, response.data.user.email, password, response.data.token, response.data)
                } 
            }).catch(function (error) {
                 
                if (error.response) {
                    const err = error.response.data.error
                    if(error.response.status == 400){
                        msgToast(err)  
                    }
                }else{
                    msgToast("Erro no servidor") 
                }
              });
        }
    }

    const forgot=()=>{
        setPasswordForgot(false)
    }

    const forgotPassword= async ()=>{

        await axios.post(API_URL+'/auth/forgot_password',
            {
                "email": mail
            }).then(response => {
                if(response.status == 200){
                    msgToast("Email enviado para " + mail)  
                }else{
                    msgToast("error") 
                }
            }).catch(function (error) {
                 
                if (error.response) {
                    const err = "E-mail não encontrado"
                    if(error.response.status == 400){
                        msgToast(err)  
                    }else{
                        msgToast("Erro no servidor") 
                    }
                    
                }
              });
    }
    const msgToast = (value:String) => {
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
            Auth(true)
        }else{
            setPassword('')
            setVisibleFinger(false)
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
                 { passwordVivible && <Ionicons name="ios-eye-off" size={24} color='rgb(97,136,215)'/> || <Ionicons name="ios-eye" size={24} color='rgb(97,136,215)'/> }
             </TouchableOpacity>
             
             </View>
             }
            {passworForgot && 
            <TouchableOpacity onPress={() => Auth(visibleFinger && true || false)}  style={styles.button}>{visibleFinger && <Text style={styles.textButton}>Login</Text> || <Entypo name="fingerprint" size={30} color="white" />}</TouchableOpacity> 
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
        backgroundColor: 'rgb(97,136,215)',
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
        backgroundColor: 'rgb(97,136,215)',
        borderRadius:10,
        shadowColor: "#000",
        elevation: 3,
    },
    textButton:{
        color:'white',
    }
});