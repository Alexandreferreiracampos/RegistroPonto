import React from 'react'
import Login from '../pages/Login';
import Home from '../pages/Home';


import { createStackNavigator } from '@react-navigation/stack';

const stackRoutes = createStackNavigator();


const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        screenOptions={{
            headerShown:false,
            cardStyle: {
                backgroundColor: 'rgb(31,44,52)'
            }
        }}


    >
        <stackRoutes.Screen
            name="Login"
            component={Login}
        />


        <stackRoutes.Screen
            name="Home"
            component={Home}
        />

        

    </stackRoutes.Navigator>

)

export default AppRoutes;