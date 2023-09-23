import { Toast } from "@chakra-ui/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const FoodStore = create(
  persist(
    (set) => ({
      Food: [],
      addFoodTocart: (newFood) => {
        set((state) => {
          // Check if the food is already in the cart
          const existingFood = state.Food.find(
            (food) => food._id === newFood._id
          );
          // const existingItem = state.Food[0];
          // // Check if the restaurant id is different
          // if (
          //   existingItem &&
          //   existingItem.Restaurant._id !== newFood.Restaurant._id
          // ) {
          //   alert(
          //     "You can't add food from multiple restaurants to the same cart."
          //   );
          //   return { Food: [...state.Food] };
          // }
          if (existingFood) {
            // If it's already in the cart, increment its quantity
            existingFood.quantity += 1;
            return { Food: [...state.Food] }; // Return a new array to trigger a state update
          } else {
            // If it's not in the cart, add it with a quantity of 1
            newFood.quantity = 1;
            return { Food: [newFood, ...state.Food] }; // Return a new array to trigger a state update
          }
        });
      },
      removeFoodFromCart: (FoodId) => {
        set((state) => {
          const updatedFood = state.Food.map((food) => {
            if (food._id === FoodId) {
              if (food.quantity > 1) {
                // If quantity is greater than 1, decrement it
                food.quantity -= 1;
              } else {
                // If quantity is 1 or less, remove the item from the cart
                return null;
              }
            }
            return food;
          });

          // Remove null entries (items with quantity <= 0)
          const filteredFood = updatedFood.filter((food) => food !== null);

          return { Food: filteredFood }; // Return a new array with updated quantities
        });
      },
      clearCart: () => {
        set((state) => {
          return { Food: [] };
        });
      },
    }),
    {
      name: "food-storage",
      skipHydration: true,
    }
  )
);

export default FoodStore;
