import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { consts } from "../../../consts";
import {log} from "expo/build/devtools/logger";

interface UserState {
  user: { id: number, name: string; phone: string } | null;
  token: string | null;
  country: string | null;
  city: number | null;
}

const initialState: UserState = {
    user: null,
    token: null,
    country: null,
    city: null,
};

// Helper function to check if the token is still valid
const isTokenValid = (timestamp: number) => {
  const currentTime = Date.now();
  const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  return currentTime - timestamp < twoHours;
};

// Thunk to issue a token and store it with a timestamp
export const issueToken = createAsyncThunk(
    "user/issueToken",
    async (phone: string, { rejectWithValue }) => {
      try {
        // Check if a token exists in AsyncStorage
        const storedTokenData = await AsyncStorage.getItem(consts.TOKEN_KEY);
        if (storedTokenData) {
          const tokenData = JSON.parse(storedTokenData);

          // Check if the token is still valid
          if (isTokenValid(tokenData.timestamp)) {
            return tokenData; // Return the valid token
          }
        }

        // If no valid token is found, issue a new one
        const response = await axios.post(`${consts.API_URL}/issue-token`, {
          phone,
        });

        const data = response.data;
        const token = data.token;
        const newTokenData = { token, timestamp: Date.now() };

        await AsyncStorage.setItem(consts.TOKEN_KEY, JSON.stringify(newTokenData));
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
);

// Thunk to retrieve the user from storage
export const getUserFromStorage = createAsyncThunk(
    "user/getUserFromStorage",
    async (_, { rejectWithValue }) => {
      try {
        const savedUserString = await AsyncStorage.getItem(consts.SAVED_USER);
        if (savedUserString) {
          return JSON.parse(savedUserString);
        }
        return null;
      } catch (error) {
        return rejectWithValue("Failed to retrieve user from storage.");
      }
    }
);

// Thunk to save user data to AsyncStorage
export const saveUserToStorage = createAsyncThunk(
  "user/saveUserToStorage",
  async (user: { id: number, name: string; phone: string }, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem(consts.SAVED_USER, JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to save city to AsyncStorage
export const saveCityToStorage = createAsyncThunk(
    "user/saveCityToStorage",
    async (cityId: { cityId: number }, { rejectWithValue }) => {
        try {
            await AsyncStorage.setItem(consts.SELECT_CITY_KEY, JSON.stringify(cityId));
            return cityId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk to update or create user via API
export const updateOrCreateUserInAPI = createAsyncThunk(
  "user/updateUserInAPI",
  async ({ name, phone }: { name: string | null; phone: string },
    { rejectWithValue }
  ) => {
    try {
        console.log('22', name, phone);
      const response = await axios.post(
        `${consts.API_URL}/signup`,
        { name, phone},
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to delete user data from AsyncStorage
export const deleteUserFromStorage = createAsyncThunk(
  "user/deleteUserFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem(consts.SAVED_USER);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to get saved city from AsyncStorage
export const getCityFromStorage = createAsyncThunk(
    "user/getCityFromStorage",
    async (_, { rejectWithValue }) => {
        try {
            return  await AsyncStorage.getItem(consts.SELECT_CITY_KEY);
        } catch (error) {
            return rejectWithValue("Failed to retrieve city from storage.");
        }
    }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(issueToken.fulfilled, (state, action) => {
          state.token = action.payload.token;
          state.user = action.payload.user;
        })
        .addCase(getUserFromStorage.fulfilled, (state, action) => {
          if (action.payload) {
            state.user = action.payload; // Directly set the user
          }
        })
        .addCase(saveUserToStorage.fulfilled, (state, action) => {
          state.user = action.payload; // Directly set the user
        })
        .addCase(saveCityToStorage.fulfilled, (state, action) => {
            state.city = action.payload.cityId; // Directly set the user
        })
        .addCase(updateOrCreateUserInAPI.fulfilled, (state, action) => {
          if (action.payload) {
            state.user = action.payload.user; // Directly set the user
            state.token = action.payload.token;
          }
        })
        .addCase(deleteUserFromStorage.fulfilled, (state) => {
          state.user = null;
          state.token = null;
        })
        .addCase(getCityFromStorage.fulfilled, (state, action) => {
            state.city = action.payload;
        })
        .addMatcher(
            (action) => action.type.endsWith("/rejected"),
            (state, action) => {
              console.error("Error in user operation:", action.payload );
            }
            );
    },
});

export default userSlice.reducer;
