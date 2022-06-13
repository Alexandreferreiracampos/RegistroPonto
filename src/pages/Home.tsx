import {View, Text, TouchableOpacity, StyleSheet, StatusBar, ToastAndroid, FlatList} from 'react-native';
import axios from 'axios';
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Animatable from 'react-native-animatable';
import { API_URL } from '../../util';
import Button from '../component/buttom';
import { Ionicons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 


export default function Home({ route }){

    const [hora, setHora] = useState('');
    const [dateNow, setDateNow] = useState('');
    const [name, setName] = useState('');
    const [dataJson, setDataJson] = useState(JSON.parse(route.params));
    const [dataJsonBeat, setDataJsonBeat] = useState(dataJson.user.beat);
    const [msgPonto, seMsgPonto] = useState('Registrar Ponto');
    const [updateFlastlist, setUpdateFlastlist] = useState(true)

    const diaSemana = [ 
        'Domingo ', 
        'Segundo-Ferreira ', 
        'Terça-Feirra ', 
        'Quarta-Feira ', 
        'Quinta-Feira ', 
        'Sexta-Feira ', 
        'Sabado ']
    const mes = ['Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro']

    useEffect(()=>{
        const dt = new Date();
        const dtString = String(dt);
        const dtNow = diaSemana[dt.getDay()] + '-' +  dt.getDate() + " de " + mes[dt.getMonth()] + " de " + dt.getFullYear();

        setDateNow(dtNow)
        const Name = dataJson.user.name.split(' ').shift();
        setName(Name)
    },[])


   setInterval(function () {
        var clock = ((new Date).toLocaleString().substr(11, 8));  
        setHora(clock);
    }, 1000);
    
    
    
    const dotBeat = async ()=>{
        const instance = await axios.create({
            baseURL: API_URL,
            timeout: 1000,
            headers: {'Authorization': 'Bearer ' + dataJson.token}
          });
          
          instance.post('/projects/dot_beat')
          .then(response => {
            if(response.status == 200){
                seMsgPonto(`Ponto Registrado as: ${'\n'}`+hora)

            }else{
                ToastAndroid.showWithGravityAndOffset(
                    "Falha ao Registrar Ponto",
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                    25,50
                )

            }
          }).catch(function (error) {
            if (error.response) {
                const err = error.response.data.error
                if(error.response.status == 401){
                    ToastAndroid.showWithGravityAndOffset(
                        err,
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                        25,50
                    )
                }
            
             
            } else if (error.request) {
              console.log(error.request);
            } else{
                ToastAndroid.showWithGravityAndOffset(
                    "Falha ao Registrar Ponto",
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                    25,50
                )

            }
          });
    }

    const animation = useRef(null);

    const biometric = async () => {
        
        const hora1 = hora

        const authenticationBiometric = await LocalAuthentication.authenticateAsync({
            promptMessage: `Registrar ponto as: ${hora1}`,
            disableDeviceFallback: false,
        });

        if (authenticationBiometric.success) {
            dotBeat()
        }else{
            ToastAndroid.showWithGravityAndOffset(
                "Cancelado",
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25,50
            )
        }

    };

    const [stylesButtom1, setStylesButtom1] = useState(true)
    const [stylesButtom2, setStylesButtom2] = useState(false)
    const [stylesButtom3, setStylesButtom3] = useState(false)

    const teste=(value:any)=>{
        switch (value) {
            case 1:
                setStylesButtom1(true)
                setStylesButtom2(false)
                setStylesButtom3(false)
            break
            case 2:
                setStylesButtom1(false)
                setStylesButtom2(true)
                setStylesButtom3(false)
                setUpdateFlastlist(!updateFlastlist)
            break
            case 3:
                setStylesButtom1(false)
                setStylesButtom2(false)
                setStylesButtom3(true)
            break
        }
        
    }

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='rgb(97,136,215)' barStyle="ligth-content"/>
            <View style={styles.header}>
                <View style={{alignItems:'center', top:-24}}>
                <Text style={{fontSize:25, color:'white', padding:8}}>{name}</Text>
                <Animatable.View animation="slideInUp">
                <Text style={{fontSize:13, color:'white'}}>{dateNow}</Text>
                </Animatable.View>

                </View>
                <Animatable.View animation="slideInUp" >
                <Text style={{fontSize:50, color:'white'}}>{hora}</Text>
                </Animatable.View>
                <View style={{ width: '100%', height: 30, bottom:15, flexDirection:'row', justifyContent:'space-between', padding:15}}>
                    <Button title='Registrar'  stylesButtom={stylesButtom1} onPressStyles={()=>teste(1)} ico=<Ionicons name="finger-print" size={24} color="#777b7e"/>/>
                    <Button title='Atividades' stylesButtom={stylesButtom2} onPressStyles={()=>teste(2)} ico=<AntDesign name="message1" size={24} color="#777b7e"/>/>
                    <Button title='Marcações' stylesButtom={stylesButtom3} onPressStyles={()=>teste(3)} ico=<AntDesign name="copy1" size={24} color="#777b7e"/>/>
                </View>

            </View>
            {stylesButtom1 && <View style={styles.viewBiometric}>
                <TouchableOpacity

                    onPress={() => {
                        animation.current?.reset();
                        animation.current?.play();
                        biometric()
                    }
                    } style={{ borderColor: 'rgb(97,136,215)', borderWidth: 2, borderRadius: 650, width: 158, height: 158, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        source={require('../../assets/biometric.json')}
                        autoPlay
                        loop={false}
                        ref={animation}
                        style={{
                            width: 230,
                            height: 230,
                        }}
                    />
                   
            </TouchableOpacity>
            <Text style={{fontSize:25, color:"#777b7e", padding:8, top:20, textAlign:'center'}}>{msgPonto}</Text>
            </View>
            }
            {stylesButtom2 && 
            <View style={styles.viewBiometric}>
                
            </View>}
            {stylesButtom3 && 
            <View style={styles.viewBiometric}>
                <View style={{width:'90%', height:'85%', top:22}}>
                 <FlatList
                        data={dataJsonBeat}
                        renderItem={({ item }) =>
                            <TouchableOpacity style={{ backgroundColor: 'rgb(250,250,250)', shadowColor: "#000", elevation: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, margin: 5 }}>
                                <View>
                                    <Text style={{ color:"#777b7e", fontWeight: 'bold' }}>{item.beat}</Text>
                                </View>
                            </TouchableOpacity>
                            
                        }
                        keyExtractor={(item) => item.id}  
                        extraData={updateFlastlist}
                    />
                    </View>

            </View>}
            
           </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      
    },
    header: {
        width: '100%',
        height: '30%',
        backgroundColor: 'rgb(97,136,215)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        elevation: 10,
        borderBottomEndRadius:15,
        borderBottomLeftRadius:15
    },
    viewBiometric: {
        width: '100%',
        height: 550,
        justifyContent: 'center',
        alignItems: 'center',
        

    }
  });