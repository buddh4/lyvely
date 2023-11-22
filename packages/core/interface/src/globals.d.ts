declare global {
    interface window {
        localStorage: Storage;
        // You can add other properties/methods of the window object here if needed.
    }
}

export {};
