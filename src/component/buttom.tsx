import {View, Text, TouchableOpacity, StyleSheet, TouchableOpacityProps} from 'react-native';


interface ButtonProps extends TouchableOpacityProps {
    title: string;
    ico:object;
}

export default function button({ title,ico,...rest }: ButtonProps){
    return(
        <TouchableOpacity  style={styles.container}>
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
        elevation: 2
    }

})