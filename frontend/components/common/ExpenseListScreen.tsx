import { Ionicons } from "@expo/vector-icons";
import { useExpenses } from "@/hooks/query/use-expenses";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import { Expense } from "@/schemas/expense.schema";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type ExpenseListScreenProps = {
  onSelectExpense?: (expense: Expense) => void;
};

const categoryEmojiMap: Record<string, string> = {
  Food: "🍔",
  Travel: "🚕",
  Shopping: "🛍️",
  Bills: "🏠",
  Entertainment: "🎬",
  Health: "💊",
};

export default function ExpenseListScreen({
  onSelectExpense,
}: ExpenseListScreenProps) {
  const expensesQuery = useExpenses();

  if (expensesQuery.isPending) {
    return <Loader message="Loading expenses..." />;
  }

  if (expensesQuery.isError) {
    return (
      <ErrorState
        title="Unable to load expenses"
        message="Please check your connection and try again."
        onRetry={() => expensesQuery.refetch()}
      />
    );
  }

  const expenses = expensesQuery.data;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>All Expenses</Text>
            <Text style={styles.subtitle}>
              Review every expense in one place.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              No expenses yet
            </Text>
            <Text style={styles.emptyText}>
              Your added expenses will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const emoji =
            categoryEmojiMap[item.category] ?? "💸";

          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push({
                pathname: "/expense-detail",
                params: { id: item.id },
              })}
            >
              <View style={styles.leading}>
                <Text style={styles.emoji}>{emoji}</Text>
              </View>

              <View style={styles.body}>
                <Text style={styles.expenseTitle}>
                  {item.title}
                </Text>
                <Text style={styles.meta}>
                  {item.category} •{" "}
                  {new Date(
                    item.date_of_expense
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>

              <View style={styles.trailing}>
                <Text style={styles.amount}>
                  ₹{item.amount}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#8A8A8A"
                />
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: "sans-bold",
    color: "#081126",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "sans-medium",
    color: "#5F6270",
  },
  card: {
    backgroundColor: "#F7F0D8",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  leading: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#FFF9E7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  emoji: {
    fontSize: 24,
  },
  body: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontFamily: "sans-bold",
    color: "#081126",
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: "sans-medium",
    color: "#6B6B6B",
  },
  trailing: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  amount: {
    fontSize: 16,
    fontFamily: "sans-bold",
    color: "#081126",
    marginBottom: 4,
  },
  emptyState: {
    marginTop: 80,
    backgroundColor: "#F7F0D8",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "sans-bold",
    color: "#081126",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "sans-medium",
    color: "#6B6B6B",
    textAlign: "center",
  },
});
