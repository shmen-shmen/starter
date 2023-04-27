import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "https://course-api.com/react-useReducer-cart-project";

export const getCartItems = createAsyncThunk("cart/getCartItems", async () => {
	try {
		const resp = await fetch(url);
		return resp.json();
	} catch (error) {
		console.error(error);
	}
});

const initialState = {
	cartItems: [],
	amount: 1,
	total: 0,
	isLoading: true,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		clearCart: (state) => {
			state.cartItems = [];
		},
		removeItem: (state, { payload }) => {
			const itemId = payload;
			state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
		},
		increase: (state, { payload }) => {
			const itemId = payload;
			const cartItem = state.cartItems.find((item) => item.id === itemId);
			cartItem.amount = cartItem.amount + 1;
		},
		decrease: (state, { payload }) => {
			const itemId = payload;
			const cartItem = state.cartItems.find((item) => item.id === itemId);
			cartItem.amount = cartItem.amount - 1;
		},
		calculateTotals: (state) => {
			let amount = 0;
			let total = 0;
			state.cartItems.forEach((item) => {
				amount += item.amount;
				total += item.amount * item.price;
			});
			state.amount = amount;
			state.total = total;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCartItems.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCartItems.fulfilled, (state, action) => {
				state.isLoading = false;
				state.cartItems = action.payload;
			})
			.addCase(getCartItems.rejected, (state) => {
				state.isLoading = false;
			});
	},

	// extraReducers: {
	// 	[getCartItems.pending]: (state) => {
	// 		state.isLoading = true;
	// 	},
	// 	[getCartItems.fulfilled]: (state, action) => {
	// 		state.isLoading = false;
	// 		state.cartItems = action.payload;
	// 	},
	// 	[getCartItems.rejected]: (state) => {
	// 		state.isLoading = false;
	// 	},
	// },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
	cartSlice.actions;

export default cartSlice.reducer;
