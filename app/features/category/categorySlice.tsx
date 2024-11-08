import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { consts } from "../../../consts";

interface Category {
  category: { name: string; logo: string } | null;
}

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
};

// Thunk to issue a categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async ({token, page} : {token: string; page: number}, { rejectWithValue, getState }) => {
    try {
      if (!token) {
        return rejectWithValue("No token available");
      }
      const response = await axios.get(consts.API_URL + "/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
          params: {
              page
          }
      });
      if (response.data.success) {
        return {
            categories: response.data.data.data,
            currentPage: response.data.data.current_page,
            totalPages: Math.ceil(response.data.data.total / response.data.data.per_page),
        }
      } else {
          throw new Error("Failed to fetch categories");
      }
    } catch (error: any) {
        console.log('Failed to fetch categories ? ', error.message);
        return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
            state.categories = [...state.categories, ...action.payload.categories];
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.loading = false;
        }
      )
      .addCase(
        fetchCategories.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default categorySlice.reducer;
