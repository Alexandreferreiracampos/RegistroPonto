import { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TouchableOpacityProps} from 'react-native';


interface ButtonProps extends TouchableOpacityProps {
    title: string;
    ico:object;
    stylesButtom:boolean;
    onPressStyles:()=>void
}

export default function button({ title,ico,stylesButtom,onPressStyles,...rest }: ButtonProps){


    return(
        <TouchableOpacity activeOpacity={0.9} onPress={onPressStyles} style={[styles.container, stylesButtom && styles.container1]}>
            <Text style={{color:"#777b7e", fontWeight:'bold'}}>
                {title}
            </Text>
            {ico}

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        width: 120, 
        height: 90, 
        backgroundColor: 'rgb(250,250,250)', 
        justifyContent:'space-between',
        padding:15,
        alignItems:'center',
        bottom:-30, borderRadius:10, 
        shadowColor: 'black',
        elevation: 2,
        
    },
    container1:{
        width: 120, 
        height: 90, 
        backgroundColor: 'rgb(250,250,250)', 
        justifyContent:'space-between',
        padding:15,
        alignItems:'center',
        bottom:-30, borderRadius:10, 
        shadowColor: 'black',
        elevation: 2,
        borderBottomWidth:8,
        borderColor:'rgb(97,136,215)'
    }

})