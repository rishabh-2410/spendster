import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";


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
  EditExpenseMutationRequest,
  EditExpenseRequest,
  editExpenseScheme,
  Expense,
} from "@/schemas/expense.schema";
import { categories } from "@/constants/data";
import { Ionicons } from "@expo/vector-icons";
import { queryClient } from "@/lib/query-client";
import { useEditExpense } from "@/hooks/mutations/user-edit-expense";



type Props = {
  expense: Expense | null;
  onSuccess: (expenseId: string) => void;
};

export const EditExpenseSheet = forwardRef<BottomSheetModal, Props>(
  function EditExpenseSheet({ expense, onSuccess }, ref) {
    const snapPoints = useMemo(
      () => ["85%"],
      []
    );


    const {
      control,
      handleSubmit,
      reset,
      setValue,
      watch,
      formState: { errors, isSubmitting, dirtyFields },
    } = useForm<EditExpenseRequest>({
      resolver: zodResolver(editExpenseScheme),

      defaultValues: {
        amount: 0,
        category: "",

      },
    });


    const selectedCategory = watch("category");

    const editExpenseMutation = useEditExpense()


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

    useEffect(() => {
      if (!expense) return;

      reset({
        amount: expense.amount,
        category: expense.category,
      });
    }, [expense, reset]);

    const onSubmit = (data: EditExpenseRequest) => {

      const editReqDyanmicPayload: EditExpenseRequest = {}

      if (!data) {
        return
      }

      if (!expense) {
        return
      }
      console.log("dirtyFields", dirtyFields);
      console.log("category dirty", dirtyFields.category);
      console.log("data", data);

      console.log("Selected form data for edit expense", data)

      if (dirtyFields.amount) {
        editReqDyanmicPayload.amount = data.amount
      } else {
        editReqDyanmicPayload.amount = undefined
      }



      if (dirtyFields.category) {
        editReqDyanmicPayload.category = data.category
      } else {
        editReqDyanmicPayload.category = undefined
      }


      const editRequest: EditExpenseMutationRequest = {
        expenseID: expense?.id,
        editRequest: editReqDyanmicPayload
      }
      editExpenseMutation.mutate(editRequest, {
        onSuccess: () => {

          queryClient.invalidateQueries({
            queryKey: ["expenses"]
          })
          queryClient.invalidateQueries({
            queryKey: ["stats"]
          })

          onSuccess(expense.id);
          reset();
          (
            ref as React.RefObject<BottomSheetModal>
          ).current?.dismiss();
        },
        onError: (error: any) => {
          console.log(error);
        },
      })
    };

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
            Edit Expense
          </Text>
          {/* ---------------- TITLE ---------------- */}

          <View style={styles.field}>
            <Text style={styles.label}>TITLE</Text>

            <TextInput
              value={expense?.title}
              editable={false}
              style={[
                styles.input,
                styles.buttonDisabled,
              ]} />
          </View>

          {/* ---------------- AMOUNT ---------------- */}

          <View style={styles.field}>
            <Text style={styles.label}>AMOUNT</Text>

            <Controller
              control={control}
              name="amount"
              render={({ field }) => (
                <View
                  style={[
                    styles.amountContainer,
                    errors.amount && styles.inputError,
                  ]}
                >
                  <Text style={styles.currency}>
                    ₹
                  </Text>

                  <TextInput
                    style={styles.amountInput}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#8A8A8A"
                    value={field.value === undefined
                      ? ""
                      : field.value.toString()}
                    onChangeText={(text) => {
                      setValue(
                        "amount",
                        text === "" ? 0 : parseFloat(text),
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        }
                      );
                    }}
                  />
                </View>
              )}
            />

            {errors.amount && (
              <Text style={styles.error}>
                {errors.amount.message}
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              CATEGORY
            </Text>

            <View style={styles.categoryContainer}>
              {categories.map((category: Category) => {
                const selected =
                  selectedCategory === category.value;

                return (
                  <Pressable
                    key={category.value}
                    onPress={() =>
                      setValue(
                        "category",
                        category.value,
                        {
                          shouldValidate: true,
                          shouldDirty: true
                        }
                      )
                    }
                    style={[
                      styles.categoryChip,
                      selected &&
                      styles.categoryChipSelected,
                    ]}
                  >
                    <Text
                      style={styles.categoryEmoji}
                    >
                      {category.emoji}
                    </Text>

                    <Text
                      style={[
                        styles.categoryText,
                        selected &&
                        styles.categoryTextSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {errors.category && (
              <Text style={styles.error}>
                {errors.category.message}
              </Text>
            )}
          </View>



          {/* ---------------- DATE ---------------- */}

          <View style={styles.field}>
            <Text style={styles.label}>
              DATE
            </Text>

            <Pressable
              style={styles.dateButton}
              disabled
            >
              <View>
                <Text style={styles.dateValue}>
                  {expense ? new Date(expense.date_of_expense).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  ) : ""}
                </Text>
              </View>

              <Ionicons
                name="calendar-outline"
                size={22}
                color="#081126"
              />
            </Pressable>
          </View>

          <Pressable
            style={[
              styles.button,
              editExpenseMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={editExpenseMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {editExpenseMutation.isPending ? "Saving..." : "Save Expense"}
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default EditExpenseSheet;

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

  button: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#EA7A53",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },

  buttonText: {
    color: "#FFF9E7",
    fontFamily: "sans-bold",
    fontSize: 16,
  },
  field: {
    marginBottom: 22,
  },

  label: {
    marginBottom: 8,
    fontFamily: "sans-semibold",
    fontSize: 13,
    color: "#081126",
    letterSpacing: 0.6,
  },

  input: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F8F2DD",
    paddingHorizontal: 18,
    fontFamily: "sans-medium",
    fontSize: 16,
    color: "#081126",

    borderWidth: 1,
    borderColor: "transparent",
  },

  amountContainer: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F8F2DD",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 18,

    borderWidth: 1,
    borderColor: "transparent",
  },

  currency: {
    fontFamily: "sans-bold",
    fontSize: 18,
    color: "#081126",
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    fontFamily: "sans-medium",
    fontSize: 16,
    color: "#081126",
  },

  inputError: {
    borderColor: "#DC2626",
  },

  error: {
    marginTop: 6,
    marginLeft: 4,
    color: "#DC2626",
    fontSize: 12,
    fontFamily: "sans-medium",
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  categoryChip: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 12,

    borderRadius: 16,

    backgroundColor: "#F8F2DD",

    borderWidth: 1,
    borderColor: "transparent",
  },

  categoryChipSelected: {
    backgroundColor: "#EA7A53",
  },

  categoryEmoji: {
    fontSize: 18,
    marginRight: 8,
  },

  categoryText: {
    fontFamily: "sans-semibold",
    color: "#081126",
  },

  categoryTextSelected: {
    color: "#FFF9E7",
  },

  dateButton: {
    height: 58,

    borderRadius: 18,

    backgroundColor: "#F8F2DD",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 18,
  },

  dateValue: {
    fontFamily: "sans-medium",

    fontSize: 16,

    color: "#081126",
  },

  calendar: {
    fontSize: 22,
  },
  buttonDisabled: {
    opacity: 0.45,
  }
});