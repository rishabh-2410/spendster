import { Expense } from "@/schemas/expense.schema";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ExpenseDetailsScreenProps = {
  expense: Expense;
  onBack?: () => void;
};

const categoryEmojiMap: Record<string, string> = {
  Food: "🍔",
  Travel: "🚕",
  Shopping: "🛍️",
  Bills: "🏠",
  Entertainment: "🎬",
  Health: "💊",
};

export default function ExpenseDetailsScreen({
  expense,
  onBack,
}: ExpenseDetailsScreenProps) {
  const emoji =
    categoryEmojiMap[expense.category] ?? "💸";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color="#081126"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Expense Details
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.emojiWrap}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>

          <Text style={styles.expenseTitle}>
            {expense.title}
          </Text>

          <Text style={styles.amount}>
            ₹{expense.amount}
          </Text>
        </View>

        <View style={styles.section}>
          <DetailRow
            label="Category"
            value={expense.category}
          />
          <DetailRow
            label="Expense Date"
            value={new Date(
              expense.date_of_expense
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <DetailRow
            label="Created At"
            value={new Date(
              expense.created_at
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
          <DetailRow
            label="Updated At"
            value={new Date(
              expense.updated_at
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF9E7",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F7F0D8",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "sans-bold",
    color: "#081126",
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  heroCard: {
    backgroundColor: "#F7F0D8",
    borderRadius: 32,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emojiWrap: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: "#FFF9E7",
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 38,
  },
  expenseTitle: {
    marginTop: 18,
    fontSize: 24,
    fontFamily: "sans-bold",
    color: "#081126",
    textAlign: "center",
  },
  amount: {
    marginTop: 10,
    fontSize: 34,
    fontFamily: "sans-bold",
    color: "#EA7A53",
  },
  section: {
    marginTop: 24,
    backgroundColor: "#F7F0D8",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  row: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E6DEBF",
  },
  rowLabel: {
    fontSize: 13,
    fontFamily: "sans-semibold",
    color: "#7C7C7C",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  rowValue: {
    fontSize: 16,
    fontFamily: "sans-medium",
    color: "#081126",
  },
});
