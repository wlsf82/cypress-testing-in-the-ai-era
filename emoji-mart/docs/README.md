# Emoji Mart App Requirements

## Overview

Emoji Mart is a user-friendly web application that allows users to browse, search, add emojis to a shopping cart, and complete their purchase through a checkout process.

## Features

### Homepage

- **Display Emojis**: The homepage displays a list of emojis.
- **Search Bar**: A search bar is available for users to search for specific emojis.
- **Emoji List**: Emojis are listed as cards with their title, description, price, and Add to Cart button.

### Emoji Details

- **Emoji Information**: Clicking on an emoji navigates to a details page displaying information about the emoji.
- **Add to Cart**: Users can add the emoji to their cart from the details page also.
- **Back to all emojis**: Users can go back to the emojis list by clicking the Back to all emojis button.

### Search Functionality

- **Search by Name**: Users can search for emojis by typing their name in the search bar.
  - Searching is not case-sensitive (i.e., typing 'Rocket' or 'rocket' should find the 🚀 emoji.)
- **Search Results**: The search results update in real-time as the user types.
- **Empty State**: When a search matches no emojis, an empty state is displayed with a 'No emojis found' heading and a message indicating the searched term, instead of an empty list.

### Cart

- **Add to Cart**: Users can add emojis to their cart.
- **View Cart**: Users can view the contents of their cart.
- **Close Cart**: Users can close the cart view.
- **Update Quantity**: Users can increase or decrease the quantity of emojis in their cart.
- **Remove from Cart**: Users can remove emojis from their cart.
- **Cart Persistence**: The cart retains its state after a page refresh.
- **Cart Checkout**: Users can proceed with the checkout.

### Checkout

- **Add to Cart**: Users can add contact information
  - Email (needs to have a valid email format)
  - Full name
- **Add to Cart**: Users can add shipping address
  - Street address
  - City
  - Country
- **Add to Cart**: Users can add payment information
  - Card number
  - Expiry date
  - CVV
- **Total amount**: Users can see the total amount before completing the checkout.
- **Back to store**: Before completing the purchase, users can decide to go back to the store. This is possible by clicking the Back to store button.
- **Complete Purchase button**: Users can complete the checkout by clicking the Complete Purchase button.

### Thank You Page

- **Heading**: Shows a heading witht the text 'Thank You for Your Purchase!'
- **Explanatory paragraph**: Shows an explanatory paragraph with the text 'Your order has been successfully placed. We've sent a confirmation email with your order details.'
- **Order Number**: Shows a random order number for each purchase.
- **Back to Store button**: Allows the user to go back to the store by clicking the Back to Store button.

### User Experience

- **Responsive Design**: The app is responsive and works on various devices and screen sizes.

---

This document outlines the core features and requirements of the Emoji Mart app. It serves as a guide for development and ensures that all necessary functionalities are implemented.
