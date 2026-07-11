import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useExpenses } from "@/hooks/query/use-expenses";
import { useStats } from "@/hooks/query/use-stats";
import { useAuthStore } from "@/store/auth.store";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useDeleteExpense } from "@/hooks/mutations/use-delete-expense";
import { queryClient } from "@/lib/query-client";

type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date_of_expense: string;
};


export default function DashboardScreen() {

  const user = useAuthStore((state) => state.user)
  

  const expenseQuery = useExpenses();
  const statsQuery = useStats();

  const deleteMutation = useDeleteExpense()


  if (
    expenseQuery.isPaused ||
    statsQuery.isPending
  ) {
    return null;
  }


  if (
    expenseQuery.isError ||
    statsQuery.isError
  ) {
    console.log("error from expense query", expenseQuery.error)
    console.log("error from stats query", statsQuery.error)
    return (
      <Text>Unable to load dashboard</Text>
    );
  }

  const expenses = expenseQuery.data;
  const stats = statsQuery.data;

  async function handleEdit(expenseId: string) {

  }

  async function handleDelete(expenseId: string) {
    if (user !== null) {
      deleteMutation.mutate(expenseId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["expenses"]
          })

          queryClient.invalidateQueries({
            queryKey: ["stats"]
          })
        },
        onError: (error) => {
          console.log("error in delete mutation:", error)
        }
      })
    }

  }

  const renderRightActions = (id: string) => (
    <View
        style={{
            flexDirection: "row",
            alignItems: "center",
        }}
    >
        <Pressable
            style={styles.editButton}
            onPress={() => handleEdit(id)}
        >
            <MaterialIcons
                name="mode-edit-outline"
                size={20}
                color="#fff"
            />
        </Pressable>

        <Pressable
            style={styles.deleteButton}
            onPress={() => handleDelete(id)}
        >
            <Ionicons
                name="trash-outline"
                size={20}
                color="#fff"
            />
        </Pressable>
    </View>
);

  const renderHeader = () => {
    return (
      <>
        <View style={styles.header}>
          <View style={styles.user}>
            <Image
              source={require("@/assets/spendster.png")}
              style={styles.avatar}
            />

            <Text style={styles.greeting}>Hi {user?.name} 👋</Text>
          </View>

          <Pressable style={styles.headerAction}>
            <Ionicons
              name="notifications-outline"
              size={26}
              color="#081126"
            />
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Total expenses
          </Text>

          <Text style={styles.totalAmount}>{stats.total_expenses}</Text>

          <View style={styles.summaryFooter}>
            <View style={styles.indicators}>
              <View style={[styles.indicator, styles.mintIndicator]} />

              <View
                style={[
                  styles.indicator,
                  styles.indicatorOverlap,
                  styles.accentIndicator,
                ]}
              />

              <View
                style={[
                  styles.indicator,
                  styles.indicatorOverlap,
                  styles.primaryIndicator,
                ]}
              />
            </View>

            <Pressable style={styles.analysisButton}>
              <Text style={styles.analysisButtonText}>
                View analysis
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.mintIcon]}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#081126"
              />
            </View>

            <View>
              <Text style={styles.statLabel}>Spent today</Text>
              <Text style={styles.statAmount}>₹{stats.today_spent}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.accentIcon]}>
              <Ionicons
                name="wallet-outline"
                size={20}
                color="#081126"
              />
            </View>

            <View>
              <Text style={styles.statLabel}>This month</Text>
              <Text style={styles.statAmount}>₹{stats.monthly_spent}</Text>
            </View>
          </View>

        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent expenses</Text>

          <Pressable>
            <Text style={styles.sectionAction}>View all</Text>
          </Pressable>
        </View>
      </>
    );
  };

  const renderExpense = ({ item }: { item: Expense }) => {
    return (
      <Swipeable 
        renderRightActions={() => renderRightActions(item.id)}
      >
        <Pressable style={styles.expenseItem}>
          <View style={styles.categoryIcon}>
            <Ionicons
              name="fast-food-outline"
              size={22}
              color="#081126"
            />
          </View>

          <View style={styles.expenseInfo}>
            <Text style={styles.expenseTitle}>{item.title}</Text>

            <Text style={styles.expenseCategory}>
              {item.category}
            </Text>
          </View>

          <View style={styles.expenseMeta}>
            <Text style={styles.expenseAmount}>
              ₹{item.amount}
            </Text>

            <Text style={styles.expenseDate}>
              {item.date_of_expense}
            </Text>
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpense}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff9e7",
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  greeting: {
    flex: 1,
    fontFamily: "sans-bold",
    fontSize: 22,
    color: "#081126",
  },

  headerAction: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryCard: {
    minHeight: 210,
    marginTop: 20,
    padding: 28,
    borderRadius: 32,
    backgroundColor: "#ffb59d",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontFamily: "sans-medium",
    fontSize: 17,
    color: "rgba(8, 17, 38, 0.75)",
  },

  totalAmount: {
    fontFamily: "sans-extrabold",
    fontSize: 46,
    letterSpacing: -1.8,
    color: "#081126",
  },

  summaryFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  indicators: {
    flexDirection: "row",
    alignItems: "center",
  },

  indicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#ffffff",
  },

  indicatorOverlap: {
    marginLeft: -8,
  },

  mintIndicator: {
    backgroundColor: "#adf0db",
  },

  accentIndicator: {
    backgroundColor: "#ea7a53",
  },

  primaryIndicator: {
    backgroundColor: "#081126",
  },

  analysisButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: "#081126",
  },

  analysisButtonText: {
    fontFamily: "sans-semibold",
    fontSize: 14,
    color: "#fff9e7",
  },

  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  statCard: {
    flex: 1,
    minHeight: 145,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: "#faf4de",
    justifyContent: "space-between",
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  mintIcon: {
    backgroundColor: "#adf0db",
  },

  accentIcon: {
    backgroundColor: "#ffb59d",
  },

  primaryIcon: {
    backgroundColor: "#081126",
  },

  statLabel: {
    fontFamily: "sans-medium",
    fontSize: 13,
    color: "#45464d",
  },

  statAmount: {
    marginTop: 3,
    fontFamily: "sans-bold",
    fontSize: 19,
    color: "#081126",
  },

  sectionHeader: {
    marginTop: 28,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontFamily: "sans-bold",
    fontSize: 24,
    color: "#081126",
  },

  sectionAction: {
    fontFamily: "sans-semibold",
    fontSize: 14,
    color: "#ea7a53",
  },

  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: "#faf4de",
    marginRight: 4
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#adf0db",
  },

  expenseInfo: {
    flex: 1,
    marginLeft: 16,
  },

  expenseTitle: {
    fontFamily: "sans-bold",
    fontSize: 16,
    color: "#081126",
  },

  expenseCategory: {
    marginTop: 3,
    fontFamily: "sans-medium",
    fontSize: 14,
    color: "#45464d",
  },

  expenseMeta: {
    marginLeft: 12,
    alignItems: "flex-end",
  },

  expenseAmount: {
    fontFamily: "sans-bold",
    fontSize: 16,
    color: "#081126",
  },

  expenseDate: {
    marginTop: 3,
    fontFamily: "sans-medium",
    fontSize: 13,
    color: "#45464d",
  },

  separator: {
    height: 8,
  },
  editButton: {
    width: 40,
    height: 40,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#EA7A53",

    borderRadius: 18,
},

deleteButton: {
    width: 40,
    height: 40,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#DC2626",

    borderRadius: 18,

    marginLeft: 8,
},
});