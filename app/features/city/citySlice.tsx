import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { consts } from "../../../consts";

interface City{
    city: { id: number, name: string; country_id: number, flag: string } | null;
}

interface CityState {
    cities: City[];
    loading: boolean;
    error: string | null;
}

const initialState: CityState = {
    cities: [],
    loading: false,
    error: null,
};

// Thunk to get cities
export const fetchCities = createAsyncThunk(
    "city/fetchCities",
    async (token: {token: string}, { rejectWithValue, getState }) => {
        try {
            if (!token) {
                return rejectWithValue("No token available");
            }
            const response = await axios.get(consts.API_URL + "/cities", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                return response.data.data.data; // This accesses the actual array of categories
            } else {
                throw new Error("Failed to fetch cities");
            }
        } catch (error: any) {
            console.log('Failed to fetch cities ? ', error.message);
            return rejectWithValue(error.message);
        }
    }
);

const citySlice = createSlice({
    name: "city",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchCities.fulfilled,
                (state, action: PayloadAction<City[]>) => {
                    state.cities = action.payload;
                    state.loading = false;
                }
            )
            .addCase(
                fetchCities.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export default citySlice.reducer;
