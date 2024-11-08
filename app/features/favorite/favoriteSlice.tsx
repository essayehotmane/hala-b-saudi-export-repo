import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { consts } from "../../../consts";
import { Service } from "../../Interfaces/IService";

interface FavoriteState {
  favorites: Service[]; // Array of services
  favoritesIds: number[]; // Array of service IDs to check if is favorite
  loadingFavorite: boolean;
  loadingAddRemoveFavorite: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favorites: [],
  favoritesIds: [],
  loadingFavorite: false,
  loadingAddRemoveFavorite: false,
  error: null,
};

// Thunk to fetch all user favorites
export const fetchFavorites = createAsyncThunk(
  "favorite/fetchFavorites",
  async ({userId, token}:{userId: number, token: string}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${consts.API_URL}/user/${userId}/favorites`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        return response.data.data.map((favorite: any) => favorite);
      } else {
        throw new Error("Failed to fetch favorites");
      }
    } catch (error: any) {
      console.log("error getting fav ? ", error.message);

      return rejectWithValue(error.message);
    }
  }
);

// Thunk to add a service to favorites
export const addToFavorites = createAsyncThunk(
  "favorite/addToFavorites",
  async (
      { userId, serviceId, token }: { userId: number; serviceId: number, token: string },
    { rejectWithValue }
  ) => {
    try {
        console.log("adding to fav...", userId, serviceId);
        const response = await axios.post(
        `${consts.API_URL}/user/${userId}/favorite/${serviceId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        return serviceId; // Return the service ID if successfully added
      } else {
        throw new Error("Failed to add to favorites");
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to remove a service from favorites
export const removeFromFavorites = createAsyncThunk(
  "favorite/removeFromFavorites",
  async (
    { userId, serviceId, token }: { userId: number; serviceId: number, token: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("removing from fav...", userId, serviceId);

      const response = await axios.delete(
        `${consts.API_URL}/user/${userId}/favorite/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        return serviceId; // Return the service ID if successfully removed
      } else {
        throw new Error("Failed to remove from favorites");
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loadingFavorite = true;
        state.error = null;
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.favorites = action.payload;
          state.favoritesIds = action.payload.map((service) => service.id);
          state.loadingFavorite = false;
        }
      )
      .addCase(fetchFavorites.rejected, (state, action: PayloadAction<any>) => {
        state.loadingFavorite = false;
        state.error = action.payload;
      })
      .addCase(addToFavorites.pending, (state) => {
        state.loadingAddRemoveFavorite = true;
        state.error = null;
      })
      .addCase(
        addToFavorites.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loadingAddRemoveFavorite = false;
          if (!state.favoritesIds.includes(action.payload)) {
            state.favoritesIds.push(action.payload);
          }
        }
      )
      .addCase(addToFavorites.rejected, (state, action: PayloadAction<any>) => {
        state.loadingAddRemoveFavorite = false;
        state.error = action.payload;
      })
      .addCase(removeFromFavorites.pending, (state) => {
        state.loadingAddRemoveFavorite = true;
        state.error = null;
      })
      .addCase(
        removeFromFavorites.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loadingAddRemoveFavorite = false;
          state.favoritesIds = state.favoritesIds.filter(
            (id) => id !== action.payload
          );
        }
      )
      .addCase(
        removeFromFavorites.rejected,
        (state, action: PayloadAction<any>) => {
          state.loadingAddRemoveFavorite = false;
          state.error = action.payload;
        }
      );
  },
});

export default favoriteSlice.reducer;
