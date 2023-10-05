/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: "class",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  theme: {
    fontSize: {
      title: `2.6rem;`,
      paragraph: `1.2rem;`,
    },
    extend: {
      colors: {
        mydark: "#42C2FF",
        mywhite: "#EFFFFD",
        mylight: "#b3ddff",
        myblue: "#85F4FF",
        primary: {
          500: "#FF6363;",
          800: "#FF1313;",
        },
      },
    },
  },
  plugins: [],
};
