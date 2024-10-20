type Meta = {
	slug: string,
	title: string,
	date: string,
	tags: string[],
}

type BlogPost = {
	meta: Meta,
	content: ReactElement<any, string | JSXElementConstructor<any>>,
}

declare module "react-plotly.js"
declare module "react-loadable"