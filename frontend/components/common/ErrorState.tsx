import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ErrorStateProps = {
  title?: string;
  message?: string;
  buttonLabel?: string;
  onRetry?: () => void;
  useAlert?: boolean;
};

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now. Please try again.",
  buttonLabel = "Try Again",
  onRetry,
  useAlert = false,
}: ErrorStateProps) {
  if (useAlert) {
    Alert.alert(title, message);
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {onRetry ? (
          <Pressable
            style={styles.button}
            onPress={onRetry}
          >
            <Text style={styles.buttonText}>
              {buttonLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
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
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#F7F0D8",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "sans-bold",
    color: "#081126",
    textAlign: "center",
  },
  message: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "sans-medium",
    color: "#5F6270",
    textAlign: "center",
  },
  button: {
    marginTop: 22,
    minWidth: 140,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#EA7A53",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "sans-bold",
    color: "#081126",
  },
});
