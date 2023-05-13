declare module '*.css'
declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}
declare module '*.module.css'
declare module '*.module.css' {
    const classes: { readonly [key: string]: string }
    export default classes
}
declare module '*.module.sass' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string }
    export default classes
}