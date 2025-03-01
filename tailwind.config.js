import aspectRatio from "@tailwindcss/aspect-ratio";
import forms from "@tailwindcss/forms";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e293b",
        secondary: "#ef6f7f",
        secondary_light: "#e898a6",
        headline: "#f7f7f9",
        main: "#ffffff", // Fully white
        tertiary: "#4fc194",
        ternary: "#999fbb",
        ternary_light: "rgb(153,159,187, 0.85)",
      },
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
    },
  },
  plugins: [aspectRatio, forms],
};
