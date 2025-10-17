import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Submission {
  id: string;
  values: unknown;
  submittedAt: string;
}

interface FormState {
  submissions: Submission[];
}

const initialState: FormState = {
  submissions: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addSubmission: (state, action: PayloadAction<Submission>) => {
      state.submissions.unshift(action.payload);
    },
    clearSubmissions: (state) => {
      state.submissions = [];
    },
  },
});

export const { addSubmission, clearSubmissions } = formSlice.actions;
export const formReducer = formSlice.reducer;
