import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {consts} from "../../../consts";

interface TranslationsState {
  language: string;
  translations: Record<string, string>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  loadingLanguage : boolean;
  error: string | null;
}

// Initial state
const initialState: TranslationsState = {
  language: null,
  translations: {},
  status: 'idle',
  loadingLanguage: false,
  error: null,
};

// Async thunk to fetch translations from an endpoint
export const fetchTranslations = createAsyncThunk(
    'translations/fetchTranslations',
    async (language: string) => {
      const response = await axios.get<{ success: boolean; data: { id: number; language: string; data: string }[] }>(
          consts.API_URL + '/translation'
      );

      if (response.data.success) {
        // Find the translation object for the selected language
        const translationData = response.data.data.find((item) => item.language === language);

        if (translationData) {
          // Parse the 'data' JSON string into a JavaScript object
          const translations = JSON.parse(translationData.data);
          return { language, translations };
        }
      }

      throw new Error('Failed to fetch translations');
    }
);

const translationSlice = createSlice({
  name: 'translations',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      AsyncStorage.setItem('appLanguage', action.payload); // Save language to AsyncStorage
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchTranslations.pending, (state) => {
          state.loadingLanguage = true;
          state.status = 'loading';
        })
        .addCase(fetchTranslations.fulfilled, (state, action: PayloadAction<{ language: string; translations: Record<string, string> }>) => {
          state.status = 'succeeded';
          state.language = action.payload.language;
          state.translations = action.payload.translations;
          state.loadingLanguage = false;
        })
        .addCase(fetchTranslations.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || null;
          state.loadingLanguage = false;
        });
  },
});

export const { setLanguage } = translationSlice.actions;
export const selectTranslations = (state: { translations: TranslationsState }) => state.translations.translations;
export const selectLanguage = (state: { translations: TranslationsState }) => state.translations.language;
export const loadingLanguage = (state: { translations: TranslationsState }) => state.translations.loadingLanguage;

export default translationSlice.reducer;
