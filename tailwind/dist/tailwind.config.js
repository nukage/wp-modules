const theme = require("./theme.json");
const tailpress = require("@nukage/tailthemer");
// const qntmMapper = require("./qntm-modules/tailwind-mapper.js");
// const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
		backgroundOpacity: false,
		placeholderOpacity: false,
		textOpacity: false,
		divideOpacity: false,
		// borderOpacity: false,
	},
    content: [
        './*.php',
        './**/*.php',
        './resources/css/*.css',
        './resources/js/*.js',
        './safelist.txt'
    ],
	safelist: [
	 
	  ],
    theme: {
        container: {
			center: true,
			padding: {
				DEFAULT: "20px",
			},
		},
        extend: {
            zIndex: {
				1: "1",
				2: "2",
				3: "3",
				4: "4",
				5: "5",
				6: "6",
				7: "7",
				8: "8",
				9: "9",
			},
            spacing: {
				"1/10": "10%",
				"2/10": "20%",
				"3/10": "30%",
				"4/10": "40%",
				"5/10": "50%",
				"6/10": "60%",
				"7/10": "70%",
				"8/10": "80%",
				"9/10": "90%",
			},

        },
		colors: {
			bordergray: "#626E6D52", 
			...tailpress.colorMapper(
				tailpress.theme("settings.color.palette", theme)
			),
		},
		width: tailpress.customMapper(tailpress.theme('settings.custom.width', theme)),
		screens: {
			// xs: "480px",
			// sm: "600px",
			// md: "782px",
			// lg: "960px", // 960px
			// xl: "1064px", // 1064px
			// "2xl": "1240px",
			// "3xl": "1440px",
			// "4xl": "1920px",
			'xs': '480px',
            'sm': '600px',
            'md': '782px',
			'lg': '960px',
            'xl': tailpress.theme('settings.layout.contentSize', theme),
            '2xl': tailpress.theme('settings.layout.wideSize', theme),
          
		},
		lineHeight: {...tailpress.customMapper(tailpress.theme('settings.custom.lineHeight', theme)),
			normal: "1.5",
			none: "none",
			tight: "1.15",
			snug: "1.2",
		},
		fontSize: tailpress.fontSizeMapper(tailpress.theme('settings.typography.fontSizes', theme)),
		fontWeight: tailpress.customMapper(tailpress.theme('settings.custom.fontWeight', theme)),
		spacing: {
			...tailpress.spacingMapper(tailpress.theme('settings.spacing.spacingSizes', theme)),
			0: '0',
			4: '0.25rem',

		},
        fontFamily: tailpress.fontFamMapper(tailpress.theme('settings.typography.fontFamilies', theme)),
    },
	plugins: [
		// tailpress.tailwind,
        require("@tailwindcss/forms"),
	],
};
