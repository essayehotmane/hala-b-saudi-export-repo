import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { consts } from "../../../consts";

interface Country {
    country: { id, name: string; phone_code: string} | null;
}

interface CountryState {
    countries: Country[];
    loading: boolean;
    error: string | null;
}

const initialState: CountryState = {
    countries: [],
    loading: false,
    error: null,
};

// Thunk to get countries
export const fetchCountries = createAsyncThunk(
  "country/fetchCountries",
  async (token: {token: string}, { rejectWithValue, getState }) => {
    try {
      if (!token) {
        return rejectWithValue("No token available");
      }
      const response = await axios.get(consts.API_URL + "/countries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        return response.data.data.data; // This accesses the actual array of categories
      } else {
          throw new Error("Failed to fetch countries");
      }
    } catch (error: any) {
        console.log('Failed to fetch countries ? ', error.message);
        return rejectWithValue(error.message);
    }
  }
);

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
          fetchCountries.fulfilled,
        (state, action: PayloadAction<Country[]>) => {
          state.countries = action.payload;
          state.loading = false;
        }
      )
      .addCase(
          fetchCountries.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default countrySlice.reducer;
