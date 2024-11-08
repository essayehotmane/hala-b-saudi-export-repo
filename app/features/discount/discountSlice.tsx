import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { consts } from "../../../consts";
import {Service} from '../../Interfaces/IService'

interface DiscountCode {
    id: number;
    code: string;
    is_used: number;
    value: number;
    user_id: number;
    service_id: number;
    created_at: string;
    updated_at: string;
    service: Service;
}

interface DiscountState {
    discounts: DiscountCode[] | null;
    code: string;
    loading: boolean;
    error: string | null;
}

const initialState: DiscountState = {
    discounts: null,
    code: null,
    loading: false,
    error: null,
};


// Thunk to generate a discount code
export const generateDiscountCode = createAsyncThunk<
  DiscountCode,
  { serviceId: number; userId: number },
  { rejectValue: string }
>(
  "discount/generateDiscountCode",
  async ({ serviceId, userId, token }: {serviceId: number, userId: number, token: string}, { rejectWithValue }) => {
      console.log('getting discount code ?', serviceId, userId, token);
    try {
      if (!token) {
        return rejectWithValue("No token available");
      }
      const response = await axios.post(
        `${consts.API_URL}/user/${userId}/discounte/${serviceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Discount code generated:", response.data);
        return response.data.code as DiscountCode;
      } else {
        throw new Error("Failed to generate code");
      }
    } catch (error: any) {
      console.log("Failed to generate code : ", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch all user discounts
export const fetchDiscounts = createAsyncThunk<
    DiscountCode[], // Return type
    { userId: number; token: string }, // Thunk argument
    { rejectValue: string } // Rejection type
>(
    "discount/fetchDiscounts",
    async ({ userId,  token }, { rejectWithValue }) => {
        console.log("getting discounts...", userId, token);
        try {
            const response = await axios.get(
                `${consts.API_URL}/discounts`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { userId, is_used: 1 }
                }
            );

            if (response.data && response.data.discounts) {
                // Return the array of discounts
                return response.data.discounts.data as DiscountCode[];
            } else {
                throw new Error("Failed to fetch discounts");
            }
        } catch (error: any) {
            console.log("error getting discounts ? ", error.message);
            return rejectWithValue(error.message);
        }
    }
);



const discountSlice = createSlice({
    name: "discount",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle generateDiscountCode cases
            .addCase(generateDiscountCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateDiscountCode.fulfilled, (state, action: PayloadAction<DiscountCode>) => {
                state.code = action.payload;
                state.loading = false;
            })
            .addCase(generateDiscountCode.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "An error occurred";
            })

            // Handle fetchDiscounts cases
            .addCase(fetchDiscounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiscounts.fulfilled, (state, action: PayloadAction<DiscountCode[]>) => {
                state.discounts = action.payload; // Store the list of discounts
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchDiscounts.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "An error occurred";
            });
    },
});

export default discountSlice.reducer;
