import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import axios from 'axios';

export default function Home({ route }){

    const dotBeat = async ()=>{
        const instance = await axios.create({
            baseURL: 'http://172.16.88.123:3333/',
            timeout: 1000,
            headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYTA5MmJlNzM1YjA4YzdkNDc0ODRmYiIsImlhdCI6MTY1NDY5MDY3NywiZXhwIjoxNjU0Nzc3MDc3fQ.ZzlWPyo0lMdKzcI-ujYLRv4aPJqwBt3ygluzIA79AQM'}
          });
          
          instance.post('projects/dot_beat')
          .then(response => {
              console.log(response.data.email)
          })
    }
    return(
        <View style={styles.container}>
            <TouchableOpacity><Text>Registrar Ponto</Text></TouchableOpacity>
            <Text>{route.params}</Text>
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
  });