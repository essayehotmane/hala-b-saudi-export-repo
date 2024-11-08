import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { consts } from "../../../consts";
import { Service } from "../../Interfaces/IService";
import { RootState } from "../../slices/store";

interface ServiceState {
    services: Service[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
}

const initialState: ServiceState = {
    services: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
};

// Thunk to fetch Services
export const fetchServices = createAsyncThunk(
    "service/fetchServices",
    async (
        { token, categoryId, cityId, page }: { token: string; categoryId: number; cityId: number; page: number },
        { rejectWithValue, getState }
    ) => {
        try {
            if (!token) {
                return rejectWithValue("No token available");
            }
            const response = await axios.get(consts.API_URL + "/servicesByCategoryAndCity", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    category_id: categoryId,
                    city_id: cityId,
                    page,
                },
            });

            if (response.data.success) {
                return {
                    services: response.data.data.data, // Array of services
                    currentPage: response.data.data.current_page, // Current page number
                    totalPages: Math.ceil(response.data.data.total / response.data.data.per_page), // Total number of pages
                };
            } else {
                throw new Error("Failed to fetch services");
            }
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
      clearServices: (state) => {
          state.services = [];
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
        .addCase(fetchServices.fulfilled, (state, action) => {
            state.services = [...state.services, ...action.payload.services]; // Append new services
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.loading = false;
        })
      .addCase(fetchServices.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearServices } = serviceSlice.actions;
export default serviceSlice.reducer;
