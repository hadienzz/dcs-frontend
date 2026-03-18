"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

import type {
  BudgetItem,
  SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { initialBudgetItems } from "@/components/sdg-dashboard/dashboard-data";
import saveBudgetDraft from "@/services/internal/save-budget-draft";
import submitBudget from "@/services/internal/submit-budget";
import {
  SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY,
  SDG_DASHBOARD_PROJECTS_QUERY_KEY,
  type BudgetFormPayload,
} from "@/types/internal";
import { getErrorMessage } from "@/utils/api-error";

interface BudgetFormValues {
  budgetItems: BudgetItem[];
}

interface UseBudgetFormOptions {
  project: SdgDashboardProjectRecord | null;
  onDraftSuccess?: (project: SdgDashboardProjectRecord) => void;
  onSubmitSuccess?: (project: SdgDashboardProjectRecord) => void;
  onError?: (message: string) => void;
}

const useBudgetForm = ({
  project,
  onDraftSuccess,
  onSubmitSuccess,
  onError,
}: UseBudgetFormOptions) => {
  const queryClient = useQueryClient();
  const projectSlug = project?.slug ?? "";

  const syncProjectCache = async (nextProject: SdgDashboardProjectRecord) => {
    queryClient.setQueryData(
      [...SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY, "internal", nextProject.slug],
      nextProject,
    );
    await queryClient.invalidateQueries({
      queryKey: SDG_DASHBOARD_PROJECTS_QUERY_KEY,
    });
  };

  const mapPayload = (values: BudgetFormValues): BudgetFormPayload => ({
    items: values.budgetItems.map((item) => ({
      category: item.category,
      description: item.description,
      volume: item.volume,
      unit: item.unit,
      unit_cost: item.unitCost,
      visibility_scope:
        item.visibilityScope === "internal" ? "INTERNAL" : "SHARED",
      expenses: item.expenses.map((expense) => ({
        description: expense.description,
        date: expense.date,
        amount: expense.amount,
      })),
    })),
  });

  const draftMutation = useMutation({
    mutationFn: (values: BudgetFormValues) =>
      saveBudgetDraft(projectSlug, mapPayload(values)),
    onSuccess: async (nextProject) => {
      await syncProjectCache(nextProject);
      onDraftSuccess?.(nextProject);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (values: BudgetFormValues) =>
      submitBudget(projectSlug, mapPayload(values)),
    onSuccess: async (nextProject) => {
      await syncProjectCache(nextProject);
      onSubmitSuccess?.(nextProject);
    },
  });

  const formik = useFormik<BudgetFormValues>({
    enableReinitialize: true,
    initialValues: {
      budgetItems: project?.budgetItems ?? initialBudgetItems,
    },
    onSubmit: async (values, actions) => {
      actions.setStatus(undefined);

      try {
        await submitMutation.mutateAsync(values);
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Budget belum bisa disimpan. Coba lagi sebentar.",
        );
        actions.setStatus({
          submitError: message,
        });
        onError?.(message);
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  const updateBudgetItem = (
    itemId: string,
    field: keyof Omit<BudgetItem, "id">,
    value: string,
  ) => {
    formik.setFieldValue(
      "budgetItems",
      formik.values.budgetItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        if (field === "volume" || field === "unitCost" || field === "spentAmount") {
          return {
            ...item,
            [field]: Number(value) || 0,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    );
  };

  const addBudgetExpense = (itemId: string) => {
    formik.setFieldValue(
      "budgetItems",
      formik.values.budgetItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const expenses = [
          ...item.expenses,
          {
            id: `expense-${Date.now()}`,
            description: "",
            date: new Date().toISOString().slice(0, 10),
            amount: 0,
          },
        ];

        return {
          ...item,
          expenses,
          spentAmount: expenses.reduce((total, expense) => total + expense.amount, 0),
        };
      }),
    );
  };

  const updateBudgetExpense = (
    itemId: string,
    expenseId: string,
    field: "description" | "date" | "amount",
    value: string,
  ) => {
    formik.setFieldValue(
      "budgetItems",
      formik.values.budgetItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const expenses = item.expenses.map((expense) =>
          expense.id === expenseId
            ? {
                ...expense,
                [field]: field === "amount" ? Number(value) || 0 : value,
              }
            : expense,
        );

        return {
          ...item,
          expenses,
          spentAmount: expenses.reduce((total, expense) => total + expense.amount, 0),
        };
      }),
    );
  };

  const removeBudgetExpense = (itemId: string, expenseId: string) => {
    formik.setFieldValue(
      "budgetItems",
      formik.values.budgetItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const expenses = item.expenses.filter((expense) => expense.id !== expenseId);

        return {
          ...item,
          expenses,
          spentAmount: expenses.reduce((total, expense) => total + expense.amount, 0),
        };
      }),
    );
  };

  const addBudgetItem = () => {
    formik.setFieldValue("budgetItems", [
      ...formik.values.budgetItems,
      {
        id: `budget-${formik.values.budgetItems.length + 1}`,
        category: "Biaya tambahan",
        description: "",
        volume: 1,
        unit: "paket",
        unitCost: 0,
        spentAmount: 0,
        visibilityScope: "csr",
        expenses: [],
      },
    ]);
  };

  const saveDraft = async () => {
    formik.setStatus(undefined);

    try {
      await draftMutation.mutateAsync(formik.values);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Draft budget belum bisa disimpan. Coba lagi sebentar.",
      );
      formik.setStatus({
        submitError: message,
      });
      onError?.(message);
    }
  };

  return {
    formik,
    addBudgetItem,
    updateBudgetItem,
    addBudgetExpense,
    updateBudgetExpense,
    removeBudgetExpense,
    saveDraft,
    isSavingDraft: draftMutation.isPending,
    isSubmitting: submitMutation.isPending,
  };
};

export default useBudgetForm;
