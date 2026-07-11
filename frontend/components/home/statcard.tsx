import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

const StatCard = () => {
  return (
    <View style={styles.container}>
        <View style={styles.imagecontainer}>
          <Image 
            source={require(`@/assets/icons/calendar.png`)}
            style={styles.image}
          />
        </View>
        <Text>Today Spent</Text>
        <Text>Rs.420.50</Text>
    </View>
  )
}

export default StatCard

const styles = StyleSheet.create({
  container:{
    maxHeight: 280,
    maxWidth: 120,
    borderColor: "red",
    borderWidth: 2,
    marginHorizontal: 20
  },
  imagecontainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "#ffdbd0",
    alignItems: "center",
    justifyContent: "center",
    
  },
  image: {
    height: 30,
    width: 30,
  },
})