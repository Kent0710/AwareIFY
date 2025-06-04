import { create } from "zustand";
import { AccountType } from "@/object-types";

interface SelectedAccountsStore {
    selectedAccounts: AccountType[];
    setSelectedAccounts: (accounts: AccountType[]) => void;
    addSelectedAccount: (account: AccountType) => void;
    removeSelectedAccount: (accountId: string) => void;
    clearSelectedAccounts: () => void;
}

export const useSelectedAccountsStore = create<SelectedAccountsStore>(
    (set) => ({
        selectedAccounts: [],

        setSelectedAccounts: (accounts) => set({ selectedAccounts: accounts }),

        addSelectedAccount: (account) =>
            set((state) => ({
                selectedAccounts: [...state.selectedAccounts, account],
            })),

        removeSelectedAccount: (accountId) =>
            set((state) => ({
                selectedAccounts: state.selectedAccounts.filter(
                    (a) => a.id !== accountId
                ),
            })),

        clearSelectedAccounts: () => set({ selectedAccounts: [] }),
    })
);
