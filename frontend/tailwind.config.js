/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      divider: {
        primary: "rgb(234, 236, 240)",
      },
    },
    extend: {
      borderRadius: {
        0: "0px",
        0.5: "0.125rem", // 2px
        1: "0.25rem", // 4px
        1.5: "0.375rem", // 6px
        2: "0.5rem", // 8px
        2.5: "0.625rem", // 10px
        3: "0.75rem", // 12px
        3.5: "0.875rem", // 14px
        4: "1rem", // 16px
        4.5: "1.125rem", // 18px
        5: "1.25rem", // 20px
        5.5: "1.375rem", // 22px
        6: "1.5rem", // 24px
        6.5: "1.625rem", // 26px
        7: "1.75rem", // 28px
        7.5: "1.875rem", // 30px
        8: "2rem", // 32px
        8.5: "2.125rem", // 34px
        9: "2.25rem", // 36px
        9.5: "2.375rem", // 38px
        10: "2.5rem", // 40px,
        10.5: "2.625rem", // 42px
        11: "2.75rem", // 44px
        11.5: "2.875rem", // 46px
        12: "3rem", // 48px
        max: "9999px",
      },
    },
  },
  plugins: [],
};
