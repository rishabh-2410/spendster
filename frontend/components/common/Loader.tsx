import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LoaderProps = {
  message?: string;
};

export default function Loader({
  message = "Loading...",
}: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#EA7A53"
      />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E7",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "sans-semibold",
    color: "#081126",
  },
});
