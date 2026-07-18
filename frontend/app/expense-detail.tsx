
import { ErrorState, ExpenseDetailsScreen, Loader } from '@/components/common'
import { useExpenses } from '@/hooks/query/use-expenses';
import { router, useLocalSearchParams } from 'expo-router';

export default function ExpenseDetailRoute() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const expensesQuery = useExpenses();

  if (expensesQuery.isPending) {
    return <Loader message="Loading expense..." />;
  }

  if (expensesQuery.isError) {
    return (
      <ErrorState
        title="Unable to load expense"
        message="Please try again."
        onRetry={() => expensesQuery.refetch()}
      />
    );
  }


  const expense = expensesQuery.data.find(
    (item) => item.id === id
  );

   if (!expense) {
    return (
      <ErrorState
        title="Expense not found"
        message="We couldn't find that expense."
      />
    );
  }

  return <ExpenseDetailsScreen expense={expense} onBack={() => router.back()}/>
}

