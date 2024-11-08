import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import categorySlice from "../features/category/categorySlice";
import serviceSlice from "../features/service/serviceSlice";
import discountSlice from "../features/discount/discountSlice";
import favoriteSlice from "../features/favorite/favoriteSlice";
import countrySlice from "../features/country/countrySlice";
import citySlice from "../features/city/citySlice";
import translationReducer from "../features/translation/translationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    category: categorySlice,
    service: serviceSlice,
    discount: discountSlice,
    favorite: favoriteSlice,
    country: countrySlice,
    city: citySlice,
    translations: translationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
