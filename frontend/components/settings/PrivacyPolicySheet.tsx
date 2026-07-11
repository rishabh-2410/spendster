import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";

import DateTimePickerModal from "react-native-modal-datetime-picker";


import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Controller,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";


import {
  AddExpenseRequest,
  AddExpenseRequestObject,
  addExpenseSchema,
} from "@/schemas/expense.schema";
import { categories } from "@/constants/data";
import { Ionicons } from "@expo/vector-icons";
import { useAddExpense } from "@/hooks/mutations/use-add-expense";
import { queryClient } from "@/lib/query-client";


const PrivacyPolicySheet = forwardRef<BottomSheetModal>(
  function PrivacyPolicySheet(_, ref) {
    const snapPoints = useMemo(
      () => ["85%"],
      []
    );

  const renderBackdrop = useCallback(
  (props: any) => (
    <BottomSheetBackdrop
      {...props}
      opacity={0.35}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  ),
  []
);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDismissOnClose
        enableDynamicSizing={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={styles.container}
        >
          <Text style={styles.title}>
           Privacy Policy
          </Text>

        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default PrivacyPolicySheet;

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
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 30,
  },

  title: {
    fontFamily: "sans-bold",
    fontSize: 28,
    color: "#081126",
    marginBottom: 28,
  },
});