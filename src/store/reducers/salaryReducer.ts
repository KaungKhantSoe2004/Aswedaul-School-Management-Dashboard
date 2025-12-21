import { createSlice } from "@reduxjs/toolkit";

export interface Salary {
  id: number | string;
  user_id: number | string;
  user_type: string;
  monthly_salary: string;
  bonus: string;
  deductions: string;
  bonus_description: string;
  dedcutins_description: string;
  net_salary: string;
  pay_month: string;
  paid_status: string;
  created_at: string;
  updated_at: string;
}

const initialState: Salary[] = [];
const SalaryReducer = createSlice({
  name: "salaries",
  initialState,
  reducers: {
    setSalaries: (state, action) => {
      state.push(...action.payload);
    },
    addSalary: (state, action) => {
      state.push(action.payload);
    },
    removeSalary: (state, action) => {
      state.filter((salary) => salary.id == action.payload.id);
    },
  },
});
export default SalaryReducer.reducer;
export const { setSalaries, addSalary, removeSalary } = SalaryReducer.actions;
