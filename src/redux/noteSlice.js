import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    notes: [],
    isLoading: false,
    filterNotes: [],
};

export const getNotes = createAsyncThunk(
    "noteSlice/getNotes",
    async(args, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/notes`);
            return data.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const saveNote = createAsyncThunk(
    "noteSlice/saveNote",
    async(note, { dispatch, rejectWithValue }) => {
        try {
            await axios.post(`/notes`, note);
            dispatch(getNotes());
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const deleteNote = createAsyncThunk(
    "noteSlice/deleteNote",
    async(id, { dispatch, rejectWithValue }) => {
        try {
            await axios.delete(`/notes/${id}`);
            dispatch(getNotes());
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const updateNote = createAsyncThunk(
    "noteSlice/updateNote",
    async(args, { dispatch, rejectWithValue }) => {
        try {
            await axios.put(`/notes/${args._id}`, args);
            dispatch(getNotes());
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
const noteSlice = createSlice({
    name: "noteSlice",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setFilterNotes: (state, action) => {
            state.filterNotes = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(getNotes.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getNotes.fulfilled, (state, action) => {
            state.notes = action.payload;
            state.filterNotes = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getNotes.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload);
        });

        builder.addCase(saveNote.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(saveNote.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(saveNote.rejected, (state, action) => {
            state.isLoading = false;
            console.log(action.payload);
            alert(action.payload);
        });
        builder.addCase(deleteNote.rejected, (state, action) => {
            console.log(action.payload);
        });
        builder.addCase(updateNote.rejected, (state, action) => {
            console.log(action.payload);
        });
    },
});

export const { setLoading, setFilterNotes } = noteSlice.actions;

export default noteSlice.reducer;