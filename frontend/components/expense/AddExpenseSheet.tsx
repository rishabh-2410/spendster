import {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import {
  forwardRef,
  useMemo,
} from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const AddExpenseSheet = forwardRef<BottomSheetModal>((_, ref) => {
    const snapPoints = useMemo(
      () => ["70%"],
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>
            Add Expense
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>
              TITLE
            </Text>

            <TextInput
              placeholder="Dinner"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              AMOUNT
            </Text>

            <TextInput
              placeholder="₹0"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              CATEGORY
            </Text>

            <TextInput
              placeholder="Food"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              DATE
            </Text>

            <TextInput
              placeholder="Today"
              style={styles.input}
            />
          </View>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>
              Save Expense
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

AddExpenseSheet.displayName = "AddExpenseSheet";

export default AddExpenseSheet;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FFF9E7",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },

  handle: {
    backgroundColor: "#D8D2BE",
    width: 48,
  },

  container: {
    flex: 1,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontFamily: "sans-bold",
    color: "#081126",
    marginBottom: 24,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,
    fontFamily: "sans-semibold",
    color: "#081126",
  },

  input: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F7F0D8",
    paddingHorizontal: 18,
    fontFamily: "sans-medium",
  },

  button: {
    marginTop: 20,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#EA7A53",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF9E7",
    fontFamily: "sans-bold",
    fontSize: 16,
  },
});