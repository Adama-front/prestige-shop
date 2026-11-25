import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PublicUser } from "@/application/auth/authApiSchemas";
import { authApiClient } from "@/infrastructure/auth/AuthApiClient";

interface AuthState {
  user: PublicUser | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  isAuthenticated: false
};

export const checkAuth = createAsyncThunk<PublicUser>(
  "auth/checkAuth",
  () => authApiClient.me(),
  {
    condition: (_, { getState }) =>
      (getState() as { auth: AuthState }).auth.status !== "loading"
  }
);

export const register = createAsyncThunk<
  PublicUser,
  { username: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    return await authApiClient.register(credentials);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Erreur d’inscription."
    );
  }
});

export const login = createAsyncThunk<
  PublicUser,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return await authApiClient.login(credentials);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Erreur de connexion."
    );
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApiClient.logout();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erreur de déconnexion."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Erreur d’inscription.";
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Erreur de connexion.";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Erreur de déconnexion.";
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
